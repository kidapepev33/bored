// resultados.js

document.addEventListener('DOMContentLoaded', function () {
    cargarResultados();
});

async function cargarResultados() {
    const urlParams = new URLSearchParams(window.location.search);
    const ids = urlParams.get('ids');
    const query = urlParams.get('q');

    // Mostrar término de búsqueda
    const queryElement = document.getElementById('search-query');
    if (queryElement && query) {
        queryElement.textContent = `Resultados para: "${query}"`;
    }

    if (!ids) {
        mostrarSinResultados();
        return;
    }

    try {
        const response = await fetch(`../includes/functions/obtener-productos-por-ids.php?ids=${ids}`);
        const data = await response.json();

        document.getElementById('loading').style.display = 'none';

        if (data.success && data.productos.length > 0) {
            mostrarProductos(data.productos);
        } else {
            mostrarSinResultados();
        }
    } catch (error) {
        console.error('Error al cargar resultados:', error);
        document.getElementById('loading').style.display = 'none';
        mostrarSinResultados();
        showToast('Error al cargar resultados', 'error');
    }
}

function mostrarProductos(productos) {
    console.log('📦 Mostrando productos:', productos.length);
    const container = document.getElementById('resultados-container');
    container.innerHTML = '';

    productos.forEach(producto => {
        const card = `
            <a href="./Compra.html?id=${producto.product_id}" class="games__box">
                <div class="games__content">
                    <img class="games__img" src="../${producto.img}" alt="${producto.name}">
                    <h3 class="games__title">${producto.name}</h3>
                    <p class="games__text">Precio: <span>₡${Number(producto.precio).toLocaleString()}</span></p>
                </div>
            </a>
        `;
        container.innerHTML += card;
    });

    container.style.display = 'grid';
}

function mostrarSinResultados() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('resultados-container').style.display = 'none';
    document.getElementById('no-resultados').style.display = 'block';
}