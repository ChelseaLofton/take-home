# Project Take Home

## This project is a reservation system that allows users to view their reservations, search for available time slots on a specified date, and create new reservations. It is set to alert the user if their is a booking conflict. The system is built using Flask, SQLAlchemy, and React.  Features to come are the ability to delete or edit a current reservation

## Installation

* Clone the repository to your local machine.

* Install the necessary packages by running pip install -r requirements.txt in the project directory.

* Set up a PostgreSQL database and update the database configuration in model.py to reflect your database settings.

* Create the necessary tables in the database and load it with sample data by running python seed_database.py.

* Set the environment and your SECRET_KEY, source secrets.sh.

* Start the Flask server by running python server.py.

* Navigate to localhost:4000 in your web browser to view the application