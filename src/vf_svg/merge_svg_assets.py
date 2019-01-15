#
# Merge individual svg files while setting proper group names
#
import os
from pathlib import Path
from wtop import merge_wtop_svgs
from wshoes import merge_wshoes_svgs

if __name__ == '__main__':
    outdir = Path('../assets/svg')
    merge_wtop_svgs(outdir)
    #merge_wshoes_svgs(outdir)

