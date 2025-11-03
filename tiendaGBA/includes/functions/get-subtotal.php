<?php
session_start();
header('Content-Type: application/json');

$subtotal = isset($_SESSION['subtotal']) ? $_SESSION['subtotal'] : 0;

echo json_encode([
    'success' => true,
    'subtotal' => $subtotal
]);
