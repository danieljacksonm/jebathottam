<?php
include 'config_gst.php';
session_start();

if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit;
}
// Fetch GST stock history with product info
$sql = "SELECT sh.*, p.name as product_name, p.unit
        FROM gst_stock_history sh
        JOIN gst_products p ON sh.product_id = p.id
        ORDER BY sh.created_at DESC";
$result = $conn->query($sql);

// Calculate total IN and OUT
$total_in  = $conn->query("SELECT SUM(change_qty) as qty FROM gst_stock_history WHERE change_type='IN'")
    ->fetch_assoc()['qty'] ?? 0;

$total_out = $conn->query("SELECT SUM(change_qty) as qty FROM gst_stock_history WHERE change_type='OUT'")
    ->fetch_assoc()['qty'] ?? 0;
?>
<!DOCTYPE html>
<html>

<head>
    <title>GST Stock History</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/app.css">
    <style>
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
            <h2 class="mb-0">📜 GST Stock History</h2>
            <a href="dashboard_gst.php" class="btn btn-success btn-sm">⬅ Back</a>
        </div>

    <!-- Summary -->
    <div class="row g-3 mb-4">
        <div class="col-md-4">
            <div class="card text-bg-success border-0 shadow-sm" style="border-radius: 12px;">
                <div class="card-body">
                    <h5>Total Stock IN</h5>
                    <h3><?= (int)$total_in ?></h3>
                </div>
            </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card text-bg-danger border-0 shadow-sm" style="border-radius: 12px;">
                <div class="card-body">
                    <h5>Total Stock OUT</h5>
                    <h3><?= (int)$total_out ?></h3>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card text-bg-primary border-0 shadow-sm" style="border-radius: 12px;">
                <div class="card-body">
                    <h5>Current Stock Balance</h5>
                    <h3><?= (int)($total_in - $total_out) ?></h3>
                </div>
            </div>
        </div>
    </div>

    <!-- Table -->
    <table class="table table-bordered table-hover">
        <thead>
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
    </div>

</body>

</html>
