// assets/js/auth/estado-login.js - Versión mejorada con seguridad y mejor UX
document.addEventListener('DOMContentLoaded', function () {
    const loadingElement = document.getElementById('loading');
    const loggedInElement = document.getElementById('logged-in');
    const notLoggedElement = document.getElementById('not-logged');
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const userAvatarElement = document.getElementById('user-avatar');

    checkLoginStatus();

    // Utility: Sanitizar HTML para prevenir XSS
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Utility: Mostrar mensaje de error al usuario
    function showErrorMessage(container, message) {
        if (container) {
            container.innerHTML = `
                <div class="error-message" style="padding: 20px; background: var(--background); border: 1px solid var(--neon); border-radius: 8px;">
                    <p style="margin: 0;">⚠️ ${escapeHtml(message)}</p>
                    <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #c33; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    // Utility: Esperar a que un elemento exista en el DOM
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Timeout para evitar esperas infinitas
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Elemento ${selector} no encontrado después de ${timeout}ms`));
            }, timeout);
        });
    }

    async function checkLoginStatus() {
        loggedInElement.style.display = 'none';
        notLoggedElement.style.display = 'none';

        try {
            const response = await fetch('/bored/tiendaGBA/includes/auth/check-session.php');

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            loadingElement.style.display = 'none';
            console.log('Estado de sesión:', data);

            if (data.isLoggedIn) {
                console.log('Usuario logueado, mostrando UI');
                loggedInElement.style.display = 'flex';

                // Mostrar información básica del usuario (usando textContent para seguridad)
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

            // Mostrar mensaje de error al usuario
            if (notLoggedElement) {
                notLoggedElement.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <p style="color: #c33; margin-bottom: 15px;">⚠️ Error al conectar con el servidor</p>
                        <button onclick="location.reload()" class="btn btn-primary">Reintentar</button>
                    </div>
                `;
            }
        }
    }

    function setupMenuByRole(userRole) {
        const menuSection = document.querySelector('.menu-section ul');

        if (userRole === 'admin') {
            // Menú para administradores
            menuSection.innerHTML = `
                <li class="active"><a href="#datos-personales"><span class="menu-icon">👤</span> Datos Personales</a></li>
                <li><a href="#crear-usuario-admin"><span class="menu-icon">👥</span> Crear Usuario Admin</a></li>
                <li><a href="#gestionar-productos"><span class="menu-icon">📦</span> Agregar Juego</a></li>

            `;
        } else {
            // Menú para clientes regulares
            menuSection.innerHTML = `
                <li class="active"><a href="#datos-personales"><span class="menu-icon">👤</span> Datos Personales</a></li>

            `;
        }

        // Configurar event listeners después de crear el menú
        setupMenuEventListeners();
    }

    async function loadUserData() {
        const datosPersonalesContent = document.getElementById('datos-personales-content');

        try {
            const response = await fetch('/bored/tiendaGBA/includes/functions/get-user-data.php');

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                displayUserData(data.user);
            } else {
                console.error('Error cargando datos del usuario:', data.message);
                showErrorMessage(datosPersonalesContent, data.message || 'Error al cargar los datos del usuario');
            }
        } catch (error) {
            console.error('Error al cargar datos del usuario:', error);
            showErrorMessage(datosPersonalesContent, 'Error al cargar los datos. Por favor, intenta de nuevo.');
        }
    }

    function displayUserData(userData) {
        const datosPersonalesContent = document.getElementById('datos-personales-content');
        if (datosPersonalesContent) {
            // Sanitizar todos los datos antes de mostrarlos
            const safeName = escapeHtml(userData.name);
            const safeLastname = escapeHtml(userData.lastname || 'No especificado');
            const safeEmail = escapeHtml(userData.email);
            const safePhone = escapeHtml(userData.phone || 'No especificado');
            const safeGender = escapeHtml(formatGender(userData.gender));
            const safeRole = escapeHtml(formatRole(userData.rol));
            const safeId = escapeHtml(userData.id);

            datosPersonalesContent.innerHTML = `
                <h2>Datos Personales</h2>
                <div class="user-details-section">
                    <div class="user-data-grid">
                        <div class="data-item">
                            <label>Nombre:</label>
                            <span>${safeName}</span>
                        </div>
                        <div class="data-item">
                            <label>Apellidos:</label>
                            <span>${safeLastname}</span>
                        </div>
                        <div class="data-item">
                            <label>Email:</label>
                            <span>${safeEmail}</span>
                        </div>
                        <div class="data-item">
                            <label>Teléfono:</label>
                            <span>${safePhone}</span>
                        </div>
                        <div class="data-item">
                            <label>Género:</label>
                            <span>${safeGender}</span>
                        </div>
                        <div class="data-item">
                            <label>Tipo de cuenta:</label>
                            <span>${safeRole}</span>
                        </div>
                        <div class="data-item">
                            <label>ID de usuario:</label>
                            <span>#${safeId}</span>
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
    async function setupMenuEventListeners() {
        // Configurar cerrar sesión
        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', function (e) {
                e.preventDefault();
                if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                    window.location.href = '/bored/tiendaGBA/includes/auth/logout.php';
                }
            });
        }

        // Esperar a que los elementos del menú existan usando la utilidad moderna
        try {
            await waitForElement('.account-nav ul li a');

            const menuLinks = document.querySelectorAll('.account-nav ul li a');
            menuLinks.forEach(link => {
                if (link.id !== 'logout-link') {
                    link.addEventListener('click', function (e) {
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
        } catch (error) {
            console.error('Error configurando menú:', error);
        }
    }

    // Mostrar sección de contenido
    function showSection(sectionId) {
        console.log('Mostrando sección:', sectionId);

        // Ocultar todas las secciones
        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Buscar la sección objetivo
        const targetSection = document.getElementById(sectionId + '-content');

        if (targetSection) {
            console.log('Sección encontrada:', targetSection.id);
            targetSection.classList.add('active');

            // Cargar contenido dinámico para ciertas secciones
            loadSectionContent(sectionId, targetSection);
        } else {
            console.error('Sección no encontrada:', sectionId + '-content');
        }
    }

    // Configuración de secciones dinámicas
    const dynamicSections = {
        'crear-usuario-admin': {
            endpoint: '/bored/tiendaGBA/includes/functions/get-crear-usuario-form.php',
            title: 'Crear Cuenta',
            onLoad: setupCreateUserForm
        },
        'gestionar-productos': {
            endpoint: '/bored/tiendaGBA/includes/functions/get-productos-form.php',
            title: 'Gestionar Productos',
            onLoad: setupProductsForm
        },
        'ordenes-sistema': {
            endpoint: '/bored/tiendaGBA/includes/functions/get-ordenes.php',
            title: 'Todas las Órdenes',
            onLoad: null
        },
        'historial-pedidos': {
            endpoint: '/bored/tiendaGBA/includes/functions/get-historial-pedidos.php',
            title: 'Historial de Pedidos',
            onLoad: null
        },
        'wishlist': {
            endpoint: '/bored/tiendaGBA/includes/functions/get-wishlist.php',
            title: 'Lista de Deseos',
            onLoad: null
        },
        'configuracion': {
            endpoint: '/bored/tiendaGBA/includes/functions/get-configuracion.php',
            title: 'Configuración',
            onLoad: null
        }
    };

    // Cargar contenido dinámico (versión escalable)
    async function loadSectionContent(sectionId, targetSection) {
        console.log('Cargando contenido para:', sectionId);

        // Verificar si esta sección requiere carga dinámica
        const sectionConfig = dynamicSections[sectionId];

        if (!sectionConfig) {
            console.log('Sección no requiere carga dinámica:', sectionId);
            return;
        }

        // Verificar si ya fue cargada
        if (targetSection.querySelector(sectionConfig.checkSelector)) {
            console.log('Contenido ya cargado para:', sectionId);
            return;
        }

        console.log('Cargando contenido dinámico desde:', sectionConfig.endpoint);

        // Mostrar loading mientras carga
        targetSection.innerHTML = `<h2>${sectionConfig.title}</h2><p>Cargando contenido...</p>`;

        try {
            const response = await fetch(sectionConfig.endpoint);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Reemplazar todo el contenido de la sección
                targetSection.innerHTML = `<h2>${sectionConfig.title}</h2>${data.html}`;
                console.log('Contenido cargado exitosamente para:', sectionId);

                // Ejecutar función de inicialización si existe
                if (sectionConfig.onLoad && typeof sectionConfig.onLoad === 'function') {
                    sectionConfig.onLoad();
                }
            } else {
                console.error('Error del servidor:', data.message);
                showErrorMessage(targetSection, data.message || 'Error al cargar el contenido');
            }
        } catch (error) {
            console.error('Error cargando contenido:', error);
            showErrorMessage(targetSection, 'Error al cargar el contenido. Por favor, intenta de nuevo.');
        }
    }

    // Configurar el formulario de crear usuario
    function setupCreateUserForm() {
        const createUserForm = document.getElementById('create-user');

        if (!createUserForm) {
            console.error('Formulario create-user no encontrado');
            return;
        }

        // Remover listeners previos clonando el elemento
        const newForm = createUserForm.cloneNode(true);
        createUserForm.parentNode.replaceChild(newForm, createUserForm);

        // Agregar nuevo listener al formulario limpio
        newForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            console.log('Formulario enviado');

            const formData = new FormData(this);
            const messageDiv = document.getElementById('create-user-message');
            const submitButton = this.querySelector('button[type="submit"]');

            // Deshabilitar botón mientras procesa
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Creando usuario...';
            }

            try {
                const response = await fetch('/bored/tiendaGBA/includes/auth/register.php', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const result = await response.json();

                if (result.success) {
                    if (messageDiv) {
                        messageDiv.textContent = '✓ Usuario creado exitosamente';
                        messageDiv.className = 'register_tittle success';
                        messageDiv.classList.remove('hidden');
                    }
                    this.reset(); // Limpiar formulario
                } else {
                    if (messageDiv) {
                        messageDiv.textContent = result.message || 'Error al crear usuario';
                        messageDiv.className = 'register_tittle error';
                        messageDiv.classList.remove('hidden');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                if (messageDiv) {
                    messageDiv.textContent = 'Error de conexión. Por favor, intenta de nuevo.';
                    messageDiv.className = 'register_tittle error';
                    messageDiv.classList.remove('hidden');
                }
            } finally {
                // Re-habilitar botón
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Crear Usuario';
                }
            }
        });
    }

    // Configurar el formulario de productos
    function setupProductsForm() {
        const productForm = document.getElementById('upload-product-form');
        const productImage = document.getElementById('product-image');
        const previewContainer = document.getElementById('preview-container');
        const imagePreview = document.getElementById('image-preview');

        if (!productForm) {
            console.error('Formulario upload-product-form no encontrado');
            return;
        }

        // Preview de imagen
        if (productImage) {
            productImage.addEventListener('change', function (e) {
                const file = e.target.files[0];
                if (file) {
                    // Validar tamaño (5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        alert('La imagen no debe superar los 5MB');
                        this.value = '';
                        if (previewContainer) previewContainer.style.display = 'none';
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = function (e) {
                        if (imagePreview) imagePreview.src = e.target.result;
                        if (previewContainer) previewContainer.style.display = 'block';
                    }
                    reader.readAsDataURL(file);
                }
            });
        }

        // Remover listeners previos clonando el elemento
        const newForm = productForm.cloneNode(true);
        productForm.parentNode.replaceChild(newForm, productForm);

        // Agregar nuevo listener al formulario limpio
        newForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            console.log('Formulario de producto enviado');

            const formData = new FormData(this);
            const messageDiv = document.getElementById('upload-product-message');
            const submitButton = this.querySelector('button[type="submit"]');

            // Deshabilitar botón mientras procesa
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Agregando producto...';
            }

            try {
                const response = await fetch('/bored/tiendaGBA/includes/functions/add-product.php', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const result = await response.json();

                if (result.success) {
                    if (messageDiv) {
                        messageDiv.textContent = '✓ Producto agregado exitosamente';
                        messageDiv.className = 'register_tittle success';
                        messageDiv.classList.remove('hidden');
                    }

                    // Esperar 1.5 segundos para que el usuario vea el mensaje, luego recargar
                    setTimeout(() => {
                        location.reload();
                    }, 1500);

                } else {
                    if (messageDiv) {
                        messageDiv.textContent = result.message || 'Error al agregar producto';
                        messageDiv.className = 'register_tittle error';
                        messageDiv.classList.remove('hidden');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                if (messageDiv) {
                    messageDiv.textContent = 'Error de conexión. Por favor, intenta de nuevo.';
                    messageDiv.className = 'register_tittle error';
                    messageDiv.classList.remove('hidden');
                }
            } finally {
                // Re-habilitar botón
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Agregar Producto';
                }
            }
        });

        // Re-aplicar el event listener de preview después de clonar
        const newProductImage = document.getElementById('product-image');
        if (newProductImage) {
            newProductImage.addEventListener('change', function (e) {
                const file = e.target.files[0];
                if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                        alert('La imagen no debe superar los 5MB');
                        this.value = '';
                        if (previewContainer) previewContainer.style.display = 'none';
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const newImagePreview = document.getElementById('image-preview');
                        const newPreviewContainer = document.getElementById('preview-container');
                        if (newImagePreview) newImagePreview.src = e.target.result;
                        if (newPreviewContainer) newPreviewContainer.style.display = 'block';
                    }
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    // Funciones globales
    window.goToHome = function () {
        window.location.href = '/bored/tiendaGBA/pages/index.html';
    };

    window.goToLogin = function () {
        window.location.href = '/bored/tiendaGBA/pages/auth/login.html';
    };

    window.logout = function () {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            window.location.href = '/bored/tiendaGBA/includes/auth/logout.php';
        }
    };

    window.editUserData = function () {
        alert('Función de edición en desarrollo. Por ahora los datos se pueden cambiar desde el registro.');
    };
});