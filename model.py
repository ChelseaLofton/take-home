from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)

    reservations = db.relationship('Reservation', backref='user', lazy=True)

    def __repr__(self):
        return '<User %r>' % self.username

class Reservation(db.Model):
    __tablename__ = 'reservations'
    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f'<Reservation {self.start_time} - {self.end_time}>'


def connect_to_db(flask_app,):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['POSTGRES_URL']
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    with flask_app.app_context():
        db.create_all()

    print('Connected to the db!')



if __name__ == '__main__':
    from .server import app
    app.run(host="0.0.0.0", port=4000, debug=True)

