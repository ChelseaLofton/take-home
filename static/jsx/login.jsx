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
        <div>
            <h1>Login</h1>
            <form action="/api/login" method="POST">
                <label>
                    Username:
                    <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <button type="submit">Log in</button>
            </form>
        </div>
    );
}


ReactDOM.render(<Login />, document.getElementById('login'));