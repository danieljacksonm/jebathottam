<?php include 'config_gst.php';
session_start();

if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit;
} 

$message = "";

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    foreach ($_POST['stock'] as $id => $addStock) {
        $addStock = (float)$addStock;
        $addFreeStock = (float)($_POST['free_stock'][$id] ?? 0);

        if ($addStock != 0 || $addFreeStock != 0) {
            // Update main stock and free stock
            $conn->query("
                UPDATE gst_products 
                SET 
                    stock = stock + $addStock,
                    free_stock = free_stock + $addFreeStock
                WHERE id = $id
            ");

            // Insert record in gst_stock_history
            $changeType = $addStock >= 0 ? 'IN' : 'OUT';
            $note = 'GST Stock update page';
            $conn->query("
                INSERT INTO gst_stock_history (product_id, change_type, change_qty, new_stock, reference_id, reference_type, created_at, note)
                SELECT id, '$changeType', $addStock, stock, id, 'stock_update_gst', NOW(), '$note'
                FROM gst_products WHERE id = $id
            ");
        }
    }

    // Redirect to avoid resubmission on refresh
    header("Location: stock_update_gst.php?success=1");
    exit;
}

// Show success message
if (isset($_GET['success'])) {
    $message = "<div class='alert alert-success'>✅ GST Stock updated successfully!</div>";
}

// Fetch all GST products
$products = $conn->query("SELECT id, name, stock, free_stock, unit FROM gst_products ORDER BY name ASC");
?>
<!DOCTYPE html>
<html>
<head>
    <title>GST Stock Update</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/app.css">
    <style>
        input[type='number'] { width: 100px; border-radius: 10px; }
        .card-body { padding: 1.5rem; }
        .card { margin-bottom: 1rem; }
        .form-control { margin-bottom: 0.5rem; }
        .table-responsive { margin-top: 1rem; }
        .btn { margin: 0.25rem; }
        .row { margin-bottom: 0.5rem; }
        .alert { margin-bottom: 1rem; }
    </style>
</head>
<body class="container py-4">
    <div class="card p-4">
        <div class="d-flex justify-content-between align-items-center card-header-style">
            <h2 class="mb-0">📦 GST Stock Update</h2>
            <a href="dashboard_gst.php" class="btn btn-success btn-sm">⬅ Back</a>
        </div>
        <?= $message ?>

        <form method="POST" action="">
            <table class="table table-bordered table-hover">
                <thead>
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
            <button type="submit" class="btn btn-primary mt-3">Update GST Stock</button>
            <a href="dashboard_gst.php" class="btn btn-secondary mt-3">Back</a>
        </form>
    </div>
</body>
</html>
