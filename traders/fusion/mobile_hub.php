<?php
require_once 'auth_helper.php';
requireSection('mobile');
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Mobile Billing Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>

<body class="container mt-5">
    <div class="card p-4 shadow-sm">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <h2 class="mb-0">📱 Mobile Billing Dashboard</h2>
            <a href="logout.php" class="btn btn-outline-danger btn-sm">Logout</a>
        </div>
        <p class="text-muted">Yegova Mobiles billing — same products, mobile invoice format.</p>
        <div class="d-flex flex-wrap gap-3">
            <a href="mobile_billing.php" class="btn btn-success btn-lg">🧾 Mobile Billing</a>
            <a href="mobile_bills.php" class="btn btn-secondary btn-lg">📋 Mobile Bills</a>
        </div>
    </div>
</body>

</html>
