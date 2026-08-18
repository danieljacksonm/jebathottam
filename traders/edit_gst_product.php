<?php
include 'config.php';
require_once 'auth_helper.php';
require_once 'gst_helpers.php';
requireSection('gst');

$gst_categories = gstCategories();

if (!isset($_GET['id'])) {
    die("<div class='alert alert-danger'>No product ID provided.</div>");
}
$id = (int) $_GET['id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $conn->real_escape_string($_POST['name']);
    $price = $_POST['price'];
    $stock = $_POST['stock'];
    $mrp = $_POST['mrp'];
    $unit = $_POST['unit'];
    $hsn = $_POST['hsn'];
    $free_stock = $_POST['free_stock'];
    $original = $_POST['original'];
    $category = $conn->real_escape_string($_POST['gst_category'] ?? '');
    $oldStock = $_POST['oldstock'];
    $adjustQty = (int) $_POST['adjust_stock'];

    if (!isGstReportProduct($name)) {
        die("<div class='alert alert-danger'>Product name must be a GST product (Maa, Friva, Milkshake, Cavins, Snacks).</div>");
    }

    if ($adjustQty != 0) {
        $newStock = $oldStock + $adjustQty;
        if ($newStock < 0) {
            echo "<div class='alert alert-danger'>Stock cannot go negative!</div>";
        } else {
            $changeType = $adjustQty > 0 ? 'IN' : 'OUT';
            $conn->query("INSERT INTO stock_history 
                (product_id, change_type, change_qty, new_stock, reference_id, reference_type, created_at, note) 
                VALUES ($id, '$changeType', $adjustQty, $newStock, $id, 'edit_gst_product', NOW(), 'GST product stock adjustment')");
            $stock = $newStock;
        }
    }

    $conn->query("UPDATE products 
        SET name='$name', price='$price', stock='$stock', mrp='$mrp', unit='$unit', 
            hsn='$hsn', free_stock='$free_stock', original='$original', category='$category'
        WHERE id=$id");

    header('Location: dashboard_gst.php');
    exit;
}

$result = $conn->query("SELECT * FROM products WHERE id=$id");
if (!$result || $result->num_rows === 0) {
    die("<div class='alert alert-danger'>Product not found.</div>");
}
$product = $result->fetch_assoc();
$history = $conn->query("SELECT * FROM stock_history WHERE product_id=$id ORDER BY created_at DESC LIMIT 10");
?>
<!DOCTYPE html>
<html>

<head>
    <title>Edit GST Product</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>

<body class="container mt-5">
    <div class="card p-4">
        <h2>Edit GST Product</h2>
        <form method="POST">
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label>Product Name</label>
                        <input type="text" name="name" value="<?= htmlspecialchars($product['name']) ?>" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label>GST Type</label>
                        <select name="gst_category" class="form-select">
                            <?php foreach ($gst_categories as $c): ?>
                                <option value="<?= htmlspecialchars($c) ?>" <?= ($product['category'] ?? '') === $c ? 'selected' : '' ?>><?= htmlspecialchars($c) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label>Price</label>
                        <input type="number" name="price" value="<?= $product['price'] ?>" step="0.01" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label>Original Price</label>
                        <input type="number" name="original" value="<?= $product['original'] ?>" step="0.01" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label>MRP</label>
                        <input type="number" name="mrp" value="<?= $product['mrp'] ?>" step="0.01" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label>Unit</label>
                        <input type="text" name="unit" value="<?= htmlspecialchars($product['unit']) ?>" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label>HSN</label>
                        <input type="text" name="hsn" value="<?= htmlspecialchars($product['hsn']) ?>" class="form-control">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label>Current Stock</label>
                        <input type="number" name="stock" value="<?= $product['stock'] ?>" class="form-control" readonly>
                        <input type="hidden" name="oldstock" value="<?= $product['stock'] ?>">
                    </div>
                    <div class="mb-3">
                        <label>Adjust Stock</label>
                        <input type="number" name="adjust_stock" value="0" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label>Free Stock</label>
                        <input type="number" name="free_stock" value="<?= $product['free_stock'] ?>" class="form-control">
                    </div>
                </div>
            </div>
            <button class="btn btn-primary">Update</button>
            <a href="dashboard_gst.php" class="btn btn-secondary">Cancel</a>
        </form>

        <hr>
        <h5>Recent Stock Updates</h5>
        <table class="table table-sm table-bordered">
            <tr><th>Date</th><th>Change</th><th>Balance</th><th>Type</th></tr>
            <?php while ($h = $history->fetch_assoc()): ?>
                <tr>
                    <td><?= $h['created_at'] ?></td>
                    <td><?= $h['change_type'] ?> <?= $h['change_qty'] ?></td>
                    <td><?= $h['new_stock'] ?></td>
                    <td><?= $h['reference_type'] ?></td>
                </tr>
            <?php endwhile; ?>
        </table>
    </div>
</body>

</html>
