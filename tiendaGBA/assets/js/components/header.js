document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM está listo');
    let userData = null;

    function checkSession() {
        const currentPath = window.location.pathname;
        let authPath = '/bored/tiendaGBA/includes/auth/check-session.php';
        
        fetch(authPath)
            .then(response => response.json())
            .then(data => {
                userData = data;
                detectDevice();
            })
            .catch(error => {
                console.error('Error al verificar sesión:', error);
                detectDevice();
            });
    }

    function detectDevice() {
        const width = window.innerWidth;
        const currentPath = window.location.pathname;
        let basePath = '/tiendaGBA/includes/components/';

        if (currentPath.includes('/pages/auth/')) {
            basePath = '../../includes/components/';
        } else if (currentPath.includes('/pages/')) {
            basePath = '../includes/components/';
        }

        if (width <= 768) {
            fetch(basePath + 'header-mobile.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('header-container').innerHTML = data;
                    updateAuthButton();
                });
        } else {
            fetch(basePath + 'header-desktop.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('header-container').innerHTML = data;
                    updateAuthButton();
                });
        }
    }

    function updateAuthButton() {
        const loginButton = document.getElementById('login-button');
        const loginButtonMobile = document.getElementById('login-button-mobile');
        
        if (userData && userData.isLoggedIn) {
            if (loginButton) {
                loginButton.innerHTML = userData.user.name;
                loginButton.href = '/bored/tiendaGBA/pages/auth/estado-login.html';
                loginButton.classList.add('logged-in-user');
            }
            
            if (loginButtonMobile) {
                loginButtonMobile.innerHTML = userData.user.name;
                loginButtonMobile.href = '/bored/tiendaGBA/pages/auth/estado-login.html';
                loginButtonMobile.classList.add('logged-in-user');
            }
        }
    }

    checkSession();
    
    window.addEventListener('resize', detectDevice);
});