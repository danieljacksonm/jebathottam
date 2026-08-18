<?php include 'config.php'; ?>
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
    </style>
</head>

<body class="container mt-5">

    <div class="card p-4">
        <h2>Edit Product</h2>

        <?php
        // Get product ID from URL
        if (!isset($_GET['id'])) {
            die("<div class='alert alert-danger'>❌ No product ID provided.</div>");
        }
        $id = (int) $_GET['id'];

        // Handle form submission
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $name = $conn->real_escape_string($_POST['name']);
            $price = $_POST['price'];
            $stock = $_POST['stock'];
            $mrp = $_POST['mrp'];
            $unit = $_POST['unit'];
            $hsn = $_POST['hsn'];
            $cgst = $_POST['cgst_rate'];
            $sgst = $_POST['sgst_rate'];
            $cess = $_POST['cess_rate'];


            $conn->query("UPDATE products SET name='$name', price='$price', stock='$stock', mrp='$mrp', unit='$unit', hsn='$hsn', cgst_rate='$cgst', sgst_rate='$sgst', cess_rate='$cess' WHERE id=$id");
            header("Location: index.php");
            exit;
        }

        // Fetch product details
        $result = $conn->query("SELECT * FROM products WHERE id=$id");
        if ($result->num_rows == 0) {
            die("<div class='alert alert-danger'>❌ Product not found.</div>");
        }
        $product = $result->fetch_assoc();
        ?>

        <!-- Edit Form -->
        <form method="POST" action="">
            <div class="mb-3">
                <label>Product Name</label>
                <input type="text" name="name" value="<?= htmlspecialchars($product['name']) ?>" class="form-control" required>
            </div>
            <div class="mb-3">
                <label>Price</label>
                <input type="number" name="price" value="<?= $product['price'] ?>" step="0.01" class="form-control" required>
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
                <input type="text" name="hsn" value="<?= htmlspecialchars($product['hsn']) ?>" class="form-control" >
            </div>
            <div class="mb-3">
                <label>CGST</label>
                <input type="text" name="cgst_rate" value="<?= htmlspecialchars($product['cgst_rate']) ?>" class="form-control" required>
            </div>
            <div class="mb-3">
                <label>SGST</label>
                <input type="text" name="sgst_rate" value="<?= htmlspecialchars($product['sgst_rate']) ?>" class="form-control" required>
            </div>
            <div class="mb-3">
                <label>CESS</label>
                <input type="text" name="cess_rate" value="<?= htmlspecialchars($product['cess_rate']) ?>" class="form-control" required>
            </div>
            <div class="mb-3">
                <label>Stock</label>
                <input type="number" name="stock" value="<?= $product['stock'] ?>" class="form-control" required>
            </div>
            <button class="btn btn-primary">Update</button>
            <a href="index.php" class="btn btn-secondary">Cancel</a>
        </form>
    </div>

</body>

</html>