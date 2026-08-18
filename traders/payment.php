<?php
include 'config.php';
require_once 'auth_helper.php';
requireSection('gst');

if (!isset($_GET['id'])) {
    die("Bill ID not provided.");
}

$billId = (int) $_GET['id'];

// Fetch bill
$result = $conn->query("SELECT * FROM bills WHERE id = $billId");
$bill = $result->fetch_assoc();

if (!$bill) {
    die("Bill not found.");
}

$total   = (float) $bill['total'];
$paid    = (float) $bill['paid_amount'];
$balance = $total - $paid;

// Handle partial or full payment
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['mark_full'])) {
        // Mark as fully paid
        $paid = $total;
    } else {
        // Add partial payment
        $newPayment = floatval($_POST['new_payment']);
        $paid += $newPayment;

        if ($paid > $total) {
            $paid = $total; // prevent overpayment
        }
    }

    $conn->query("UPDATE bills SET paid_amount = $paid WHERE id = $billId");
    header("Location: gst_bills.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Update Payment - Bill #<?= $bill['id'] ?></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <style>
        body { background-color: #f4f6f9; }
        .card { border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
        h3 { font-weight: 700; }
        .progress { height: 25px; border-radius: 30px; }
        .amount-box { padding: 15px; border-radius: 10px; font-weight: bold; text-align: center; }
        .amount-paid { background: #e0f7e9; color: #007b33; }
        .amount-balance { background: #fff4e0; color: #b35a00; }
    </style>
</head>
<body class="container mt-5">
    <div class="card p-4">
        <h3>💰 Payment for Bill #<?= $bill['id'] ?></h3>
        <hr>
        <p><strong>Customer:</strong> <?= htmlspecialchars($bill['billname']) ?></p>
        <p><strong>Total Amount:</strong> ₹<?= number_format($total, 2) ?></p>

        <!-- Payment Progress -->
        <div class="progress mb-3">
            <div class="progress-bar <?= $paid >= $total ? 'bg-success' : 'bg-warning' ?>"
                 role="progressbar"
                 style="width: <?= ($paid/$total)*100 ?>%">
                <?= number_format(($paid/$total)*100, 1) ?>%
            </div>
        </div>

        <!-- Paid & Balance Display -->
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="amount-box amount-paid">
                    ✅ Paid: ₹<?= number_format($paid, 2) ?>
                </div>
            </div>
            <div class="col-md-6">
                <div class="amount-box amount-balance">
                    💡 Balance: ₹<?= number_format($balance, 2) ?>
                </div>
            </div>
        </div>

        <!-- Payment Form -->
        <form method="post" class="mb-3">
            <div class="mb-3">
                <label for="new_payment" class="form-label">Enter Partial Payment</label>
                <input type="number" step="0.01" min="0" max="<?= $balance ?>"
                       class="form-control form-control-lg"
                       name="new_payment" id="new_payment"
                       placeholder="Enter amount (₹)" <?= $balance <= 0 ? 'disabled' : '' ?>>
            </div>

            <?php if ($balance > 0): ?>
                <button type="submit" class="btn btn-success btn-lg">➕ Add Payment</button>
                <button type="submit" name="mark_full" class="btn btn-primary btn-lg"
                        onclick="return confirm('Mark this bill as fully paid?')">
                    ✅ Mark as Fully Paid
                </button>
            <?php else: ?>
                <div class="alert alert-success">🎉 This bill is already fully paid!</div>
            <?php endif; ?>

            <a href="<?php
                $s = currentSection();
                if ($s === 'gst') echo 'gst_bills.php';
                elseif ($s === 'mobile') echo 'mobile_sales_list.php';
                elseif ($s === 'rent') echo 'rent_dashboard.php';
                else echo 'bills.php';
            ?>" class="btn btn-secondary btn-lg">⬅️ Back</a>
        </form>
    </div>
</body>
</html>
