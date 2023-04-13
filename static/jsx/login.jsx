function Login() {
    const [username, setUsername] = React.useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ username }),
        });
        const data = await response.json();

        if (data.status === 'success') {
            // Redirect to the next page or update the application state
            console.log(data.message);
        } else {
            // Show an error message to the user
            console.error(data.message);
        }
    };


    return (
        <div className="d-flex justify-content-center align-items-center h-100">
            <div className="bg-white p-5 rounded">
                <h1 className="text-center mb-4">Login</h1>
                <form action="/api/login" method="POST">
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
}


ReactDOM.render(<Login />, document.getElementById('login'));