import pandas as pd
import os
import glob
from tqdm import tqdm
import csv
import math
from pathlib import Path
import numpy as np
from collections import OrderedDict
import random
from const import *
import time
from fitscore import FitRequirement, FitScorer
import re
import sys
sys.path.append("..")
from common.yppath import ArchivePath, CrawlPath

ns_woman_top_data_path = Path('..') / 'data' / 'ns_woman_top'

class Product:
    def __init__(self, pid, cid, prd_row, prd_col_row, prd_pred_row, prd_col_pred_row, price_rows):
        self.pid, self.cid = pid, cid
        self.pcid = '_'.join([str(self.pid), str(self.cid)])
        self.brand = prd_row.brandName
        self.front_img = f'prd_imgs/{self.pid}/{self.cid}_00.jpg'
        self.name =  prd_row['productName']
        self.url = prd_row['productUrl']
        self.props = prd_pred_row.to_dict()
        self.props.update(prd_col_pred_row.to_dict())
        self.prd_row = prd_row
        self.prd_col_row = prd_col_row
        self.price_rows = price_rows
        
        if price_rows is not None:
            self.price = price_rows.price.min()
        else:
            self.price = 29.94
        self.sizes = sorted(list(price_rows['size']))

    def __repr__(self):
        prop_str = '{'+', '.join([k+':%.1f' % v for k, v in self.props.items()]) + '}'
        return ', '.join([self.pcid, self.name, self.front_img, prop_str])

    def to_dict_brief(self, extra_info=False, extra_dict=None):
        ext = {}
        ext['product_id'] = self.pcid
        ext['brand'] = self.brand
        ext['front_img'] = self.front_img
        ext['name'] = self.name
        ext['price'] = self.price
        ext['src_url'] = self.url

        if extra_info:
            ei = 'PCID' + self.pcid + '\n'
            for k, v in self.props.items():
                ei += '\n'+k+': %.2f'%v
            if extra_dict:
                for k, v in extra_dict.items():
                    ei += f'\n{k}: {v}'
            ext['extra_info'] = ei

        if extra_dict:
            ext['extra'] = {k: "%.2f" % v for k, v in extra_dict.items()}
            #ext.update(extra_dict)
        return ext

    # For individual product info page
    def to_dict_full(self):
        #print('prd_row', self.prd_row)
        #print('prd_col_row', self.prd_col_row)
        #print('prd_info_row', self.prd_info_row)
        d = self.to_dict_brief(False)
        desc = self.prd_row['description']
        if pd.isnull(desc):
            d['description'] = ""
        else:
            desc = desc.replace('<p>','').replace('</p>','')
            desc = re.sub('<b.*</b>','', desc) # Remove bold messages - temporary ad message
            #if len(desc) > 200: desc = desc[:200]+'...' # TODO: Handle ... in UI
            d['description'] = desc
        p = ns_woman_top_data_path / 'archive' / 'prd_imgs'

        imgs = sorted(list(p.glob(f'{self.pid}/{self.cid}_*.jpg')))
        all_imgs = sorted([str(i.relative_to(ns_woman_top_data_path/'archive')).replace('\\','/') for i in imgs])
        if d['front_img'] in all_imgs: all_imgs.remove(d['front_img'])
        else: print('Cannot find front image from similar product!!')
        d['extra_imgs'] = all_imgs
        return d

class ProductDb:
    def __init__(self, yppath, dropMaternity=True):
        self.paths = yppath
        self.load_product_info(dropMaternity)
        self.pids = list(self.prd_df.index)

    def pids_to_drop(self, df, dropMaternity, dropPlussize):
        pids = []
        if dropMaternity:
            pids += list(df[df['brandName'].isin(maternity_brands)].pid)
            pids += list(df[df['productTitle'].str.contains('maternity', na=True, flags=re.IGNORECASE, regex=True)].pid)
        if dropPlussize:
            pids += list(df[df['productTitle'].str.contains('\(Plus[ -]Size\)', na=True, flags=re.IGNORECASE, regex=True)].pid)
        pids += black_listed_pids
        return list(set(map(int, pids)))

    def load_product_info(self, dropMaternity):
        print('Loading product info')

        # Product DF
        df = pd.read_pickle(self.paths.prd_df_fn)
        df.pid = df.pid.astype('int64')
        pids_to_drop = self.pids_to_drop(df, dropMaternity, dropPlussize=True)
        print('Dropping %d maternity/plus size products out of %d' % (len(pids_to_drop), df.shape[0]))
        df = df[~df['pid'].isin(pids_to_drop)]
        self.prd_df = df.set_index('pid').sort_index()

        # Product-color DF
        df = pd.read_pickle(self.paths.prd_col_df_fn)
        df.pid = df.pid.astype('int64')
        df.colorId = df.colorId.astype('int64')
        df = df[~df['pid'].isin(pids_to_drop)]
        df['pcid'] = df[['pid', 'colorId']].apply(lambda x: '_'.join(map(str, x)), axis=1)
        self.prd_col_df = df.set_index('pcid').sort_index()
        
        # Per-product predictions DF
        props = ['belly', 'neckline', 'sleeve_length', 'sleeve_tightness', 'waist', 'collar', 'shoulder', 'chest', 'top_length', 'detail']
        dfs = []
        for prop in props:
            df = pd.read_pickle(self.paths.prd_pred_fn(prop))
            df.index = df.index.astype('int64')
            dfs.append(df)
        df = pd.concat(dfs, axis=1)
        df = df[~df.index.isin(pids_to_drop)]
        df.rename(columns={'detail':'details'}, inplace=True) # Fix name for UI
        self.prd_pred_df = df.sort_index()

        # Per-product color predictions : pattern/color
        df = pd.read_pickle(self.paths.prd_pred_fn('pattern'))
        df['pid'] = df['pid'].astype(int)
        df['cid'] = df['cid'].astype(int)
        df = df[~df['pid'].isin(pids_to_drop)]
        df['pcid'] = df[['pid', 'cid']].apply(lambda x: '_'.join(map(str, x)), axis=1)
        self.prd_col_pred_df = df.set_index('pcid').sort_index()

        # Price/size info 
        df = pd.read_pickle(self.paths.price_df_fn)
        df['pid'] = df['pid'].astype(int)
        df['colorId'] = df['colorId'].astype(int)
        df = df[~df.index.isin(pids_to_drop)]
        self.price_df = df

    def get_product_by_pcid(self, pcid):
        pid, cid = map(int, pcid.split('_'))
        try:
            prd_row = self.prd_df.loc[pid]
            prd_col_row = self.prd_col_df.loc[pcid]
            prd_pred_row = self.prd_pred_df.loc[pid]
            prd_col_pred_row = self.prd_col_pred_df.loc[pcid]
            price_rows = self.price_df[(self.price_df.pid == pid) & (self.price_df.colorId == cid)]
        except KeyError:
            print(f'PCID {pcid} not found')
            return None
        return Product(pid, cid, prd_row, prd_col_row, prd_pred_row, prd_col_pred_row, price_rows)
  
    def pcids_sorted(self, req, limit_per_pid=0):
        start = time.time()

        calc = FitScorer(self.prd_pred_df, self.prd_col_pred_df)
        df = calc.score(req)
        if limit_per_pid: # Limit # of items per pid
            before = df.shape[0]
            df = df.groupby('pid').head(limit_per_pid)
            print('Lmiting list per pid: %d->%d' % (before, df.shape[0]))
        pcids = list(df['pid'].astype('str')+'_'+df['cid'].astype('str'))
        score = list(df['score'])
        print('pcids_sorted() took %.0fms' % ((time.time()-start)*1000))
        return pcids, score

    # Get detailed information for debugging pcids_sorted
    def get_score_df(self, req):
        start = time.time()

        calc = FitScorer(self.prd_pred_df, self.prd_col_pred_df)
        df = calc.score(req, keep_subscore=True)
        return df    

if __name__ == '__main__':
    cp = CrawlPath('../data/ns_woman_top', '180731_2155')
    db = ProductDb(cp)
    print('Product Count:', len(db.pids))
    pid = db.pids[0]
    #print(db.prd_df.head())
    #print(db.prd_df.loc[pid].Name)
    #print(db.prd_df.loc[pid].colors)
    #print(db.prd_df.loc[pid].imgs)

    fr = FitRequirement.ByDict({"waist":2, "sleeve_length":3})
    pcids, scores = db.pcids_sorted(fr)
    for pcid,score in list(zip(pcids, scores))[:3]: 
        print('PCID#%s Score %.1f' % (pcid, score), db.get_product_by_pcid(pcid))

    fr = FitRequirement()
    fr.add_prior_prd(pcids[5])
    pcids, scores = db.pcids_sorted(fr)
    for pcid,score in list(zip(pcids, scores))[:3]: 
        p = db.get_product_by_pcid(pcid)
        print('PCID#%s Score %.1f' % (pcid, score), p)
        d = p.to_dict_full()

