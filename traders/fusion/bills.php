<?php
include 'config.php';
require_once 'auth_helper.php';
requireBillingAccess();
ensureBillsCreatedByColumn($conn);

$isRep = isBrandRep();

$billsRows = [];
$result = $conn->query("SELECT id, paid_amount, billname, address, phone, total, bill_date, pdf_file 
                        FROM bills 
                        WHERE 1=1" . billsCreatedBySql() . "
                        ORDER BY id DESC
                        LIMIT 500");
if ($result) {
    while ($r = $result->fetch_assoc()) {
        $billsRows[] = $r;
    }
}

if (isset($_REQUEST['action']) && $_REQUEST['action'] == "delete" && !empty($_REQUEST["id"])) {
    $billId = (int) $_REQUEST["id"];
    assertRepOwnsBill($conn, $billId);

    $conn->begin_transaction();
    try {
        // Update product quantities: restore stock and free_stock for each bill item before deleting the bill
        $result1 = $conn->query("SELECT product_id, quantity, free FROM bill_items WHERE bill_id = $billId");
        if (!$result1) {
            throw new Exception('Could not load bill items');
        }
        while ($row = $result1->fetch_assoc()) {
            $pid  = (int) $row['product_id'];
            $qty  = intval($row['quantity']);
            $free = intval($row['free']);

            if (!$conn->query("UPDATE products SET stock = stock + $qty, free_stock = free_stock + $free WHERE id = $pid")) {
                throw new Exception('Stock restore failed');
            }

            $res = $conn->query("SELECT stock, free_stock FROM products WHERE id = $pid");
            $prod = $res ? $res->fetch_assoc() : null;
            $new_stock = $prod ? (int)$prod['stock'] : $qty;
            $new_free_stock = $prod ? (int)$prod['free_stock'] : $free;

            if ($qty > 0) {
                $conn->query("INSERT INTO stock_history 
                    (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at) 
                    VALUES ($pid, " . ($new_stock - $qty) . ", $new_stock, $qty, 'IN', 'bill_delete', $billId, NOW())");
            }
            if ($free > 0) {
                $conn->query("INSERT INTO stock_history 
                    (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at) 
                    VALUES ($pid, " . ($new_free_stock - $free) . ", $new_free_stock, $free, 'IN', 'bill_delete_free', $billId, NOW())");
            }
        }

        if (!$conn->query("DELETE FROM bill_items WHERE bill_id = $billId")) {
            throw new Exception('Could not delete bill items');
        }
        if (!$conn->query("DELETE FROM bills WHERE id = $billId")) {
            throw new Exception('Could not delete bill');
        }
        $conn->commit();
    } catch (Exception $e) {
        $conn->rollback();
        header("Location: bills.php?error=" . urlencode($e->getMessage()));
        exit;
    }
    header("Location: bills.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>YEGOVA FUSION CORNER — Bills</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/fusion_theme.css">
    <style>
        .btn { border-radius: 12px; }
        @media (max-width: 767px) {
            .table-responsive.desktop-only { display: none; }
        }
    </style>
</head>

<body class="theme-fusion container mt-3 mt-md-4">
    <?php if (!empty($_GET['error'])): ?>
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <?= htmlspecialchars($_GET['error']) ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>
    <div class="mb-2"><span class="brand-pill">YEGOVA FUSION CORNER</span></div>
    <div class="card p-3 p-md-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
            <h2 class="mb-0">🧾 Bills<?= $isRep ? ' — yours only' : '' ?></h2>
            <a href="dashboard.php" class="btn btn-success">⬅️ Back</a>
        </div>
<div class="mb-3">
    <input type="search" id="billSearch" class="form-control search-bar mb-2" placeholder="🔍 Search bill no, customer, phone..." autocomplete="off">
    <button class="btn btn-info text-white" id="showProductsBtn">📦 Products & Profit</button>
    <button class="btn btn-warning" id="combineBillsBtn">🧾 Combine Bills (A4)</button>
</div>
        <div class="table-responsive desktop-only">
            <table class="table table-bordered table-hover align-middle mb-0" id="billsTable">
                <thead>
                    <tr>
                        <th><input type="checkbox" id="selectAll"></th>
                        <th>Bill No</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>PDF</th>
                        <th class="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($billsRows as $row): ?>
                        <?php
                        $paid_amount = isset($row['paid_amount']) ? $row['paid_amount'] : 0;
                        $total = $row['total'];
                        $status = "<span class='badge bg-danger'>Not Paid</span>";

                        if ($paid_amount > 0 && $paid_amount < $total) {
                            $status = "<span class='badge bg-warning text-dark'>Partially Paid (₹" . number_format($paid_amount, 2) . ")</span>";
                        } elseif ($paid_amount >= $total) {
                            $status = "<span class='badge bg-success'>Paid</span>";
                        }
                        $searchBlob = strtolower($row['id'] . ' ' . $row['billname'] . ' ' . $row['phone'] . ' ' . ($row['address'] ?? ''));
                        ?>
                        <tr data-search="<?= htmlspecialchars($searchBlob) ?>">
                                    <td><input type="checkbox" class="bill-check" value="<?= $row['id'] ?>"></td>

                            <td class="fw-bold text-dark">#<?= $row['id'] ?></td>
                            <td><?= date('d-m-Y h:i A', strtotime($row['bill_date'])) ?></td>

                            <td><?= ucfirst(strtolower(htmlspecialchars($row['billname']))) ?></td>
                            <td><?= htmlspecialchars($row['phone']) ?></td>
                            <td class="fw-bold text-primary">₹<?= number_format($total, 2) ?></td>
                            <td><?= $status ?></td>
                            <td>
                                <?php if (!empty($row['pdf_file'])): ?>
                                    <a href="invoices/<?= $row['pdf_file'] ?>" target="_blank" class="btn btn-sm btn-outline-success">📄 View PDF</a>
                                <?php else: ?>
                                    <span class="text-danger">Not generated</span>
                                <?php endif; ?>
                            </td>
                            <td class="text-center d-flex flex-wrap justify-content-center gap-1">
                                <?php $bid = (int)$row['id']; $has_phone = !empty(trim($row['phone'] ?? '')); ?>
                                <?php if ($has_phone): ?>
                                <button type="button" class="btn btn-sm btn-success btn-wa-send" title="Send bill PDF to customer on WhatsApp" data-bill-id="<?= $bid ?>">📱 WhatsApp</button>
                                <?php else: ?>
                                <span class="btn btn-sm btn-secondary" style="opacity:0.6;cursor:not-allowed;" title="No phone number">📱 WhatsApp</span>
                                <?php endif; ?>
                                <a href="bills.php?action=delete&id=<?= $row['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete Bill #<?= $row['id'] ?>?')">🗑 Delete</a>
                                <?php if (!$isRep): ?>
                                <a href="billing.php?action=edit&id=<?= $row['id'] ?>" class="btn btn-sm btn-primary">✏️ Classic</a>
                                <?php endif; ?>
                                <a href="billing_categories.php?action=edit&id=<?= $row['id'] ?>" class="btn btn-sm btn-info">✏️ Edit</a>
                                <a href="print_bill.php?bill_id=<?= $row['id'] ?>" target="_blank" class="btn btn-sm btn-outline-success">📄 PDF</a>
                                <a href="payment.php?id=<?= $row['id'] ?>" class="btn btn-sm btn-success">💰 Pay</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    
                </tbody>
            </table>
        </div>

        <div class="mobile-only" id="billsMobile">
            <?php foreach ($billsRows as $row):
                $paid_amount = isset($row['paid_amount']) ? $row['paid_amount'] : 0;
                $total = $row['total'];
                $statusTxt = 'Not Paid';
                if ($paid_amount > 0 && $paid_amount < $total) $statusTxt = 'Partial';
                elseif ($paid_amount >= $total) $statusTxt = 'Paid';
                $searchBlob = strtolower($row['id'] . ' ' . $row['billname'] . ' ' . $row['phone'] . ' ' . ($row['address'] ?? ''));
            ?>
            <div class="bill-mobile-card" data-search="<?= htmlspecialchars($searchBlob) ?>">
                <div class="d-flex justify-content-between align-items-start gap-2">
                    <div>
                        <input type="checkbox" class="bill-check me-1" value="<?= $row['id'] ?>">
                        <strong>#<?= $row['id'] ?></strong> · <?= htmlspecialchars($row['billname']) ?>
                        <div class="small text-muted"><?= date('d-m-Y', strtotime($row['bill_date'])) ?> · <?= htmlspecialchars($row['phone']) ?></div>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold">₹<?= number_format($total, 2) ?></div>
                        <span class="badge bg-secondary"><?= $statusTxt ?></span>
                    </div>
                </div>
                <div class="actions">
                    <a href="print_bill.php?bill_id=<?= $row['id'] ?>" target="_blank" class="btn btn-sm btn-outline-success">PDF</a>
                    <a href="billing_categories.php?action=edit&id=<?= $row['id'] ?>" class="btn btn-sm btn-info">Edit</a>
                    <a href="payment.php?id=<?= $row['id'] ?>" class="btn btn-sm btn-success">Pay</a>
                    <a href="bills.php?action=delete&id=<?= $row['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Delete #<?= $row['id'] ?>?')">Delete</a>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>

<!-- Bootstrap Modal -->
<div class="modal fade" id="productModal" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Selected Bills - Product Details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body" id="productDetails">
        <p class="text-muted">Loading...</p>
      </div>
    </div>
  </div>
</div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
document.getElementById("selectAll").addEventListener("click", function() {
    document.querySelectorAll(".bill-check").forEach(cb => cb.checked = this.checked);
});

document.getElementById("billSearch").addEventListener("input", function() {
    const q = this.value.trim().toLowerCase();
    document.querySelectorAll("#billsTable tbody tr, #billsMobile .bill-mobile-card").forEach(function(el) {
        const blob = el.getAttribute("data-search") || "";
        el.style.display = (!q || blob.indexOf(q) !== -1) ? "" : "none";
    });
});

document.getElementById("showProductsBtn").addEventListener("click", function() {
    let ids = Array.from(document.querySelectorAll(".bill-check:checked"))
                   .map(cb => cb.value);

    if (ids.length === 0) {
        alert("Please select at least one bill!");
        return;
    }

    // Send AJAX request
    fetch("get_products.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({bill_ids: ids})
    })
    .then(res => res.text())
    .then(data => {
        document.getElementById("productDetails").innerHTML = data;
        new bootstrap.Modal(document.getElementById("productModal")).show();
    });
});document.getElementById("combineBillsBtn").addEventListener("click", function() {
    let ids = Array.from(document.querySelectorAll(".bill-check:checked"))
                   .map(cb => cb.value);
    if (ids.length === 0) {
        alert("Please select at least one bill!");
        return;
    }

    fetch("combine_bills.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({bill_ids: ids})
    })
    .then(response => response.blob())
    .then(blob => {
        let url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
    });
});

document.querySelectorAll(".btn-wa-send").forEach(function(btn) {
    btn.addEventListener("click", function() {
        var id = this.getAttribute("data-bill-id");
        if (!id) return;
        this.disabled = true;
        this.textContent = "Sending…";
        fetch("send_bill_whatsapp.php?bill_id=" + id)
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.ok) {
                    alert("Bill sent to customer on WhatsApp.");
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

</script>

</body>

</html>