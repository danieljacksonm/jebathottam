<?php
session_start();
include "config.php";

$email = $_POST['email'];
$hashedClient = $_POST['password']; // already SHA256 from client

// Get user record safely
$sql = "SELECT id, password FROM users WHERE email = '" . $conn->real_escape_string($email) . "' LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc(); // convert result to associative array

    // The server stored hash was made using password_hash(SHA256(password))
    if (password_verify($hashedClient, $user['password'])) {
        $_SESSION['user'] = $user['id'];
        header("Location: index.php");
        exit;
    }
}

// Invalid login
$_SESSION['error'] = "Invalid Email or Password";
header("Location: index.php");
exit;
?>
