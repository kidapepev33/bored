<?php
session_start();
require_once 'server.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$email = $conn->real_escape_string($input['email'] ?? '');
$password = $input['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Campos incompletos']);
    exit;
}

$sql = "SELECT * FROM usuarios WHERE email='$email' LIMIT 1";
$result = $conn->query($sql);

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        $_SESSION['user_id'] = $row['id'];
        $_SESSION['user_name'] = $row['name'];
        $_SESSION['user_email'] = $row['email'];
        echo json_encode(['success' => true]);
        exit;
    } else {
        echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
        exit;
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
    exit;
}
?>