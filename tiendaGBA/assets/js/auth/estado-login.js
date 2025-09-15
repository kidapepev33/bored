document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loadingElement = document.getElementById('loading');
    const loggedInElement = document.getElementById('logged-in');
    const notLoggedElement = document.getElementById('not-logged');
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const userAvatarElement = document.getElementById('user-avatar');
    const sessionDetailsElement = document.getElementById('session-details');
    
    // Verificar estado de sesión
    checkLoginStatus();
    setupMenuEventListeners();
    
    function checkLoginStatus() {
        // Ocultar ambas vistas inicialmente
        loggedInElement.style.display = 'none';
        notLoggedElement.style.display = 'none';
        
        fetch('/bored/tiendaGBA/includes/auth/check-session.php')
            .then(response => response.json())
            .then(data => {
                loadingElement.style.display = 'none';
                console.log('Estado de sesión:', data); // Debug
                
                if (data.isLoggedIn) {
                    console.log('Usuario logueado, mostrando UI');
                    loggedInElement.style.display = 'flex'; // Cambiado a flex para el layout
                    
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
    
    // Configurar navegación del menú
    function setupMenuEventListeners() {
        // Configurar cerrar sesión
        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = '/bored/tiendaGBA/includes/auth/logout.php';
            });
        }
        
        // Configurar navegación entre secciones
        const menuLinks = document.querySelectorAll('.account-nav ul li a');
        menuLinks.forEach(link => {
            if (link.id !== 'logout-link') {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Eliminar clase activa de todos los links
                    menuLinks.forEach(l => l.parentElement.classList.remove('active'));
                    
                    // Añadir clase activa al link actual
                    this.parentElement.classList.add('active');
                    
                    // Obtener la sección a mostrar
                    const targetId = this.getAttribute('href').substring(1);
                    showSection(targetId);
                });
            }
        });
    }
    
    // Mostrar sección de contenido
    function showSection(sectionId) {
        // Ocultar todas las secciones
        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar la sección solicitada si existe
        const targetSection = document.getElementById(sectionId + '-content');
        if (targetSection) {
            targetSection.classList.add('active');
        } else {
            // Si la sección no existe, mostrar un mensaje
            const accountContent = document.getElementById('account-content');
            if (accountContent) {
                accountContent.innerHTML = `
                    <div class="content-section active">
                        <h2>${formatSectionTitle(sectionId)}</h2>
                        <div class="user-details-section">
                            <p>Esta sección está en desarrollo...</p>
                        </div>
                    </div>
                `;
            }
        }
    }
    
    // Dar formato al título de la sección
    function formatSectionTitle(sectionId) {
        const titles = {
            'datos-personales': 'Datos Personales',
            'historial-pedidos': 'Historial de Pedidos',
            'wishlist': 'Lista de Deseos'
        };
        return titles[sectionId] || 'Sección';
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
