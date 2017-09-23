# -*- coding:utf-8 -*-

from flask import Flask
from flask_sqlalchemy import SQLalchemy

app = Flask(__name__)

app.config.from_pyfile('config.py')
db = SQLalchemy(app)

