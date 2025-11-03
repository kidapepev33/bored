<?php
// carrito.php - Maneja todas las operaciones del carrito
require_once '../../config/server.php';
session_start();
header('Content-Type: application/json');

// Obtener datos de la petición
$input = json_decode(file_get_contents('php://input'), true);
$action = isset($input['action']) ? $input['action'] : '';

// Verificar sesión (excepto para agregar que tiene su propia validación)
if ($action !== 'agregar' && !isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'mensaje' => 'No hay sesión activa']);
    exit;
}

// Switch de acciones
switch ($action) {
    
    // ============== OBTENER CARRITO ==============
    case 'obtener':
        try {
            if (!isset($_SESSION['carrito'])) {
                $_SESSION['carrito'] = [];
            }

            if (empty($_SESSION['carrito'])) {
                echo json_encode(['success' => true, 'productos' => []]);
                exit;
            }

            $productIds = array_keys($_SESSION['carrito']);
            $placeholders = implode(',', array_fill(0, count($productIds), '?'));

            $sql = "SELECT product_id, name, description, category, plataform, stock, precio, img 
                    FROM products WHERE product_id IN ($placeholders)";
            
            $stmt = $conn->prepare($sql);
            $types = str_repeat('i', count($productIds));
            $stmt->bind_param($types, ...$productIds);
            $stmt->execute();
            $result = $stmt->get_result();

            $productos = [];
            while ($row = $result->fetch_assoc()) {
                $row['cantidad'] = $_SESSION['carrito'][$row['product_id']];
                
                if ($row['cantidad'] > $row['stock']) {
                    $row['cantidad'] = $row['stock'];
                    $_SESSION['carrito'][$row['product_id']] = $row['stock'];
                }
                
                $productos[] = $row;
            }

            echo json_encode(['success' => true, 'productos' => $productos]);
            $stmt->close();

        } catch (Exception $e) {
            echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
        }
        break;

    // ============== AGREGAR AL CARRITO ==============
    case 'agregar':
        if (!isset($_SESSION['user_id'])) {
            echo json_encode([
                'success' => false, 
                'mensaje' => 'Debes iniciar sesión para agregar productos',
                'requiere_login' => true
            ]);
            exit;
        }

        if (!isset($input['product_id'])) {
            echo json_encode(['success' => false, 'mensaje' => 'Datos incompletos']);
            exit;
        }

        $productId = intval($input['product_id']);
        $cantidad = isset($input['cantidad']) ? intval($input['cantidad']) : 1;

        if ($cantidad < 1) {
            echo json_encode(['success' => false, 'mensaje' => 'La cantidad debe ser al menos 1']);
            exit;
        }

        try {
            $sql = "SELECT product_id, name, stock FROM products WHERE product_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('i', $productId);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 0) {
                echo json_encode(['success' => false, 'mensaje' => 'Producto no encontrado']);
                exit;
            }

            $producto = $result->fetch_assoc();

            if (!isset($_SESSION['carrito'])) {
                $_SESSION['carrito'] = [];
            }

            $cantidadActual = isset($_SESSION['carrito'][$productId]) ? $_SESSION['carrito'][$productId] : 0;
            $cantidadTotal = $cantidadActual + $cantidad;

            if ($cantidadTotal > $producto['stock']) {
                echo json_encode([
                    'success' => false, 
                    'mensaje' => 'Stock insuficiente. Solo hay ' . $producto['stock'] . ' unidades'
                ]);
                exit;
            }

            $_SESSION['carrito'][$productId] = $cantidadTotal;
            
            echo json_encode([
                'success' => true,
                'mensaje' => 'Producto agregado al carrito',
                'producto' => $producto['name'],
                'cantidad_carrito' => count($_SESSION['carrito'])
            ]);

            $stmt->close();

        } catch (Exception $e) {
            echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
        }
        break;

    // ============== ACTUALIZAR CANTIDAD ==============
    case 'actualizar':
        if (!isset($input['product_id']) || !isset($input['cantidad'])) {
            echo json_encode(['success' => false, 'mensaje' => 'Datos incompletos']);
            exit;
        }

        $productId = intval($input['product_id']);
        $cantidad = intval($input['cantidad']);

        if ($cantidad < 1) {
            echo json_encode(['success' => false, 'mensaje' => 'La cantidad debe ser al menos 1']);
            exit;
        }

        try {
            $sql = "SELECT stock FROM products WHERE product_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('i', $productId);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 0) {
                echo json_encode(['success' => false, 'mensaje' => 'Producto no encontrado']);
                exit;
            }

            $producto = $result->fetch_assoc();

            if ($cantidad > $producto['stock']) {
                echo json_encode([
                    'success' => false, 
                    'mensaje' => 'Stock insuficiente. Solo hay ' . $producto['stock'] . ' unidades'
                ]);
                exit;
            }

            if (!isset($_SESSION['carrito'])) {
                $_SESSION['carrito'] = [];
            }

            $_SESSION['carrito'][$productId] = $cantidad;

            echo json_encode(['success' => true, 'mensaje' => 'Cantidad actualizada']);
            $stmt->close();

        } catch (Exception $e) {
            echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
        }
        break;

    // ============== ELIMINAR DEL CARRITO ==============
    case 'eliminar':
        if (!isset($input['product_id'])) {
            echo json_encode(['success' => false, 'mensaje' => 'Datos incompletos']);
            exit;
        }

        $productId = intval($input['product_id']);

        if (!isset($_SESSION['carrito'])) {
            $_SESSION['carrito'] = [];
        }

        if (!isset($_SESSION['carrito'][$productId])) {
            echo json_encode(['success' => false, 'mensaje' => 'Producto no encontrado en el carrito']);
            exit;
        }

        unset($_SESSION['carrito'][$productId]);

        echo json_encode(['success' => true, 'mensaje' => 'Producto eliminado del carrito']);
        break;

    // ============== VACIAR CARRITO ==============
    case 'vaciar':
        $_SESSION['carrito'] = [];
        echo json_encode(['success' => true, 'mensaje' => 'Carrito vaciado']);
        break;

    // ============== ACCIÓN NO VÁLIDA ==============
    default:
        echo json_encode(['success' => false, 'mensaje' => 'Acción no válida']);
        break;
}
// Después de actualizar $_SESSION['carrito']
$_SESSION['subtotal'] = []; // inicializar
foreach ($_SESSION['carrito'] as $productId => $cantidad) {
    $sql = "SELECT precio FROM products WHERE product_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $productId);
    $stmt->execute();
    $result = $stmt->get_result();
    $producto = $result->fetch_assoc();
    $_SESSION['subtotal'][$productId] = $producto['precio'] * $cantidad;
    $stmt->close();
}


$conn->close();
?>