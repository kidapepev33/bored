// carrito.js

// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
});

// Función para verificar si el usuario está logueado
async function verificarSesion() {
    try {
        const response = await fetch('../includes/auth/check-session.php', {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        // Ocultar loading
        document.getElementById('loading').style.display = 'none';

        if (data.isLoggedIn) {
            // Usuario está logueado, mostrar carrito
            document.getElementById('carrito-section').style.display = 'grid';
            cargarCarrito();
        } else {
            // Usuario NO está logueado, mostrar mensaje
            document.getElementById('login-required').style.display = 'block';
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('login-required').style.display = 'block';
    }
}

// Cargar productos del carrito
async function cargarCarrito() {
    try {
        const response = await fetch('../includes/functions/carrito.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'obtener'
            })
        });

        const data = await response.json();

        if (data.success && data.productos.length > 0) {
            mostrarProductos(data.productos);
            calcularTotal(data.productos);
        } else {
            // Carrito vacío
            document.getElementById('carrito-container').style.display = 'none';
            document.getElementById('carrito-vacio').style.display = 'block';
        }
    } catch (error) {
        console.error('Error al cargar carrito:', error);
    }
}

// Mostrar productos en el HTML
function mostrarProductos(productos) {
    const container = document.getElementById('carrito-container');
    container.innerHTML = '';

    productos.forEach(producto => {
        const item = `
        
        <div class="carrito__container">
            <div class="carrito__item">
                <img src="../${producto.img}" alt="${producto.name}" class="carrito__item-image">
                <div class="carrito__item-details">
                    <div class="carrito__item-info">
                        <h3 class="carrito__item-name">${producto.name}</h3>
                        <h3 class="carrito__item-price">Precio: <span>₡${Number(producto.precio).toLocaleString()}</span></h3>
                        <p>Plataforma: <span>${producto.plataform || ''}</span></p>
                    </div>
                    <div class="carrito__item-quantity">
                        <label for="quantity-${producto.product_id}">Cantidad:</label>
                        <input 
                            type="number" 
                            id="quantity-${producto.product_id}" 
                            name="quantity-${producto.product_id}" 
                            value="${producto.cantidad}" 
                            min="1"
                            onchange="actualizarCantidad(${producto.product_id}, this.value, ${producto.stock})">
                    </div>
                    <button class="button" onclick="eliminarProducto(${producto.product_id})">Eliminar</button>
                </div>
            </div>
        </div>
        `;
        container.innerHTML += item;
    });

    document.getElementById('carrito-container').style.display = 'block';
    document.getElementById('carrito-vacio').style.display = 'none';
}

// Calcular total
function calcularTotal(productos) {
    let total = 0;
    
    productos.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });

    document.getElementById('subtotal').textContent = total.toLocaleString();
    document.getElementById('total').textContent = total.toLocaleString();
}

// Actualizar cantidad de un producto
async function actualizarCantidad(productId, cantidad, stock) {
    // Validar cantidad
    cantidad = parseInt(cantidad);
    
    if (cantidad < 1) {
        showToast('La cantidad mínima es 1', 'warning');
        cargarCarrito();
        return;
    }

    if (cantidad > stock) {
        showToast(`Solo hay ${stock} unidades disponibles`, 'warning');
        cargarCarrito();
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
                action: 'actualizar',
                product_id: productId,
                cantidad: cantidad
            })
        });

        const data = await response.json();

        if (data.success) {
            cargarCarrito();
            showToast('Cantidad actualizada', 'success');
        } else {
            showToast(data.mensaje || 'Error al actualizar cantidad', 'error');
            cargarCarrito();
        }
    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        showToast('Error al actualizar cantidad', 'error');
        cargarCarrito();
    }
}

// Eliminar producto del carrito
async function eliminarProducto(productId) {
    const confirmar = await showConfirm('¿Estás seguro de eliminar este producto?');
    if (!confirmar) {
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
                action: 'eliminar',
                product_id: productId
            })
        });

        const data = await response.json();

        if (data.success) {
            showToast('Producto eliminado del carrito', 'success');
            cargarCarrito();
        } else {
            showToast(data.mensaje || 'Error al eliminar producto', 'error');
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        showToast('Error al eliminar producto', 'error');
    }
}

// Vaciar carrito completo (función extra)
async function vaciarCarrito() {
    const confirmar = await showConfirm('¿Estás seguro de vaciar todo el carrito?');
    if (!confirmar) {
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
                action: 'vaciar'
            })
        });

        const data = await response.json();

        if (data.success) {
            showToast('Carrito vaciado', 'success');
            cargarCarrito();
        } else {
            showToast(data.mensaje || 'Error al vaciar carrito', 'error');
        }
    } catch (error) {
        console.error('Error al vaciar carrito:', error);
        showToast('Error al vaciar carrito', 'error');
    }
}

// Proceder al pago
document.getElementById('btn-checkout')?.addEventListener('click', function() {
    window.location.href = 'checkout.html';
});