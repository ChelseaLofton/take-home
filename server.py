from flask import Flask, render_template, request, redirect, session, url_for, jsonify, flash
from jinja2 import StrictUndefined
from flask_sqlalchemy import SQLAlchemy
from model import db, User, Reservation, connect_to_db
from datetime import datetime
import os

app = Flask(
    __name__, template_folder='/Users/chelsealofton/src/take-home/templates')

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
        flash('Sorry, we do not have a record of that username. Please try again or sign up.')
        return redirect(url_for('login_page'))



@app.route('/reservations')
def reservations():
    user_id = session.get('user_id')
    if user_id:
        user_reservations = Reservation.query.filter_by(user_id=user_id).all()
        return render_template('reservations.html', reservations=user_reservations)
    else:
        return redirect(url_for('login_page'))


@app.route('/search/reservations')
def get_reservations():
    date = request.args.get('date')
    user_id = session.get('user_id')

    # Get the datetime objects for the selected date 
    start_datetime = datetime.strptime(f"{date} 00:00", "%Y-%m-%d %H:%M")
    end_datetime = datetime.strptime(f"{date} 23:59", "%Y-%m-%d %H:%M")

    # Find all unavailable reservations within the specified date
    unavailable_reservations = Reservation.query.filter(
        Reservation.start_time >= start_datetime,
        Reservation.end_time <= end_datetime
    ).all()

    # Convert the reservations to a JSON serializable format
    unavailable_reservations_json = [
        {
            'id': reservation.id,
            'start_time': reservation.start_time.isoformat(),
            'end_time': reservation.end_time.isoformat(),
            'user_id': reservation.user_id,
        } for reservation in unavailable_reservations
    ]

    return jsonify({'reservations': unavailable_reservations_json, 'user_id': user_id})


@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    """Handle the creation of a new reservation."""
    data = request.get_json()
    date = data['date']
    time = data['time']

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'User not logged in'}), 401

    start_datetime = datetime.strptime(
        f"{date} {time.split('-')[0]}", "%Y-%m-%d %H:%M")
    end_datetime = datetime.strptime(
        f"{date} {time.split('-')[1]}", "%Y-%m-%d %H:%M")

    # Check if the user already has a reservation during the chosen time
    existing_reservation = Reservation.query.filter(
        Reservation.user_id == user_id,
        Reservation.start_time >= start_datetime,
        Reservation.end_time <= end_datetime
    ).first()

    if existing_reservation:
        return jsonify({'message': 'You already have a reservation during the chosen time.'}), 400

    # Create a new reservation object
    new_reservation = Reservation(
        user_id=user_id, start_time=start_datetime, end_time=end_datetime)

    # Add the new reservation to the session and commit the changes to the database
    db.session.add(new_reservation)
    db.session.commit()

    # Return a success message
    return jsonify({'message': 'Reservation created successfully'}), 201


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", port=4000, debug=True)
