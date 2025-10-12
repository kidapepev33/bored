// load-product.js

// Variable para controlar si ya preguntamos sobre ir al carrito
let yaPreguntaronCarrito = false;

document.addEventListener('DOMContentLoaded', function() {
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

    loadProduct();
});

async function agregarAlCarrito(productId, maxStock) {
    const cantidadInput = document.getElementById('cantidad-producto');
    const cantidad = cantidadInput ? parseInt(cantidadInput.value) : 1;
    
    if (cantidad < 1) {
        showToast('La cantidad debe ser al menos 1', 'error');
        return;
    }

    if (maxStock && cantidad > maxStock) {
        showToast(`Solo hay ${maxStock} unidades disponibles`, 'warning');
        return;
    }

    try {
        const response = await fetch('../includes/functions/carrito.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'agregar',
                product_id: productId,
                cantidad: cantidad
            })
        });

        const data = await response.json();

        if (data.success) {
            showToast('✓ ' + data.mensaje, 'success');
            
            // Solo preguntar la PRIMERA VEZ
            if (!yaPreguntaronCarrito) {
                yaPreguntaronCarrito = true;
                const irAlCarrito = await showConfirm('¿Quieres ir al carrito?');
                if (irAlCarrito) {
                    window.location.href = 'carrito.html';
                    return;
                }
            }
            
            // Resetear cantidad a 1
            if (cantidadInput) {
                cantidadInput.value = 1;
            }
        } else if (data.requiere_login) {
            const irAlLogin = await showConfirm('Debes iniciar sesión para agregar productos. ¿Quieres ir al login?');
            if (irAlLogin) {
                window.location.href = 'login.html';
            }
        } else {
            showToast('⚠ ' + data.mensaje, 'warning');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al agregar producto al carrito', 'error');
    }
}