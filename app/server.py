from flask import Flask, render_template, request, redirect, session, url_for, jsonify, flash
from jinja2 import StrictUndefined
from flask_sqlalchemy import SQLAlchemy
from model import db, User, Reservation, connect_to_db
from datetime import datetime
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
        return redirect(url_for('reservations'))
    else:
        return redirect(url_for('login_page'))

@app.route('/reservations')
def reservations():
    user_id = session.get('user_id')
    if user_id:
        user_reservations = Reservation.query.filter_by(user_id=user_id).all()
        return render_template('reservations.html', reservations=user_reservations)
    else:
        return redirect(url_for('login_page'))
    


@app.route('/reservation/search', methods=['POST'])
def search_reservations():
    data = request.get_json()
    date = data['date']
    start_time = data['startTime']
    end_time = data['endTime']

    # Get the datetime objects for the selected date and time range
    start_datetime = datetime.strptime(f"{date} {start_time}", "%Y-%m-%d %H:%M")
    end_datetime = datetime.strptime(f"{date} {end_time}", "%Y-%m-%d %H:%M")

    # Get the current user's ID
    user_id = session.get('user_id')

    # Check if the user already has a reservation on the chosen date
    existing_reservation = Reservation.query.filter(
        Reservation.user_id == user_id,
        Reservation.start_time >= start_datetime,
        Reservation.end_time <= end_datetime
    ).first()

    if existing_reservation:
        return jsonify({'error': 'You already have a reservation on the chosen date.'}), 400

    # Find all available reservations within the specified time range
    available_reservations = Reservation.query.filter(
        Reservation.start_time >= start_datetime,
        Reservation.end_time <= end_datetime
    ).all()

    if not available_reservations:
        return jsonify({'error': 'No reservations available.'}), 404

    # Convert the reservations to a JSON serializable format
    available_reservations_json = [
        {
            'id': reservation.id,
            'start_time': reservation.start_time.isoformat(),
            'end_time': reservation.end_time.isoformat(),
            'user_id': reservation.user_id,
        } for reservation in available_reservations
    ]

    return jsonify(available_reservations_json)



if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", port=4000, debug=True)
