import os
import re
from svgcleaner import VizFilterSvg
from pathlib import Path

def load_wshoes_svg_fixed(svg_fn):
    id_fixups = {
        'toe_0': 'toes_0',
        'toe_1': 'toes_1',
        'toe_2': 'toes_2',
        'covers': 'cover',
        'covers_0': 'cover_0',
        'covers_1': 'cover_1',
        'covers_2': 'cover_2',
        'covers_3': 'cover_3',
        'covers_4': 'cover_4',
        'bottoms': 'bottom',
        'bottoms_0': 'bottom_0',
        'bottoms_1': 'bottom_1',
        'bottoms_2': 'bottom_2',
        'bottoms_3': 'bottom_3',
        'bottoms_4': 'bottom_4',
        'bottoms_5': 'bottom_5',
        'bottoms_6': 'bottom_6',
        'touch_covers': 'touch_cover',
        'touch_counters': 'touch_counter',
        'touch_shafts': 'touch_shaft',
        'touch_bottoms': 'touch_bottom',
        'tn_covers': 'tn_cover',
        'tn_counters': 'tn_counter',
        'tn_shafts': 'tn_shaft',
        'tn_bottoms': 'tn_bottom',
    }
    tn_y = 0
    pos_fixes = {
        'shoes_parts_filters': [f'130 40', None],
        'tn_bottom_0' : [f'0 {tn_y}', None],
        'tn_bottom_1' : [f'70 {tn_y}', None],
        'tn_bottom_2' : [f'130 {tn_y}', None],
        'tn_bottom_3' : [f'190 {tn_y}', None],
        'tn_bottom_4' : [f'250 {tn_y}', None],
        'tn_bottom_5' : [f'300 {tn_y}', None],
        'tn_bottom_6' : [f'350 {tn_y}', None],
    }
    str_sub_fixes = { }

    svg = VizFilterSvg(Path('wshoes') / svg_fn)
    for k, v in id_fixups.items():
       if re.search(f'id="{k}"', svg.contents):
           svg.rename_id(k, v)
    for k, v in pos_fixes.items():
        if re.search(f'id="{k}"', svg.contents):
            xy, scale = v[0], v[1]
            svg.translate(k, xy, scale)
    for k, v in str_sub_fixes.items():
        if re.search(k, svg_fn):
            svg.str_sub(*v)
    return svg.contents
    
def merge_wshoes_svgs(fn, vertical=False):
    fv_svgs = ['shoes_parts_filters.svg']
    tn_svgs = ['tn_shoes.svg', 'Navigation-Arrows.svg', 'filter_buttons.svg']

    fv_mod = '<svg><g id="fullview_area">'

    print('Combining svgs into', fn)
    with open(fn, 'w') as f:
        f.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n')
        f.write(fv_mod)
        for svg in fv_svgs:
            f.write(load_wshoes_svg_fixed(svg))
        f.write('\n')
        f.write('<g id="thumbnail_area" transform="translate(0, 10)">')
        for svg in tn_svgs:
            f.write(load_wshoes_svg_fixed(svg))
        f.write('</g>')
        f.write('</svg>')

def build_wshoes_svgs(outdir):
    merge_wshoes_svgs(outdir / 'vf_wshoes.svg', vertical=False)
    merge_wshoes_svgs(outdir / 'vf_wshoes_vert.svg', vertical=True)

