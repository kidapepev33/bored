 document.addEventListener('DOMContentLoaded', function () {
            // Elementos del DOM
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            const showRegisterBtn = document.getElementById('show-register');
            const showLoginBtn = document.getElementById('show-login');
            const btnLogin = document.getElementById('btn-login');
            const btnRegister = document.getElementById('btn-register');
            const loginMessage = document.getElementById('login-message');
            const registerMessage = document.getElementById('register-message');

            // Verificar si el usuario ya está logueado
            const userToken = localStorage.getItem('userToken');
            const userData = localStorage.getItem('userData');
            
            if (userToken && userData) {
                // Obtener datos del usuario
                const user = JSON.parse(userData);
                
                // Mostrar mensaje de bienvenida en vez de redirigir inmediatamente
                loginForm.classList.add('hidden');
                registerForm.classList.add('hidden');
                
                // Crear contenedor para el mensaje de ya logueado
                const alreadyLoggedContainer = document.createElement('div');
                alreadyLoggedContainer.id = 'already-logged';
                alreadyLoggedContainer.style.textAlign = 'center';
                alreadyLoggedContainer.style.padding = '20px';
                
                // Crear avatar de usuario más grande
                const userAvatar = document.createElement('div');
                userAvatar.style.width = '64px';
                userAvatar.style.height = '64px';
                userAvatar.style.borderRadius = '50%';
                userAvatar.style.backgroundColor = '#4CAF50';
                userAvatar.style.color = 'white';
                userAvatar.style.display = 'flex';
                userAvatar.style.alignItems = 'center';
                userAvatar.style.justifyContent = 'center';
                userAvatar.style.fontSize = '32px';
                userAvatar.style.fontWeight = 'bold';
                userAvatar.style.margin = '0 auto 20px';
                userAvatar.textContent = user.name.charAt(0).toUpperCase();
                
                // Crear mensaje de bienvenida
                const welcomeMessage = document.createElement('h2');
                welcomeMessage.textContent = `¡Bienvenido de nuevo, ${user.name}!`;
                welcomeMessage.style.marginBottom = '20px';
                welcomeMessage.style.color = '#4CAF50';
                
                // Información del usuario
                const userInfo = document.createElement('p');
                userInfo.textContent = `Ya has iniciado sesión con ${user.email}`;
                userInfo.style.marginBottom = '30px';
                
                // Botones
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.justifyContent = 'space-between';
                buttonContainer.style.maxWidth = '400px';
                buttonContainer.style.margin = '0 auto';
                
                // Botón para ir a la página principal
                const goHomeBtn = document.createElement('button');
                goHomeBtn.textContent = 'Ir a la tienda';
                goHomeBtn.className = 'btn-login';
                goHomeBtn.style.flex = '1';
                goHomeBtn.style.marginRight = '10px';
                goHomeBtn.addEventListener('click', function() {
                    window.location.href = 'index.html';
                });
                
                // Botón para cerrar sesión
                const logoutBtn = document.createElement('button');
                logoutBtn.textContent = 'Cerrar sesión';
                logoutBtn.className = 'btn-register';
                logoutBtn.style.flex = '1';
                logoutBtn.style.marginLeft = '10px';
                logoutBtn.style.backgroundColor = '#f44336';
                logoutBtn.addEventListener('click', function() {
                    API.logout();
                    window.location.reload();
                });
                
                // Añadir elementos al contenedor
                buttonContainer.appendChild(goHomeBtn);
                buttonContainer.appendChild(logoutBtn);
                
                // Añadir todo al contenedor principal
                alreadyLoggedContainer.appendChild(userAvatar);
                alreadyLoggedContainer.appendChild(welcomeMessage);
                alreadyLoggedContainer.appendChild(userInfo);
                alreadyLoggedContainer.appendChild(buttonContainer);
                
                // Añadir el contenedor a la página
                document.querySelector('.login-container').appendChild(alreadyLoggedContainer);
            }

            // Mostrar formulario de registro
            showRegisterBtn.addEventListener('click', function () {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            });

            // Mostrar formulario de login
            showLoginBtn.addEventListener('click', function () {
                registerForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
            });

            // Función para mostrar mensajes
            function showMessage(element, message, type) {
                element.textContent = message;
                element.classList.remove('hidden', 'success', 'error');
                element.classList.add(type);
            }

            // Iniciar sesión
            btnLogin.addEventListener('click', async function () {
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;

                if (!email || !password) {
                    showMessage(loginMessage, 'Por favor, complete todos los campos', 'error');
                    return;
                }

                try {
                    await API.login(email, password);
                    showMessage(loginMessage, 'Inicio de sesión exitoso, redirigiendo...', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } catch (error) {
                    showMessage(loginMessage, 'Email o contraseña incorrectos', 'error');
                }
            });

            // Registrarse
            btnRegister.addEventListener('click', async function () {
                const name = document.getElementById('register-name').value;
                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                const confirmPassword = document.getElementById('register-confirm-password').value;

                if (!name || !email || !password || !confirmPassword) {
                    showMessage(registerMessage, 'Por favor, complete todos los campos', 'error');
                    return;
                }

                if (password !== confirmPassword) {
                    showMessage(registerMessage, 'Las contraseñas no coinciden', 'error');
                    return;
                }

                if (password.length < 6) {
                    showMessage(registerMessage, 'La contraseña debe tener al menos 6 caracteres', 'error');
                    return;
                }

                try {
                    await API.register(name, email, password);
                    showMessage(registerMessage, 'Registro exitoso, redirigiendo...', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } catch (error) {
                    showMessage(registerMessage, 'Error al registrar usuario', 'error');
                }
            });
        });