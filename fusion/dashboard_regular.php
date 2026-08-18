<?php include 'config.php';
session_start();

if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit;
}

// Ensure products has category column for category billing
$chk = $conn->query("SHOW COLUMNS FROM products LIKE 'category'");
if ($chk && $chk->num_rows === 0) {
    $conn->query("ALTER TABLE products ADD COLUMN category VARCHAR(100) DEFAULT NULL");
}
$product_categories = ['Lays', 'KK', 'Cococola', 'Pickle', 'Tata'];
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Manage Products</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/app.css">
    <style>
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .card { border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border: none; }
        .card-header-style { border-bottom: 2px solid #667eea; padding-bottom: 1rem; }
        .card-body { padding: 2rem; }
        .form-control { margin-bottom: 0.5rem; border-radius: 8px; border: 2px solid #e0e0e0; transition: all 0.3s; }
        .form-control:focus { border-color: #667eea; box-shadow: 0 0 0 0.2rem rgba(102,126,234,0.25); }
        .table-responsive { margin-top: 1rem; border-radius: 12px; overflow: hidden; }
        .btn { margin: 0.25rem; border-radius: 8px; font-weight: 600; transition: all 0.3s; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .row { margin-bottom: 0.5rem; }
        .alert { margin-bottom: 1rem; border-radius: 12px; }
        .top-nav { gap: 10px; flex-wrap: wrap; }
        .table thead th { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; }
        .table tbody tr:hover { background-color: #f0f4ff; }
        .table td { vertical-align: middle; }
        .stock-low { color: #dc3545; font-weight: 600; }
        .stock-ok { color: #28a745; font-weight: 600; }
        .form-section { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .section-title { color: #667eea; font-weight: 700; margin-bottom: 1rem; }
        .input-group-text { background: #667eea; color: white; border: none; }
        @media (max-width: 576px) { table { font-size: 12px; } }
    </style>
</head>

<body class="container py-4">

    <div class="card p-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center card-header-style">
            <h2 class="mb-0">📦 Regular Products Dashboard</h2>
            <div class="d-flex top-nav">
                <a href="billing.php"><button class="btn btn-success">💳 Billing</button></a>
                <a href="billing_categories.php"><button class="btn btn-info text-white">📂 Billing by Category</button></a>
                <a href="bills.php"><button class="btn btn-secondary">🧾 Bills</button></a>
                <a href="sales_report.php"><button class="btn btn-danger">📊 Sales Report</button></a>
                <a href="stock_history.php"><button class="btn btn-warning text-dark">📜 Stock History</button></a>
                <a href="stock_update.php"><button class="btn btn-primary">📜 Stock Update</button></a>
                <a href="main_dashboard.php" class="btn btn-outline-secondary">⬅ Back to Main</a>
            </div>
        </div>

        <?php
        // Get stats
        $totalProducts = $conn->query("SELECT COUNT(*) as count FROM products")->fetch_assoc()['count'];
        $totalStock = $conn->query("SELECT SUM(stock) as total FROM products")->fetch_assoc()['total'] ?? 0;
        $lowStock = $conn->query("SELECT COUNT(*) as count FROM products WHERE stock <= 5 AND stock > 0")->fetch_assoc()['count'];
        $outOfStock = $conn->query("SELECT COUNT(*) as count FROM products WHERE stock = 0")->fetch_assoc()['count'];
        ?>

        <div class="row mb-4">
            <div class="col-12 col-md-3">
                <div class="card p-3 text-center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
                    <div class="fs-3 fw-bold"><?= $totalProducts ?></div>
                    <div class="small">Total Products</div>
                </div>
            </div>
            <div class="col-12 col-md-3">
                <div class="card p-3 text-center" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; border: none;">
                    <div class="fs-3 fw-bold"><?= $totalStock ?></div>
                    <div class="small">Total Stock</div>
                </div>
            </div>
            <div class="col-12 col-md-3">
                <div class="card p-3 text-center" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none;">
                    <div class="fs-3 fw-bold"><?= $lowStock ?></div>
                    <div class="small">Low Stock</div>
                </div>
            </div>
            <div class="col-12 col-md-3">
                <div class="card p-3 text-center" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; border: none;">
                    <div class="fs-3 fw-bold"><?= $outOfStock ?></div>
                    <div class="small">Out of Stock</div>
                </div>
            </div>
        </div>

        <!-- Add Product Form -->
        <div class="form-section">
            <h5 class="section-title">➕ Add New Product</h5>
            <form method="POST" action="">
                <div class="row g-3">
                    <div class="col-12 col-md-3">
                        <label class="form-label fw-bold text-muted">Product Name *</label>
                        <div class="input-group">
                            <span class="input-group-text">📦</span>
                            <input type="text" name="name" placeholder="Enter product name" class="form-control" required>
                        </div>
                    </div>
                    <div class="col-6 col-md-2">
                        <label class="form-label fw-bold text-muted">Price (₹) *</label>
                        <div class="input-group">
                            <span class="input-group-text">💰</span>
                            <input type="number" name="price" placeholder="0.00" class="form-control" step="0.01" required>
                        </div>
                    </div>
                    <div class="col-6 col-md-2">
                        <label class="form-label fw-bold text-muted">Stock *</label>
                        <div class="input-group">
                            <span class="input-group-text">📊</span>
                            <input type="number" name="stock" placeholder="0" class="form-control" required>
                        </div>
                    </div>
                    <div class="col-6 col-md-2">
                        <label class="form-label fw-bold text-muted">Unit *</label>
                        <div class="input-group">
                            <span class="input-group-text">📏</span>
                            <input type="text" name="unit" placeholder="e.g., pcs, kg" class="form-control" required>
                        </div>
                    </div>
                    <div class="col-6 col-md-2">
                        <label class="form-label fw-bold text-muted">MRP (₹) *</label>
                        <div class="input-group">
                            <span class="input-group-text">🏷️</span>
                            <input type="number" name="mrp" placeholder="0.00" class="form-control" step="0.01" required>
                        </div>
                    </div>
                    <div class="col-6 col-md-2">
                        <label class="form-label fw-bold text-muted">HSN/SAC</label>
                        <div class="input-group">
                            <span class="input-group-text">🔢</span>
                            <input type="text" name="hsn" placeholder="HSN code" class="form-control">
                        </div>
                    </div>
                    <div class="col-6 col-md-2">
                        <label class="form-label fw-bold text-muted">Original Price</label>
                        <div class="input-group">
                            <span class="input-group-text">💵</span>
                            <input type="number" name="original" placeholder="0.00" class="form-control" step="0.01">
                        </div>
                    </div>
                    <div class="col-6 col-md-2">
                        <label class="form-label fw-bold text-muted">Free Stock</label>
                        <div class="input-group">
                            <span class="input-group-text">🎁</span>
                            <input type="number" name="free_stock" placeholder="0" class="form-control">
                        </div>
                    </div>
                    <div class="col-6 col-md-2">
                        <label class="form-label fw-bold text-muted">Category</label>
                        <div class="input-group">
                            <span class="input-group-text">📁</span>
                            <select name="category" class="form-control">
                                <option value="">-- Category --</option>
                                <?php foreach ($product_categories as $c): ?>
                                    <option value="<?= htmlspecialchars($c) ?>"><?= htmlspecialchars($c) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    <div class="col-12 col-md-2 d-flex align-items-end">
                        <button type="submit" class="btn btn-primary w-100 py-2">➕ Add Product</button>
                    </div>
                </div>
            </form>
        </div>

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

            $conn->query("INSERT INTO products (name, price, stock, unit, mrp, hsn, original, free_stock, category) 
            VALUES ('$name', '$price', '$stock','$unit', '$mrp', '$hsn', '$original','$free_stock', " . ($category === '' ? "NULL" : "'$category'") . ")");

            header("Location: dashboard.php");
            exit;
        }

        // Handle delete
        if (isset($_REQUEST['action']) && $_REQUEST['action'] == "delete" && $_REQUEST["id"] != "") {
            $conn->query("DELETE FROM products WHERE id = '" . $_REQUEST["id"] . "'");
            header("Location: dashboard.php");
            exit;
        }

        $result = $conn->query("SELECT * FROM products ORDER BY name ASC");
        ?>

        <!-- Product Table -->
        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
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
                    while ($row = $result->fetch_assoc()) {
                        $stockClass = $row['stock'] == 0 ? 'stock-low' : ($row['stock'] <= 5 ? 'text-warning fw-bold' : 'stock-ok');
                        $stockBadge = $row['stock'] == 0 ? '<span class="badge bg-danger">OUT</span>' : ($row['stock'] <= 5 ? '<span class="badge bg-warning">LOW</span>' : $row['stock']);
                    ?>
                        <tr>
                            <td><span class="badge bg-primary"><?= $i++ ?></span></td>
                            <td><strong><?= htmlspecialchars($row['name']) ?></strong></td>
                            <td>₹<?= number_format($row['price'], 2) ?></td>
                            <td><?= htmlspecialchars($row['unit']) ?></td>
                            <td>₹<?= number_format($row['mrp'], 2) ?></td>
                            <td><?= htmlspecialchars($row['hsn']) ?></td>
                            <td><span class="badge bg-secondary"><?= htmlspecialchars($row['category'] ?? 'N/A') ?></span></td>
                            <td class="<?= $stockClass ?>"><?= $stockBadge ?></td>
                            <td class="fw-bold text-success"><?= $row['free_stock'] ?></td>
                            <td>₹<?= number_format($row['original'], 2) ?></td>
                            <td class="text-center">
                                <a href="dashboard.php?action=delete&id=<?= $row['id'] ?>"
                                    onclick="return confirm('Are you sure you want to delete <?= htmlspecialchars($row['name']) ?>?')">
                                    <button class="btn btn-sm btn-danger">🗑 Delete</button>
                                </a>
                                <a href="edit_product.php?action=edit&id=<?= $row['id'] ?>">
                                    <button class="btn btn-sm btn-warning">✏️ Edit</button>
                                </a>
                            </td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </div>

</body>
</html>
