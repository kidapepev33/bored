document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('register-form');
    const messageDiv = document.getElementById('register-message');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        messageDiv.classList.add('hidden');
        messageDiv.textContent = '';

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const confirm_password = form.confirm_password.value;
        const rol = form.rol ? form.rol.value : 'client'; // <-- aquí

        const response = await fetch('php/register.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name, email, password, confirm_password, rol })
        });

        const data = await response.json();

        messageDiv.classList.remove('hidden');
        messageDiv.style.color = data.success ? 'green' : 'red';
        messageDiv.textContent = data.message || (data.success ? '¡Registro exitoso!' : 'Error al registrar');

        if (data.success) {
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    });
});