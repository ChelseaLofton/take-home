from flask import Flask, render_template, request, redirect, session, url_for, jsonify
from jinja2 import StrictUndefined
from flask_sqlalchemy import SQLAlchemy
from model import db, User, Reservation, connected_to_db
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY')
app.jinja_env.undefined = StrictUndefined


@app.route('/login', methods=['POST'])
def login():
    # Get the submitted username from the request
    username = request.form.get('username')

    # Check if the user exists in the database
    user = User.query.filter_by(username=username).first()

    # If the user exists, store the user's id in the session and return a success message
    if user:
        session['user_id'] = user.id
        return jsonify({'status': 'success', 'message': 'Logged in successfully'})
    else:
        # If the user doesn't exist, return an error message
        return jsonify({'status': 'error', 'message': 'User not found'}), 404



# @app.route('/api/search_appointments', methods=['POST'])
# def search_appointments():
#     # Search appointments logic here


# @app.route('/api/book_appointment', methods=['POST'])
# def book_appointment():
#     # Book appointment logic here


# @app.route('/api/user_reservations', methods=['GET'])
# def user_reservations():
#     # Get user reservations logic here


if __name__ == "__main__":
    connected_to_db(app)
    app.run(host="0.0.0.0", port=4000, debug=True)
