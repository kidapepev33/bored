document.addEventListener('DOMContentLoaded', function () {
    const createUserForm = document.getElementById('create-user');
    if (!createUserForm) return;

    createUserForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('create-user-name')?.value || '',
            lastname: document.getElementById('create-user-lastname')?.value || '',
            email: document.getElementById('create-user-email')?.value || '',
            phone: document.getElementById('create-user-phone')?.value || '',
            gender: document.getElementById('create-user-gender')?.value || '',
            password: document.getElementById('create-user-password')?.value || '',
            confirm_password: document.getElementById('create-user-confirm-password')?.value || '',
            rol: document.querySelector('input[name="rol"]:checked')?.value || ''
        };

        // Validación de campos obligatorios
        if (!formData.name || !formData.lastname || !formData.email ||
            !formData.phone || !formData.password || !formData.confirm_password) {
            showMessage(createUserForm, 'Todos los campos son obligatorios', 'error');
            return;
        }

        // Validación de rol
        if (!formData.rol) {
            showMessage(createUserForm, 'Debe seleccionar un rol', 'error');
            return;
        }

        // Validación de contraseña
        if (formData.password !== formData.confirm_password) {
            showMessage(createUserForm, 'Las contraseñas no coinciden', 'error');
            return;
        }

        // Enviar al PHP
        fetch('/bored/tiendaGBA/includes/auth/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage(createUserForm, data.message, 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    showMessage(createUserForm, data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage(createUserForm, 'Hubo un error. Intenta más tarde.', 'error');
            });
    });

    function showMessage(form, message, type) {
        const messageElement = form.querySelector('#create-user-message');
        if (!messageElement) return;

        messageElement.textContent = message;
        messageElement.classList.remove('hidden', 'success', 'error');
        messageElement.classList.add(type);

        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});