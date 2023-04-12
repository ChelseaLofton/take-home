function SearchReservations({ reservations }){
    const [date, setDate] = React.useState('');
    const [startTime, setStartTime] = React.useState('');
    const [endTime, setEndTime] = React.useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Send the search request to the server with the selected date and time range.
    };

    return (
        <div>
            <h1>Search Reservations</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Date:
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </label>
                <label>
                    Start Time:
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} step="1800" required />
                </label>
                <label>
                    End Time:
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} step="1800" required />
                </label>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}
