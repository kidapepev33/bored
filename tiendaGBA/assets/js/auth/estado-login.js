document.addEventListener('DOMContentLoaded', function() {
    const loadingElement = document.getElementById('loading');
    const loggedInElement = document.getElementById('logged-in');
    const notLoggedElement = document.getElementById('not-logged');
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const userAvatarElement = document.getElementById('user-avatar');
    const sessionDetailsElement = document.getElementById('session-details');
    
    // Verificar estado de sesión
    checkLoginStatus();
    
    function checkLoginStatus() {
        fetch('/bored/tiendaGBA/includes/auth/check-session.php')
            .then(response => response.json())
            .then(data => {
                loadingElement.style.display = 'none';
                
                if (data.isLoggedIn) {
                    loggedInElement.style.display = 'block';
                    
                    // Mostrar información del usuario
                    userNameElement.textContent = data.user.name;
                    userEmailElement.textContent = data.user.email;
                    
                    if (userAvatarElement) {
                        const initial = data.user.name.charAt(0).toUpperCase();
                        userAvatarElement.textContent = initial;
                    }
                    
                    if (sessionDetailsElement) {
                        const now = new Date();
                        const formattedDate = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
                        
                        sessionDetailsElement.innerHTML = `
                            <p><strong>ID de Usuario:</strong> ${data.user.id}</p>
                            <p><strong>Última Actividad:</strong> ${formattedDate}</p>
                        `;
                    }
                } else {
                    // Usuario no logueado
                    notLoggedElement.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error al verificar estado de sesión:', error);
                loadingElement.style.display = 'none';
                notLoggedElement.style.display = 'block';
            });
    }
    
    window.goToHome = function() {
        window.location.href = '/bored/tiendaGBA/pages/index.html';
    };
    
    window.goToLogin = function() {
        window.location.href = '/bored/tiendaGBA/pages/auth/login.html';
    };
    
    window.logout = function() {
        window.location.href = '/bored/tiendaGBA/includes/auth/logout.php';
    };
});
