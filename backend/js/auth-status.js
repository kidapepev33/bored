// Funciones para manejar el estado de autenticación en la interfaz

// Agregar estilos CSS para los elementos de autenticación
const authStyles = document.createElement('style');
authStyles.textContent = `
    .user-greeting {
        display: flex;
        align-items: center;
        font-weight: bold;
        color: #4CAF50;
        transition: all 0.3s ease;
    }
    
    .user-avatar {
        width: 24px;
        height: 24px;
        background-color: #4CAF50;
        color: white;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        font-weight: bold;
        font-size: 14px;
    }
    
    .logout-btn {
        background-color: #f44336;
        color: white !important;
        padding: 5px 10px;
        border-radius: 5px;
        margin-left: 15px;
        transition: background-color 0.3s ease;
        text-decoration: none;
    }
    
    .logout-btn:hover {
        background-color: #d32f2f;
    }
    
    .auth-status {
        display: inline-block;
        padding: 3px 8px;
        background-color: #4CAF50;
        color: white;
        border-radius: 10px;
        font-size: 12px;
        margin-left: 8px;
    }
    
    .mobile-only .logout-btn {
        display: block;
        margin: 8px 0;
        text-align: center;
    }
`;
document.head.appendChild(authStyles);

document.addEventListener('DOMContentLoaded', function () {
    // Intentar actualizar la UI inmediatamente y luego nuevamente después
    // de que se cargue completamente el header
    updateAuthUI();
    setTimeout(updateAuthUI, 100);
    setTimeout(updateAuthUI, 500);  // Intentar una tercera vez si hay problemas
});

// Ejecutar inmediatamente, sin esperar a DOMContentLoaded
// Esto ayuda en casos donde el script se carga después del evento DOMContentLoaded
updateAuthUI();

// También actualizar la UI cuando cambie el tamaño de la ventana
window.addEventListener('resize', function() {
    updateAuthUI();
});


function updateAuthUI() {
    // Verificar si el usuario está logueado
    const userToken = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    // Primero, vamos a manejar los botones de inicio de sesión
    const loginButtonDesktop = document.getElementById('login-button');
    const loginButtonMobile = document.getElementById('login-button-mobile');
    
    // Verificar qué header está visible actualmente
    const isMobileView = window.innerWidth < 768; // 768px es comúnmente el breakpoint para móvil
    
    if (userToken && userData) {
        // Ocultar botones de login cuando el usuario está logueado
        if (loginButtonDesktop) loginButtonDesktop.style.display = 'none';
        if (loginButtonMobile) loginButtonMobile.style.display = 'none';
        
        const user = JSON.parse(userData);
        
        // Actualizar la interfaz para el usuario logueado
        const desktopHeaderContainer = document.querySelector('header.desktop-only');
        if (desktopHeaderContainer && !isMobileView) {
            // Solo actualizamos el header de escritorio si estamos en vista de escritorio
            const navLinkContainer = desktopHeaderContainer.querySelector('.nav__link');
            if (navLinkContainer) {
                // Buscar si ya existe un contenedor de usuario
                let userContainer = navLinkContainer.querySelector('.user-container');
                
                if (!userContainer) {
                    userContainer = document.createElement('div');
                    userContainer.classList.add('user-container');
                    
                    // Crear el avatar del usuario
                    const userAvatar = document.createElement('div');
                    userAvatar.classList.add('user-avatar');
                    userAvatar.textContent = user.name.charAt(0).toUpperCase();
                    
                    // Crear el saludo
                    const greeting = document.createElement('span');
                    greeting.textContent = `Hola, ${user.name}`;
                    greeting.classList.add('user-greeting');
                    
                    // Crear indicador de estado
                    const statusIndicator = document.createElement('span');
                    statusIndicator.textContent = 'Conectado';
                    statusIndicator.classList.add('status-indicator');
                    
                    // Crear el botón de cerrar sesión
                    const logoutBtn = document.createElement('a');
                    logoutBtn.href = '#';
                    logoutBtn.textContent = 'Cerrar Sesión';
                    logoutBtn.classList.add('logout-button');
                    logoutBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        API.logout();
                        window.location.href = 'index.html';
                    });
                    
                    // Agregar elementos al contenedor
                    userContainer.appendChild(userAvatar);
                    userContainer.appendChild(greeting);
                    userContainer.appendChild(statusIndicator);
                    userContainer.appendChild(logoutBtn);
                    
                    // Agregar el contenedor al nav
                    navLinkContainer.appendChild(userContainer);
                }
            }
        }
        
        const mobileHeaderContainer = document.querySelector('header.mobile-only');
        
        if (mobileHeaderContainer && isMobileView) {
            // Solo actualizamos el header móvil si estamos en vista móvil
            const mobileSubmenu = mobileHeaderContainer.querySelector('.submenu');
            if (mobileSubmenu) {
                // Verificar si ya existe el botón de cerrar sesión para no duplicarlo
                const existingLogoutBtn = mobileSubmenu.querySelector('.logout-btn');
                if (!existingLogoutBtn) {
                    // Actualizar enlace de cuenta
                    const mobileAccountItem = mobileSubmenu.querySelector('a[href="perfil.html"]');
                    if (mobileAccountItem) {
                        const mobileAccountLink = mobileAccountItem.parentElement;
                        
                        // Crear contenedor de saludo
                        const mobileGreeting = document.createElement('div');
                        mobileGreeting.classList.add('mobile-greeting');
                        
                        // Crear avatar
                        const mobileAvatar = document.createElement('div');
                        mobileAvatar.classList.add('user-avatar');
                        mobileAvatar.textContent = user.name.charAt(0).toUpperCase();
                        
                        const mobileGreetingText = document.createElement('span');
                        mobileGreetingText.textContent = `Hola, ${user.name}`;
                        
                        mobileGreeting.appendChild(mobileAvatar);
                        mobileGreeting.appendChild(mobileGreetingText);
                        
                        mobileAccountLink.innerHTML = '';
                        mobileAccountLink.appendChild(mobileGreeting);
                    }
                    
                    // Añadir opción de cerrar sesión
                    const mobileLogoutItem = document.createElement('li');
                    const mobileLogoutLink = document.createElement('a');
                    mobileLogoutLink.href = '#';
                    mobileLogoutLink.textContent = 'Cerrar Sesión';
                    mobileLogoutLink.classList.add('submenu__link', 'logout-btn');
                    mobileLogoutLink.addEventListener('click', function(e) {
                        e.preventDefault();
                        API.logout();
                        window.location.href = 'index.html';
                    });
                    mobileLogoutItem.appendChild(mobileLogoutLink);
                    mobileSubmenu.appendChild(mobileLogoutItem);
                }
            }
        }
        
        // Actualizar la interfaz para mostrar que está logueado
        document.body.classList.add('user-logged-in');
    } else {
        // Si no está logueado, asegurarse de que los botones de login sean visibles
        if (loginButtonDesktop) loginButtonDesktop.style.display = 'inline-block';
        if (loginButtonMobile) loginButtonMobile.style.display = 'block';
        
        // Remover cualquier clase relacionada con usuario logueado
        document.body.classList.remove('user-logged-in');
    }
}
