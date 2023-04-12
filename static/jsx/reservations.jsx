

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Query the database for all reservations on the given date
        const response = await fetch(`/search/reservations?date=${date}`);
        const data = await response.json();

        const reservations = data.reservations;
        const userId = data.user_id;

        // Check if the user already has a reservation on the selected date
        const userReservation = reservations.find((reservation) => reservation.user_id === userId);
        if (userReservation) {
            alert(`You already have a reservation on ${date} at ${userReservation.start_time}.`);
            setHasReservation(true);
            return;
        } else {
            setHasReservation(false);
        }

        // Create a list of available time slots based on the reservations and selected time range
        const timeOptions = createTimeOptions().filter((time) => time >= startTime && time <= endTime);
        const unavailableTimes = reservations.map((reservation) => reservation.start_time);
        const availableTimes = timeOptions.filter((time) => !unavailableTimes.includes(time));
        setAvailableTimes(availableTimes);
    };

    const handleBookReservation = async (time) => {
        // Make a POST request to the server to create a reservation with the selected time
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date,
                time,
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
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Date:
                    <input
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        required
                    />
                </label>
                <TimeSelect label="Start Time:" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
                <TimeSelect label="End Time:" value={endTime} onChange={(event) => setEndTime(event.target.value)} />
                <button type="submit">Search</button>
            </form>
            {!hasReservation && availableTimes.map((time) => (
                <div key={time}>
                    <span>{time}</span>
                    <button onClick={() => handleBookReservation(time)}>Book</button>
                </div>
            ))}
        </div>
    );
}

