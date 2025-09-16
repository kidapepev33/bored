<?php
require_once '../../config/server.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

$userId = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT id, name, lastname, email, phone, gender, rol FROM usuarios WHERE id = ? LIMIT 1");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'lastname' => $user['lastname'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'gender' => $user['gender'],
            'rol' => $user['rol']
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
}
?>