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

        if (response.ok) {
            console.log(data.message);
        } else {
            console.error(data.message);
            if (data.status === 'error' && data.message === 'User not found') {
                alert('Sorry, your username is not in our database. Please try again or contact support.');
            } else {
                alert('An error occurred. Please try again later.');
            }
        }
    };


    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
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
