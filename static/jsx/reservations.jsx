
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

    const [showModal, setShowModal] = React.useState(false);
    const [selectedTime, setSelectedTime] = React.useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Query the database for all reservations on the given date
        const response = await fetch(`/search/reservations?date=${date}`);
        const data = await response.json();

        if (data.error) {
            alert(data.error);
        } else {
            const reservations = data.reservations;

            // Create a list of available time slots based on the reservations
            const unavailableTimes = reservations.map((reservation) => ({
                start: reservation.start_time,
                end: reservation.end_time,
            }));
            const availableTimes = [];
            for (let i = 0; i < 48; i++) {
                const startTime = `${Math.floor(i / 2)
                    .toString()
                    .padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`;
                const endTime = `${Math.floor((i + 1) / 2)
                    .toString()
                    .padStart(2, '0')}:${(i + 1) % 2 === 0 ? '00' : '30'}`;
                if (
                    !unavailableTimes.some(
                        (reservation) =>
                            reservation.start === startTime && reservation.end === endTime
                    )
                ) {
                    availableTimes.push(`${startTime}-${endTime}`);
                }
            }
            setAvailableTimes(availableTimes);

            // TODO: Display the available time slots to the user
        }
    };
    const handleSelectTime = (event) => {
        setSelectedTime(event.target.value);
    };

    const handleBookReservation = async () => {
        // Close the modal
        setShowModal(false);

        // Make a POST request to the server to create a reservation with the selected time
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date,
                time: selectedTime,
            }),
        });

        if (response.ok) {
            alert('Reservation created successfully!');
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    };



    const timeOptions = availableTimes.length
        ? availableTimes
        : Array.from({ length: 48 }, (_, i) => {
            const hours = Math.floor(i / 2);
            const minutes = i % 2 === 0 ? '00' : '30';
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        });

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
                    <TimeSelect
                        label="Start time:"
                        value={startTime}
                        onChange={(event) => setStartTime(event.target.value)}
                    />
                    <TimeSelect
                        label="End time:"
                        value={endTime}
                        onChange={(event) => setEndTime(event.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
                {/* ... [modal] ... */}
            </div>
        );
    }
