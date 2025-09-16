document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                email: document.getElementById('login-email').value.trim(),
                password: document.getElementById('login-password').value,
                remember: document.getElementById('remember-me')?.checked || false
            };
            
            if (!formData.email || !formData.password) {
                showMessage('Por favor, completa todos los campos', 'error');
                return;
            }
            
            try {
                const response = await fetch('/bored/tiendaGBA/includes/auth/login.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showMessage('¡Inicio de sesión exitoso!', 'success');
                    setTimeout(() => {
                        window.location.href = 'estado-login.html';
                    }, 1000);
                } else {
                    showMessage(data.message, 'error');
                }
                
            } catch (error) {
                showMessage('Error de conexión', 'error');
            }
        });
    }
    
    function showMessage(message, type) {
        const messageElement = document.getElementById('login-message');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.classList.remove('hidden', 'success', 'error');
            messageElement.classList.add(type);
        }
    }
});

// Función simple para reset de password
function showResetPassword() {
    const email = prompt('Ingresa tu email:');
    if (!email) return;
    
    const newPassword = prompt('Ingresa tu nueva contraseña (mínimo 6 caracteres):');
    if (!newPassword || newPassword.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    fetch('/bored/tiendaGBA/includes/auth/reset-password.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: email,
            new_password: newPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(() => {
        alert('Error de conexión');
    });
}