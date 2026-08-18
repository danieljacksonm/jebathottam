<?php
include 'config.php';
require_once 'auth_helper.php';
require_once 'fusion_helpers.php';
requireBillingAccess();
if (isBrandRep()) {
    header('Location: billing_categories.php');
    exit;
}

$products = $conn->query("SELECT * FROM products ORDER BY name ASC");
?>
<!DOCTYPE html>
<html>

<head>
    <title>Billing</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        body {
            background-color: #f8f9fa;
        }

        .card {
            border-radius: 10px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }

        .btn {
            border-radius: 20px;
        }

        .table th,
        .table td {
            vertical-align: middle;
            white-space: nowrap;
        }

        @media (max-width: 576px) {
            h2 {
                font-size: 1.2rem;
            }

            .btn {
                font-size: 0.8rem;
                padding: 6px 12px;
            }
        }
    </style>
</head>

<body class="container mt-4">

    <div class="card p-3">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-2">
            <h2 class="mb-0">🧾 Billing</h2>
            <a href="dashboard.php">
                <button class="btn btn-success w-100 w-md-auto">Back</button>
            </a>
        </div>

        <!-- Product Selection -->
        <form id="addForm" class="row g-3">
            <div class="col-12 col-md-4">
                <input type="text" name="bill_name" id="bill_name" placeholder="Bill Name" class="form-control" required>
<ul id="suggestions" class="list-group position-absolute w-100" style="z-index:9999; display:none;"></ul>
            </div>
            <div class="col-12 col-md-4">
                <input type="text" name="address" id="address" placeholder="Address" class="form-control">
            </div>
            <div class="col-12 col-md-4">
                <input type="text" name="phone" id="phone" placeholder="Phone Number" class="form-control">
            </div>

            <div class="col-12 col-md-6">
                <select id="product" class="form-control" required>
                    <option value="">Select Product</option>
                    <?php
                    while ($p = $products->fetch_assoc()) {
                        if (fusionShouldHideGstProducts() && isFusionGstOnlyProduct($p['name'])) {
                            continue;
                        }
                        echo "<option value='{$p['id']}'
                            data-price='{$p['price']}'
                            data-hsn='{$p['hsn']}'
                            data-mrp='{$p['mrp']}'
                            data-unit='{$p['unit']}'
                            data-original='{$p['original']}'
                            data-stock='{$p['stock']}'
                            data-freestock='{$p['free_stock']}'
                            " . (($p['stock'] <= 0 && $p['free_stock'] <= 0) ? "disabled style='color:red;'" : "") . ">
                            {$p['name']} (₹{$p['price']}) - Stock: {$p['stock']}, Free: {$p['free_stock']}
                        </option>";
                    }
                    ?>
                </select>
            </div>

            <div class="col-6 col-md-2">
                <input type="number" id="quantity" min="1" value="1" class="form-control" required>
            </div>

            <div class="col-6 col-md-2">
                <input type="number" id="price" step="0.01" placeholder="Price" class="form-control" required>
            </div>

            <div class="col-12 col-md-3">
                <div id="originalPrice" class="form-control bg-light">Original Price: ₹0.00</div>
            </div>

            <div class="col-6 col-md-2 d-flex align-items-center">
                <input type="checkbox" id="isFree" class="form-check-input me-2">
                <label for="isFree">Free</label>
            </div>

            <div class="col-6 col-md-2" id="freeQtyDiv" style="display:none;">
                <input type="number" id="freeQuantity" min="0" value="0" class="form-control" placeholder="Free Qty">
            </div>

            <div class="col-12 col-md-3">
                <button type="button" id="addBtn" class="btn btn-success w-100">Add to Bill</button>
            </div>
        </form>

        <hr>

        <div class="table-responsive">
            <table class="table table-bordered mt-3">
                <thead class="table-dark">
                    <tr>
                        <th>Product</th>
                        <th>Price (₹)</th>
                        <th>Qty</th>
                        <th>MRP</th>
                        <th>Unit</th>
                        <th>HSN/SAC</th>
                        <!-- GST Columns Hidden -->
                        <!-- <th>CGST</th>
                        <th>SGST</th>
                        <th>CESS</th> -->
                        <th>Total (₹)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="billItems"></tbody>
                <tfoot id="billFooter"></tfoot>
            </table>
        </div>

        <div class="row mt-3">
            <!-- GST Summary Removed -->
            <!-- <div class="col-12 col-md-6">...</div> -->

            <!-- Totals -->
            <div class="col-12 text-md-end mt-3">
                <table class="table table-sm table-bordered">
                    <tbody>
                        <tr>
                            <th>Subtotal</th>
                            <td id="subTotal"></td>
                        </tr>
                        <tr>
                            <th>Round Off</th>
                            <td id="roundOff"></td>
                        </tr>
                        <tr>
                            <th>Grand Total</th>
                            <td id="grandTotal"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <hr>
        <div class="row my-3">
            <div class="col-md-4">
                <label for="discountType" class="form-label fw-bold">Discount Type</label>
                <select id="discountType" class="form-control">
                    <option value="none">No Discount</option>
                    <option value="percent">Percentage (%)</option>
                    <option value="amount">Flat Amount (₹)</option>
                </select>
            </div>

            <div class="col-md-4">
                <label for="discountValue" class="form-label fw-bold">Discount Value</label>
                <input type="number" id="discountValue" step="0.01" min="0" value="0" class="form-control">
            </div>

            <div class="col-md-4">
                <label for="oldPayment" class="form-label fw-bold">Old Payment (Advance ₹)</label>
                <input type="number" id="oldPayment" step="0.01" min="0" value="0" class="form-control">
            </div>
        </div>

        <button class="btn btn-primary w-100" id="checkoutBtn">Checkout</button>
    </div>

    <script>
      const billInput = document.getElementById("bill_name");
const sugBox = document.getElementById("suggestions");

billInput.addEventListener("keyup", function() {
    const val = this.value.trim();
    if (val.length < 1) {
        sugBox.style.display = "none";
        return;
    }

    fetch("get_billnames.php?q=" + encodeURIComponent(val))
        .then(res => res.json())
        .then(data => {
            sugBox.innerHTML = "";
            if (data.length === 0) {
                sugBox.style.display = "none";
                return;
            }

            data.forEach(name => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.textContent = name;
                li.onclick = () => {
                    billInput.value = name;
                    sugBox.style.display = "none";
                };
                sugBox.appendChild(li);
            });

            sugBox.style.display = "block";
        });
});



        let billItems = [];
        let grandTotal = 0;
        let editBillId = null;

        // --- Check for edit bill ---
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("action") === "edit" && urlParams.get("id")) {
            editBillId = urlParams.get("id");

            fetch("get_bill.php?id=" + editBillId)
                .then(res => res.json())
                .then(data => {
                    document.getElementById('bill_name').value = data.bill_name;
                    document.getElementById('address').value = data.address;
                    document.getElementById('phone').value = data.phone;

                    // Restore discount and old payment if inputs exist
                    if (document.getElementById('discountType'))
                        document.getElementById('discountType').value = data.discount_type || '';
                    if (document.getElementById('discountValue'))
                        document.getElementById('discountValue').value = data.discount_value || '';
                    if (document.getElementById('oldPayment'))
                        document.getElementById('oldPayment').value = data.old_payment || 0;

                    billItems = data.items.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: parseFloat(item.price),
                        qty: parseInt(item.qty),
                        total: parseFloat(item.total),
                        unit: item.unit,
                        mrp: item.mrp,
                        hsn: item.hsn,
                        free: item.free
                    }));

                    renderBill();




                    // 👇 Fetch old balance excluding this bill
                    fetch(`get_old_balance.php?name=${encodeURIComponent(data.bill_name)}&exclude_id=${editBillId}`)
                        .then(res => res.json())
                        .then(balanceData => {
                            let balance = parseFloat(balanceData.total_balance || 0);
                            document.getElementById('oldPayment').value = balance > 0 ? balance.toFixed(2) : '';
                            renderBill();
                        })
                        .catch(err => console.error("Old balance fetch (edit) error:", err));
                })
                .catch(err => console.error("Edit Load Error:", err));
        }

        // --- Quantity Limit Check ---
        document.getElementById("quantity").addEventListener("input", function() {
            let productSelect = document.getElementById("product");
            let selected = productSelect.options[productSelect.selectedIndex];
            if (!selected.value) return;

            let stock = parseInt(selected.getAttribute("data-stock")) || 0;
            let freeStock = parseInt(selected.getAttribute("data-freestock")) || 0;
            let totalAvailable = stock + freeStock;

            let qtyInput = parseInt(this.value) || 0;

            if (qtyInput > totalAvailable) {
                alert(`⚠️ Only ${totalAvailable} total items available in stock!`);
                this.value = totalAvailable;
            } else if (qtyInput < 1) {
                this.value = 1;
            }
        });

        // --- Free Quantity Limit Check ---
        document.getElementById("freeQuantity").addEventListener("input", function() {
            let productSelect = document.getElementById("product");
            let selected = productSelect.options[productSelect.selectedIndex];
            if (!selected.value) return;

            let freeStock = parseInt(selected.getAttribute("data-freestock")) || 0;
            let freeQtyInput = parseInt(this.value) || 0;

            if (freeQtyInput > freeStock) {
                alert(`⚠️ Only ${freeStock} free items available in stock!`);
                this.value = freeStock;
            } else if (freeQtyInput < 0) {
                this.value = 0;
            }
        });

        document.getElementById("product").addEventListener("change", function() {
            let selected = this.options[this.selectedIndex];
            let price = selected.getAttribute("data-price");
            let freestock = selected.getAttribute("data-freestock");
            if (price) {
                document.getElementById("price").value = price;
            } else {
                document.getElementById("price").value = "";
            }
            if (freestock) {
                document.getElementById("freeQtyDiv").value = freestock;
            } else {
                document.getElementById("freeQtyDiv").value = "";
            }
            let original = selected.getAttribute("data-original");
            if (original) {
                document.getElementById("originalPrice").textContent = "Original Price: ₹" + Number(original).toFixed(2);
            } else {
                document.getElementById("originalPrice").textContent = "Original Price: ₹0.00";
            }
        });
        // ---- Add Item ----
        document.getElementById('addBtn').addEventListener('click', function() {
            let productSelect = document.getElementById("product");
            let selected = productSelect.options[productSelect.selectedIndex];
            if (!selected.value) return;

            let stock = parseInt(selected.dataset.stock) || 0;
            let freeStock = parseInt(selected.dataset.freestock) || 0;
            let totalAvailable = stock + freeStock;

            let qty = parseInt(document.getElementById("quantity").value) || 0;
            let freeQuantity = parseInt(document.getElementById("freeQuantity").value) || 0;

            if (qty > totalAvailable) {
                alert(`⚠️ Only ${totalAvailable} total items available in stock!`);
                document.getElementById("quantity").value = totalAvailable;
                return;
            }

            if (freeQuantity > freeStock) {
                alert(`⚠️ Only ${freeStock} free items available in stock!`);
                document.getElementById("freeQuantity").value = freeStock;
                return;
            }
            let productId = productSelect.value;
            let productName = productSelect.options[productSelect.selectedIndex].text;
            let price = parseFloat(document.getElementById("price").value);
            let mrp = productSelect.options[productSelect.selectedIndex].dataset.mrp;
            let unit = productSelect.options[productSelect.selectedIndex].dataset.unit;
            let hsn = productSelect.options[productSelect.selectedIndex].dataset.hsn;
            let free = parseInt(document.getElementById("freeQuantity").value);
            let quantity = qty + free;

            if (productId && quantity > 0) {

                let total = price * quantity;
                billItems.push({
                    id: productId,
                    name: productName,
                    price: price,
                    qty: qty,
                    total: total,
                    mrp: mrp,
                    unit: unit,
                    hsn: hsn,
                    free: free
                });
                renderBill();
            }
        });

        // ---- Render Bill ----
        function renderBill() {
            let tbody = document.getElementById('billItems');
            let tfoot = document.getElementById('billFooter');

            tbody.innerHTML = "";
            tfoot.innerHTML = "";

            grandTotal = 0;
            let totalQty = 0;
            let totalPrice = 0;

            billItems.forEach((item, index) => {
                grandTotal += item.total;
                totalQty += Number(item.qty) + Number(item.free || 0);
                totalPrice += item.price;

                tbody.innerHTML += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.price.toFixed(2)}</td>
<td>${Number(item.qty) + Number(item.free || 0)}</td>
                        <td>${item.mrp}</td>
                        <td>${item.unit}</td>
                        <td>${item.hsn}</td>
                        <td>${item.total.toFixed(2)}</td>
                        <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Remove</button></td>
                    </tr>
                `;
            });

            tfoot.innerHTML = `
                <tr class="fw-bold">
                    <td>Totals</td>
                    <td>${Number(totalPrice).toFixed(2)}</td>
                    <td>${totalQty}</td>
                    <td colspan="3"></td>
                    <td>${Number(grandTotal).toFixed(2)}</td>
                </tr>
            `;
            let subtotal = grandTotal;

            // Discount calculation
            let discountType = document.getElementById("discountType").value;
            let discountValue = parseFloat(document.getElementById("discountValue").value) || 0;
            let discountAmount = 0;

            if (discountType === "percent") {
                discountAmount = subtotal * (discountValue / 100);
            } else if (discountType === "amount") {
                discountAmount = discountValue;
            }

            let afterDiscount = subtotal - discountAmount;

            // Old payment adjustment
            let oldPayment = parseFloat(document.getElementById("oldPayment").value) || 0;
            let finalTotal = afterDiscount + oldPayment;

            let rounded = Math.round(finalTotal);
            let roundoff = (rounded - finalTotal).toFixed(2);

            // Update totals on screen
            document.getElementById("subTotal").textContent = subtotal.toFixed(2);
            document.getElementById("roundOff").textContent = roundoff;
            document.getElementById("grandTotal").textContent = rounded.toFixed(2);



        }
        document.getElementById('bill_name').addEventListener('blur', function() {
            let name = this.value.trim();
            if (name === '') return;

            fetch(`get_old_balance.php?name=${encodeURIComponent(name)}`)
                .then(res => res.json())
                .then(data => {
                    let totalBalance = parseFloat(data.total_balance || 0);
                    document.getElementById('oldPayment').value = totalBalance > 0 ? totalBalance.toFixed(2) : '';

                    // Optional: log or show the list of old bills
                    if (Array.isArray(data.bills) && data.bills.length > 0) {
                        console.table(data.bills); // 👈 shows all unpaid bills in console for debugging
                    }

                    // Recalculate totals
                    renderBill();
                })
                .catch(err => console.error('Old balance fetch error:', err));
        });

        function removeItem(index) {
            billItems.splice(index, 1);
            renderBill();
        }

        // ---- Checkout ----
        document.getElementById('checkoutBtn').addEventListener('click', function() {
            if (billItems.length === 0) {
                alert("Add items first!");
                return;
            }

            let payload = {
                items: billItems,
                total: grandTotal,
                bill_name: document.getElementById('bill_name').value,
                address: document.getElementById('address').value,
                phone: document.getElementById('phone').value,
                discount_type: document.getElementById('discountType').value,
                discount_value: document.getElementById('discountValue').value,
                old_payment: document.getElementById('oldPayment').value
            };

            if (editBillId) {
                payload.bill_id = editBillId;
            }

            fetch(editBillId ? 'update_bill.php' : 'save_bill.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(res => res.text())
                .then(data => {
                    window.open('print_bill.php?bill_id=' + data, '_blank');
                    setTimeout(() => {
                        window.location.href = 'bills.php';
                    }, 1000);
                });
        });
    </script>

</body>

</html>