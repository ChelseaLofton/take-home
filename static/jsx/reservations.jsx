
function SearchReservations({ reservations }) {
    const [date, setDate] = React.useState(null);
    const [startTime, setStartTime] = React.useState('');
    const [endTime, setEndTime] = React.useState('');

    React.useEffect(() => {
        const datepicker = new Pikaday({
            field: document.getElementById('datepicker'),
            format: 'YYYY-MM-DD',
            onSelect: function (date) {
                setDate(this.getMoment().format('YYYY-MM-DD'));
            },
        });

        return () => {
            datepicker.destroy();
        };
    }, []);

    const handleSubmit = async (event) => {
        // ...
    };

    const timeOptions = Array.from({ length: 48 }, (_, i) => {
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
                    <input type="text" id="datepicker" required />
                </label>
                <label>
                    Start Time:
                    <select
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    >
                        <option value="">Select start time</option>
                        {timeOptions.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    End Time:
                    <select
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    >
                        <option value="">Select end time</option>
                        {timeOptions.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}
