<?php
require_once '../../config/server.php';
header('Content-Type: text/html; charset=UTF-8');

try {
    // Usar la conexión mysqli que viene de server.php
    $sql = "SELECT product_id, name, category, plataform, stock, precio, img FROM products ORDER BY name";
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }
    
    $productos = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $productos[] = $row;
        }
    }
    
} catch(Exception $e) {
    echo "<p>Error al cargar productos: " . $e->getMessage() . "</p>";
    exit;
}

// Generar el HTML de los productos
if (!empty($productos)) {
    foreach ($productos as $producto) {
        echo '<a href="../pages/Compra.html?id=' . htmlspecialchars($producto['product_id']) . '" class="games__box">';
        echo '<div class="games__content">';
        echo '<img class="games__img" src="../' . htmlspecialchars($producto['img']) . '" alt="' . htmlspecialchars($producto['name']) . '">';
        echo '<h3 class="games__tittle">';
        echo htmlspecialchars($producto['name']);
        echo '</h3>';
        echo '<p class="games__text">Precio ₡' . number_format($producto['precio'], 2) . '</p>';
        echo '</div>';
        echo '</a>';
    }
} else {
    echo '<p>No hay productos disponibles en este momento.</p>';
}

// Cerrar la conexión
$conn->close();
?>