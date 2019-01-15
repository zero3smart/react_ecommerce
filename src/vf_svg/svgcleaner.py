import re

class VizFilterSvg:
    def __init__(self, svg_fn):
        self.svg_fn = str(svg_fn)
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

