<?php
require_once '../../config/server.php';
session_start();
header('Content-Type: application/json');

// Si no hay sesión, verificar remember me
if (!isset($_SESSION['user_id']) && isset($_COOKIE['remember_user']) && isset($_COOKIE['remember_email'])) {
    $userId = $_COOKIE['remember_user'];
    $email = $_COOKIE['remember_email'];
    
    $stmt = $conn->prepare("SELECT id, name, email, rol FROM usuarios WHERE id = ? AND email = ? LIMIT 1");
    $stmt->bind_param("is", $userId, $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($user = $result->fetch_assoc()) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
    }
}

if (isset($_SESSION['user_id'])) {
    $stmt = $conn->prepare("SELECT id, name, email, rol FROM usuarios WHERE id = ? LIMIT 1");
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($user = $result->fetch_assoc()) {
        echo json_encode([
            'isLoggedIn' => true,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['rol']
            ]
        ]);
    } else {
        session_destroy();
        echo json_encode(['isLoggedIn' => false]);
    }
} else {
    echo json_encode(['isLoggedIn' => false]);
}
?>
