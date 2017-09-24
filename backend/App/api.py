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
        
@app.route(url.GET_DISLIKE_COUNT_URI, methods=['GET'])
def get_dislike_count():
    try:
        cnt = Dislike.query.count()
        res_data = {'status': status_code.success,
                    'dislike_count': cnt}
        return json.jsonify(res_data)
    except Exception as e:
        res_data = {'status': status_code.fail,
                    'reason': e.message}
        return json.jsonify(res_data)




