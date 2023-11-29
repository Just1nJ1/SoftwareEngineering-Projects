document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '../cart.html'; // Redirect on successful login
            } else {
                alert('Login failed');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});
