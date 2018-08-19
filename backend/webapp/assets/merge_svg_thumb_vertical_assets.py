#
# Merge individual svg files while setting proper group names
#
import os
from pathlib import Path
import re

class VizFilterSvg:
    def __init__(self, svg_fn):
        self.svg_fn = svg_fn
        svg_fn = Path('svg-thumb-vertical') / svg_fn
        with open(svg_fn, 'r') as f:
            self.contents = f.read()
        self.basic_cleanup()

    def remove_viewbox(self):
        self.contents = re.sub('viewBox=\"[^\"]*\"','', self.contents)

    def basic_cleanup(self):
        self.contents = self.contents.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>','')
        self.contents = re.sub(r'<svg width="[0-9]+px" height="[0-9]+px" ', '<svg ', self.contents)
        # Remove unnecessary attributes
        for i in ['data-name']: #, 'width', 'height']:
            self.contents = re.sub(f' {i}=\"[^\"]*\"','', self.contents)
        # Remove unncessary blocks
        for i in ['title', 'desc']:
            self.contents = re.sub(f'<{i}>[^<]*</{i}>','', self.contents)
        self.remove_viewbox()

    def rename_id(self, frm, to):
        g_frm, g_to = f' id=\"{frm}\"', f' id=\"{to}\"'
        cnt = self.contents.count(g_frm)
        if cnt != 1:
            print(f'Invalid # of groups in {self.svg_fn} : found {cnt}')
        assert(cnt == 1)
        self.contents = self.contents.replace(g_frm, g_to)

    def translate(self, id, trans, scale):
        if re.search(f'<[^>]*id="{id}"[^>]*transform[^>]*>', self.contents):
            self.contents = re.sub('transform=\"[^\"]*\"',f'transform="translate({trans}) scale({scale})"', self.contents, count=1)
        elif re.search(f'<[^>]*id="{id}"[^>]*>', self.contents):
            self.contents = self.contents.replace(f'id="{id}"', f'id="{id}" transform="translate({trans})"')
        else:
            print('Failed to find entry to transform', self.svg_fn)

    def str_sub(self, frm, to):
        self.contents = self.contents.replace(frm, to)

    def svg(self):
        return self.contents + '\n'

def load_svg_fixed(svg_fn):
    id_fixups = {
        #'color_palette_closed' : 'color_0',
        # 'color_palete_-open'  : 'color_pallete_open', 
        # 'color_palette_3' : 'color-palette',
        # 'filter_button_touch_area_0':'solid_touch',
        # 'filter_button_touch_area_1':'pattern_touch',
        # 'filter_button_touch_area_2':'details_touch',
        # 'filter_button_touch_area_3':'color_touch',
        # 'patterns_0' : 'pattern_0',
        # 'patterns_1' : 'pattern_1',
        # 'patterns_touch' :'pattern_touch',
    }
    tn_x = 400 # Also update vf_common.js:thumbnail_x_offset when this is changed!
    tn_y = 20 # Also update vf_common.js:thumbnail_y_offset when this is changed!
    filter_y = -20 #375
    pos_fixes = {
        # 'BodyParts-Touch-Area': 'translate(110, -17)',
        'length_thumbnails': f'{tn_x} {tn_y}', # 4 selections
        'neckline_thumbnails': f'{tn_x} {tn_y}', # 4 selections
        'shoulder_thumbnails': f'{tn_x} {tn_y}', # 6 selections
        'sleeves_thumbnails': f'{tn_x} {tn_y}', # 7 selections
        'top_collar_thumbnails': f'{tn_x} {tn_y}', # 4 selections
        'top_core_thumbnails': f'{tn_x} {tn_y}', # 5 selections
        #'all-about-filter-buttons-v1': f'40 {filter_y}',
        # 'all-about-filter-buttons-v1': f'85 {filter_y}',
        'BodyParts-Touch-Area' : f'-9 -18',
        # 'color-palette' : f'40 -31',
    }
    str_sub_fixes = {
        #'Thumbnail-Highliter.svg' : ['rx="8"', 'rx="8" width="62" height="62"'], 
        # '.*_0.svg' : ['cls-1', 'cls-0'], # Change cls id for 0 - cls id conflicts with length_x.svg
        # 'top_core_0.svg' : ['cls-0', 'cls-1'],
        # '.*_all.svg' : ['cls-1', 'cls-all'], # Change cls id for all - cls id conflicts with length_x.svg
    }
    svg = VizFilterSvg(svg_fn)
    for k, v in id_fixups.items():
        if re.search(f'id="{k}"', svg.contents):
            svg.rename_id(k, v)
    for k, v in pos_fixes.items():
        if re.search(f'id="{k}"', svg.contents):
            svg.translate(k, v, '1.4')
    for k, v in str_sub_fixes.items():
        if re.search(k, svg_fn):
            svg.str_sub(*v)
    return svg.contents

def merge_svgs():
    upper_svgs = ['full_body.svg']
    upper_svgs += ['BodyParts-Touch-Area.svg']

    lower_svgs = [
        'Thumbnail-Highliter.svg',
        'length_thumbnails.svg', 
        'neckline_thumbnails.svg',
        'shoulder_thumbnails.svg',
        'sleeves_thumbnails.svg',
        'top_collar_thumbnails.svg',
        'top_core_thumbnails.svg',
        'filter_buttons.svg',
        'Thumbnail_Touch_Area.svg',
        # 'color_highlighter.svg',
        # 'color_palette.svg',
    ]


    fn = '../../../public/svg/vf_bundle_thumb_vertical.svg'
    print('Combining svgs into', fn)
    with open(fn, 'w') as f:
        f.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n')
        f.write('<svg><g id="bodypart_area" transform="scale(1.35) translate(30, 15)">')
        for svg in upper_svgs:
            f.write(load_svg_fixed(svg))
        f.write('</g>')
        f.write('<g id="thumbnail_area" transform="translate(0, 10)">')
        for svg in lower_svgs:
            f.write(load_svg_fixed(svg))
        f.write('</g>')
        f.write('</svg>')
if __name__ == '__main__':
    merge_svgs()
