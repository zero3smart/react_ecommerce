var fit_change_observer = null;

var cur_prop_state = new Object()
var cur_thumbnail = 'neckline'

var firstTime = true
var enableColorPallete = false

function saveConfig(name, val)
{
    try {
        localStorage[name] = val
    } 
    catch(err)
    {
//        alert(err)
    }
}

function loadConfig(name)
{
    try {
        return localStorage[name]
    }
    catch(err)
    {
    }
    return null 
}

for (var i in prop_const) {
    val = loadConfig(i)
    if (val) {
        console.log('Loading saved config', i, val)
        cur_prop_state[i] = val
    }
    else
    {
        cur_prop_state[i] = prop_const[i][2] // Set current status
    }
}

var saved_top_length = cur_prop_state['top_length']

function on_bodypart_clicked(s, prop)
{
    console.log('Touched', prop)
    if (cur_thumbnail.valueOf() == prop.valueOf())
    {
        cycle_prop_selection(s, prop)
    }
    hide_group(s, prop_const[cur_thumbnail][3] +'_thumbnails')
    cur_thumbnail = prop
    new_tn_grp = prop_const[cur_thumbnail][3] +'_thumbnails'
    show_group(s, new_tn_grp)

    // Move thumbnail hit area        
    xoffset = get_thumnail_offset(prop)+15
    yoffset = thumbnail_y_offset + 15
    desc = 't'+xoffset+','+yoffset
    find_group_by_id(s, 'Thumbnail_Touch_Area').transform(desc)

    // Display current one
    show_selection_box(s, prop, cur_prop_state[prop])
}

function change_prop_selection(s, prop, sel)
{
    console.log('change_prop_selection', prop, sel)
    prop_grpn = prop_const[prop][3]
    hide_group(s, prop_grpn+'_'+cur_prop_state[prop])
    show_group(s, prop_grpn+'_'+sel)

    if (prop == 'coretype')
    {
        // Special handling for tank top
        // Hide top-length
        if (sel == '0')
        {
            saved_top_length = cur_prop_state['top_length']
            //change_prop_selection(s, 'top_length', '0')
            cur_prop_state['top_length'] = 'all'
            hide_group(s, 'length_'+saved_top_length)
            show_group(s, 'length_0')
        }
        else if (cur_prop_state[prop] == '0')
        {
            hide_group(s, 'length_0')
            hide_group(s, 'length_all')
            show_group(s, 'length_'+saved_top_length)
            cur_prop_state['top_length'] = saved_top_length
        }
    }
    if (prop == 'top_length' && cur_prop_state['coretype'] == '0')
    {
        if (prop != 0)
        {
            hide_group(s, 'length_0')
        }
        hide_group(s, 'top_core_0')
        show_group(s, 'top_core_1')
        cur_prop_state['coretype'] = '1' // Avoid recursion
    }

    cur_prop_state[prop] = sel
    
    if (fit_change_observer)
    {
        req_str = getRestProductReqStr()
        fit_change_observer(req_str)
    }

    for (var i in prop_const) {
        saveConfig(i, cur_prop_state[i])
    }
}

function cycle_prop_selection(s, prop)
{
    if (cur_prop_state[prop]=='all')
    {
        change_prop_selection(s, prop, '0')
    }
    else
    {
        next = parseInt(cur_prop_state[prop])+1
        if (next == prop_const[cur_thumbnail][1]+1)
            next = 'all'
        change_prop_selection(s, prop, next)
    }
}

function on_thumbnail_clicked(s, tn_idx)
{
    console.log('Touched thumbnail idx', tn_idx)
    if (tn_idx > prop_const[cur_thumbnail][1]+1)
        return
    show_selection_box(s, cur_thumbnail, parseInt(tn_idx))
    if (tn_idx == prop_const[cur_thumbnail][1]+1)
        tn_idx = 'all'
    change_prop_selection(s, cur_thumbnail, tn_idx)
}

var color_pallette_opened = 0

function open_close_color_pallete(s, open)
{
    if (open)
    {
        color_pallette_opened = 1
        hide_group(s, 'color_0')
        show_group(s, 'color_pallete_open')
    }
    else
    {
        color_pallette_opened = 0
        hide_group(s, 'color_pallete_open')
        show_group(s, 'color_0')
    }

    for (var i = 0; i< 15; i++)
    {
        g = find_group_by_id(s, 'color_palette_touch_'+i);
        if (color_pallette_opened)
        {
            g.attr({ visibility: "visible" });
        }
        else
        {
            g.attr({ visibility: "hidden" });    
        }
    }
}
function on_filter_clicked(s, prop)
{
    console.log('Touched filter', prop)

    if (prop == 'color')
    {
        open_close_color_pallete(s, !color_pallette_opened)
    }
    else
    {
        change_prop_selection(s, prop, (cur_prop_state[prop]+1)%2)
    }
}

function on_color_clicked(s, color_id)
{
    console.log('on_color_clicked', color_id)
    if (color_id=='0')
    {
        on_filter_clicked(s, 'color')
    }
}

function init_click_hit_map(s) 
{
    // This will be touch hit-area
    for (var prop in cur_prop_state) 
    {
        g = find_group_by_id(s, prop_const[prop][3]+'_touch');
        if (g==null) {
            console.log('Touch area for',prop,'not found')
            continue
        }
        if (!enableColorPallete && prop == 'color')
            continue
        // Just make it not-visible. We still need it for hit-map 
        g.attr({ visibility: "visible" });
        g.attr({ opacity: "0" });
        if (['solid', 'pattern', 'details', 'color'].includes(prop))
        {
            g.click(function() { on_filter_clicked(s, this) }, prop); 
        }
        else
        {
            g.click(function() { on_bodypart_clicked(s, this) }, prop);
        }
    }
    if (enableColorPallete)
    {
        for (var i = 0; i< 15; i++)
        {
            g = find_group_by_id(s, 'color_palette_touch_'+i);
            //g.attr({ visibility: "visible" });
            g.attr({ visibility: "hidden" });
            g.attr({ opacity: ".0" });
            g.click(function() { on_color_clicked(s, this) }, i.toString());
        }
    }
    for (var i = 0; i<7; i++)
    {
        g = find_group_by_id(s, 'thumbnail_touch_'+i)
        g.attr({'width':68, 'height':68})
        g.attr({ visibility: "visible" });
        //g.attr({ opacity: ".5" }); 
        g.attr({ opacity: "0" });
        g.click(function() { on_thumbnail_clicked(s, this) }, i.toString());  
    }
}
/*
function init_filter_buttons(s)
{
    show_group(s, 'details_0')
    show_group(s, 'pattern_0')
    show_group(s, 'solid_0')
    if (enableColorPallete)
    {
        show_group(s, 'color_palette_closed')
    }
    else
    {
        hide_group(s, 'color_palette_closed')    
    }
}
*/

var onboarding_stage = 0

function on_onboarding_click(s)
{
    //console.log('onboarding clicked', onboarding_stage) 
    switch (onboarding_stage)
    {
        case 0:
            show_group(s, 'mini_onboarding_touch')
            show_group(s, 'mini_onboarding_1')
            change_prop_selection(s, 'shoulder', 1)
            on_bodypart_clicked(s, 'shoulder')
            break
        case 1:
            hide_group(s, 'mini_onboarding_1')
            show_group(s, 'mini_onboarding_2')
            on_bodypart_clicked(s, 'shoulder')
            break
        case 2:
            hide_group(s, 'mini_onboarding_2')
            show_group(s, 'mini_onboarding_3')
            on_bodypart_clicked(s, 'shoulder')
            break
        case 3:
            hide_group(s, 'mini_onboarding_3')
            show_group(s, 'mini_onboarding_4')
            break
        case 4:
            hide_group(s, 'mini_onboarding_touch')
            hide_group(s, 'mini_onboarding_4')
            done_onboarding()
            init_click_hit_map(s); // Delay late to avoid Conflict with onboarding hitmap
            break
    }
    onboarding_stage += 1
}

function on_onboarding(s, frag)
{
    console.log('Loaded mini_onboarding.svg', frag)
    s.g = s.group();
    s.g.append(frag);
    s.g.attr({ visibility: "hidden" });

    g = find_group_by_id(s, 'mini_onboarding_touch')
    g.click(function() { on_onboarding_click(s)}, s); 
    on_onboarding_click(s)
}

function need_onboarding()
{
    if (loadConfig('onboarding_completed'))
    {
        return false
    }
    else
    {
        return true
    }
}

function done_onboarding()
{
    saveConfig('onboarding_completed', 1)
}

window.onload = function () {
    var s = Snap("#svg");
    s.attr({ viewBox: [0, 0, 480, 440] });

    Snap.load('vf_bundle.svg', function(frag) {
        console.log('Loaded vf_bundle.svg', frag)
        s.g = s.group();
        s.g.append(frag);
        s.g.attr({ visibility: "hidden" });

        show_group(s, "full-body")
        //init_filter_buttons(s)
        on_bodypart_clicked(s, 'coretype');
        
        for (var prop in cur_prop_state) 
        {
            if (prop == 'color')
            {
                if  (enableColorPallete)
                    show_group(s, 'color_palette_closed')
                continue
            }
            prop_grpn = prop_const[prop][3]
            change_prop_selection(s, prop, cur_prop_state[prop])
        }
        if (need_onboarding())
        {
            Snap.load('mini_onboarding.svg', function(frag) {
                on_onboarding(s, frag); 
            });
        }
        else
        {
            init_click_hit_map(s);
        }
    });
};

//rest_server_url = "http://35.185.226.95:5000/"
rest_server_url = "" // http://35.185.226.95:5000/"

function getRestProductReqStr() {
    var self = this;
    http_req = rest_server_url
    http_req += "api/products/woman_top?"
    http_req += "page=0";
    //http_req += "&extra_info=1";
    http_req += "&limit_per_pid=1";
    http_req += "&cnt_per_page=72"
    
    for (var prop in cur_prop_state) 
    {
        ps = cur_prop_state[prop];
        if (ps >= 0)
        {
            http_req += "&" + prop + "=" + ps
        }
    }
    return http_req;
}

function set_fit_change_observer(observer)
{
    fit_change_observer = observer
}

