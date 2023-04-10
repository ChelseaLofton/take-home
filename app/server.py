from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from model import db, User, Reservation
import os


app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY')
app.jinja_env.undefined = StrictUndefined



app.rout('/')
def index():
    return 'Hello World'




if __name__ == "__main__":
    connected_to_db(app)
    app.run(host="0.0.0.0", port=4000, debug=True)
