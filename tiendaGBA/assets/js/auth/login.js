document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const formData = {
                email: document.getElementById('login-email').value,
                password: document.getElementById('login-password').value
            };
            
            // Validación del lado del cliente
            if (!formData.email || !formData.password) {
                showMessage('Por favor, completa todos los campos', 'error');
                return;
            }
            
            fetch('/bored/tiendaGBA/includes/auth/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage('¡Inicio de sesión exitoso!', 'success');
                    setTimeout(() => {
                        window.location.href = 'estado-login.html';
                    }, 1500);
                } else {
                    showMessage(data.message || 'Error al iniciar sesión. Verifica tus credenciales.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('Hubo un error en el inicio de sesión. Por favor, inténtalo más tarde.', 'error');
            });
        });
    }
    
    function showMessage(message, type) {
        const messageElement = document.getElementById('login-message');
        if (!messageElement) return;
        
        messageElement.textContent = message;
        messageElement.classList.remove('hidden', 'success', 'error');
        messageElement.classList.add(type);
        
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
