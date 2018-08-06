
var group_cycle_list = [
    //'Thumbnail_Touch_Area',
    'length_thumbnails',
    // 'neckline_thumbnails',
    // 'shoulder_thumbnails',
    // 'sleeves_thumbnails',
    // 'top_collar_thumbnails',
    // 'top_core_thumbnails',
    //'length_touch', 'top_collar_touch', 'sleeves_touch', 'shoulder_touch', 'top_core_touch', 'neckline_touch',
    // 'length_0', 'length_1', 'length_2', 'length_all', 
    // 'neckline_0', 'neckline_1', 'neckline_2', 'neckline_all', 
    // 'shoulder_0', 'shoulder_1', 'shoulder_2', 'shoulder_3', 'shoulder_4', 'shoulder_all', 
    // 'sleeves_0', 'sleeves_1', 'sleeves_2', 'sleeves_3', 'sleeves_4', 'sleeves_5', 'sleeves_all', 
    // 'top_collar_0', 'top_collar_1', 'top_collar_2', 'top_collar_all', 
    // 'top_core_0', 'top_core_1', 'top_core_2', 'top_core_3', 'top_core_all', 
   'details_button', 'details_selected',
   'patterns_button', 'patterns_button_selected',
   'solid_button', 'solid_button_selected',
    'color_palette_closed', 'color_pallete_-open', 
]

var current_idx = -1;
var selection_idx = 0;

function cycle_bodypart(s)
{
    if (current_idx >= 0) {
        hide_group(s, group_cycle_list[current_idx])
    }
    current_idx += 1
    if (current_idx >= group_cycle_list.length) {

        current_idx = 0
        selection_idx += 1
    }
    gid = group_cycle_list[current_idx]
    show_group(s, gid)
    
    // Show selection in thumbnail 
    // if (gid.includes('thumbnails')) {
    //     prop = gid.replace('_thumbnails', '')
    //     tn_cnt = thumbnail_cnts[prop]
    //     console.log(prop, tn_cnt)
    //     show_selection_box(s, prop, selection_idx%tn_cnt)
    // } else {
    //     hide_group(s, 'Thumbnail-Highliter')
    // }
}

function on_clicked(s)
{
    cycle_bodypart(s)
}

window.onload = function () {
    var s = Snap("#svg");
    s.attr({ viewBox: [0, 0, 480, 420] });

    Snap.load('vf_bundle.svg', function(frag) {
        console.log('Loaded SVG', frag)
        s.g = s.group();
        s.g.append(frag);
        s.g.attr({ visibility: "hidden" });

        show_group(s, "full-body")
        
        s.g.click(function() { on_clicked(s) });
        cycle_bodypart(s)
    });
};
