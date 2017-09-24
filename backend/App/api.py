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
                    'updated_count': Dislike.query.count(),
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
                    'updated_count': Dislike.query.count(),
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
        # Which is faster? join the column user_id in posts or for loop
        rows = Dislike.query.with_entities(Dislike.postid).filter(Dislike.userid==userid, Dislike.postid.in_(posts)).all()
        dic = dict(map(lambda x : (x, False), posts))
        for row in rows:
            dic[row.postid] = True
        res_data = {'status': status_code.success,
                    'dislike_count': len(rows),
                    'user_dislikes': dic}
        return json.jsonify(res_data)
    except Exception as e:
        res_data = {'status': status_code.fail,
                    'reason': e.message}
        return json.jsonify(res_data)




