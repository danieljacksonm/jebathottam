<?php
include 'config.php';
require_once 'auth_helper.php';
requireBillingAccess();
ensureBillsCreatedByColumn($conn);

$isRep = isBrandRep();
$brand = currentBrandLabel();

// Ensure products has category column for category billing
$chk = $conn->query("SHOW COLUMNS FROM products LIKE 'category'");
if ($chk && $chk->num_rows === 0) {
    $conn->query("ALTER TABLE products ADD COLUMN category VARCHAR(100) DEFAULT NULL");
}
$product_categories = $isRep && $brand
    ? [$brand]
    : ['Lays', 'KK', 'Cococola', 'Pickle', 'Tata', 'Campa', 'Cavins'];

$billWhere = '1=1' . billsCreatedBySql();
$prodWhere = '1=1' . brandProductSqlFilter();
$statToday = (float) ($conn->query("SELECT COALESCE(SUM(total),0) AS t FROM bills WHERE $billWhere AND DATE(bill_date) = CURDATE()")->fetch_assoc()['t'] ?? 0);
$statBills = (int) ($conn->query("SELECT COUNT(*) AS c FROM bills WHERE $billWhere")->fetch_assoc()['c'] ?? 0);
$statProducts = (int) ($conn->query("SELECT COUNT(*) AS c FROM products WHERE $prodWhere")->fetch_assoc()['c'] ?? 0);
$statLow = (int) ($conn->query("SELECT COUNT(*) AS c FROM products WHERE $prodWhere AND stock <= 10")->fetch_assoc()['c'] ?? 0);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>YEGOVA FUSION CORNER</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/fusion_theme.css">
    <style>
        .top-nav { gap: 8px; flex-wrap: wrap; }
        .form-control { border-radius: 10px; }
        @media (max-width: 576px) {
            table { font-size: 12px; }
            h2 { font-size: 1.25rem; }
        }
    </style>
</head>

<body class="theme-fusion container mt-3 mt-md-4">

    <div class="brand-bar">
        <div>
            <span class="brand-pill">YEGOVA FUSION CORNER</span>
            <div class="text-muted small mt-1"><?= $isRep ? htmlspecialchars($brand) . ' Representative' : 'Normal Billing' ?></div>
        </div>
    </div>

    <div class="card p-3 p-md-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <h2 class="mb-0">💳 Dashboard</h2>
            <div class="d-flex top-nav">
                <a href="billing_categories.php"><button class="btn btn-success">📂 Billing</button></a>
                <?php if (!$isRep): ?>
                <a href="billing.php"><button class="btn btn-outline-success">Classic</button></a>
                <?php endif; ?>
                <a href="bills.php"><button class="btn btn-secondary">📋 Bills</button></a>
                <?php if (!$isRep): ?>
                <a href="sales_report.php"><button class="btn btn-danger">📊 Report</button></a>
                <a href="stock_history.php"><button class="btn btn-warning text-white">Stock History</button></a>
                <a href="stock_update.php"><button class="btn btn-primary">Stock Update</button></a>
                <a href="download_app.php"><button class="btn btn-dark">📱 Download App</button></a>
                <?php endif; ?>
                <a href="logout.php"><button class="btn btn-outline-danger">Logout</button></a>
            </div>
        </div>

        <?php if ($isRep): ?>
        <div class="alert alert-info mb-4">
            You can use only <strong>3 pages</strong>: <?= htmlspecialchars($brand) ?> products, category billing (<?= htmlspecialchars($brand) ?> only), and bills you added. Bills go into the normal bill list.
        </div>
        <?php else: ?>
        <div class="alert alert-dark d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <div>
                <strong>📱 Android App</strong>
                <div class="small mb-0">Install on phone for quick Fusion billing access.</div>
            </div>
            <a href="download_app.php" class="btn btn-success">⬇ Download APK</a>
        </div>
        <?php endif; ?>

        <div class="row g-3 mb-4">
            <div class="col-6 col-md-4">
                <div class="stat-card" style="background: var(--fc-stat1);">
                    <div class="label">Today Sales</div>
                    <div class="value">₹<?= number_format($statToday, 0) ?></div>
                </div>
            </div>
            <div class="col-6 col-md-4">
                <div class="stat-card" style="background: var(--fc-stat3);">
                    <div class="label">Total Bills</div>
                    <div class="value"><?= $statBills ?></div>
                </div>
            </div>
            <div class="col-6 col-md-4">
                <div class="stat-card" style="background: var(--fc-stat4);">
                    <div class="label">Products / Low stock</div>
                    <div class="value"><?= $statProducts ?> <small style="font-size:0.7em;opacity:.9">/ <?= $statLow ?></small></div>
                </div>
            </div>
        </div>

        <!-- Add Product Form -->
        <form method="POST" action="" class="mb-4">
            <div class="row g-3">
                <div class="col-12 col-md-4">
                    <input type="text" name="name" placeholder="Product Name" class="form-control" required>
                </div>
                <div class="col-6 col-md-2">
                    <input type="number" name="price" placeholder="Price" class="form-control" step="0.01" required>
                </div>
                <div class="col-6 col-md-2">
                    <input type="number" name="stock" placeholder="Stock" class="form-control" required>
                </div>
                <div class="col-6 col-md-2">
                    <input type="text" name="unit" placeholder="Unit" class="form-control" required>
                </div>
                <div class="col-6 col-md-2">
                    <input type="number" name="mrp" placeholder="MRP" class="form-control" step="0.01" required>
                </div>
                <div class="col-6 col-md-2">
                    <input type="text" name="hsn" placeholder="HSN/SAC" class="form-control">
                </div>

                <!-- Commented GST fields -->
                <!--
                <div class="col-6 col-md-2">
                    <input type="number" name="cgst_rate" placeholder="CGST %" class="form-control">
                </div>
                <div class="col-6 col-md-2">
                    <input type="number" name="sgst_rate" placeholder="SGST %" class="form-control">
                </div>
                <div class="col-6 col-md-2">
                    <input type="number" name="cess_rate" placeholder="Cess %" class="form-control">
                </div>
                -->

                <div class="col-6 col-md-2">
                    <input type="number" name="original" placeholder="Original Price" class="form-control" step="0.01">
                </div>
                <div class="col-6 col-md-2">
                    <input type="number" name="free_stock" placeholder="Free Stock" class="form-control">
                </div>
                <div class="col-6 col-md-2">
                    <select name="category" class="form-control" <?= $isRep ? 'required' : '' ?>>
                        <?php if (!$isRep): ?>
                        <option value="">-- Category --</option>
                        <?php endif; ?>
                        <?php foreach ($product_categories as $c): ?>
                            <option value="<?= htmlspecialchars($c) ?>" <?= ($isRep && $brand === $c) ? 'selected' : '' ?>><?= htmlspecialchars($c) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="col-12 col-md-2 d-grid">
                    <button type="submit" class="btn btn-primary w-100">➕ Add Product</button>
                </div>
            </div>
        </form>

        <div class="mb-2">
            <input type="search" id="productSearch" class="form-control search-bar" placeholder="🔍 Search products..." autocomplete="off">
        </div>

        <hr>

        <?php
        // Handle add product
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $name = $conn->real_escape_string($_POST['name']);
            $price = $_POST['price'];
            $stock = $_POST['stock'];
            $unit = $_POST['unit'];
            $mrp = $_POST['mrp'];
            $hsn = $_POST['hsn'];
            // $cgst_rate = $_POST['cgst_rate'];
            // $sgst_rate = $_POST['sgst_rate'];
            // $cess_rate = $_POST['cess_rate'];
            $original = $_POST['original'];
            $free_stock = $_POST['free_stock'];
            $category = isset($_POST['category']) ? $conn->real_escape_string($_POST['category']) : '';
            if ($isRep && $brand) {
                $category = $conn->real_escape_string($brand);
            }

            $conn->query("INSERT INTO products (name, price, stock, unit, mrp, hsn, original, free_stock, category) 
            VALUES ('$name', '$price', '$stock','$unit', '$mrp', '$hsn', '$original','$free_stock', " . ($category === '' ? "NULL" : "'$category'") . ")");

            header("Location: dashboard.php");
            exit;
        }

        // Handle delete
        if (isset($_REQUEST['action']) && $_REQUEST['action'] == "delete" && $_REQUEST["id"] != "") {
            $delId = (int) $_REQUEST['id'];
            $rowDel = $conn->query("SELECT name, category FROM products WHERE id = $delId")->fetch_assoc();
            if ($rowDel && fusionProductMatchesBrand($rowDel['name'] ?? '', $rowDel['category'] ?? '', $brand)) {
                $conn->query("DELETE FROM products WHERE id = $delId");
            }
            header("Location: dashboard.php");
            exit;
        }

        $result = $conn->query("SELECT * FROM products WHERE $prodWhere ORDER BY name ASC");
        ?>

        <!-- Product Table -->
        <div class="table-responsive">
            <table class="table table-bordered table-hover mt-3 align-middle" id="productsTable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Unit</th>
                        <th>MRP</th>
                        <th>HSN/SAC</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Free Stock</th>
                        <th>Original Price</th>
                        <th class="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $i = 1;
                    while ($row = $result->fetch_assoc()) { ?>
                        <tr data-name="<?= htmlspecialchars(strtolower($row['name'])) ?>">
                            <td><?= $i++ ?></td>
                            <td><?= htmlspecialchars($row['name']) ?></td>
                            <td>₹<?= number_format($row['price'], 2) ?></td>
                            <td><?= htmlspecialchars($row['unit']) ?></td>
                            <td>₹<?= number_format($row['mrp'], 2) ?></td>
                            <td><?= htmlspecialchars($row['hsn']) ?></td>
                            <td><?= htmlspecialchars($row['category'] ?? '') ?></td>
                            <td class="fw-bold text-primary"><?= (int)$row['stock'] ?></td>
                            <td class="fw-bold text-success"><?= $row['free_stock'] ?></td>
                            <td>₹<?= number_format($row['original'], 2) ?></td>
                            <td class="text-center">
                                <a href="dashboard.php?action=delete&id=<?= $row['id'] ?>"
                                    onclick="return confirm('Are you sure you want to delete <?= htmlspecialchars($row['name']) ?>?')">
                                    <button class="btn btn-sm btn-danger">🗑 Delete</button>
                                </a>
                                <a href="edit_product.php?action=edit&id=<?= $row['id'] ?>">
                                    <button class="btn btn-sm btn-secondary">✏️ Edit</button>
                                </a>
                            </td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </div>
    <script>
        document.getElementById('productSearch')?.addEventListener('input', function() {
            const q = this.value.trim().toLowerCase();
            document.querySelectorAll('#productsTable tbody tr').forEach(function(tr) {
                const name = tr.getAttribute('data-name') || '';
                tr.style.display = (!q || name.indexOf(q) !== -1) ? '' : 'none';
            });
        });
    </script>
</body>
</html>
