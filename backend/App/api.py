# -*- coding:utf-8 -*-
from App import app, url, db
from flask import json, request

from models import Dislike
import status_code

@app.route(url.USER_DISLIKE_URI, methods=['POST'])
def user_dislike():
    try:
        req_data = request.get_json()
        postid, userid = req_data['post_id'], req_data['user_id']
        row = Dislike(postid, userid)
        row.save()
        res_data = {'status': status_code.success,
                    'updated_count': Dislike.query.filter_by(postid=postid).count(),
                    'reason': ''}
        return json.jsonify(res_data)
    except Exception as e:
        res_data = {'status': status_code.fail,
                    'reason': e.message}
        return json.jsonify(res_data)

@app.route(url.USER_UNDISLIKE_URI, methods=['POST'])
def user_undislike():
    try:
        req_data = request.get_json()
        postid, userid = req_data['post_id'], req_data['user_id']
        row = Dislike.query.filter_by(postid=postid, userid=userid).first_or_404()
        db.session.delete(row)
        db.session.commit()
        res_data = {'status': status_code.success,
                    'updated_count': Dislike.query.filter_by(postid=postid).count(),
                    'reason': ''}
        return json.jsonify(res_data)
    except Exception as e:
        res_data = {'status': status_code.fail,
                    'reason': e.message}
        return json.jsonify(res_data)
        
@app.route(url.GET_DISLIKE_INFO_URI, methods=['POST'])
def get_dislike_info():
    try:
        req_data = request.get_json()
        userid, posts = req_data['user_id'], req_data['posts']
        post_rows = Dislike.query.filter(Dislike.postid.in_(posts))
        cnt_data = post_rows.group_by(Dislike.postid).with_entities(Dislike.postid, db.func.count(Dislike.postid))
        cnt_dic = dict(map(lambda x : (x, 0), posts))
        for data in cnt_data:
            cnt_dic[data[0]] = data[1]
        info_data = post_rows.with_entities(Dislike.postid).filter(Dislike.userid==userid).all()
        info_dic = dict(map(lambda x : (x, False), posts))
        for data in info_data:
            info_dic[data.postid] = True
        res_data = {'status': status_code.success,
                    'dislike_count': cnt_dic,
                    'user_dislikes': info_dic}
        return json.jsonify(res_data)
    except Exception as e:
        res_data = {'status': status_code.fail,
                    'reason': e.message}
        return json.jsonify(res_data)
