document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar los productos
    function loadGames() {
        fetch('/bored/tiendaGBA/includes/functions/load-games.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.text();
            })
            .then(data => {
                const gamesContainer = document.getElementById('games-container');
                if (gamesContainer) {
                    gamesContainer.innerHTML = data;
                } else {
                    console.error('No se encontró el contenedor de juegos');
                }
            })
            .catch(error => {
                console.error('Error al cargar productos:', error);
                const gamesContainer = document.getElementById('games-container');
                if (gamesContainer) {
                    gamesContainer.innerHTML = '<p>Error al cargar los productos. Por favor, recarga la página.</p>';
                }
            });
    }

    // Cargar productos al iniciar
    loadGames();

    // Opcional: Función para recargar productos (por si quieres un botón de actualizar)
    window.reloadGames = function() {
        loadGames();
    };
});