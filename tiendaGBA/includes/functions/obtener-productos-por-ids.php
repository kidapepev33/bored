<?php
// Activar errores temporalmente
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../../config/server.php';

if (!isset($_GET['ids'])) {
    echo json_encode([
        'success' => false,
        'mensaje' => 'No se proporcionaron IDs'
    ]);
    exit;
}

$ids = $_GET['ids'];

// Limpiar y validar IDs
$idsArray = explode(',', $ids);
$idsArray = array_filter($idsArray, 'is_numeric');
$idsArray = array_map('intval', $idsArray);

if (empty($idsArray)) {
    echo json_encode([
        'success' => false,
        'mensaje' => 'IDs inválidos'
    ]);
    exit;
}

try {
    // Crear placeholders para la consulta preparada
    $placeholders = implode(',', array_fill(0, count($idsArray), '?'));
    
    $sql = "SELECT * FROM products WHERE product_id IN ($placeholders)";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Error al preparar consulta: " . $conn->error);
    }
    
    // Bind dinámico de parámetros
    $types = str_repeat('i', count($idsArray));
    $stmt->bind_param($types, ...$idsArray);
    
    if (!$stmt->execute()) {
        throw new Exception("Error al ejecutar consulta: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    
    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
    
    $stmt->close();
    
    echo json_encode([
        'success' => true,
        'productos' => $productos,
        'total' => count($productos)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error al obtener productos',
        'error' => $e->getMessage()
    ]);
}

exit;
?>