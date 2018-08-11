import pandas as pd
import math
import numpy as np
from const import *
from collections import OrderedDict

class FitPropRequirement:
    def __init__(self, name, frm=-1, to=None): # Don't care by default
        self.name = name
        self.set_range(frm, to)

    def __repr__(self):
        r = '' #f'{self.name}:'
        if self.all:
            r += 'all'
        elif self.frm>=0:
            r += f'%d' % self.frm
            if self.frm != self.to:
                r += f'-%d' % self.to
        return r
   
    def set_range(self, frm, to=None):
        self.frm = frm
        if to == None:  self.to = frm
        else:           self.to = to
        self.all = (frm == -1)

class FitRequirement:
    def __init__(self):
        self.reqs = {}
        for name in per_prd_props + per_prd_col_props:
            self.reqs[name] = FitPropRequirement(name)
        self.prior_prds = []
 
    def __repr__(self):
        s = '{'
        for k, v in self.reqs.items():
            if v.all: continue
            s += f'{k}:{v.__repr__()} '
        s += '}'
        if len(self.prior_prds):
            s += ', prior=' + ','.join(self.prior_prds)
        return s

    def base_body_props(self):
        return [v for k, v in self.reqs.items() if k in base_body_props]
    
    def coretype(self):
        return self.reqs['coretype']

    def solid(self):
        if self.reqs['pattern'].frm == self.reqs['solid'].frm:
            return FitPropRequirement('solid') # don't care 
        else:
            return self.reqs['solid']

    def pattern(self): # Actually include checker, stripe, pattern
        if self.reqs['pattern'].frm == self.reqs['solid'].frm:
            return FitPropRequirement('pattern') # don't care 
        else:
            return self.reqs['pattern']

    def details(self):
        dr =  self.reqs['details']
        if dr.frm == 1:
            return dr
        if dr.frm == 0 and self.reqs['solid'].frm == 1 and self.reqs['pattern'].frm == 0:
            return FitPropRequirement('details', 0) # Assume no detail if user selected solid only
        return FitPropRequirement('details') # Assume 'disabled' is don't care
    
    def add_prior_prd(self, pcid):
        self.prior_prds.append(pcid)

    @staticmethod
    def ByRestReq(args): # args: Flask request object
        r = FitRequirement()
        # Decide whether to use given value as raw value or translated value
        raw_prop = args.get('raw_prop', default=0, type=int)
        reqs = {}
        for name in per_prd_props:
            fpr = FitPropRequirement(name)
            val = args.get(name, default=-1, type=int)
            if val>=0:
                if raw_prop:
                    fpr.set_range(val)
                else:
                    fpr.set_range(*FitRequirement.map_user_prop_val_to_internal_range(name, val))
            reqs[name] = fpr

        if args.get('sleeve_length', default=-1, type=int) == 5:
            print('Updating sleeve_tightness')
            fpr = FitPropRequirement('sleeve_tightness')
            fpr.set_range(3, 4)
            reqs['sleeve_tightness'] = fpr

        for name in per_prd_col_props:
            fpr = FitPropRequirement(name)
            val = args.get(name, default=-1, type=int)
            if val>=0:
                fpr.set_range(val)
            reqs[name] = fpr
        color = args.get('color', default=None, type=str)
        if color and color != '0':
            print('Color', color)
        if reqs['coretype'] == 0:
            reqs['top_length'].all = True
        r.reqs = reqs
        selected_product_id = args.get('selected_product_id', default=None, type=str)
        if selected_product_id:
            r.add_prior_prd(selected_product_id) # More may be added when user account is implemented..
        return r

    @staticmethod
    def ByDict(reqs): # dict
        r = FitRequirement()
        for k, v in reqs.items():
            if k in per_prd_props:
                fpr = FitPropRequirement(k)
                fpr.set_range(*FitRequirement.map_user_prop_val_to_internal_range(k, v))
                r.reqs[k] = fpr
            elif k in per_prd_col_props:
                fpr = FitPropRequirement(k)
                fpr.set_range(v)
            else:
                assert(False)
            r.reqs[k] = fpr
        return r

    @staticmethod
    def map_user_prop_val_to_internal_range(name, val):
        mapping = {'collar': {0: 0, 1: 1, 2: [2,4]},
                   'neckline': {0: 0, 1: [1,3], 2: [4,6]},
                   'shoulder': {0: 0, 1: 1, 2: 2, 3:3, 4: [4,5]},
                   'chest': {0: 0, 1: [1, 2], 2: [3, 5]}, 
                   'waist': {0: 0, 1: [1, 2], 2: [3, 4], 3: [5, 6]},
                   'belly': {0: 0, 1: [1, 2], 2: [3, 4], 3: [5, 6]},
                   'sleeve_tightness': {0: [0, 2], 1: [3, 4]},
                   'sleeve_length': {0: 0, 1: [1,2], 2:[3,4], 3: 5, 4: [6,7], 5: [6,7]},
                   'top_length': {0: 0, 1: [1,3], 2: 4},
                   'coretype': {i:i for i in range(4)}
                   }
        try:
            val = int(val)
            if val < 0: return None # Don't care.
            m = mapping[name]
            if val in m:
                ival = m[val]
            else:
                ival = m[max(m.keys())] # Out of range. Return max values
            if type(ival) == int: 
                return [ival, ival]
            return ival
        except:
            print('No user prop val to internal mapping found:', name, val)
            return None 

class FitScorer:
    def __init__(self, prd_pred_df, prd_col_pred_df, min_score=90, max_count=1000, keep_subscore=False):
        self.pr_df = prd_pred_df # Per product Prediction
        self.pc_df = prd_col_pred_df # Per product-color prediction
        self.min_score = min_score
        self.max_count = max_count
        self.keep_subscore = keep_subscore
        # Max weights(score to deduct)
        #base_prop_wts = { 'waist':4, 'sleeve_length':12, 'sleeve_tightness':8, 'neckline':4, 
        #        'belly':4, 'collar':4, 'shoulder':8, 'chest':2, 'top_length':4 } # Care less for chest and more for shoulder/sleeve_tightness
        self.base_prop_wts = {
                'waist':1, 'sleeve_length':2, 'sleeve_tightness':2, 'neckline':1, 
                'belly':1, 'collar':1, 'shoulder':2, 'chest':.5, 'top_length':1
        }
        self.solidpattern_wts = 8
        self.details_wts = 8

    def score(self, fit_req, keep_subscore=False):
        print('Fit request', fit_req)
        pr_score_df = pd.DataFrame(index=self.pr_df.index, dtype='float')
        pc_score_df = self.pc_df[['pid', 'cid']].copy()
        # Actual base score doesn't matter. Make sum 100
        pr_score_df['score'] = 0
        pc_score_df['score'] = 0

        self.score_base_prop(pr_score_df, fit_req, 'base_prop_score')
        self.score_coretype(pr_score_df, fit_req, 'coretype_score')
        self.score_details(pr_score_df, fit_req, 'details_score')
        pr_score_df['score'] = 100 - pr_score_df[['base_prop_score', 'coretype_score', 'details_score']].sum(axis=1)

        self.score_solidpattern(pc_score_df, fit_req, 'solidpattern_score')
        pc_score_df['score'] -= pc_score_df['solidpattern_score']

        self.score_prior_products(pr_score_df, fit_req, 'prior_pr_score')
        pr_score_df['score'] -= pr_score_df['prior_pr_score']

        self.score_prior_productcols(pc_score_df, fit_req, 'prior_pc_score')
        pc_score_df['score'] -= pc_score_df['prior_pc_score']

        # Merge per-product score and per-product-color score
        df = pc_score_df.reset_index()
        df = df.join(pr_score_df, on='pid', how='outer', rsuffix='_pr')
        df['score'] += df['score_pr']
        df = df.sort_values(by='score', ascending=False)
        if len(fit_req.prior_prds) > 0:
            pid, cid = map(int, fit_req.prior_prds[0].split('_'))
            df = df.drop(df[(df['pid'] == pid) & (df['cid'] == cid)].index)
        df = df[df['score']>self.min_score]
        return df

    def score_base_prop(self, df, fit_req, col_name):
        reqs = fit_req.base_body_props()
        cols = []
        for r in reqs:
            if r.all: continue
            norm_max = per_prd_prop_max_vals[r.name]
            pr = self.pr_df[r.name]
            score_col = r.name + '_score'
            cols.append(score_col)
            df[score_col] = 0
            df.loc[pr<r.frm, score_col] = r.frm - pr
            df.loc[r.to<pr, score_col] = pr - r.to
            df[score_col] = df[score_col] * self.base_prop_wts[r.name] #/ norm_max
        df[col_name] = df[cols].sum(axis=1)
        df.loc[ pd.isnull(df[col_name]), col_name] = 0 # Fill 0 for NaN
            
    def score_coretype(self, df, fit_req, col_name):
        req = fit_req.coretype()
        if req.all:  
            df[col_name] = 0
            return

        # Core type defines waist and belly ranges
        wb_pairs = [
            [(0,0), (0,1), (0,2), (0,3), (4,0), (4,1), (5,0), (5,1), (5,2), (6,0), (6,1), (6,2)], # 0: tanktop
            [(1,1), (1,2), (1,3), (2,1), (2,2), (2,3), (3,1), (3,2)], # 1: bodysuit
            [(3,3), (3,4), (3,5), (4,2), (4,3), (4,4), (4,5), (4,6), (5,3), (5,4)], # 2: tunic
            [(5,5), (5,6), (6,3), (6,4), (6,5), (6,6)]+[(1,4), (1,5), (1,6), (2,4), (2,5), (2,6), (2,6), (3,6)], # 3: boxy
        ]
        wbs = wb_pairs[req.frm]
        ct_df = pd.DataFrame(index=df.index, dtype='float')
        for i, (w, b) in enumerate(wbs):
            # Penalize later pairs little bit to show more represntative items appear first
            waist_max, belly_max = per_prd_prop_max_vals['waist'], per_prd_prop_max_vals['belly']
            ct_df[f'{w}{b}'] = (
                    (abs(self.pr_df['waist'] - w))+ # /waist_max*16 + 
                    (abs(self.pr_df['belly'] - b))) #/belly_max*16)
        df[col_name] = ct_df.min(axis=1)*2

    def soft_bool_distance(self, series, y):
        return abs((series.clip(0.25,0.75)-0.25)*2 - y)

    def score_solidpattern(self, df, fit_req, col_name):
        r = fit_req.solid()
        if r.all: 
            df[col_name] = 0
            return
        # Solid and pattern is mutual-exclusive. So checking 'solid'ness alone is enough
        df[col_name] = self.soft_bool_distance(self.pc_df['solid'], r.frm) * self.solidpattern_wts

    def score_details(self, df, fit_req, col_name):
        r = fit_req.details()
        if r.all: 
            df[col_name] = 0
        else:
            df[col_name] = self.soft_bool_distance(self.pr_df['details'], r.frm) * self.details_wts

    def score_prior_products(self, df, fit_req, col_name):
        r = fit_req.prior_prds
        if len(r) == 0:
            df[col_name] = 0
            return
        # Currently support only one prior product
        # TODO:
        #    Get score for each prior product. Get minimum from each product
        prior_pcid = r[0]
        pid, _ = prior_pcid.split('_')
        pid = int(pid)
        pr_pr = self.pr_df.loc[pid]

        df[col_name] = 0
        wts = { 'details' : self.details_wts, 'ruffle':1,
                'embellish' : 1, 'fringe': 1, 'cutout': 1, 'bow': 1,
                'strappy': 1, 'corset': 1, 'twist': 1, 'tie': 1, 'misc': 1 }
        wts.update(self.base_prop_wts)
        for prop, wt in wts.items():
            df[col_name] += abs(self.pr_df[prop] -pr_pr[prop]) * wt / 8

    def score_prior_productcols(self, df, fit_req, col_name):
        r = fit_req.prior_prds
        if len(r) == 0:
            df.loc[:, col_name] = 0
            return
        prior_pcid = r[0]
        pr_pc = self.pc_df.loc[prior_pcid]

        df.loc[:, col_name] = 0
        wts = { 'solid' : self.solidpattern_wts, 'pattern' : self.solidpattern_wts/3, 
                'stripe' : self.solidpattern_wts/3, 'checker': self.solidpattern_wts/3 }
        for prop, wt in wts.items():
            df.loc[:, col_name] += abs(self.pc_df[prop] - pr_pc[prop]) * wt / 8
 
