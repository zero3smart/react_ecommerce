from pathlib import Path
from slugify import slugify
import os

DATA_NS_WOMAN_TOP_DIR = '../data/ns_woman_top'

class YpPath:
    def __init__(self, base_dir):
        self.base_dir = base_dir
        self.prd_imgs_dir = self.base_dir / 'prd_imgs'
        self.meta_path = self.base_dir / "meta"
        self.prd_df_fn = self.meta_path / 'prd_df.pkl'
        self.prd_col_df_fn = self.meta_path / 'prd_col_df.pkl'
        self.pred_dir = self.base_dir / 'pred'
        self.swatch_dir = self.base_dir / 'swatch'

    def prd_img_fn(self, pid, cid, idx):
        return self.prd_imgs_dir / str(pid) / f'{cid}_{idx:02d}.jpg'
 
    def swatch_fn(self, cid, name, stype='unsorted'):
        return self.base_dir / 'swatch' / stype / f'{cid}_{slugify(name)}.jpg'

    def prd_img_fns(self, pid, cid):
        return sorted(list((self.prd_imgs_dir / str(pid)).glob(f'{cid}_*.jpg')))

    def prd_pred_fn(self, prop):
        return self.pred_dir / f'{prop}.pkl'

class ArchivePath(YpPath):
    def __init__(self, data_dir):
        super().__init__(Path(data_dir) / "archive")
        self.meta_backup_path = self.base_dir / "meta_backup"
        self.prd_anno_df_fn = self.meta_path / 'prd_anno_df.pkl'
        self.prd_col_anno_df_fn = self.meta_path / 'prd_col_anno_df.pkl'

    def swatch_list(self, stype=None):
        if stype == None: 
            stype = ['checker', 'pattern', 'solid', 'stripe', 'unsorted'] 
        else:
            stype = [stype]
        l = []
        for s in stype:
            l.extend([p.name for p in (self.base_dir / 'swatch'/ s).glob('*.jpg')])
        return l

class CrawlPath(YpPath):
    def __init__(self, data_dir, timestamp, postfix=None):
        if timestamp == 'latest':
            timestamp = CrawlPath.previous_ts(data_dir)[-1]
        base_path = Path(data_dir) / "crawl" / (f"{timestamp}_{postfix}" if postfix else timestamp)
        super().__init__(base_path)
        self.prd_list_json_dir = self.base_dir / 'prd_list_json'
        self.prd_details_dir = self.base_dir / 'prd_pages'
        self.price_df_fn = self.meta_path / 'price_df.pkl'

        # Use archive directory for storing images
        self.apath = ArchivePath(data_dir)
        self.prd_imgs_dir = self.apath.prd_imgs_dir
        self.swatch_dir = self.apath.swatch_dir

        # Download log files
        self.prd_img_crawl_log = self.base_dir / 'img_crawl.log'
        self.swatch_crawl_log = self.base_dir / 'swatch_crawl.log'

    @property
    def outdirs(self):
        return [self.base_dir, self.meta_path, self.prd_list_json_dir, self.prd_imgs_dir, 
                  self.prd_details_dir, self.swatch_dir]
    def prd_list_json(self, page):
        return self.prd_list_json_dir/f'page_{page:03d}.json'
    def prd_list_json_files(self):
        return sorted(list(self.prd_list_json_dir.glob('page_[0-9]*.json')))
    def prd_detail_html(self, pid):
        return self.prd_details_dir / f'{pid}.html'
    def meta_present(self):
        return os.path.exists(self.prd_df_fn) and os.path.exists(self.prd_col_df_fn) and os.path.exists(self.price_df_fn) 

    @staticmethod
    def previous_ts(base_dir):
        return [i.name for i in sorted((Path(base_dir) / 'crawl').glob('*'))]
