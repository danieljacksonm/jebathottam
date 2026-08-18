<?php
require_once 'auth_helper.php';
startAppSession();

$hashedClient = $_POST['password'] ?? '';
$config = require __DIR__ . '/sections_config.php';

if ($hashedClient === '') {
    $_SESSION['error'] = 'Please enter password.';
    header('Location: index.php');
    exit;
}

foreach ($config as $key => $section) {
    $expected = hash('sha256', $section['password']);
    if (hash_equals($expected, $hashedClient)) {
        $_SESSION['section'] = $key;
        unset($_SESSION['error']);
        header('Location: ' . $section['redirect']);
        exit;
    }
}

$_SESSION['error'] = 'Wrong password.';
header('Location: index.php');
exit;
