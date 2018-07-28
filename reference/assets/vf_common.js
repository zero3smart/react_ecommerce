// name: [Min, Max, Default State, SVG file prefix]
// state -1 is all
var prop_const = { 
    coretype: [0, 3, 2, "top_core"], 
    collar: [0, 2, 0, "top_collar"],
    top_length: [0, 2, 1, "length"],
    neckline: [0, 2, 1, "neckline"], 
    shoulder: [0, 4, 1, "shoulder"],
    sleeve_length: [0, 5, 3, "sleeves"], // Actual max value to pass to REST is 4. length 5 means length 4 & tightness 1
    solid: [0, 1, 0, 'solid'],
    pattern: [0, 1, 0, 'pattern'],
    details: [0, 1, 0, 'details'],
    color: [0, 1, 0, 'color'],
}

var thumbnail_img_x_offset = {
    4: 103,
    5: 67,
    6: 43,
    7: 3
}

var thumbnail_y_offset=320-5 // Affected by tn_y in merge_svg_asset.py

function get_thumnail_offset(prop)
{
    tn_cnt = prop_const[prop][1]+2
    return thumbnail_img_x_offset[tn_cnt]
}

function show_selection_box(s, prop, sel)
{
    var g = find_group_by_id(s, 'Thumbnail-Highliter')
    if (sel == 'all')
        sel = prop_const[prop][1]+1
    x = sel*68 + get_thumnail_offset(prop)
    desc = 't'+x+','+thumbnail_y_offset
    console.log('Thumbnail', sel, 'Transform selection box to ', desc)
    g.transform(desc)
    show_group(s, 'Thumbnail-Highliter')
}

function find_group_by_id(s, id)
{
//    if (id.includes("no-show"))
//        return null
    g = s.select("#"+id)
    if (g == null) {
        console.log('Missing group', id)
        return null
    }
    return g
}

function show_group(s, id)
{
    //console.log('Showing', id)
    g = find_group_by_id(s, id)
    g.attr({ visibility: "visible" });
}

function hide_group(s, id)
{
    g = find_group_by_id(s, id)
    g.attr({ visibility: "hidden" });
}

//var rest_server_url = "http://35.185.226.95:5000/" // yesplz-us
var rest_server_url = "http://35.240.154.83:5000/" // yesplz-asis
//var rest_server_url = "" // Use same server

