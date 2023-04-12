
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Query the database for all reservations on the given date
        const response = await fetch(`/api/reservations?date=${date}`);
        const data = await response.json();
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
            <h1>Search Reservations</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Date:
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </label>
                <TimeSelect
                    label="Start Time:"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
                <TimeSelect
                    label="End Time:"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
        </div>
    );
}
