import os
import re
from svgcleaner import VizFilterSvg
from pathlib import Path

def load_wtop_svg_fixed(svg_fn, vertical, remove_all):
    id_fixups = {
        'top_core_thumbnails' : 'coretype_thumbnails',
        'top_core_thumbnails_0' : 'coretype_thumbnails_0',
        'top_core_thumbnails_1' : 'coretype_thumbnails_1',
        'top_core_thumbnails_2' : 'coretype_thumbnails_2',
        'top_core_thumbnails_3' : 'coretype_thumbnails_3',
        'top_core_0_HL': 'coretype_0_HL',
        'top_core_1_HL': 'coretype_1_HL',
        'top_core_2_HL': 'coretype_2_HL',
        'top_core_3_HL': 'coretype_3_HL',
        'top_core_0': 'coretype_0',
        'top_core_1': 'coretype_1',
        'top_core_2': 'coretype_2',
        'top_core_3': 'coretype_3',
        'top_core_touch': 'coretype_touch',
        'sleeves_thumbnails' : 'sleeve_length_thumbnails',
        'sleeves_thumbnails_0' : 'sleeve_length_thumbnails_0',
        'sleeves_thumbnails_1' : 'sleeve_length_thumbnails_1',
        'sleeves_thumbnails_2' : 'sleeve_length_thumbnails_2',
        'sleeves_thumbnails_3' : 'sleeve_length_thumbnails_3',
        'sleeves_thumbnails_4' : 'sleeve_length_thumbnails_4',
        'sleeves_thumbnails_5' : 'sleeve_length_thumbnails_5',
        'sleeves_0_HL': 'sleeve_length_0_HL',
        'sleeves_1_HL': 'sleeve_length_1_HL',
        'sleeves_2_HL': 'sleeve_length_2_HL',
        'sleeves_3_HL': 'sleeve_length_3_HL',
        'sleeves_4_HL': 'sleeve_length_4_HL',
        'sleeves_5_HL': 'sleeve_length_5_HL',
        'sleeves_0': 'sleeve_length_0',
        'sleeves_1': 'sleeve_length_1',
        'sleeves_2': 'sleeve_length_2',
        'sleeves_3': 'sleeve_length_3',
        'sleeves_4': 'sleeve_length_4',
        'sleeves_5': 'sleeve_length_5',
        'sleeves_touch' : 'sleeve_length_touch',
        'length_thumbnails' : 'top_length_thumbnails',
        'length_thumbnails_0' : 'top_length_thumbnails_0',
        'length_thumbnails_1' : 'top_length_thumbnails_1',
        'length_thumbnails_2' : 'top_length_thumbnails_2',
        'length_0_HL': 'top_length_0_HL',
        'length_1_HL': 'top_length_1_HL',
        'length_2_HL': 'top_length_2_HL',
        'length_0': 'top_length_0',
        'length_1': 'top_length_1',
        'length_2': 'top_length_2',
        'length_touch': 'top_length_touch',
    }
    # Adjust positions
    if vertical:
        if remove_all:
            tn_xy = f'400 -10'
        else:
            tn_xy = f'400 20'
        scale = '1.4'
        pos_fixes = { i : [tn_xy, scale] for i in [
            'length_thumbnails',
            'neckline_thumbnails',
            'shoulder_thumbnails',
            'sleeves_thumbnails',
            #'top_collar_thumbnails',
            'top_core_thumbnails'
        ] }
    else:
        tn_y = 330
        scale = None
        if remove_all: 
            pos_fixes = {
                'length_thumbnails': [f'135 {tn_y}', scale], # 3 selections
                'neckline_thumbnails': [f'69 {tn_y}', scale], # 5 selections
                'shoulder_thumbnails': [f'100 {tn_y}', scale], # 4 selections
                'sleeves_thumbnails': [f'35 {tn_y}', scale], # 6 selections
                #'top_collar_thumbnails': [f'135 {tn_y}', scale], # 4 selections
                'coretype_thumbnails': [f'100 {tn_y}', scale], # 4 selections
            }
        else: # not used now
            pos_fixes = {
                'length_thumbnails': [f'110 {tn_y}', scale], # 4 selections
                'neckline_thumbnails': [f'72 {tn_y}', scale], # 5 selections
                'shoulder_thumbnails': [f'72 {tn_y}', scale], # 5 selections
                'sleeves_thumbnails': [f'10 {tn_y}', scale], # 7 selections
                #'top_collar_thumbnails': [f'110 {tn_y}', scale], # 4 selections
                'coretype_thumbnails': [f'72 {tn_y}', scale], # 5 selections
            }
    pos_fixes.update({
        'BodyParts-Touch-Area' : [f'-9 -18', None],
        'visual-filter-updated-Aug-10.0': [f'50 15', 1.35]
    })

    # Misc fixes
    str_sub_fixes = {
        #'Thumbnail-Highliter.svg' : ['rx="8"', 'rx="8" width="62" height="62"'], 
    }
    svg = VizFilterSvg(Path('wtop') / svg_fn)
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

def merge_wtop(fn, vertical=False, remove_all=False):
    upper_svgs = ['full_body.svg']
    upper_svgs += ['BodyParts-Touch-Area.svg']
    
    lower_svgs = ['Thumbnail-Highliter.svg', 'filter_buttons.svg']

    hv_svgs = [
            'length_thumbnails.svg', 
            'neckline_thumbnails.svg',
            'shoulder_thumbnails.svg',
            'sleeves_thumbnails.svg',
            #'top_collar_thumbnails.svg',
            'top_core_thumbnails.svg',
            'Thumbnail_Touch_Area.svg'] # Thumbnail_Touch_Area.svg should be at the bottom
    lower_svgs += [s.replace('.svg', '_vert.svg') if vertical else s for s in hv_svgs]

    lower_svgs += ['Navigation-Arrows.svg', 'Floating-circle-point.svg']

    if vertical:
        bodypart_mod = '<svg><g id="bodypart_area">' # transform="scale(1.35) translate(30, 15)">'
    else:
        bodypart_mod = '<svg><g id="bodypart_area">' # transform="scale(1.35) translate(50, 15)">'

    print('Combining svgs into', fn)
    with open(fn, 'w') as f:
        f.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n')
        f.write(bodypart_mod)
        for svg in upper_svgs:
            f.write(load_wtop_svg_fixed(svg, vertical, remove_all))
        f.write('</g>')
        f.write('<g id="thumbnail_area" transform="translate(0, 10)">')
        for svg in lower_svgs:
            f.write(load_wtop_svg_fixed(svg, vertical, remove_all))
        f.write('</g>')
        f.write('</svg>')

def merge_wtop_svgs(outdir):
    merge_wtop(outdir / 'vf_wtop.svg', vertical=False, remove_all=True)
    merge_wtop(outdir / 'vf_wtop_vert.svg', vertical=True, remove_all=True)

