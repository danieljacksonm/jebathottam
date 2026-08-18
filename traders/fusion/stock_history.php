<?php
include 'config.php';
require_once 'auth_helper.php';
requireSection('billing');
// Fetch stock history with product info
$sql = "SELECT sh.*, p.name as product_name, p.unit
        FROM stock_history sh
        JOIN products p ON sh.product_id = p.id
        ORDER BY sh.created_at DESC";
$result = $conn->query($sql);

// Calculate total IN and OUT
$total_in  = $conn->query("SELECT SUM(change_qty) as qty FROM stock_history WHERE change_type='IN'")
    ->fetch_assoc()['qty'] ?? 0;

$total_out = $conn->query("SELECT SUM(change_qty) as qty FROM stock_history WHERE change_type='OUT'")
    ->fetch_assoc()['qty'] ?? 0;
?>
<!DOCTYPE html>
<html>

<head>
    <title>Stock History</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>

<body class="container mt-4">

    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>📦 Stock History</h2>
        <a href="dashboard.php" class="btn btn-success">⬅ Back</a>
    </div>

    <!-- Summary -->
    <div class="row mb-4">
        <div class="col-md-4">
            <div class="card text-bg-success shadow-sm">
                <div class="card-body">
                    <h5>Total Stock IN</h5>
                    <h3><?= (int)$total_in ?></h3>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card text-bg-danger shadow-sm">
                <div class="card-body">
                    <h5>Total Stock OUT</h5>
                    <h3><?= (int)$total_out ?></h3>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card text-bg-primary shadow-sm">
                <div class="card-body">
                    <h5>Current Stock Balance</h5>
                    <h3><?= (int)($total_in - $total_out) ?></h3>
                </div>
            </div>
        </div>
    </div>

    <!-- Table -->
    <table class="table table-bordered table-hover shadow-sm">
        <thead class="table-dark">
            <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Change</th>
                <th>Old Stock</th>
                <th>New Stock</th>
                <th>Reference</th>
                <th>Ref. ID</th>
            </tr>
        </thead>
        <tbody>
            <?php while ($row = $result->fetch_assoc()): ?>
                <tr class="<?= $row['change_type'] == 'IN' ? 'table-success' : 'table-danger' ?>">
                    <td><?= date("d-m-Y h:i A", strtotime($row['created_at'])) ?></td>
                    <td><?= htmlspecialchars($row['product_name']) ?> (<?= $row['unit'] ?>)</td>
                    <td>
                        <?= $row['change_type'] == 'IN' ? '+' : '-' ?>
                        <?= $row['change_qty'] ?>
                    </td>
                    <td><?= $row['old_stock'] ?></td>
                    <td><?= $row['new_stock'] ?></td>
                    <td><?= ucfirst($row['reference_type'] ?? '-') ?></td>
                    <td><?= $row['reference_id'] ?? '-' ?></td>
                </tr>
            <?php endwhile; ?>
        </tbody>
    </table>

</body>

</html>