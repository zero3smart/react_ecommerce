import os
import re
from svgcleaner import VizFilterSvg
from pathlib import Path

def load_wshoes_svg_fixed(svg_fn):
    id_fixups = {
        'bottom_0': 'bottoms_0',
        'bottom_1': 'bottoms_1',
        'toe_0': 'toes_0',
        'toe_1': 'toes_1',
        'toe_2': 'toes_2',
        'counter_0': 'counters_0',
        'counter_1': 'counters_1',
        'counter_2': 'counters_2',
        'counter_3': 'counters_3',
        'counter_4': 'counters_4',
        'shaft_0': 'shafts_0',
        'shaft_1': 'shafts_1',
        'shaft_2': 'shafts_2',
        'shaft_3': 'shafts_3',
        'shaft_4': 'shafts_4',
        'tn_counter_2': 'tn_counters_2',
        'tn_bottom': 'tn_bottoms',
        'tn_bottom_0': 'tn_bottoms_0',
        'tn_bottom_1': 'tn_bottoms_1',
        'tn_bottom_2': 'tn_bottoms_2',
        'tn_bottom_3': 'tn_bottoms_3',
        'tn_bottom_4': 'tn_bottoms_4',
        'tn_bottom_5': 'tn_bottoms_5',
        'tn_bottom_6': 'tn_bottoms_6',
        'tn_shaft' : 'tn_shafts',
        'tn_shaft_0': 'tn_shafts_0',
        'tn_shaft_1': 'tn_shafts_1',
        'tn_shaft_2': 'tn_shafts_2',
        'tn_shaft_3': 'tn_shafts_3',
        'tn_shaft_4': 'tn_shafts_4',
        'shaft_0_HL': 'shafts_0_HL',
        'shaft_1_HL': 'shafts_1_HL',
        'shaft_2_HL': 'shafts_2_HL',
        'shaft_3_HL': 'shafts_3_HL',
        'shaft_4_HL': 'shafts_4_HL',
        'tn_covers_1': 'tn_covers_0',
        'tn_covers_2': 'tn_covers_1',
        'tn_covers_3': 'tn_covers_2',
        'tn_covers_4': 'tn_covers_3',
        'toe_0_HL' : 'toes_0_HL',
        'toe_1_HL' : 'toes_1_HL',
        'toe_2_HL' : 'toes_2_HL',
        'counter_0_HL' : 'counters_0_HL',
        'counter_1_HL' : 'counters_1_HL',
        'counter_2_HL' : 'counters_2_HL',
        'counter_3_HL' : 'counters_3_HL',
        'counter_4_HL' : 'counters_4_HL',
        'cover_0_HL' : 'covers_0_HL',
        'cover_1_HL' : 'covers_1_HL',
        'cover_2_HL' : 'covers_2_HL',
        'cover_3_HL' : 'covers_3_HL',
    }
    tn_y = 0
    pos_fixes = {
        'shoes_parts_filters': ['80 90', .8], # Main filter area
        'preset_back': ['5 150', 1],
        'preset_forward': ['345 150', 1],
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
    tn_svgs = ['tn_shoes.svg', '../common/arrows.svg', '../common/preset_arrows.svg', 'filter_buttons.svg']

    print('Combining svgs into', fn)
    with open(fn, 'w') as f:
        f.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n')
        f.write('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n')
        f.write('<g id="fullview_area">\n')
        for svg in fv_svgs:
            f.write(load_wshoes_svg_fixed(svg))
        f.write('</g>\n')
        f.write('<g id="thumbnail_area" transform="translate(0, 0)">')
        for svg in tn_svgs:
            f.write(load_wshoes_svg_fixed(svg))
        f.write('</g>')
        f.write('</svg>')

def build_wshoes_svgs(outdir):
    merge_wshoes_svgs(outdir / 'vf_wshoes.svg', vertical=False)
    merge_wshoes_svgs(outdir / 'vf_wshoes_vert.svg', vertical=True)
