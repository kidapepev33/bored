<?php
require_once '../../config/server.php';
session_start();
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$remember = $input['remember'] ?? false;

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Campos incompletos']);
    exit;
}

$stmt = $conn->prepare("SELECT id, name, email, password FROM usuarios WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        
        // Remember me simple con cookies
        if ($remember) {
            setcookie('remember_user', $user['id'], time() + (30 * 24 * 60 * 60), '/');
            setcookie('remember_email', $user['email'], time() + (30 * 24 * 60 * 60), '/');
        }
        
        echo json_encode(['success' => true]);
        exit;
    }
}

// Si no hay sesión, redirige al login
echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);