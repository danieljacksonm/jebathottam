<?php
include 'config.php';
require_once 'auth_helper.php';
requireSection('billing');

$message = "";

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    foreach ($_POST['stock'] as $id => $addStock) {
        $addStock = (float)$addStock;
        $addFreeStock = (float)($_POST['free_stock'][$id] ?? 0);

        if ($addStock != 0 || $addFreeStock != 0) {
            // Update main stock and free stock
            $conn->query("
                UPDATE products 
                SET 
                    stock = stock + $addStock,
                    free_stock = free_stock + $addFreeStock
                WHERE id = $id
            ");

            // Insert record in stock_history
            $changeType = $addStock >= 0 ? 'IN' : 'OUT';
            $note = 'Stock update page';
            $conn->query("
                INSERT INTO stock_history (product_id, change_type, change_qty, new_stock, reference_id, reference_type, created_at, note)
                SELECT id, '$changeType', $addStock, stock, id, 'stock_update', NOW(), '$note'
                FROM products WHERE id = $id
            ");
        }
    }

    // Redirect to avoid resubmission on refresh
    header("Location: stock_update.php?success=1");
    exit;
}

// Show success message
if (isset($_GET['success'])) {
    $message = "<div class='alert alert-success'>✅ Stock updated successfully!</div>";
}

// Fetch all products
$products = $conn->query("SELECT id, name, stock, free_stock, unit FROM products ORDER BY name ASC");
?>
<!DOCTYPE html>
<html>
<head>
    <title>Stock Update</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; }
        .card { border-radius: 10px; box-shadow: 0 3px 6px rgba(0,0,0,0.1); }
        h2 { font-weight: 600; color: #333; }
        input[type='number'] { width: 100px; }
        table th, table td { vertical-align: middle; }
    </style>
</head>
<body class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>📦 Stock Update</h2>
        <a href="dashboard.php" class="btn btn-success">⬅ Back</a>
    </div>
    <div class="card p-4">
        <?= $message ?>

        <form method="POST" action="">
            <table class="table table-bordered table-striped">
                <thead class="table-dark">
                    <tr>
                        <th>Product Name</th>
                        <th>Current Stock</th>
                        <th>Add Stock</th>
                        <th>Free Stock</th>
                        <th>Unit</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while ($row = $products->fetch_assoc()): ?>
                        <tr>
                            <td><?= htmlspecialchars($row['name']) ?></td>
                            <td><?= $row['stock'] ?></td>
                            <td><input type="number" name="stock[<?= $row['id'] ?>]" step="1" class="form-control"></td>
                            <td><input type="number" name="free_stock[<?= $row['id'] ?>]" step="1" class="form-control"></td>
                            <td><?= htmlspecialchars($row['unit']) ?></td>
                        </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
            <button type="submit" class="btn btn-primary mt-3">Update Stock</button>
            <a href="dashboard.php" class="btn btn-secondary mt-3">Back</a>
        </form>
    </div>
</body>
</html>
