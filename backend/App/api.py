# -*- coding:utf-8 -*-
from App import app
from flask import json, request
import status_code

@app.route('/user_dislike', methods=['POST'])
def user_dislike():
    try:
        req_data = request.get_json()
        postid, username = req_data['post_id'], req_data['user_id']
        '''
            add data to db
        '''
        res_data = {'status': status_code.success,
                    'updated_count': 0,
                    'reason': ''}
        return json.jsonify(res_data)
    except Exception as e:
        res_data = {'status': status_code.fail,
                    'reason': e}
        return json.jsonify(res_data)

@app.route('/user_undislike', methods=['POST'])
def user_undislike():
    try:
        req_data = request.get_json()
        postid, username = req_data['post_id'], req_data['user_id']
        '''
            delete data on db
        '''
        res_data = {'status': status_code.success,
                'updated_count': 0,
                'reason': ''}
        res = Reponse(respons_data)
        res.headers['Content-Type'] = "application/json; charset=utf-8"
        return json.dump(res)
    except Exception as e:
        res_data = {'status': status_code.fail,
                    'reason': e}
        return json.jsonify(res_data)
        
    
    

@app.route('/get_dislike_count', methods=['GET'])
def get_dislike_count():
    try:
        req_data = request.get_json()
        #postid, username = req_data['post_id'], req_data['user_id']
        '''
            select from db
        '''
        res_data = {'status': status_code.success,
                    'dislike_count': 0}
        return json.jsonify(res_data)
    except Exception as e:
        res_data = {'status': status_code.fail,
                    'reason': e}
        return json.jsonify(res_data)




