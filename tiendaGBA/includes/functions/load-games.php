<?php
// ALTERNATIVA: Si no tienes tabla de orders/ventas
// Esta versión usa el producto con MENOS stock (asumiendo que menos stock = más vendido)

require_once '../../config/server.php';
header('Content-Type: text/html; charset=UTF-8');

try {
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
    
    // OPCIÓN 1: Obtener el juego con MENOS stock (más vendido)
    $sqlBestSeller = "SELECT product_id, name, precio, img, category, stock 
                      FROM products 
                      WHERE stock > 0 
                      ORDER BY stock ASC 
                      LIMIT 1";
    
    // OPCIÓN 2: Si prefieres usar el más caro (juego premium)
    // $sqlBestSeller = "SELECT product_id, name, precio, img, category 
    //                   FROM products 
    //                   ORDER BY precio DESC 
    //                   LIMIT 1";
    
    // OPCIÓN 3: O simplemente elegir uno específico por ID
    // $sqlBestSeller = "SELECT product_id, name, precio, img, category 
    //                   FROM products 
    //                   WHERE product_id = 123"; // ID de tu juego destacado
    
    $resultBestSeller = $conn->query($sqlBestSeller);
    $juegoMasVendido = null;
    
    if ($resultBestSeller && $resultBestSeller->num_rows > 0) {
        $juegoMasVendido = $resultBestSeller->fetch_assoc();
    } else {
        // Fallback: usar el primer producto
        $juegoMasVendido = !empty($productos) ? $productos[0] : null;
    }
    
} catch(Exception $e) {
    echo "<p>Error al cargar productos: " . $e->getMessage() . "</p>";
    exit;
}

// [El resto del código es igual al archivo anterior...]
// Generar el HTML con dos tipos de banners alternados
if (!empty($productos)) {
    $itemsPerGrid = 6;
    $totalProductos = count($productos);
    $gridAbierto = false;
    $bannerCount = 0;
    
    foreach ($productos as $index => $producto) {
        if ($index % $itemsPerGrid === 0) {
            if ($gridAbierto) {
                echo '</div>';
            }
            
            if ($index > 0) {
                $bannerCount++;
                
                if ($bannerCount % 2 == 1) {
                    // BANNER CATEGORÍAS
                    echo '<div class="banner-separator banner-categories">';
                    echo '<h2 class="banner-title">Explora por Categoría</h2>';
                    echo '<div class="categories-grid">';
                    echo '<a href="?categoria=accion" class="category-box">';
                    echo '<span class="category-icon">🎯</span>';
                    echo '<span class="category-name">Acción</span>';
                    echo '</a>';
                    echo '<a href="?categoria=aventura" class="category-box">';
                    echo '<span class="category-icon">🗺️</span>';
                    echo '<span class="category-name">Aventura</span>';
                    echo '</a>';
                    echo '<a href="?categoria=rpg" class="category-box">';
                    echo '<span class="category-icon">⚔️</span>';
                    echo '<span class="category-name">RPG</span>';
                    echo '</a>';
                    echo '<a href="?categoria=deportes" class="category-box">';
                    echo '<span class="category-icon">⚽</span>';
                    echo '<span class="category-name">Deportes</span>';
                    echo '</a>';
                    echo '<a href="?categoria=terror" class="category-box">';
                    echo '<span class="category-icon">👻</span>';
                    echo '<span class="category-name">Terror</span>';
                    echo '</a>';
                    echo '<a href="?categoria=estrategia" class="category-box">';
                    echo '<span class="category-icon">🧠</span>';
                    echo '<span class="category-name">Estrategia</span>';
                    echo '</a>';
                    echo '</div>';
                    echo '</div>';
                } else {
                    // BANNER JUEGO MÁS VENDIDO
                    if ($juegoMasVendido) {
                        echo '<div class="banner-separator banner-bestseller">';
                        echo '<div class="bestseller-content">';
                        
                        echo '<div class="bestseller-image">';
                        echo '<img src="../' . htmlspecialchars($juegoMasVendido['img']) . '" alt="' . htmlspecialchars($juegoMasVendido['name']) . '">';
                        echo '<div class="bestseller-badge">🏆 MÁS VENDIDO</div>';
                        echo '</div>';
                        
                        echo '<div class="bestseller-info">';
                        echo '<h3 class="bestseller-category">' . htmlspecialchars($juegoMasVendido['category']) . '</h3>';
                        echo '<h2 class="bestseller-title">' . htmlspecialchars($juegoMasVendido['name']) . '</h2>';
                        echo '<p class="bestseller-description">El favorito de nuestra comunidad. Miles de jugadores ya lo tienen.</p>';
                        echo '<div class="bestseller-price-section">';
                        echo '<span class="bestseller-price">₡' . number_format($juegoMasVendido['precio'], 2) . '</span>';
                        echo '<a href="../pages/Compra.html?id=' . htmlspecialchars($juegoMasVendido['product_id']) . '" class="bestseller-btn">Comprar Ahora</a>';
                        echo '</div>';
                        echo '</div>';
                        
                        echo '</div>';
                        echo '</div>';
                    }
                }
            }
            
            echo '<div class="games">';
            $gridAbierto = true;
        }
        
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
    
    if ($gridAbierto) {
        echo '</div>';
    }
    
} else {
    echo '<p>No hay productos disponibles en este momento.</p>';
}

$conn->close();
?>