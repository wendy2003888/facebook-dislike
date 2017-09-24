# -*- coding:utf-8 -*-

from App import db

class Dislike(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    postid = db.Column(db.String(44))
    userid = db.Column(db.String(18))

    def __init__(self, postid, userid):
        self.postid = postid
        self.userid = userid

    def save(self):
        db.session.add(self)
        db.session.commit()