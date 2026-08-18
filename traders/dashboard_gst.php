<?php
include 'config.php';
require_once 'auth_helper.php';
require_once 'gst_helpers.php';
requireSection('gst');

ensureGstBillColumns($conn);

// Light sync once. Use ?sync=1 once to backfill + renumber invoices
// (July 1 first bill = 101, then 102…).
syncGstKnownProducts($conn, isset($_GET['sync']));

$gst_categories = gstCategories();
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $conn->real_escape_string($_POST['name']);
    $price = floatval($_POST['price']);
    $stock = intval($_POST['stock']);
    $unit = $conn->real_escape_string($_POST['unit']);
    $mrp = floatval($_POST['mrp']);
    $hsn = $conn->real_escape_string($_POST['hsn'] ?? '');
    $original = floatval($_POST['original'] ?? 0);
    $free_stock = intval($_POST['free_stock'] ?? 0);
    $category = $conn->real_escape_string($_POST['gst_category'] ?? '');

    if (!isGstReportProduct($name)) {
        $error = 'Product name must be a GST product (Maa, Friva, Milkshake, Cavins, Snacks — not Maaza).';
    } else {
        $sql = "INSERT INTO products (name, price, stock, unit, mrp, hsn, original, free_stock, category)
                VALUES ('$name', $price, $stock, '$unit', $mrp, '$hsn', $original, $free_stock, '$category')";
        if ($conn->query($sql)) {
            header('Location: dashboard_gst.php');
            exit;
        }
        $error = 'Could not add product: ' . $conn->error;
    }
}

if (isset($_GET['delete'])) {
    $id = (int) $_GET['delete'];
    $conn->query("DELETE FROM products WHERE id = $id");
    header('Location: dashboard_gst.php');
    exit;
}

function gstSafeCount($conn, $sql)
{
    $res = @$conn->query($sql);
    if (!$res) {
        return 0;
    }
    $row = $res->fetch_assoc();
    return $row ? (float) reset($row) : 0;
}

$products = @$conn->query("SELECT * FROM products WHERE " . gstProductWhereSql() . " ORDER BY name ASC");
if (!$products) {
    // Fallback if category/keyword SQL fails on older MySQL
    $products = @$conn->query("SELECT * FROM products ORDER BY name ASC");
}

$totalProducts = (int) gstSafeCount($conn, "SELECT COUNT(*) AS c FROM products WHERE " . gstProductWhereSql());
if ($totalProducts === 0 && $products) {
    $totalProducts = (int) $products->num_rows;
}

$statToday = gstSafeCount($conn, "SELECT COALESCE(SUM(total),0) AS t FROM bills WHERE " . gstTradersBillFilterSql() . " AND DATE(bill_date) = CURDATE()");
$statBills = (int) gstSafeCount($conn, "SELECT COUNT(*) AS c FROM bills WHERE " . gstTradersBillFilterSql());
$statLow = (int) gstSafeCount($conn, "SELECT COUNT(*) AS c FROM products WHERE (" . gstProductWhereSql() . ") AND stock <= 10");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>YEGOVA TRADERS — GST</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/traders_theme.css">
    <style>
        .top-nav { gap: 8px; flex-wrap: wrap; }
        .form-section { padding: 1.25rem; margin-bottom: 1.5rem; }
    </style>
</head>

<body class="theme-traders container py-3 py-md-4">
    <?php if ($error): ?>
        <div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <div class="mb-3">
        <span class="brand-pill">YEGOVA <span>TRADERS</span></span>
        <div class="text-muted small mt-1">GST Billing</div>
    </div>

    <div class="card p-3 p-md-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <h2 class="mb-0">📊 GST Dashboard</h2>
            <div class="d-flex top-nav">
                <a href="gst_billing_categories.php" class="btn btn-success">🧾 GST Billing</a>
                <a href="gst_bills.php" class="btn btn-secondary">📋 GST Bills</a>
                <a href="maa_friva_report.php" class="btn btn-warning">⬇ Excel</a>
                <a href="download_app.php" class="btn btn-dark">📱 Download App</a>
                <a href="logout.php" class="btn btn-outline-danger">Logout</a>
            </div>
        </div>

        <div class="alert alert-dark d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <div>
                <strong>📱 Android App</strong>
                <div class="small mb-0">Install on phone for quick GST billing access.</div>
            </div>
            <a href="download_app.php" class="btn btn-warning">⬇ Download APK</a>
        </div>

        <div class="row g-3 mb-4">
            <div class="col-6 col-md-4">
                <div class="stat-card" style="background: var(--yt-stat1);">
                    <div class="label">Today Sales</div>
                    <div class="value">₹<?= number_format($statToday, 0) ?></div>
                </div>
            </div>
            <div class="col-6 col-md-4">
                <div class="stat-card" style="background: var(--yt-stat3);">
                    <div class="label">GST Bills</div>
                    <div class="value"><?= $statBills ?></div>
                </div>
            </div>
            <div class="col-6 col-md-4">
                <div class="stat-card" style="background: var(--yt-stat4);">
                    <div class="label">Products / Low</div>
                    <div class="value"><?= (int) $totalProducts ?> <small style="font-size:.7em">/ <?= $statLow ?></small></div>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h5 class="section-title">➕ Add GST Product</h5>
            <form method="post" class="row g-3">
                <div class="col-md-3">
                    <label class="form-label small">Product Name *</label>
                    <input type="text" name="name" class="form-control" placeholder="e.g. MAA FD Mango" required>
                </div>
                <div class="col-md-2">
                    <label class="form-label small">GST Type</label>
                    <select name="gst_category" class="form-select">
                        <?php foreach ($gst_categories as $c): ?>
                            <option value="<?= htmlspecialchars($c) ?>"><?= htmlspecialchars($c) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="col-md-2">
                    <label class="form-label small">Price *</label>
                    <input type="number" name="price" class="form-control" step="0.01" required>
                </div>
                <div class="col-md-1">
                    <label class="form-label small">Stock *</label>
                    <input type="number" name="stock" class="form-control" required>
                </div>
                <div class="col-md-1">
                    <label class="form-label small">Unit *</label>
                    <input type="text" name="unit" class="form-control" placeholder="ML" required>
                </div>
                <div class="col-md-1">
                    <label class="form-label small">MRP *</label>
                    <input type="number" name="mrp" class="form-control" step="0.01" required>
                </div>
                <div class="col-md-2">
                    <label class="form-label small">HSN</label>
                    <input type="text" name="hsn" class="form-control" placeholder="22029920">
                </div>
                <div class="col-md-2">
                    <label class="form-label small">Original</label>
                    <input type="number" name="original" class="form-control" step="0.01">
                </div>
                <div class="col-md-2">
                    <label class="form-label small">Free Stock</label>
                    <input type="number" name="free_stock" class="form-control" value="0">
                </div>
                <div class="col-md-2 d-flex align-items-end">
                    <button type="submit" class="btn btn-primary w-100">➕ Add</button>
                </div>
            </form>
        </div>

        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Unit</th>
                        <th>MRP</th>
                        <th>HSN</th>
                        <th>Stock</th>
                        <th>Free</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $i = 1;
                    $seenProductIds = [];
                    if ($products && $products->num_rows > 0):
                        while ($row = $products->fetch_assoc()):
                            $pid = (int) $row['id'];
                            if (isset($seenProductIds[$pid])) continue;
                            $seenProductIds[$pid] = true;
                            if (!isGstReportProduct($row['name'])) continue;
                    ?>
                            <tr>
                                <td><?= $i++ ?></td>
                                <td><?= htmlspecialchars($row['name']) ?></td>
                                <td>₹<?= number_format($row['price'], 2) ?></td>
                                <td><?= htmlspecialchars($row['unit']) ?></td>
                                <td>₹<?= number_format($row['mrp'], 2) ?></td>
                                <td><?= htmlspecialchars(resolveGstHsn($row['name'], '', $row['hsn'])) ?></td>
                                <td><?= (int) $row['stock'] ?></td>
                                <td><?= (int) $row['free_stock'] ?></td>
                                <td>
                                    <a href="edit_gst_product.php?id=<?= $row['id'] ?>" class="btn btn-sm btn-warning">✏️ Edit</a>
                                    <a href="dashboard_gst.php?delete=<?= $row['id'] ?>" class="btn btn-sm btn-danger"
                                        onclick="return confirm('Delete <?= htmlspecialchars($row['name']) ?>?')">🗑</a>
                                </td>
                            </tr>
                    <?php
                        endwhile;
                    else:
                    ?>
                        <tr><td colspan="9" class="text-center text-muted">No GST products yet. Add above.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>

</html>
