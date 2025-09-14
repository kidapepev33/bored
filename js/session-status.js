        // Verificar el estado de autenticación
        document.addEventListener('DOMContentLoaded', function() {
            // Ocultar mensaje de carga
            document.getElementById('loading').style.display = 'none';
            
            // Obtener datos de usuario
            const userToken = localStorage.getItem('userToken');
            const userData = localStorage.getItem('userData');
            
            if (userToken && userData) {
                // Usuario logueado
                const user = JSON.parse(userData);
                
                // Mostrar sección de logueado
                document.getElementById('logged-in').style.display = 'block';
                
                // Mostrar información del usuario
                document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
                document.getElementById('user-name').textContent = user.name;
                document.getElementById('user-email').textContent = user.email;
                
                // Mostrar detalles de la sesión
                const details = document.getElementById('session-details');
                details.innerHTML = '<pre>' + JSON.stringify(user, null, 2) + '</pre>';
                
            } else {
                // Usuario no logueado
                document.getElementById('not-logged').style.display = 'block';
            }
        });
        
        // Funciones de navegación
        function goToHome() {
            window.location.href = 'index.html';
        }
        
        function goToLogin() {
            window.location.href = 'login.html';
        }
        
        function logout() {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            window.location.reload();
        }