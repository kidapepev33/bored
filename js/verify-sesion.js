 // Verificar el estado de la sesión del usuario
        document.addEventListener('DOMContentLoaded', async function() {
            const userData = localStorage.getItem('userData');
            const userToken = localStorage.getItem('userToken');
            const headerContainer = document.getElementById('header-container');
            
            // Cargar juegos desde la API
            try {
                const games = await API.getGames();
                displayGames(games);
            } catch (error) {
                console.error('Error al cargar juegos:', error);
            }

            // Función para mostrar los juegos
            function displayGames(games) {
                const gamesContainer = document.querySelector('.games');
                
                if (!games || games.length === 0) {
                    // Si no hay juegos disponibles, mostrar mensaje
                    const noGamesMessage = document.createElement('p');
                    noGamesMessage.textContent = 'No hay juegos disponibles en este momento';
                    noGamesMessage.style.textAlign = 'center';
                    noGamesMessage.style.width = '100%';
                    noGamesMessage.style.padding = '20px';
                    gamesContainer.innerHTML = '';
                    gamesContainer.appendChild(noGamesMessage);
                    return;
                }
                
                // Si hay juegos, mostrar cada uno en una tarjeta
                gamesContainer.innerHTML = '';
                
                games.forEach(game => {
                    const gameBox = document.createElement('a');
                    gameBox.href = `Compra.html?id=${game._id}`;
                    gameBox.className = 'games__box';
                    
                    gameBox.innerHTML = `
                        <div class="games__content">
                            <img class="games__img" src="${game.image}" alt="${game.name}">
                            <h3 class="games__tittle">${game.name}</h3>
                            <p class="games__text">Precio $${game.price.toFixed(2)} </p>
                        </div>
                    `;
                    
                    gamesContainer.appendChild(gameBox);
                });
            }

            // Verificar si el usuario está logueado y actualizar la interfaz
            if (userToken && userData) {
                const user = JSON.parse(userData);
                const loginBtn = document.createElement('a');
                loginBtn.href = '#';
                loginBtn.textContent = 'Cerrar Sesión';
                loginBtn.className = 'nav-link';
                loginBtn.addEventListener('click', function() {
                    API.logout();
                    window.location.href = 'index.html';
                });
                
                // Añadir botón de perfil y otras opciones si es necesario
            } else {
                // Si no está logueado, mostrar botón de inicio de sesión
                const loginButton = document.querySelector('.header-login-btn');
                if (loginButton) {
                    loginButton.href = 'login.html';
                }
            }
        });