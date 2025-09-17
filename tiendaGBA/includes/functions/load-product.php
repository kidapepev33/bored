<?php
require_once '../../config/server.php';
header('Content-Type: text/html; charset=UTF-8');

// Obtener el ID del producto de la URL
$product_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($product_id <= 0) {
    echo "<p>ID de producto no válido.</p>";
    exit;
}

try {
    // Consultar el producto específico
    $sql = "SELECT product_id, name, category, plataform, stock, precio, img, description FROM products WHERE product_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo "<p>Producto no encontrado.</p>";
        exit;
    }
    
    $producto = $result->fetch_assoc();
    
} catch(Exception $e) {
    echo "<p>Error al cargar el producto: " . $e->getMessage() . "</p>";
    exit;
}

// Generar el HTML del producto
echo '<div>';
echo '<img src="../' . htmlspecialchars($producto['img']) . '" alt="' . htmlspecialchars($producto['name']) . '" class="Compra__img">';
echo '</div>';

echo '<div>';
echo '<h1>' . htmlspecialchars($producto['name']) . '</h1>';
echo '<h2>Precio: <span>$' . number_format($producto['precio'], 2) . '</span></h2>';
echo '<div class="Compra_flex">';
echo '<div class="Compra_flex_info">';
echo '<p class="Compra_categoria" ><strong>Categoría:</strong> ' . htmlspecialchars($producto['category']) . '</p>';
echo '<p class="Compra_plataforma" ><strong>Plataforma:</strong> ' . htmlspecialchars($producto['plataform']) . '</p>';
echo '<p class="Compra_cantidad" ><strong>Stock disponible:</strong> ' . htmlspecialchars($producto['stock']) . ' unidades</p>';
echo '</div>';
echo '<p class="Compra_description" >' . htmlspecialchars($producto['description']) . '</p>';
echo '</div>';
echo '<a href="carrito.html?id=' . $producto['product_id'] . '" class="button comprar">Comprar</a>';
echo '</div>';

// Cerrar la conexión
$conn->close();
?>