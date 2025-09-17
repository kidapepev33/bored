document.addEventListener('DOMContentLoaded', function() {
    // Función para obtener parámetros de la URL
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Función para cargar el producto
    function loadProduct() {
        const productId = getUrlParameter('id');
        
        if (!productId) {
            document.getElementById('product-container').innerHTML = '<p>No se especificó un producto válido.</p>';
            return;
        }

        const url = '/bored/tiendaGBA/includes/functions/load-product.php?id=' + productId;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor: ' + response.status);
                }
                return response.text();
            })
            .then(data => {
                const productContainer = document.getElementById('product-container');
                if (productContainer) {
                    productContainer.innerHTML = data;
                }
            })
            .catch(error => {
                const productContainer = document.getElementById('product-container');
                if (productContainer) {
                    productContainer.innerHTML = '<p>Error al cargar el producto. Por favor, recarga la página.</p>';
                }
            });
    }

    // Cargar producto al iniciar
    loadProduct();
});