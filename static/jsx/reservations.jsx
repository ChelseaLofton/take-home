// Description: This file contains the SearchReservations component, which allows users to search for available reservation times on a given date

// The TimeSelect component creates a dropdown menu for selecting a time slot.


function TimeSelect({ label, value, onChange }) {
    const timeOptions = createTimeOptions();

    return (
        <label>
            {label}
            <select value={value} onChange={onChange} required>
                <option value="">Select time</option>
                {timeOptions.map((time) => (
                    <option key={time} value={time}>
                        {time}
                    </option>
                ))}
            </select>
        </label>
    );
}


// half-hour increments starting from 00:00 to 23:30
function createTimeOptions() {
    return Array.from({ length: 48 }, (_, i) => {
        const hours = Math.floor(i / 2);
        const minutes = i % 2 === 0 ? '00' : '30';
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    });
}

function SearchReservations() {
    const [date, setDate] = React.useState('');
    const [startTime, setStartTime] = React.useState('');
    const [endTime, setEndTime] = React.useState('');
    const [availableTimes, setAvailableTimes] = React.useState([]);
    const [hasReservation, setHasReservation] = React.useState(false);

    // makes a request to the server to get a list of reservations for the selected date
    const handleSubmit = async (event) => {
        event.preventDefault();


        const response = await fetch(`/search/reservations?date=${date}`);
        const data = await response.json();

        const reservations = data.reservations;
        const userId = data.user_id;

        // checks if the user already has a reservation on the selected date
        const userReservation = reservations.find((reservation) => reservation.user_id === userId);
        if (userReservation) {
            alert(`You already have a reservation on ${date} at ${userReservation.start_time}.`);
            setHasReservation(true);
            return;
        } else {
            setHasReservation(false);
        }

        //  calculates the list of available time slots based on the selected start and end times
        const timeOptions = createTimeOptions().filter((time) => time >= startTime && time <= endTime);
        const unavailableTimes = reservations.map((reservation) => reservation.start_time);
        const availableTimes = timeOptions.filter((time) => !unavailableTimes.includes(time));
        setAvailableTimes(availableTimes);
    };

    const handleBookReservation = async (time) => {
        // Get the next time slot
        const timeIndex = createTimeOptions().indexOf(time);
        const endTime = createTimeOptions()[timeIndex + 1];

        // POST request to the server to create a reservation with the selected time
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date,
                time: `${time}-${endTime}`,
            }),
        });

        if (response.ok) {
            alert('Reservation created successfully!');
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-5">
                    <div className="booking-container">
                        <h1>Book your Reservations!</h1>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>
                                    Date:
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(event) => setDate(event.target.value)}
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <div>
                                    <TimeSelect
                                        label="Start Time:"
                                        value={startTime}
                                        onChange={(event) => setStartTime(event.target.value)}
                                    />
                                </div>
                                <div>
                                    <TimeSelect
                                        label="End Time:"
                                        value={endTime}
                                        onChange={(event) => setEndTime(event.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit">Search</button>
                        </form>
                    </div>
                </div>
                <div className="col-md-5 float-md-right">
                    {!hasReservation &&
                        availableTimes.map((time) => (
                            <div key={time}>
                                <span>{time}</span>
                                <button onClick={() => handleBookReservation(time)}>Book</button>
                            </div>
                        ))}
                </div>
            </div>
        </div>

    );
}

