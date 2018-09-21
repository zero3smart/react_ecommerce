#
# Merge individual svg files while setting proper group names
#
import os
from pathlib import Path
import re

class VizFilterSvg:
    def __init__(self, svg_fn):
        self.svg_fn = svg_fn
        svg_fn = Path('svg') / svg_fn
        with open(svg_fn, 'r') as f:
            self.contents = f.read()
        self.basic_cleanup()

    def remove_viewbox(self):
        self.contents = re.sub('viewBox=\"[^\"]*\"','', self.contents)

    def basic_cleanup(self):
        self.contents = self.contents.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>','')
        self.contents = self.contents.replace('<?xml version="1.0" encoding="UTF-8"?>','')
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

    def translate(self, id, trans, scale=None):
        if re.search(f'<[^>]*id="{id}"[^>]*transform[^>]*>', self.contents):
            if scale: dst = f'transform="translate({trans}) scale({scale})"'
            else:     dst = f'transform="translate({trans})"'
            self.contents = re.sub('transform=\"[^\"]*\"', dst, self.contents, count=1)
        elif re.search(f'<[^>]*id="{id}"[^>]*>', self.contents):
            if scale: dst = f'id="{id}" transform="translate({trans}) scale({scale})"'
            else:     dst = f'id="{id}" transform="translate({trans})"'
            self.contents = self.contents.replace(f'id="{id}"', dst)
        else:
            print('Failed to find entry to transform', self.svg_fn)

    def str_sub(self, frm, to):
        self.contents = self.contents.replace(frm, to)

    def svg(self):
        return self.contents + '\n'

def load_svg_fixed(svg_fn, vertical, remove_all):
    # Fix incorrectly ids - fix these in sketch
    id_fixups = {
        #'color_palette_closed' : 'color_0',
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
            'top_collar_thumbnails',
            'top_core_thumbnails'
        ] }
    else:
        tn_y = 330
        scale = None
        if remove_all: 
            pos_fixes = {
                'length_thumbnails': [f'135 {tn_y}', scale], # 4 selections
                'neckline_thumbnails': [f'135 {tn_y}', scale], # 4 selections
                'shoulder_thumbnails': [f'68 {tn_y}', scale], # 6 selections
                'sleeves_thumbnails': [f'35 {tn_y}', scale], # 7 selections
                'top_collar_thumbnails': [f'135 {tn_y}', scale], # 4 selections
                'top_core_thumbnails': [f'100 {tn_y}', scale], # 5 selections
            }
        else:
            pos_fixes = {
                'length_thumbnails': [f'110 {tn_y}', scale], # 4 selections
                'neckline_thumbnails': [f'110 {tn_y}', scale], # 4 selections
                'shoulder_thumbnails': [f'50 {tn_y}', scale], # 6 selections
                'sleeves_thumbnails': [f'10 {tn_y}', scale], # 7 selections
                'top_collar_thumbnails': [f'110 {tn_y}', scale], # 4 selections
                'top_core_thumbnails': [f'72 {tn_y}', scale], # 5 selections
            }
    pos_fixes.update({'BodyParts-Touch-Area' : [f'-9 -18', None]})

    # Misc fixes
    str_sub_fixes = {
        #'Thumbnail-Highliter.svg' : ['rx="8"', 'rx="8" width="62" height="62"'], 
    }
    svg = VizFilterSvg(svg_fn)
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

def merge_svgs(fn, vertical=False, remove_all=False):
    upper_svgs = ['full_body.svg']
    upper_svgs += ['BodyParts-Touch-Area.svg']
    
    lower_svgs = ['Thumbnail-Highliter.svg', 'filter_buttons.svg']

    hv_svgs = [
            'length_thumbnails.svg', 
            'neckline_thumbnails.svg',
            'shoulder_thumbnails.svg',
            'sleeves_thumbnails.svg',
            'top_collar_thumbnails.svg',
            'top_core_thumbnails.svg',
            'Thumbnail_Touch_Area.svg'] # Thumbnail_Touch_Area.svg should be at the bottom
    lower_svgs += [s.replace('.svg', '_vert.svg') if vertical else s for s in hv_svgs]

    lower_svgs += ['Navigation-Arrows.svg']

    if vertical:
        bodypart_mod = '<svg><g id="bodypart_area" transform="scale(1.35) translate(30, 15)">'
    else:
        bodypart_mod = '<svg><g id="bodypart_area" transform="scale(1.35) translate(50, 15)">'

    print('Combining svgs into', fn)
    with open(fn, 'w') as f:
        f.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n')
        f.write(bodypart_mod)
        for svg in upper_svgs:
            f.write(load_svg_fixed(svg, vertical, remove_all))
        f.write('</g>')
        f.write('<g id="thumbnail_area" transform="translate(0, 10)">')
        for svg in lower_svgs:
            f.write(load_svg_fixed(svg, vertical, remove_all))
        f.write('</g>')
        f.write('</svg>')

if __name__ == '__main__':
    outdir = Path('../assets/svg')
    merge_svgs(outdir / 'vf_bundle.svg', vertical=False, remove_all=True)
    merge_svgs(outdir / 'vf_bundle_thumb_vertical.svg', vertical=True, remove_all=True)

