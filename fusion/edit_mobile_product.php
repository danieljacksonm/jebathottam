<?php
include 'config_mobile.php';
require_once 'auth_helper.php';
requireSection('mobile');

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = (int)$_POST['id'];
    $name = $conn->real_escape_string($_POST['name']);
    $price = floatval($_POST['price']);
    $stock = intval($_POST['stock']);
    $unit = $conn->real_escape_string($_POST['unit']);
    $original = floatval($_POST['original']);
    $category = $conn->real_escape_string($_POST['category']);
    $description = $conn->real_escape_string($_POST['description']);

    $sql = "UPDATE mobile_products 
            SET name='$name', price=$price, stock=$stock, unit='$unit', original=$original, category='$category', description='$description' 
            WHERE id=$id";
    
    if ($conn->query($sql)) {
        header("Location: dashboard_mobile.php");
        exit;
    } else {
        $error = "Error updating product: " . $conn->error;
    }
}

// Fetch product details
$product = $conn->query("SELECT * FROM mobile_products WHERE id = $id")->fetch_assoc();
if (!$product) {
    die("Product not found");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Edit Mobile Product</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/app.css">
    <style>
        .card-body { padding: 1.5rem; }
        .card { margin-bottom: 1rem; }
        .form-control { margin-bottom: 0.5rem; }
        .btn { margin: 0.25rem; }
        .row { margin-bottom: 0.5rem; }
        .alert { margin-bottom: 1rem; }
    </style>
</head>
<body class="container py-4">

    <?php if (isset($error)): ?>
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <?= $error ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <div class="card p-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center card-header-style">
            <h2 class="mb-0">✏️ Edit Mobile Product</h2>
            <a href="dashboard_mobile.php" class="btn btn-secondary">⬅ Back</a>
        </div>

        <form method="POST" action="">
            <input type="hidden" name="id" value="<?= $product['id'] ?>">
            
            <h5 class="mb-3">Product Details</h5>
            <div class="row g-3 mb-4">
                <div class="col-12 col-md-4">
                    <label class="form-label fw-bold">Product Name *</label>
                    <input type="text" name="name" value="<?= htmlspecialchars($product['name']) ?>" class="form-control" required>
                </div>
                <div class="col-6 col-md-2">
                    <label class="form-label fw-bold">Price (₹) *</label>
                    <input type="number" name="price" value="<?= $product['price'] ?>" class="form-control" step="0.01" required>
                </div>
                <div class="col-6 col-md-2">
                    <label class="form-label fw-bold">Stock *</label>
                    <input type="number" name="stock" value="<?= $product['stock'] ?>" class="form-control" required>
                </div>
                <div class="col-6 col-md-2">
                    <label class="form-label fw-bold">Unit *</label>
                    <input type="text" name="unit" value="<?= htmlspecialchars($product['unit']) ?>" class="form-control" required>
                </div>
                <div class="col-6 col-md-2">
                    <label class="form-label fw-bold">Original Price</label>
                    <input type="number" name="original" value="<?= $product['original'] ?>" class="form-control" step="0.01">
                </div>
                <div class="col-6 col-md-2">
                    <label class="form-label fw-bold">Category</label>
                    <input type="text" name="category" value="<?= htmlspecialchars($product['category']) ?>" class="form-control">
                </div>
                <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Description</label>
                    <input type="text" name="description" value="<?= htmlspecialchars($product['description']) ?>" class="form-control">
                </div>
            </div>

            <button type="submit" class="btn btn-success w-100">💾 Update Product</button>
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
