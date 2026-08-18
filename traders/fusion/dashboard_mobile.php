<?php
include 'config_mobile.php';
require_once 'auth_helper.php';
requireSection('mobile');

// Ensure mobile_products has category column
$chk = $conn->query("SHOW COLUMNS FROM mobile_products LIKE 'category'");
if ($chk && $chk->num_rows === 0) {
    $conn->query("ALTER TABLE mobile_products ADD COLUMN category VARCHAR(100) DEFAULT NULL");
}

$error = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $conn->real_escape_string($_POST['name']);
    $price = floatval($_POST['price']);
    $stock = intval($_POST['stock']);
    $unit = $conn->real_escape_string($_POST['unit']);
    $original = floatval($_POST['original']);
    $category = $conn->real_escape_string($_POST['category']);
    $description = $conn->real_escape_string($_POST['description']);

    $sql = "INSERT INTO mobile_products (name, price, stock, unit, original, category, description)
            VALUES ('$name', $price, $stock, '$unit', $original, '$category', '$description')";

    if ($conn->query($sql)) {
        header("Location: dashboard_mobile.php");
        exit;
    } else {
        $error = "Error adding product: " . $conn->error;
    }
}

// Handle delete
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $conn->begin_transaction();
    try {
        // Delete related sales items first
        $conn->query("DELETE FROM mobile_sales_items WHERE product_id = $id");
        // Delete related stock history
        $conn->query("DELETE FROM mobile_stock_history WHERE product_id = $id");
        // Then delete the product
        $conn->query("DELETE FROM mobile_products WHERE id = $id");
        $conn->commit();
        header("Location: dashboard_mobile.php");
        exit;
    } catch (Exception $e) {
        $conn->rollback();
        $error = "Error deleting product: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Mobile Shop Dashboard</title>
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

    <?php if (!empty($error)): ?>
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <?= $error ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <div class="card p-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center card-header-style">
            <h2 class="mb-0">📱 Mobile Shop Dashboard</h2>
            <div class="d-flex top-nav">
                <a href="mobile_billing.php"><button class="btn btn-success">🛒 Product Billing</button></a>
                <a href="mobile_service.php"><button class="btn btn-info text-white">🔧 Mobile Service</button></a>
                <a href="mobile_sales_list.php"><button class="btn btn-warning">🧾 Sales List</button></a>
                <a href="mobile_service_list.php"><button class="btn btn-primary">📋 Service List</button></a>
                <a href="logout.php" class="btn btn-outline-danger">Logout</a>
            </div>
        </div>

        <?php
        // Get stats
        $totalProducts = $conn->query("SELECT COUNT(*) as count FROM mobile_products")->fetch_assoc()['count'];
        $totalStock = $conn->query("SELECT SUM(stock) as total FROM mobile_products")->fetch_assoc()['total'] ?? 0;
        $lowStock = $conn->query("SELECT COUNT(*) as count FROM mobile_products WHERE stock <= 5 AND stock > 0")->fetch_assoc()['count'];
        $outOfStock = $conn->query("SELECT COUNT(*) as count FROM mobile_products WHERE stock = 0")->fetch_assoc()['count'];
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

        <!-- Add Mobile Product Form -->
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
                        <label class="form-label fw-bold text-muted">Original Price</label>
                        <div class="input-group">
                            <span class="input-group-text">🏷️</span>
                            <input type="number" name="original" placeholder="0.00" class="form-control" step="0.01">
                        </div>
                    </div>
                    <div class="col-6 col-md-2">
                        <label class="form-label fw-bold text-muted">Category</label>
                        <div class="input-group">
                            <span class="input-group-text">📁</span>
                            <input type="text" name="category" placeholder="Category" class="form-control">
                        </div>
                    </div>
                    <div class="col-12 col-md-3">
                        <label class="form-label fw-bold text-muted">Description</label>
                        <div class="input-group">
                            <span class="input-group-text">📝</span>
                            <input type="text" name="description" placeholder="Product description" class="form-control">
                        </div>
                    </div>
                    <div class="col-12 col-md-2 d-flex align-items-end">
                        <button type="submit" class="btn btn-success w-100 py-2">➕ Add Product</button>
                    </div>
                </div>
            </form>
        </div>

        <!-- Mobile Products Table -->
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Unit</th>
                        <th>Original</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $products = $conn->query("SELECT * FROM mobile_products ORDER BY name ASC");
                    if (!$products) {
                        echo "<tr><td colspan='8' class='text-danger text-center py-4'>Error fetching products: " . $conn->error . "</td></tr>";
                    } elseif ($products->num_rows === 0) {
                        echo "<tr><td colspan='8' class='text-center text-muted py-4'>
                            <div class='fs-5'>📦 No products found</div>
                            <small>Add products using the form above</small>
                        </td></tr>";
                    } else {
                        while ($p = $products->fetch_assoc()) {
                            $stockClass = $p['stock'] == 0 ? 'stock-low' : ($p['stock'] <= 5 ? 'text-warning fw-bold' : 'stock-ok');
                            $stockBadge = $p['stock'] == 0 ? '<span class="badge bg-danger">OUT</span>' : ($p['stock'] <= 5 ? '<span class="badge bg-warning">LOW</span>' : $p['stock']);
                        echo "<tr>
                            <td><span class='badge bg-primary'>#{$p['id']}</span></td>
                            <td><strong>{$p['name']}</strong></td>
                            <td>₹" . number_format($p['price'], 2) . "</td>
                            <td class='{$stockClass}'>{$stockBadge}</td>
                            <td>{$p['unit']}</td>
                            <td>₹" . number_format($p['original'], 2) . "</td>
                            <td><span class='badge bg-secondary'>{$p['category']}</span></td>
                            <td>
                                <a href='edit_mobile_product.php?id={$p['id']}' class='btn btn-sm btn-warning'>✏️ Edit</a>
                                <a href='dashboard_mobile.php?delete={$p['id']}' class='btn btn-sm btn-danger' onclick='return confirm(\"Delete {$p['name']}?\")'>🗑 Delete</a>
                            </td>
                        </tr>";
                        }
                    }
                    ?>
                </tbody>
            </table>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
