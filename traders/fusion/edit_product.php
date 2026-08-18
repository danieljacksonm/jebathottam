<?php
include 'config.php';
require_once 'auth_helper.php';
requireBillingAccess();
$isRep = isBrandRep();
$brand = currentBrandLabel();
$product_categories = $isRep && $brand
    ? [$brand]
    : ['Lays', 'KK', 'Cococola', 'Pickle', 'Tata', 'Campa', 'Cavins'];
?>
<!DOCTYPE html>
<html>

<head>
    <title>Edit Product</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        body {
            background-color: #f8f9fa;
        }

        .card {
            border-radius: 10px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }

        .btn-primary {
            border-radius: 20px;
            padding: 5px 20px;
        }

        h2 {
            font-weight: 600;
            color: #333;
        }

        .profit-positive {
            color: green;
            font-weight: bold;
        }

        .profit-negative {
            color: red;
            font-weight: bold;
        }
    </style>
</head>

<body class="container mt-5">

    <div class="card p-4">
        <h2>Edit Product</h2>

        <?php
        if (!isset($_GET['id'])) {
            die("<div class='alert alert-danger'>❌ No product ID provided.</div>");
        }
        $id = (int) $_GET['id'];

        $existing = $conn->query("SELECT * FROM products WHERE id=$id");
        if (!$existing || $existing->num_rows == 0) {
            die("<div class='alert alert-danger'>❌ Product not found.</div>");
        }
        $existingRow = $existing->fetch_assoc();
        if ($isRep && $brand && !fusionProductMatchesBrand($existingRow['name'] ?? '', $existingRow['category'] ?? '', $brand)) {
            die("<div class='alert alert-danger'>You can edit only " . htmlspecialchars($brand) . " products.</div>");
        }

        // Handle form submission
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $name        = $conn->real_escape_string($_POST['name']);
            $price       = $_POST['price'];
            $stock       = $_POST['stock'];
            $mrp         = $_POST['mrp'];
            $unit        = $_POST['unit'];
            $hsn         = $_POST['hsn'];
            $free_stock  = $_POST['free_stock'];
            $original    = $_POST['original'];
            $category    = isset($_POST['category']) ? $conn->real_escape_string($_POST['category']) : '';
            if ($isRep && $brand) {
                $category = $conn->real_escape_string($brand);
            }
            // $cgst      = $_POST['cgst_rate'];
            // $sgst      = $_POST['sgst_rate'];
            // $cess      = $_POST['cess_rate'];

            $oldStock    = $_POST['oldstock'];
            $adjustQty   = (int)$_POST['adjust_stock'];

            // Handle stock adjustment
            if ($adjustQty != 0) {
                $newStock = $oldStock + $adjustQty;
                if ($newStock < 0) {
                    echo "<div class='alert alert-danger'>❌ Stock cannot go negative!</div>";
                } else {
                    $changeType = $adjustQty > 0 ? 'IN' : 'OUT';
                    $conn->query("INSERT INTO stock_history 
                        (product_id, change_type, change_qty, new_stock, reference_id, reference_type, created_at, note) 
                        VALUES ($id, '$changeType', $adjustQty, $newStock, $id, 'edit_product', NOW(), 'Manual stock adjustment')");

                    $stock = $newStock;
                }
            }

            $conn->query("UPDATE products 
                SET name='$name', price='$price', stock='$stock', mrp='$mrp', unit='$unit', 
                    hsn='$hsn',
                    free_stock='$free_stock', original='$original', category=" . ($category === '' ? "NULL" : "'$category'") . "
                WHERE id=$id");

            header("Location: dashboard.php");
        }

        // Fetch product details
        $result = $conn->query("SELECT * FROM products WHERE id=$id");
        if ($result->num_rows == 0) {
            die("<div class='alert alert-danger'>❌ Product not found.</div>");
        }
        $product = $result->fetch_assoc();

        // Fetch last 5 stock history
        $history = $conn->query("SELECT * FROM stock_history WHERE product_id=$id ORDER BY created_at DESC");
        ?>

        <!-- Edit Form -->
        <form method="POST" action="">
            <div class="row">
                <!-- General Info -->
                <div class="col-md-6">
                    <h5>General Info</h5>
                    <div class="mb-3">
                        <label>Product Name</label>
                        <input type="text" name="name" value="<?= htmlspecialchars($product['name']) ?>" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label>Price</label>
                        <input type="number" name="price" id="price" value="<?= $product['price'] ?>" step="0.01" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label>Original Price</label>
                        <input type="number" name="original" id="original" value="<?= $product['original'] ?>" step="0.01" class="form-control" required>
                        <small id="profitDisplay"></small>
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
                        <label>HSN/SAC</label>
                        <input type="text" name="hsn" value="<?= htmlspecialchars($product['hsn']) ?>" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label>Category</label>
                        <select name="category" class="form-control">
                            <option value="">-- None --</option>
                            <?php foreach ($product_categories as $c): ?>
                                <option value="<?= htmlspecialchars($c) ?>" <?= (isset($product['category']) && $product['category'] === $c) ? 'selected' : '' ?>><?= htmlspecialchars($c) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <!-- Stock (GST commented out) -->
                <div class="col-md-6">
                    <h5>Stock</h5>
                    <!--
                    <div class="mb-3">
                        <label>CGST</label>
                        <input type="text" name="cgst_rate" value="<?= htmlspecialchars($product['cgst_rate']) ?>" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label>SGST</label>
                        <input type="text" name="sgst_rate" value="<?= htmlspecialchars($product['sgst_rate']) ?>" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label>CESS</label>
                        <input type="text" name="cess_rate" value="<?= htmlspecialchars($product['cess_rate']) ?>" class="form-control">
                    </div>
                    -->
                    <div class="mb-3">
                        <label>Current Stock</label>
                        <input type="number" name="stock" value="<?= $product['stock'] ?>" class="form-control" readonly>
                        <input type="hidden" name="oldstock" value="<?= $product['stock'] ?>">
                    </div>
                    <div class="mb-3">
                        <label>Adjust Stock</label>
                        <input type="number" name="adjust_stock" value="0" class="form-control">
                        <small class="text-muted">Enter +ve to add, -ve to remove</small>
                    </div>
                    <div class="mb-3">
                        <label>Free Stock</label>
                        <input type="number" name="free_stock" value="<?= $product['free_stock'] ?>" class="form-control" required>
                    </div>
                </div>
            </div>

            <button class="btn btn-primary">Update</button>
            <a href="dashboard.php" class="btn btn-secondary">Cancel</a>
        </form>

        <!-- Stock History -->
        <hr>
        <h5>Recent Stock Updates</h5>
        <table class="table table-sm table-bordered">
            <tr>
                <th>Date</th>
                <th>Change</th>
                <th>Balance</th>
                <th>Note</th>
                <th>Bill</th>

            </tr>
            <?php while ($h = $history->fetch_assoc()): ?>
                <tr>
                    <td><?= $h['created_at'] ?></td>
                    <td><?= $h['change_type'] ?> <?= $h['change_qty'] ?></td>
                    <td><?= $h['new_stock'] ?></td>
                    <td><?= $h['reference_type'] ?></td>
                    <td><?= $h['reference_id'] ?></td>

                </tr>
            <?php endwhile; ?>
        </table>
    </div>

    <script>
        function updateProfit() {
            let price = parseFloat(document.getElementById('price').value) || 0;
            let original = parseFloat(document.getElementById('original').value) || 0;
            let profit = price - original;
            let margin = original > 0 ? (profit / original * 100).toFixed(2) : 0;

            let display = document.getElementById('profitDisplay');
            if (profit >= 0) {
                display.innerHTML = `Profit: ₹${profit.toFixed(2)} (${margin}%)`;
                display.className = "profit-positive";
            } else {
                display.innerHTML = `Loss: ₹${profit.toFixed(2)} (${margin}%)`;
                display.className = "profit-negative";
            }
        }

        document.getElementById('price').addEventListener('input', updateProfit);
        document.getElementById('original').addEventListener('input', updateProfit);
        updateProfit();
    </script>

</body>

</html>