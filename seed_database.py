import model
from model import User, Reservation
from datetime import datetime, timedelta
import server
import os



# os.system("dropdb take_home")
# os.system("createdb take_home")


model.connect_to_db(server.app)
model.db.create_all()


def create_user(username):
    """
    Creates a new User instance and adds it to the database.
    """
    user = User(username=username)
    model.db.session.add(user)
    model.db.session.commit()
    return user

def create_reservation(user, start_time):
    """
    Creates a new Reservation instance and adds it to the database.
    """
    end_time = start_time + timedelta(minutes=30)
    reservation = Reservation(start_time=start_time, end_time=end_time, user_id=user.id)
    model.db.session.add(reservation)
    model.db.session.commit()

def create_sample_data():
    """
    Create sample users and reservations.
    """
    # Delete existing data
    User.query.delete()
    Reservation.query.delete()

    # Create sample users
    alice = create_user('Alice')
    bob = create_user('Bob')
    charlie = create_user('Charlie')

    # Create sample reservations
    create_reservation(alice, datetime(2023, 4, 12, 9, 0))
    create_reservation(bob, datetime(2023, 4, 12, 10, 0))
    create_reservation(charlie, datetime(2023, 4, 12, 11, 0))
    create_reservation(alice, datetime(2023, 4, 13, 14, 30))
    create_reservation(bob, datetime(2023, 4, 13, 15, 30))


create_sample_data()
