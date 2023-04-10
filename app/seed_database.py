from model import db, User, Reservation, connect_to_db
from datetime import datetime

def create_user(username):
    """
    Creates a new User instance and adds it to the database.
    """
    new_user = User(username=username)
    db.session.add(new_user)
    db.session.commit()
    return new_user

if __name__ == '__main__':
    from server import app

    connect_to_db(app)

    test_user = create_user('test')

    db.session.add(Reservation(
        user_id=test_user.id,
        start_time=datetime(2023, 4, 15, 14),
        end_time=datetime(2023, 4, 15, 14, 30)
    ))
    db.session.commit()
