<?php
// includes/functions/add-product.php
ob_start();
require_once '../../config/server.php';
session_start();
ob_end_clean();

header('Content-Type: application/json; charset=utf-8');


// Verificar que sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
    exit;
}

// Validar campos requeridos
$required_fields = ['name', 'description', 'category', 'plataform', 'stock', 'precio'];
foreach ($required_fields as $field) {
    if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
        echo json_encode([
            'success' => false,
            'message' => "El campo {$field} es requerido"
        ]);
        exit;
    }
}

// Validar que se subió una imagen
if (!isset($_FILES['img']) || $_FILES['img']['error'] === UPLOAD_ERR_NO_FILE) {
    echo json_encode([
        'success' => false,
        'message' => 'Debes seleccionar una imagen'
    ]);
    exit;
}

// Validar la imagen
$imagen = $_FILES['img'];
$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
$max_size = 5 * 1024 * 1024; // 5MB

if ($imagen['error'] !== UPLOAD_ERR_OK) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al subir la imagen'
    ]);
    exit;
}

if (!in_array($imagen['type'], $allowed_types)) {
    echo json_encode([
        'success' => false,
        'message' => 'Formato de imagen no permitido. Solo JPG, PNG y GIF'
    ]);
    exit;
}

if ($imagen['size'] > $max_size) {
    echo json_encode([
        'success' => false,
        'message' => 'La imagen no debe superar los 5MB'
    ]);
    exit;
}

// Sanitizar datos
$name = trim($_POST['name']);
$description = trim($_POST['description']);
$category = trim($_POST['category']);
$platform = trim($_POST['plataform']);
$stock = intval($_POST['stock']);
$precio = floatval($_POST['precio']);

// Validar números
if ($stock < 0) {
    echo json_encode([
        'success' => false,
        'message' => 'El stock no puede ser negativo'
    ]);
    exit;
}

if ($precio < 0) {
    echo json_encode([
        'success' => false,
        'message' => 'El precio no puede ser negativo'
    ]);
    exit;
}

// Procesar la imagen
$upload_dir = '../../assets/images/products/';

// Crear directorio si no existe
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

// Generar nombre único para la imagen
$file_extension = pathinfo($imagen['name'], PATHINFO_EXTENSION);
$file_name = preg_replace('/[^a-zA-Z0-9]/', '_', $name) . '_' . time() . '.' . $file_extension;
$file_path = $upload_dir . $file_name;

// Mover imagen al directorio
if (!move_uploaded_file($imagen['tmp_name'], $file_path)) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al guardar la imagen en el servidor'
    ]);
    exit;
}

// Ruta relativa para guardar en la base de datos
$img_db_path = 'assets/images/products/' . $file_name;

try {
    // Insertar en la base de datos
    $stmt = $conn->prepare("INSERT INTO products (name, description, category, plataform, stock, precio, img) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param("ssssids", $name, $description, $category, $platform, $stock, $precio, $img_db_path);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Producto agregado exitosamente',
            'product_id' => $stmt->insert_id
        ]);
    } else {
        // Si falla la inserción, eliminar la imagen subida
        unlink($file_path);
        
        echo json_encode([
            'success' => false,
            'message' => 'Error al guardar el producto en la base de datos'
        ]);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    // Si hay error, eliminar la imagen subida
    if (file_exists($file_path)) {
        unlink($file_path);
    }
    
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]);
}

$conn->close();
?>