import os
import re
from svgcleaner import VizFilterSvg
from pathlib import Path

def merge_wshoes_svgs(outdir):
    merge_wshoes(outdir / 'vf_wshoes.svg', vertical=False)
    merge_wshoes(outdir / 'vf_wshoes_thumb_vert.svg', vertical=True)

