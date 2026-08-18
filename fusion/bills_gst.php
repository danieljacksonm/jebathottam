<?php
include 'config_gst.php';
session_start();

if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit;
}
// Fetch GST bills
$result = $conn->query("SELECT id, paid_amount, billname, address, phone, total, bill_date, pdf_file, 
                        subtotal, cgst_total, sgst_total, cess_total, gst_percentage 
                        FROM gst_bills 
                        ORDER BY id DESC");

if (isset($_REQUEST['action']) && $_REQUEST['action'] == "delete" && !empty($_REQUEST["id"])) {
    $billId = (int) $_REQUEST["id"];

    $conn->begin_transaction();
    try {
        // Update product quantities: restore stock and free_stock for each bill item before deleting the bill
        $result1 = $conn->query("SELECT product_id, quantity, free FROM gst_bill_items WHERE bill_id = $billId");
        if (!$result1) {
            throw new Exception('Could not load bill items');
        }
        while ($row = $result1->fetch_assoc()) {
            $pid  = (int) $row['product_id'];
            $qty  = max(0, (int)($row['quantity'] ?? 0));
            $free = max(0, (int)($row['free'] ?? 0));
            if ($pid <= 0) {
                continue;
            }

            if (!$conn->query("UPDATE gst_products SET stock = stock + $qty, free_stock = free_stock + $free WHERE id = $pid")) {
                throw new Exception('Stock restore failed');
            }

            $res = $conn->query("SELECT stock, free_stock FROM gst_products WHERE id = $pid");
            $prod = $res ? $res->fetch_assoc() : null;
            $new_stock = $prod ? (int)$prod['stock'] : $qty;
            $new_free_stock = $prod ? (int)$prod['free_stock'] : $free;

            if ($qty > 0) {
                $conn->query("INSERT INTO gst_stock_history 
                    (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at) 
                    VALUES ($pid, " . ($new_stock - $qty) . ", $new_stock, $qty, 'IN', 'bill_delete', $billId, NOW())");
            }
            if ($free > 0) {
                $conn->query("INSERT INTO gst_stock_history 
                    (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at) 
                    VALUES ($pid, " . ($new_free_stock - $free) . ", $new_free_stock, $free, 'IN', 'bill_delete_free', $billId, NOW())");
            }
        }

        // Delete bill items first
        if (!$conn->query("DELETE FROM gst_bill_items WHERE bill_id = $billId")) {
            throw new Exception('Failed to delete bill items');
        }

        // Delete the bill
        if (!$conn->query("DELETE FROM gst_bills WHERE id = $billId")) {
            throw new Exception('Failed to delete bill');
        }

        $conn->commit();
        header("Location: bills_gst.php?success=Bill deleted successfully");
        exit;
    } catch (Exception $e) {
        $conn->rollback();
        header("Location: bills_gst.php?error=" . urlencode($e->getMessage()));
        exit;
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>GST Bills</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/app.css">
    <style>
        body { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); min-height: 100vh; }
        .card { border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border: none; }
        .card-header-style { border-bottom: 2px solid #11998e; padding-bottom: 1rem; }
        .card-body { padding: 2rem; }
        .table-responsive { margin-top: 1rem; border-radius: 12px; overflow: hidden; }
        .btn { margin: 0.25rem; border-radius: 8px; font-weight: 600; transition: all 0.3s; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .table th, .table td { white-space: nowrap; vertical-align: middle; }
        .table thead th { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; border: none; }
        .table tbody tr:hover { background-color: #e8f5e9; }
        .table tfoot th { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; }
        .alert { border-radius: 12px; }
        .gst-summary { font-size: 0.85em; }
        .gst-badge { background: #28a745; color: white; padding: 2px 6px; border-radius: 3px; font-size: 0.75em; }
    </style>
</head>
<body class="container py-4">
    <div class="card p-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center card-header-style gap-2">
            <h2 class="mb-0">🧾 GST Bills List</h2>
            <div class="d-flex gap-2">
                <a href="billing_gst.php" class="btn btn-success">➕ New GST Bill</a>
                <a href="dashboard_gst.php" class="btn btn-secondary">⬅ Back to Dashboard</a>
            </div>
        </div>

        <?php
        // Get stats
        $totalBills = $conn->query("SELECT COUNT(*) as count FROM gst_bills")->fetch_assoc()['count'];
        $totalSales = $conn->query("SELECT SUM(total) as total FROM gst_bills")->fetch_assoc()['total'] ?? 0;
        $totalGST = $conn->query("SELECT SUM(cgst_total + sgst_total + cess_total) as total FROM gst_bills")->fetch_assoc()['total'] ?? 0;
        $paidBills = $conn->query("SELECT COUNT(*) as count FROM gst_bills WHERE paid_amount >= total")->fetch_assoc()['count'];
        ?>

        <div class="row mb-4">
            <div class="col-12 col-md-3">
                <div class="card p-3 text-center" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; border: none;">
                    <div class="fs-3 fw-bold"><?= $totalBills ?></div>
                    <div class="small">Total GST Bills</div>
                </div>
            </div>
            <div class="col-12 col-md-3">
                <div class="card p-3 text-center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
                    <div class="fs-3 fw-bold">₹<?= number_format($totalSales, 2) ?></div>
                    <div class="small">Total Sales</div>
                </div>
            </div>
            <div class="col-12 col-md-3">
                <div class="card p-3 text-center" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none;">
                    <div class="fs-3 fw-bold">₹<?= number_format($totalGST, 2) ?></div>
                    <div class="small">Total GST Collected</div>
                </div>
            </div>
            <div class="col-12 col-md-3">
                <div class="card p-3 text-center" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; border: none;">
                    <div class="fs-3 fw-bold"><?= $paidBills ?></div>
                    <div class="small">Paid Bills</div>
                </div>
            </div>
        </div>

        <?php if (isset($_GET['success'])): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <?= htmlspecialchars($_GET['success']) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <?php if (isset($_GET['error'])): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <?= htmlspecialchars($_GET['error']) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <div class="table-responsive">
            <table class="table table-bordered mt-3">
                <thead class="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Bill Name</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Date</th>
                        <th>Subtotal</th>
                        <th>GST</th>
                        <th>Total</th>
                        <th>Paid</th>
                        <th>Balance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    $totalSubtotal = 0;
                    $totalGST = 0;
                    $totalAmount = 0;
                    $totalPaid = 0;
                    
                    while ($row = $result->fetch_assoc()): 
                        $totalSubtotal += $row['subtotal'];
                        $totalGST += ($row['cgst_total'] + $row['sgst_total'] + $row['cess_total']);
                        $totalAmount += $row['total'];
                        $totalPaid += $row['paid_amount'];
                        $balance = $row['total'] - $row['paid_amount'];
                    ?>
                    <tr>
                        <td><?= $row['id'] ?></td>
                        <td>
                            <?= htmlspecialchars($row['billname']) ?>
                            <span class="gst-badge">GST</span>
                        </td>
                        <td><?= htmlspecialchars($row['address']) ?></td>
                        <td><?= htmlspecialchars($row['phone']) ?></td>
                        <td><?= date('d/m/Y h:i A', strtotime($row['bill_date'])) ?></td>
                        <td>₹<?= number_format($row['subtotal'], 2) ?></td>
                        <td class="gst-summary">
                            CGST: ₹<?= number_format($row['cgst_total'], 2) ?><br>
                            SGST: ₹<?= number_format($row['sgst_total'], 2) ?><br>
                            CESS: ₹<?= number_format($row['cess_total'], 2) ?>
                        </td>
                        <td><strong>₹<?= number_format($row['total'], 2) ?></strong></td>
                        <td>₹<?= number_format($row['paid_amount'], 2) ?></td>
                        <td class="<?= $balance > 0 ? 'text-danger' : 'text-success' ?>">
                            ₹<?= number_format($balance, 2) ?>
                        </td>
                        <td class="text-center d-flex flex-wrap justify-content-center gap-1">
                            <?php $bid = (int)$row['id']; $has_phone = !empty(trim($row['phone'] ?? '')); ?>
                            <?php if ($has_phone): ?>
                            <button type="button" class="btn btn-sm btn-success btn-wa-send-gst" title="Send GST bill PDF to customer on WhatsApp" data-bill-id="<?= $bid ?>">📱 WhatsApp</button>
                            <?php else: ?>
                            <span class="btn btn-sm btn-secondary" style="opacity:0.6;cursor:not-allowed;" title="No phone number">📱 WhatsApp</span>
                            <?php endif; ?>
                            <a href="print_bill_gst.php?bill_id=<?= $row['id'] ?>" target="_blank" class="btn btn-sm btn-primary">🖨 Print</a>
                            <a href="billing_gst.php?action=edit&id=<?= $row['id'] ?>" class="btn btn-sm btn-warning">✏️ Edit</a>
                            <a href="bills_gst.php?action=delete&id=<?= $row['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete GST Bill #<?= $row['id'] ?>?')">🗑 Delete</a>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
                <tfoot class="table-primary">
                    <tr>
                        <th colspan="5">TOTALS</th>
                        <th>₹<?= number_format($totalSubtotal, 2) ?></th>
                        <th>₹<?= number_format($totalGST, 2) ?></th>
                        <th>₹<?= number_format($totalAmount, 2) ?></th>
                        <th>₹<?= number_format($totalPaid, 2) ?></th>
                        <th>₹<?= number_format($totalAmount - $totalPaid, 2) ?></th>
                        <th></th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>

    <script>
        // WhatsApp send functionality for GST bills
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.btn-wa-send-gst').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-bill-id');
                    if (!id) return;
                    this.disabled = true;
                    this.textContent = "Sending…";
                    fetch("send_bill_whatsapp_gst.php?bill_id=" + id)
                        .then(function(r) { return r.json(); })
                        .then(function(data) {
                            if (data.ok) {
                                alert("GST Bill sent to customer on WhatsApp.");
                            } else {
                                alert("Error: " + (data.error || "Could not send."));
                            }
                        })
                        .catch(function() { alert("Network error."); })
                        .finally(function() {
                            btn.disabled = false;
                            btn.textContent = "📱 WhatsApp";
                        });
                });
            });
        });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
