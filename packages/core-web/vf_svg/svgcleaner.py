import re

class VizFilterSvg:
    def __init__(self, svg_fn):
        self.svg_fn = str(svg_fn)
        with open(svg_fn, 'r') as f:
            self.contents = f.read()
        self.basic_cleanup()

    def basic_cleanup(self):
        to_remove = [
            '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
            '<?xml version="1.0" encoding="UTF-8"?>'
        ]
        for s in to_remove:
            self.contents = self.contents.replace(s, '')
        to_remove_reg = [
            '<svg[^>]*>',
            '</svg>'
        ]
        for r in to_remove_reg:
            self.contents = re.sub(r, '', self.contents)

        # Remove unnecessary attributes
        for i in ['data-name']: #, 'width', 'height']:
            self.contents = re.sub(f' {i}=\"[^\"]*\"','', self.contents)
        # Remove unncessary blocks
        for i in ['title', 'desc']:
            self.contents = re.sub(f'<{i}>[^<]*</{i}>','', self.contents)
       
    def rename_id(self, frm, to):
        g_frm, g_to = f' id=\"{frm}\"', f' id=\"{to}\"'
        cnt = self.contents.count(g_frm)
        if cnt != 1:
            print(f'Invalid # of groups in {self.svg_fn} : found {cnt} of {frm}')
        assert(cnt == 1)
        self.contents = self.contents.replace(g_frm, g_to)

    def translate(self, id, trans, scale=None):
        if re.search(f'<[^>]*id="{id}"[^>]*transform[^>]*>', self.contents):
            if scale: dst = f'id="{id}" transform="translate({trans}) scale({scale})"'
            else:     dst = f'id="{id}" transform="translate({trans})"'
            self.contents = re.sub(f'id="{id}" transform=\"[^\"]*\"', dst, self.contents, count=1)
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

