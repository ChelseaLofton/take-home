from flask import Flask, render_template, request, redirect, session, url_for, jsonify, flash
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
        flash('Logged in successfully.', 'success')
        return redirect(url_for('reservations'))
    else:
        flash("Sorry, we don't know you.", 'error')
        return redirect(url_for('login_page'))

@app.route('/reservations')
def reservations():
    return render_template('reservations.html')

if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", port=4000, debug=True)
