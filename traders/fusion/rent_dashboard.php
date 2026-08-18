<?php
include 'config.php';
require_once 'auth_helper.php';
requireSection('rent');

$conn->query("CREATE TABLE IF NOT EXISTS home_rent_receipts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_name VARCHAR(200) NOT NULL,
    rent_month VARCHAR(30) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paid_date DATE NOT NULL,
    payment_mode VARCHAR(50) DEFAULT 'Cash',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tenant = $conn->real_escape_string($_POST['tenant_name']);
    $month = $conn->real_escape_string($_POST['rent_month']);
    $amount = floatval($_POST['amount']);
    $paid = $conn->real_escape_string($_POST['paid_date']);
    $mode = $conn->real_escape_string($_POST['payment_mode']);
    $notes = $conn->real_escape_string($_POST['notes'] ?? '');

    if ($conn->query("INSERT INTO home_rent_receipts (tenant_name, rent_month, amount, paid_date, payment_mode, notes)
        VALUES ('$tenant', '$month', $amount, '$paid', '$mode', '$notes')")) {
        $newId = $conn->insert_id;
        header('Location: print_rent_receipt.php?id=' . $newId);
        exit;
    }
    $message = 'Could not save receipt.';
}

$receipts = $conn->query("SELECT * FROM home_rent_receipts ORDER BY paid_date DESC, id DESC");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Home Rent Receipts</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <style>
        body { background: #f8f5f0; }
        .card { border-radius: 14px; border: none; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .header-bar { background: linear-gradient(135deg, #5d4037, #8d6e63); color: #fff; border-radius: 14px 14px 0 0; padding: 1.25rem; }
    </style>
</head>

<body class="container py-4">
    <div class="card overflow-hidden">
        <div class="header-bar d-flex flex-wrap justify-content-between align-items-center">
            <h2 class="h4 mb-0">🏠 Home Rent Receipts</h2>
            <a href="logout.php" class="btn btn-light btn-sm">Logout</a>
        </div>
        <div class="card-body p-4">
            <?php if ($message): ?>
                <div class="alert alert-danger"><?= htmlspecialchars($message) ?></div>
            <?php endif; ?>

            <form method="post" class="row g-3 mb-4">
                <div class="col-md-4">
                    <label class="form-label">Tenant / Paid By</label>
                    <input type="text" name="tenant_name" class="form-control" required placeholder="Name">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Rent Month</label>
                    <input type="month" name="rent_month" class="form-control" required>
                </div>
                <div class="col-md-2">
                    <label class="form-label">Amount (₹)</label>
                    <input type="number" name="amount" class="form-control" step="0.01" min="0" required>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Paid Date</label>
                    <input type="date" name="paid_date" class="form-control" value="<?= date('Y-m-d') ?>" required>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Payment Mode</label>
                    <select name="payment_mode" class="form-select">
                        <option>Cash</option>
                        <option>UPI</option>
                        <option>Bank Transfer</option>
                        <option>Cheque</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Notes (optional)</label>
                    <input type="text" name="notes" class="form-control" placeholder="Any note">
                </div>
                <div class="col-md-3 d-flex align-items-end">
                    <button type="submit" class="btn btn-success w-100">Save & Print Receipt</button>
                </div>
            </form>

            <h5 class="mb-3">Past Receipts</h5>
            <div class="table-responsive">
                <table class="table table-bordered table-sm">
                    <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Tenant</th>
                            <th>Month</th>
                            <th>Amount</th>
                            <th>Paid Date</th>
                            <th>Mode</th>
                            <th>Print</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($receipts && $receipts->num_rows > 0): ?>
                            <?php while ($r = $receipts->fetch_assoc()): ?>
                                <tr>
                                    <td><?= $r['id'] ?></td>
                                    <td><?= htmlspecialchars($r['tenant_name']) ?></td>
                                    <td><?= htmlspecialchars($r['rent_month']) ?></td>
                                    <td>₹<?= number_format($r['amount'], 2) ?></td>
                                    <td><?= date('d-m-Y', strtotime($r['paid_date'])) ?></td>
                                    <td><?= htmlspecialchars($r['payment_mode']) ?></td>
                                    <td><a href="print_rent_receipt.php?id=<?= $r['id'] ?>" target="_blank" class="btn btn-sm btn-primary">🖨 Print</a></td>
                                </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr><td colspan="7" class="text-center text-muted">No receipts yet</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>

</html>
