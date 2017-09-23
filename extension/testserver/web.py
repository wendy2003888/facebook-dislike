from flask import Flask
from flask import request
from flask import render_template, abort, redirect, Response

import pymysql

import json

from flask_cors import CORS, cross_origin

db = pymysql.connect(
    host = 'localhost',
    user = 'root',
    password = 'cscscscs',
    db = 'projecttest',
    charset = 'utf8',
    cursorclass = pymysql.cursors.DictCursor,
)


app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, world'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return '<b>Hello, %s</b>' % request.form['username'] 
    else:
        return render_template('login.html')


## ---- 2.1 ---- #    

@app.route('/student', methods=['POST'])
def create_student():
    content = request.get_json()
    student_id = None
    
    with db.cursor() as cursor:
        sql = "insert into students (name, email, phone) values (%s, %s, %s)"
        cursor.execute(sql, (content['name'], content['email'], content['phone']))
        student_id = cursor.lastrowid

    db.commit()

    print 'inserted new student: id =', student_id

    return json.dumps({'student_id' : student_id})


## --------------- 2.2 ----------------- ##
@app.route('/student/<student_id>', methods=['GET'])
def get_student(student_id):
    try:
        with db.cursor() as cursor:
            sql = "select * from students where id = %s"
            cursor.execute(sql, (int(student_id)))
            student = cursor.fetchone()
    except Exception, e:
        print e
        abort(404)

    print 'client fetched information of student id = ', student_id

    if student is None:
        abort(404)

    ret = {
        'student_id' : student['id'],
        'name' : student['name'],
        'email' : student['email'],
        'phone' : student['phone']
    }

    ret = Response(ret)
    ret.headers['Content-Type'] = "application/json; charset=utf-8"

    return json.dumps(ret)



## ---------------- 2.3 ------------------- ##

@app.route('/student/<student_id>/expense', methods=['POST'])
def create_expense(student_id):
    content = request.get_json()
    with db.cursor() as cursor:
        for item in content:
            # TODO : if student_id exists in table-students ( check foreign key )
            sql = "insert into expenses (title, amount, description, student_id) values (%s, %s, %s, %s)"
            cursor.execute(sql, (item['title'], item['amount'], item['description'], student_id)) 
    db.commit()

    with db.cursor() as cursor:
        cursor.execute("select id expense_id, title, amount, description from expenses where student_id = %s", student_id)
        expenses = cursor.fetchall()
    
    return json.dumps(expenses)
    



## ---------------- 2.4 ------------------- ##

@app.route('/dept/<dept_id>', methods=['GET'])
def get_deptinfo_with_expense(dept_id):

    with db.cursor() as cursor:
        cursor.execute("select id deptid, name from departments where id = %s", dept_id)
        dept = cursor.fetchone()

        sql = """ select expenses.* from expenses 
                  inner join students on expenses.student_id = students.id
                  inner join departments on students.department_id = departments.id
                  where departments.id = %s
              """
        cursor.execute(sql, dept_id)
        expenses = cursor.fetchall()

    dept['expenses'] = expenses

    return json.dumps(dept)
    


## ---------------- sprint 2.5 ------------------- ##

@app.route('/student/<student_id>/expense/<expense_id>', methods=['DELETE'])
def delete_student_expense(student_id, expense_id):
    try:
        with db.cursor() as cursor:
            sql = "delete from expenses where id = %s and student_id = %s"
            rows_affected = cursor.execute(sql, (expense_id, student_id))
            if rows_affected == 0:
                abort(404)
    except Exception, e:
        print e
        abort(404)
    
    db.commit()
    
    return json.dumps({'status' : 'Success'})
    
