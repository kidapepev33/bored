// assets/js/auth/estado-login.js - Versión completa con roles
document.addEventListener('DOMContentLoaded', function() {
    const loadingElement = document.getElementById('loading');
    const loggedInElement = document.getElementById('logged-in');
    const notLoggedElement = document.getElementById('not-logged');
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const userAvatarElement = document.getElementById('user-avatar');
    
    checkLoginStatus();
    setupMenuEventListeners();
    
    async function checkLoginStatus() {
        loggedInElement.style.display = 'none';
        notLoggedElement.style.display = 'none';
        
        try {
            const response = await fetch('/bored/tiendaGBA/includes/auth/check-session.php');
            const data = await response.json();
            
            loadingElement.style.display = 'none';
            console.log('Estado de sesión:', data);
            
            if (data.isLoggedIn) {
                console.log('Usuario logueado, mostrando UI');
                loggedInElement.style.display = 'flex';
                
                // Mostrar información básica del usuario
                userNameElement.textContent = data.user.name;
                userEmailElement.textContent = data.user.email;
                
                if (userAvatarElement) {
                    const initial = data.user.name.charAt(0).toUpperCase();
                    userAvatarElement.textContent = initial;
                }
                
                // Configurar menú según el rol del usuario
                setupMenuByRole(data.user.role);
                
                // Cargar datos completos del usuario para la sección de datos personales
                await loadUserData();
                
            } else {
                // Usuario no logueado
                notLoggedElement.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al verificar estado de sesión:', error);
            loadingElement.style.display = 'none';
            notLoggedElement.style.display = 'block';
        }
    }
    
    function setupMenuByRole(userRole) {
        const menuSection = document.querySelector('.menu-section ul');
        
        if (userRole === 'admin') {
            // Menú para administradores
            menuSection.innerHTML = `
                <li class="active"><a href="#datos-personales"><span class="menu-icon">👤</span> Datos Personales</a></li>
                <li><a href="#crear-usuario-admin"><span class="menu-icon">👥</span> Crear Usuario Admin</a></li>
                <li><a href="#gestionar-productos"><span class="menu-icon">📦</span> Gestionar Productos</a></li>
                <li><a href="#ordenes-sistema"><span class="menu-icon">📋</span> Todas las Órdenes</a></li>
                <li><a href="#configuracion"><span class="menu-icon">⚙️</span> Configuración</a></li>
            `;
        } else {
            // Menú para clientes regulares
            menuSection.innerHTML = `
                <li class="active"><a href="#datos-personales"><span class="menu-icon">👤</span> Datos Personales</a></li>
                <li><a href="#historial-pedidos"><span class="menu-icon">📋</span> Historial de Pedidos</a></li>
                <li><a href="#wishlist"><span class="menu-icon">❤️</span> Lista de Deseos</a></li>
            `;
        }
    }
    
    async function loadUserData() {
        try {
            const response = await fetch('/bored/tiendaGBA/includes/functions/get-user-data.php');
            const data = await response.json();
            
            if (data.success) {
                displayUserData(data.user);
            } else {
                console.error('Error cargando datos del usuario:', data.message);
            }
        } catch (error) {
            console.error('Error al cargar datos del usuario:', error);
        }
    }
    
    function displayUserData(userData) {
        const datosPersonalesContent = document.getElementById('datos-personales-content');
        if (datosPersonalesContent) {
            datosPersonalesContent.innerHTML = `
                <h2>Datos Personales</h2>
                <div class="user-details-section">
                    <div class="user-data-grid">
                        <div class="data-item">
                            <label>Nombre:</label>
                            <span>${userData.name}</span>
                        </div>
                        <div class="data-item">
                            <label>Apellidos:</label>
                            <span>${userData.lastname || 'No especificado'}</span>
                        </div>
                        <div class="data-item">
                            <label>Email:</label>
                            <span>${userData.email}</span>
                        </div>
                        <div class="data-item">
                            <label>Teléfono:</label>
                            <span>${userData.phone || 'No especificado'}</span>
                        </div>
                        <div class="data-item">
                            <label>Género:</label>
                            <span>${formatGender(userData.gender)}</span>
                        </div>
                        <div class="data-item">
                            <label>Tipo de cuenta:</label>
                            <span>${formatRole(userData.rol)}</span>
                        </div>
                        <div class="data-item">
                            <label>ID de usuario:</label>
                            <span>#${userData.id}</span>
                        </div>
                    </div>
                    <div class="user-actions">
                        <button class="btn btn-primary" onclick="editUserData()">Editar Información</button>
                    </div>
                </div>
            `;
        }
    }
    
    function formatGender(gender) {
        const genders = {
            'masculino': 'Masculino',
            'femenino': 'Femenino',
            'otro': 'Otro',
            'no-especificado': 'Prefiero no especificar'
        };
        return genders[gender] || 'No especificado';
    }
    
    function formatRole(role) {
        const roles = {
            'client': 'Cliente',
            'admin': 'Administrador',
            'user': 'Usuario'
        };
        return roles[role] || 'Usuario';
    }
    
    // Configurar navegación del menú
    function setupMenuEventListeners() {
        // Configurar cerrar sesión
        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                    window.location.href = '/bored/tiendaGBA/includes/auth/logout.php';
                }
            });
        }
        
        // Esta función se ejecutará después de que se configure el menú
        // por eso usamos un setTimeout para asegurar que los elementos existan
        setTimeout(() => {
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
        }, 100);
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
        }
    }
    
    // Dar formato al título de la sección
    function formatSectionTitle(sectionId) {
        const titles = {
            // Secciones de cliente
            'datos-personales': 'Datos Personales',
            'historial-pedidos': 'Historial de Pedidos',
            'wishlist': 'Lista de Deseos',
            
            // Secciones de admin
            'crear-usuario-admin': 'Crear Usuario Administrador',
            'gestionar-productos': 'Gestionar Productos',
            'ordenes-sistema': 'Todas las Órdenes',
            'configuracion': 'Configuración del Sistema'
        };
        return titles[sectionId] || 'Sección';
    }
    
    // Funciones globales
    window.goToHome = function() {
        window.location.href = '/bored/tiendaGBA/pages/index.html';
    };
    
    window.goToLogin = function() {
        window.location.href = '/bored/tiendaGBA/pages/auth/login.html';
    };
    
    window.logout = function() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            window.location.href = '/bored/tiendaGBA/includes/auth/logout.php';
        }
    };
    
    window.editUserData = function() {
        alert('Función de edición en desarrollo. Por ahora los datos se pueden cambiar desde el registro.');
    };
});