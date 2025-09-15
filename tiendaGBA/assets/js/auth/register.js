document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('register-name').value,
                lastname: document.getElementById('register-lastname').value,
                email: document.getElementById('register-email').value,
                phone: document.getElementById('register-phone').value,
                gender: document.getElementById('register-gender').value,
                password: document.getElementById('register-password').value,
                confirm_password: document.getElementById('register-confirm-password').value,
                rol: document.getElementById('register-rol').value
            };
            
            // Validación del lado del cliente
            if (!formData.name || !formData.lastname || !formData.email || 
                !formData.phone || !formData.password || !formData.confirm_password) {
                showMessage('Todos los campos son obligatorios', 'error');
                return;
            }
            
            if (formData.password !== formData.confirm_password) {
                showMessage('Las contraseñas no coinciden', 'error');
                return;
            }
            
            fetch('/bored/tiendaGBA/includes/auth/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage(data.message, 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showMessage(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('Hubo un error en el registro. Por favor, inténtalo más tarde.', 'error');
            });
        });
    }
    
    function showMessage(message, type) {
        const messageElement = document.getElementById('register-message');
        if (!messageElement) return;
        
        messageElement.textContent = message;
        messageElement.classList.remove('hidden', 'success', 'error');
        messageElement.classList.add(type);
        
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
