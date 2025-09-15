<?php
require_once 'server.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$name = $conn->real_escape_string($input['name'] ?? '');
$email = $conn->real_escape_string($input['email'] ?? '');
$password = $input['password'] ?? '';
$confirm_password = $input['confirm_password'] ?? '';
$rol = $conn->real_escape_string($input['rol'] ?? 'client'); // <-- aquí

if (!$name || !$email || !$password || !$confirm_password) {
    echo json_encode(['success' => false, 'message' => 'Campos incompletos']);
    exit;
}
if ($password !== $confirm_password) {
    echo json_encode(['success' => false, 'message' => 'Las contraseñas no coinciden']);
    exit;
}

$sql = "SELECT id FROM usuarios WHERE email='$email' LIMIT 1";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'El email ya está registrado']);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$sql = "INSERT INTO usuarios (name, email, password, rol) VALUES ('$name', '$email', '$hash', '$rol')";
if ($conn->query($sql)) {
    echo json_encode(['success' => true, 'message' => '¡Registro exitoso!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al registrar']);
}
?>