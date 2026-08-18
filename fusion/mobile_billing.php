<?php
include 'config_mobile.php';
require_once 'auth_helper.php';
requireSection('mobile');

$products = $conn->query("SELECT * FROM mobile_products WHERE stock > 0 ORDER BY name ASC");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Mobile Product Billing</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        body { background: #f4f6f9; }
        .card { border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    </style>
</head>

<body class="container py-4">
    <div class="card p-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
            <h2 class="mb-0">🛒 Mobile Product Billing</h2>
            <a href="dashboard_mobile.php" class="btn btn-secondary">⬅ Back</a>
        </div>

        <div class="row g-3 mb-3">
            <div class="col-md-4">
                <input type="text" id="customer_name" class="form-control" placeholder="Customer Name" required>
            </div>
            <div class="col-md-4">
                <input type="text" id="customer_phone" class="form-control" placeholder="Phone Number">
            </div>
            <div class="col-md-4">
                <input type="number" id="paid_amount" class="form-control" placeholder="Paid Amount (₹)" step="0.01" min="0" value="0">
            </div>
        </div>

        <div class="row g-3 mb-3">
            <div class="col-md-6">
                <select id="product" class="form-select">
                    <option value="">Select Product</option>
                    <?php while ($p = $products->fetch_assoc()): ?>
                        <option value="<?= $p['id'] ?>"
                            data-name="<?= htmlspecialchars($p['name']) ?>"
                            data-price="<?= $p['price'] ?>"
                            data-stock="<?= $p['stock'] ?>">
                            <?= htmlspecialchars($p['name']) ?> — ₹<?= number_format($p['price'], 2) ?> (Stock: <?= $p['stock'] ?>)
                        </option>
                    <?php endwhile; ?>
                </select>
            </div>
            <div class="col-md-2">
                <input type="number" id="qty" class="form-control" min="1" value="1">
            </div>
            <div class="col-md-2">
                <input type="number" id="price" class="form-control" step="0.01" placeholder="Price">
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-success w-100" id="addBtn">Add</button>
            </div>
        </div>

        <table class="table table-bordered">
            <thead class="table-dark">
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="billItems"></tbody>
            <tfoot>
                <tr class="fw-bold">
                    <td colspan="3" class="text-end">Grand Total</td>
                    <td id="grandTotal">₹0.00</td>
                    <td></td>
                </tr>
            </tfoot>
        </table>

        <button class="btn btn-primary btn-lg w-100" id="checkoutBtn">✅ Save & Print Bill</button>
    </div>

    <script>
        let items = [];
        let total = 0;

        document.getElementById('product').addEventListener('change', function() {
            const opt = this.options[this.selectedIndex];
            if (opt.value) document.getElementById('price').value = opt.dataset.price;
        });

        document.getElementById('addBtn').addEventListener('click', function() {
            const sel = document.getElementById('product');
            const opt = sel.options[sel.selectedIndex];
            if (!opt.value) return alert('Select a product');
            const qty = parseInt(document.getElementById('qty').value) || 0;
            const price = parseFloat(document.getElementById('price').value) || 0;
            const stock = parseInt(opt.dataset.stock) || 0;
            if (qty < 1) return alert('Enter quantity');
            if (qty > stock) return alert('Only ' + stock + ' in stock');
            items.push({
                id: parseInt(opt.value),
                name: opt.dataset.name,
                price: price,
                qty: qty,
                total: price * qty
            });
            render();
        });

        function render() {
            const tbody = document.getElementById('billItems');
            tbody.innerHTML = '';
            total = 0;
            items.forEach((it, i) => {
                total += it.total;
                tbody.innerHTML += `<tr>
                    <td>${it.name}</td>
                    <td>₹${it.price.toFixed(2)}</td>
                    <td>${it.qty}</td>
                    <td>₹${it.total.toFixed(2)}</td>
                    <td><button class="btn btn-sm btn-danger" onclick="removeItem(${i})">Remove</button></td>
                </tr>`;
            });
            document.getElementById('grandTotal').textContent = '₹' + total.toFixed(2);
        }

        function removeItem(i) {
            items.splice(i, 1);
            render();
        }

        document.getElementById('checkoutBtn').addEventListener('click', function() {
            const name = document.getElementById('customer_name').value.trim();
            if (!name) return alert('Enter customer name');
            if (items.length === 0) return alert('Add products first');

            fetch('save_mobile_bill.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name: name,
                    customer_phone: document.getElementById('customer_phone').value.trim(),
                    paid_amount: document.getElementById('paid_amount').value || 0,
                    total: total,
                    items: items
                })
            })
            .then(r => r.text())
            .then(data => {
                if (/^\d+$/.test(data.trim())) {
                    window.open('print_mobile_bill.php?bill_id=' + data.trim(), '_blank');
                    window.location.href = 'mobile_sales_list.php';
                } else {
                    alert('Error: ' + data);
                }
            });
        });
    </script>
</body>

</html>
