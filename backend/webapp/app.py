#!/home/sjcho/anaconda3/envs/tf/bin/python

from flask import Flask, jsonify, make_response, abort, url_for, send_from_directory, request, redirect, \
                  render_template
from copy import deepcopy
from productdb import ProductDb
from const import *
from collections import OrderedDict
from logging.handlers import RotatingFileHandler
import logging
from time import strftime
from flask_cors import CORS, cross_origin
from fitscore import FitRequirement
import socket
import copy
import sys
sys.path.append("..")
from common.yppath import ArchivePath, CrawlPath

cp = CrawlPath('../data/ns_woman_top', 'latest')
db = ProductDb(cp)

app = Flask(__name__, static_url_path="")
#log_file = open('connection_log.log', 'w+')

def isDevServer():
    hostname = socket.gethostname()
    if hostname in ['jandi', 'ChickenDinner']:
        return True
    else:
        return False

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.route('/imgs/ns_woman_top/<path:path>')
def send_img(path):
    return send_from_directory('../data/ns_woman_top/archive', path)

@app.route('/')
def index():
    agent = request.headers.get('User-Agent')
    phones = ["iphone", "android", "blackberry"]
    if any(phone in agent.lower() for phone in phones):
        return render_template('mobile/index.html')
    else:
        return render_template('index.html')

@app.route('/api/products/woman_top', methods=['GET'])
@cross_origin()
def get_woman_top():
    fit_req = FitRequirement.ByRestReq(request.args)

    extra = request.args.get('extra_info', default=0, type=int)
    page = request.args.get('page', default=0, type=int)
    cnt_per_page = request.args.get('cnt_per_page', default=9, type=int)
    cnt_per_page = min(cnt_per_page, 256) # Limit max count
    limit_per_pid = request.args.get('limit_per_pid', default=0, type=int) # 0: No limit
    json_dict = {}
    
    pcids, scores = db.pcids_sorted(fit_req, limit_per_pid)

    #exact_pids, other_pids = db.pids_prop_sorted(props)
    #pids = exact_pids + other_pids
    json_dict['total_cnt'] = len(pcids)
    pcids = pcids[page*cnt_per_page:(page+1)*cnt_per_page]
   
    products = []
    for i, pcid in enumerate(pcids):
        prd = db.get_product_by_pcid(pcid)
        if not prd:
            print(f"PCID {pcid} not found!!!")
            continue
        d = prd.to_dict_brief(extra, {'score':scores[i]})
        products.append(d)

    json_dict['products'] = products
    return jsonify(json_dict)

@app.route('/api/products/woman_top_internal', methods=['GET'])
@cross_origin()
def get_woman_top_internal():
    if not isDevServer: 
        print("\n/products/woman_top_internal accessed in none dev server!!!!\n")
        return get_woman_top()

    fit_req = FitRequirement.ByRestReq(request.args)

    page = request.args.get('page', default=0, type=int)
    cnt_per_page = request.args.get('cnt_per_page', default=9, type=int)
    cnt_per_page = min(cnt_per_page, 256) # Limit max count
    json_dict = {}
    
    df = db.get_score_df(fit_req)
    #print(df.head(5))
    json_dict['total_cnt'] = len(df)
   
    products = []
    for i, row in df[page*cnt_per_page:(page+1)*cnt_per_page].iterrows():
        pcid = row['ProductId']+'_'+row['ColorId']
        prd = db.get_product_by_pcid(pcid)
        if not prd: 
            print(f"PCID {pcid} not found!!!")
            continue # TODO: Find why this case happens..
        row = row.drop(labels = ['index', 'ProductId', 'ColorId'])
        prd.props.update(row.to_dict())
        d = prd.to_dict_brief(extra_info=True, extra_dict=prd.props)
        products.append(d)

    json_dict['products'] = products
    return jsonify(json_dict)

def gen_woman_top_preset(name):
    return {'name': name}

@app.route('/api/products/woman_top/preset', methods=['GET'])
@cross_origin()
def get_woman_top_preset(): # This will be per-user configuration
    presets = []
    presets.append( {'name': 'Choker Tank', 
        'coretype': 2, 'sleeve_length':0, 'neckline': 1, 'collar':2, 'shoulder':2, 'top_length':1,
        'solid': 0, 'pattern':0, 'details': 1})
    presets.append( {'name': 'Tunic with Details', 
        'coretype': 2, 'sleeve_length':4, 'neckline': 1, 'collar':0, 'shoulder': 4, 'top_length':2,
        'solid': 1, 'pattern':0, 'details': 1})
    presets.append( {'name': 'Summer Crop Tops ', 
        'coretype': 0, 'sleeve_length':2, 'neckline': 1, 'collar':0, 'shoulder':0, 'top_length':0,
        'solid': 0, 'pattern':0, 'details': 0})
    presets.append( {'name': 'Work Blouses', 
        'coretype': 2, 'sleeve_length':5, 'neckline': 1, 'collar':1, 'shoulder':4, 'top_length':1,
        'solid': 0, 'pattern':0, 'details': 0})
    presets.append( {'name': 'Bodysuit', 
        'coretype': 1, 'sleeve_length':0, 'neckline': 1, 'collar':0, 'shoulder':1, 'top_length':0,
        'solid': 0, 'pattern':0, 'details': 0})
    presets.append( {'name': 'Cold-Shoulder Top', 
        'coretype': 1, 'sleeve_length':3, 'neckline': 1, 'collar':2, 'shoulder':2, 'top_length':1,
        'solid': 0, 'pattern':0, 'details': 0})
    presets.append( {'name': 'Work Blouses', 
        'coretype': 2, 'sleeve_length':5, 'neckline': 2, 'collar':1, 'shoulder':4, 'top_length':1,
        'solid': 0, 'pattern':0, 'details': 1})
    return jsonify(presets)

@app.route('/api/products/woman_top/<product_id>', methods=['GET'])
@cross_origin()
def get_woman_top_single(product_id):
    if '_' in product_id:
        prd = db.get_product_by_pcid(product_id)
    else:
        prd = db.get_product_by_pid(product_id)
    if prd == None:
        abort(404)
    d = prd.to_dict_full()
    return jsonify({'products': [d]})

known_ips = ['24.130.227.208']
reported_ips = []

def is_ip_to_report(ip):
    if '192.168.50' in ip or ip in known_ips + reported_ips:
        return False
    else:
        return True

@app.after_request
def after_request(response):
    if '/imgs/ns_woman_top/' in request.full_path:
        return response
    ts = strftime('[%Y-%b-%d %H:%M]')
    #log_file.write('%s %s %s %s %s %s\n' % (
    #    ts,
    #    request.remote_addr,
    #    request.method,
    #    request.scheme,
    #    request.full_path,
    #    response.status))
    #log_file.flush()
    #if is_ip_to_report(request.remote_addr):
    #    reported_ips.append(request.remote_addr)
    #
    return response

if __name__ == '__main__':
    if len(sys.argv) >= 2:
        app.run(debug=False, host='0.0.0.0', threaded=True, port=int(sys.argv[1]))
    else:
        app.run(debug=False, host='0.0.0.0', threaded=True)

