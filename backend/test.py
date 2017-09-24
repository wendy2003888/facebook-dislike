# -*- coding:utf-8 -*-

import requests, json

from App import url


def test_user_dislike():
    data = {
        'post_id' : '123_456', 
        'user_id' : '233'
    }
    response = requests.post(url.LOCAL_URL + url.USER_DISLIKE_URI, json=data)
    print 'user_dislike response : %s' % response.content
    return

def test_user_undislike():
    data = {
        'post_id' : '123_456', 
        'user_id' : '233'
    }
    response = requests.post(url.LOCAL_URL + url.USER_UNDISLIKE_URI, json=data)
    print 'user_undislike response : %s' % response.content
    return

def test_get_dislike_info():
    data = {
        'posts' : ['123_456', '233_666'], 
        'user_id' : '233'
    }
    response = requests.post(url.LOCAL_URL + url.GET_DISLIKE_INFO_URI, json=data)
    print 'get_dislike_info response : %s' % response.content
    return

if __name__ == '__main__':
    # test_user_dislike()
    # test_user_undislike()
    test_get_dislike_info()




    