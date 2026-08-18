<?php
include 'config_mobile.php';
require_once 'auth_helper.php';
requireSection('mobile');

// Fetch mobile sales bills
$result = $conn->query("SELECT id, customer_name, customer_phone, total, paid_amount, bill_date, pdf_file
                        FROM mobile_sales_bills
                        ORDER BY id DESC");

if (!$result) {
    die("Error fetching sales: " . $conn->error);
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Mobile Sales List</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/app.css">
    <style>
        body { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); min-height: 100vh; }
        .card { border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border: none; }
        .card-header-style { border-bottom: 2px solid #00f2fe; padding-bottom: 1rem; }
        .card-body { padding: 2rem; }
        .table-responsive { margin-top: 1rem; border-radius: 12px; overflow: hidden; }
        .btn { margin: 0.25rem; border-radius: 8px; font-weight: 600; transition: all 0.3s; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .table thead th { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; }
        .table tbody tr:hover { background-color: #f0f8ff; }
        .table td { vertical-align: middle; }
        .balance-positive { color: #dc3545; font-weight: 600; }
        .balance-zero { color: #28a745; font-weight: 600; }
        .stats-card { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .stat-item { text-align: center; }
        .stat-value { font-size: 1.5rem; font-weight: 700; color: #4facfe; }
        .stat-label { color: #6c757d; font-size: 0.9rem; }
    </style>
</head>
<body class="container py-4">
    <div class="card p-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center card-header-style gap-2">
            <h2 class="mb-0">🧾 Mobile Sales List</h2>
            <div class="d-flex gap-2">
                <a href="mobile_billing.php" class="btn btn-success">➕ New Sale</a>
                <a href="dashboard_mobile.php" class="btn btn-secondary">⬅ Back to Dashboard</a>
            </div>
        </div>

        <?php
        $totalSales = 0;
        $totalPaid = 0;
        $totalBalance = 0;
        $result->data_seek(0);
        while ($row = $result->fetch_assoc()) {
            $totalSales += $row['total'];
            $totalPaid += $row['paid_amount'];
            $totalBalance += ($row['total'] - $row['paid_amount']);
        }
        $result->data_seek(0);
        ?>

        <div class="stats-card">
            <div class="row">
                <div class="col-12 col-md-4 stat-item">
                    <div class="stat-value">₹<?= number_format($totalSales, 2) ?></div>
                    <div class="stat-label">Total Sales</div>
                </div>
                <div class="col-12 col-md-4 stat-item">
                    <div class="stat-value">₹<?= number_format($totalPaid, 2) ?></div>
                    <div class="stat-label">Total Paid</div>
                </div>
                <div class="col-12 col-md-4 stat-item">
                    <div class="stat-value <?= $totalBalance > 0 ? 'text-danger' : 'text-success' ?>">₹<?= number_format($totalBalance, 2) ?></div>
                    <div class="stat-label">Total Balance</div>
                </div>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Bill No</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Total</th>
                        <th>Paid</th>
                        <th>Balance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($result->num_rows > 0): ?>
                        <?php while ($row = $result->fetch_assoc()): ?>
                            <?php
                            $balance = $row['total'] - $row['paid_amount'];
                            $balanceClass = $balance > 0 ? 'balance-positive' : 'balance-zero';
                            ?>
                            <tr>
                                <td><span class="badge bg-primary">#<?= $row['id'] ?></span></td>
                                <td><?= date('d-m-Y h:i A', strtotime($row['bill_date'])) ?></td>
                                <td><strong><?= htmlspecialchars($row['customer_name']) ?></strong></td>
                                <td><?= htmlspecialchars($row['customer_phone']) ?></td>
                                <td>₹<?= number_format($row['total'], 2) ?></td>
                                <td>₹<?= number_format($row['paid_amount'], 2) ?></td>
                                <td class="<?= $balanceClass ?>">₹<?= number_format($balance, 2) ?></td>
                                <td>
                                    <a href="print_mobile_bill.php?bill_id=<?= $row['id'] ?>" class="btn btn-sm btn-primary" target="_blank">🖨 Print</a>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="8" class="text-center text-muted py-4">
                                <div class="fs-5">📭 No sales found</div>
                                <small>Create a sale to get started</small>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
