<?php include 'config.php'; ?>
<!DOCTYPE html>
<html>

<head>
    <title>Products</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        body {
            background-color: #f8f9fa;
        }

        .card {
            border-radius: 10px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }

        .table thead {
            background-color: #007bff;
            color: white;
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

<body class="container mt-4">

    <div class="card p-4">
        <div class="d-flex gap-4">
            <h2 class="mb-4">Manage Products</h2>
            <a href="billing.php"> <button class="btn btn-success w-100">Billing</button></a>
                        <a href="bills.php"> <button class="btn btn-secondary w-100">Bills</button></a>
                        <a href="sales_report.php"> <button class="btn btn-danger w-100">Sales Report</button></a>

        </div>

        <!-- Add Product Form -->
        <form method="POST" action="">
            <div class="row g-3 align-items-center">
                <div class="col-md-4">
                    <input type="text" name="name" placeholder="Product Name" class="form-control" required>
                </div>
                <div class="col-md-2">
                    <input type="number" name="price" placeholder="Price" class="form-control" step="0.01" required>
                </div>
                <div class="col-md-2">
                    <input type="number" name="stock" placeholder="Stock" class="form-control" required>
                </div>
                <div class="col-md-2">
                    <input type="text" name="unit" placeholder="Unit" class="form-control" required>
                </div>
                <div class="col-md-2">
                    <input type="number" name="mrp" placeholder="MRP" class="form-control" step="0.01" required>
                </div>
                <div class="col-md-2">
                    <input type="text" name="hsn" placeholder="HSN/SAC" class="form-control">
                </div>
                <div class="col-md-2">
                    <input type="number" name="cgst_rate" placeholder="CGST Rate (%)" class="form-control" required>
                </div>
                <div class="col-md-2">
                    <input type="number" name="sgst_rate" placeholder="SGST Rate (%)" class="form-control" required>
                </div>

                <div class="col-md-2">
                    <input type="number" name="cess_rate" placeholder="Cess Rate (%)" class="form-control">
                </div>
                 <div class="col-md-2">
            <label>
                <input type="checkbox" name="free" id="freeCheckbox"> Free
            </label>
        </div>
                <div class="col-md-2 d-flex gap-2">
                    <a> <button type="submit" class="btn btn-primary w-100">Add</button></a>

                </div>
            </div>
        </form>

        <hr>

        <?php
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $name = $conn->real_escape_string($_POST['name']);
            $price = $_POST['price'];
            $stock = $_POST['stock'];
            $Unit = $_POST['unit'];
            $mrp = $_POST['mrp'];
            $hsn = $_POST['hsn'];
            $cgst_rate = $_POST['cgst_rate'];
            $sgst_rate = $_POST['sgst_rate'];
            $cess_rate = $_POST['cess_rate'];
            $conn->query("INSERT INTO products (name, price, stock, Unit, mrp, hsn, cgst_rate, sgst_rate, cess_rate) VALUES
             ('$name', '$price', '$stock','$Unit', '$mrp', '$hsn','$cgst_rate', '$sgst_rate','$cess_rate')");

            header("Location: index.php");
            exit;
        }

        if (isset($_REQUEST['action']) && $_REQUEST['action'] == "delete" && $_REQUEST["id"] != "") {
            $conn->query("DELETE FROM products where id = '" . $_REQUEST["id"] . "'");
        }

        $result = $conn->query("SELECT * FROM products");
        ?>

        <!-- Product Table -->
        <table class="table table-bordered table-hover mt-3">
            <thead>
                <tr>
                    <th width="50">ID</th>
                    <th width="300">Product Name</th>
                    <th width="120">Price</th>
                    <th width="120">Unit</th>
                    <th width="120">MRP</th>
                    <th width="120">HSN/SAC</th>
                    <th width="120">CGST</th>
                    <th width="100">SGST</th>
                    <th width="100">CESS</th>
                    <th width="100">Stock</th>
                    <th width="300">Action</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $i = 0;
                while ($row = $result->fetch_assoc()) {
                    $i++; ?>
                    <tr>
                        <td><?= $i ?></td>
                        <td><?= htmlspecialchars($row['name']) ?></td>
                        <td><?= number_format($row['price'], 2) ?></td>
                        <td><?= ($row['unit']) ?></td>
                        <td><?= number_format($row['mrp'], 2) ?></td>
                        <td><?= ($row['hsn']) ?></td>
                        <td><?= ($row['cgst_rate']) ?></td>
                        <td><?= ($row['sgst_rate']) ?></td>
                        <td><?= ($row['cess_rate']) ?></td>
                        <td><?= $row['stock'] ?></td>
                        <td class="d-flex gap-2"> <a href="index.php?action=delete&id=<?= $row['id'] ?>"> <button class="btn btn-danger w-100">Delete</button> </a>
                            <a href="edit_product.php?action=edit&id=<?= $row['id'] ?>"><button class="btn btn-secondary w-100">Edit</button></a>
                        </td>

                    </tr>
                <?php } ?>
            </tbody>
        </table>
    </div>
<script>
document.getElementById("freeCheckbox").addEventListener("change", function() {
    let isFree = this.checked;

    // Fields to hide/show
    let fields = ["price", "cgst_rate", "sgst_rate", "cess_rate"];

    fields.forEach(function(field) {
        let input = document.querySelector("[name='" + field + "']");
        if (isFree) {
            input.removeAttribute("required");
            input.parentElement.style.display = "none"; // hide whole input box
            if (field === "price" || field === "mrp") {
                input.value = 0; // auto-set to 0
            }
        } else {
            input.setAttribute("required", "true");
            input.parentElement.style.display = "block"; // show again
        }
    });
});
</script>

</body>

</html>