document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ DOM está listo');
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
                    setTimeout(initSearchToggle, 150);
                });
        } else {
            fetch(basePath + 'header-desktop.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('header-container').innerHTML = data;
                    updateAuthButton();
                    setTimeout(initSearchToggle, 150);
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

    // ========== FUNCIÓN DE BÚSQUEDA ==========
    async function buscarProductos(query) {
        console.log('🔍 Buscando:', query);

        try {
            const response = await fetch(`/bored/tiendaGBA/includes/functions/buscar-productos.php?q=${encodeURIComponent(query)}`);
            
            // Verificar si la respuesta es JSON válido
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error('❌ La respuesta no es JSON');
                throw new Error("La respuesta no es JSON");
            }
            
            const data = await response.json();
            console.log('📦 Respuesta:', data);

            if (data.success && data.productos && data.productos.length > 0) {
                const ids = data.productos.map(p => p.product_id).join(',');
                const redirectUrl = `/bored/tiendaGBA/pages/resultados.html?ids=${ids}&q=${encodeURIComponent(query)}`;
                console.log('🔗 Redirigiendo a:', redirectUrl);
                window.location.href = redirectUrl;
            } else {
                console.log('⚠️ No se encontraron productos');
                showToast('No se encontraron productos similares', 'info');
            }
        } catch (error) {
            console.error('💥 Error en la búsqueda:', error);
            showToast('Error al buscar productos', 'error');
        }
    }

    // ========== INICIALIZAR BUSCADOR ==========
    function initSearchToggle() {
        console.log('🔧 Inicializando buscador...');
        
        const toggleBtn = document.getElementById('toggle-search');
        const searchBar = document.getElementById('search-bar');
        const closeBtn = document.getElementById('close-search');
        const searchInput = document.getElementById('search-input');
        const searchOverlay = document.getElementById('search-overlay');

        console.log('📍 Elementos encontrados:', {
            toggleBtn: !!toggleBtn,
            searchBar: !!searchBar,
            closeBtn: !!closeBtn,
            searchInput: !!searchInput
        });

        if (!toggleBtn || !searchBar || !closeBtn || !searchInput) {
            console.error('❌ Elementos del buscador no encontrados');
            console.log('Verifica que header-desktop.html tenga los IDs correctos');
            return;
        }

        console.log('✅ Todos los elementos encontrados');

        // Abrir buscador
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔵 Abriendo buscador');
            searchBar.classList.add('active');
            if (searchOverlay) {
                searchOverlay.classList.add('active');
            }
            searchInput.focus();
        });

        // Cerrar buscador
        closeBtn.addEventListener('click', function() {
            console.log('🔴 Cerrando buscador');
            searchBar.classList.remove('active');
            if (searchOverlay) {
                searchOverlay.classList.remove('active');
            }
            searchInput.value = '';
            const dropdown = document.getElementById('search-results');
            if (dropdown) dropdown.classList.remove('show');
        });

        // Cerrar con overlay
        if (searchOverlay) {
            searchOverlay.addEventListener('click', function() {
                searchBar.classList.remove('active');
                searchOverlay.classList.remove('active');
                searchInput.value = '';
            });
        }

        // Cerrar con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchBar.classList.contains('active')) {
                searchBar.classList.remove('active');
                if (searchOverlay) searchOverlay.classList.remove('active');
                searchInput.value = '';
            }
        });

        // Buscar al presionar Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.value.trim();
                console.log('⏎ Enter presionado. Query:', query);
                if (query) {
                    buscarProductos(query);
                } else {
                    showToast('Ingresa un término de búsqueda', 'warning');
                }
            }
        });

        console.log('✅ Buscador inicializado correctamente');
    }

    checkSession();
    window.addEventListener('resize', detectDevice);
}); 