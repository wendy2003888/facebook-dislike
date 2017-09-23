# -*- coding:utf-8 -*-

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__)

app.config.from_pyfile('config.py')
db = SQLAlchemy(app)
CORS(app)

