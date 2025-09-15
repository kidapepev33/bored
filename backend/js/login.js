document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');
    const messageDiv = document.getElementById('login-message');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        messageDiv.classList.add('hidden');
        messageDiv.textContent = '';

        const email = form.email.value.trim();
        const password = form.password.value;

        const response = await fetch('php/login.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            messageDiv.classList.remove('hidden');
            messageDiv.style.color = 'green';
            messageDiv.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1200);
        } else {
            messageDiv.classList.remove('hidden');
            messageDiv.style.color = 'red';
            messageDiv.textContent = data.message || 'Error al iniciar sesión';
        }
    });
});