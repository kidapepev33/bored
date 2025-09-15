<?php
session_start();
require_once '../../config/server.php';
header('Content-Type: application/json');

if (isset($_SESSION['user_id']) && isset($_SESSION['user_name'])) {
    // Obtener el rol del usuario desde la base de datos
    $userId = $_SESSION['user_id'];
    $sql = "SELECT rol FROM usuarios WHERE id = $userId LIMIT 1";
    $result = $conn->query($sql);
    
    $role = 'client'; // Valor por defecto
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $role = $row['rol'];
    }
    
    echo json_encode([
        'isLoggedIn' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'email' => $_SESSION['user_email'] ?? '',
            'role' => $role
        ]
    ]);
} else {
    echo json_encode([
        'isLoggedIn' => false
    ]);
}
?>
