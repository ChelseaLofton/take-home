from flask import Flask, render_template, request, redirect, session, url_for, jsonify
from jinja2 import StrictUndefined
from flask_sqlalchemy import SQLAlchemy
from model import db, User, Reservation, connect_to_db
import os

app = Flask(__name__, template_folder='/Users/chelsealofton/src/take-home/templates')

app.static_folder = '/Users/chelsealofton/src/take-home/static'
app.secret_key = os.environ.get('SECRET_KEY')
app.jinja_env.undefined = StrictUndefined

@app.route('/login_page')
def login_page():
    return render_template('login.html')


@app.route('/api/login', methods=['POST'])
def login():
    username = request.form.get('username')
    user = User.query.filter_by(username=username).first()

    if user:
        session['user_id'] = user.id
        return jsonify(status='success', message='Logged in successfully.')
    else:
        return jsonify(status='error', message='User not found.')


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", port=4000, debug=True)
