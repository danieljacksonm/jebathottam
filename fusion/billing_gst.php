<?php include 'config_gst.php';
session_start();

if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit;
} ?>
<!DOCTYPE html>
<html>

<head>
    <title>GST Billing</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/app.css">
    <style>
        body { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); min-height: 100vh; }
        .card { border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border: none; }
        .card-header-style { border-bottom: 2px solid #11998e; padding-bottom: 1rem; }
        .card-body { padding: 2rem; }
        .form-control { margin-bottom: 0.5rem; border-radius: 8px; border: 2px solid #e0e0e0; transition: all 0.3s; }
        .form-control:focus { border-color: #11998e; box-shadow: 0 0 0 0.2rem rgba(17,153,142,0.25); }
        .table-responsive { margin-top: 1rem; border-radius: 12px; overflow: hidden; }
        .btn { margin: 0.25rem; border-radius: 8px; font-weight: 600; transition: all 0.3s; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .row { margin-bottom: 0.5rem; }
        .table th, .table td { white-space: nowrap; vertical-align: middle; }
        .table thead th { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; border: none; }
        .table tbody tr:hover { background-color: #e8f5e9; }
        .customer-section { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .product-section { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .section-title { color: #11998e; font-weight: 700; margin-bottom: 1rem; }
        .input-group-text { background: #11998e; color: white; border: none; }
        .checkout-btn { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border: none; font-size: 1.1rem; padding: 15px; }
        .checkout-btn:hover { background: linear-gradient(135deg, #38ef7d 0%, #11998e 100%); }
        .suggestions { position: absolute; z-index: 9999; max-height: 200px; overflow-y: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .suggestions .list-group-item { cursor: pointer; transition: background 0.2s; }
        .suggestions .list-group-item:hover { background: #e8f5e9; }
    </style>
</head>

<body class="container py-4">

    <div class="card p-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center card-header-style gap-2">
            <h2 class="mb-0">🧾 GST Billing</h2>
            <a href="dashboard_gst.php" class="btn btn-success">⬅ Back to Dashboard</a>
        </div>

        <!-- Customer Details -->
        <div class="customer-section">
            <h5 class="section-title">👤 Customer Details</h5>
            <form id="addForm" class="row g-3">
                <div class="col-12 col-md-4">
                    <label class="form-label fw-bold text-muted">Bill Name *</label>
                    <div class="input-group">
                        <span class="input-group-text">👤</span>
                        <input type="text" name="bill_name" id="bill_name" placeholder="Enter customer name" class="form-control" required>
                    </div>
                    <ul id="suggestions" class="list-group position-absolute w-100 suggestions" style="display:none;"></ul>
                </div>
                <div class="col-12 col-md-4">
                    <label class="form-label fw-bold text-muted">Address</label>
                    <div class="input-group">
                        <span class="input-group-text">📍</span>
                        <input type="text" name="address" id="address" placeholder="Enter address" class="form-control">
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <label class="form-label fw-bold text-muted">Phone Number</label>
                    <div class="input-group">
                        <span class="input-group-text">📱</span>
                        <input type="text" name="phone" id="phone" placeholder="Enter phone number" class="form-control">
                    </div>
                </div>

        </form>
        </div>

        <!-- Product Selection -->
        <div class="product-section">
            <h5 class="section-title">📦 Add Product to Bill</h5>
            <form id="addForm" class="row g-3">
                <div class="col-12 col-md-6">
                    <label class="form-label fw-bold text-muted">Select Product *</label>
                    <div class="input-group">
                        <span class="input-group-text">📦</span>
                        <select id="product" class="form-control" required>
                            <option value="">-- Select Product --</option>
                            <?php
                            $products = $conn->query("SELECT * FROM gst_products ORDER BY name ASC");
                            while ($p = $products->fetch_assoc()) {
                                $disabled = ($p['stock'] <= 0 && $p['free_stock'] <= 0) ? 'disabled' : '';
                                $style = ($p['stock'] <= 0 && $p['free_stock'] <= 0) ? 'color:red;' : '';
                                echo "<option value='{$p['id']}'
                                    data-price='{$p['price']}'
                                    data-hsn='{$p['hsn']}'
                                    data-mrp='{$p['mrp']}'
                                    data-unit='{$p['unit']}'
                                    data-original='{$p['original']}'
                                    data-stock='{$p['stock']}'
                                    data-freestock='{$p['free_stock']}'
                                    data-cgst='{$p['cgst_rate']}'
                                    data-sgst='{$p['sgst_rate']}'
                                    data-cess='{$p['cess_rate']}'
                                    {$disabled} style='{$style}'>
                                    {$p['name']} (₹{$p['price']}) - GST: {$p['cgst_rate']}%+{$p['sgst_rate']}% - Stock: {$p['stock']}, Free: {$p['free_stock']}
                                </option>";
                            }
                            ?>
                        </select>
                    </div>
                </div>

                <div class="col-6 col-md-2">
                    <label class="form-label fw-bold text-muted">Quantity *</label>
                    <div class="input-group">
                        <span class="input-group-text">🔢</span>
                        <input type="number" id="quantity" min="1" value="1" class="form-control" required>
                    </div>
                </div>

                <div class="col-6 col-md-2">
                    <label class="form-label fw-bold text-muted">Price (₹) *</label>
                    <div class="input-group">
                        <span class="input-group-text">💰</span>
                        <input type="number" id="price" step="0.01" placeholder="0.00" class="form-control" required>
                    </div>
                </div>

                <div class="col-12 col-md-3">
                    <label class="form-label fw-bold text-muted">Original Price</label>
                    <div id="originalPrice" class="form-control bg-light">Original Price: ₹0.00</div>
                </div>

                <div class="col-6 col-md-2 d-flex align-items-center">
                    <div class="form-check">
                        <input type="checkbox" id="isFree" class="form-check-input">
                        <label for="isFree" class="form-check-label">Free Item</label>
                    </div>
                </div>

                <div class="col-6 col-md-2" id="freeQtyDiv" style="display:none;">
                    <label class="form-label fw-bold text-muted">Free Qty</label>
                    <input type="number" id="freeQuantity" min="0" value="0" class="form-control" placeholder="0">
                </div>

                <div class="col-12 col-md-3 d-flex align-items-end">
                    <button type="button" id="addBtn" class="btn btn-success w-100 py-2">➕ Add to Bill</button>
                </div>
            </form>
        </div>

        <!-- Bill Items Table -->
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price (₹)</th>
                        <th>Qty</th>
                        <th>MRP</th>
                        <th>Unit</th>
                        <th>HSN/SAC</th>
                        <th>CGST (%)</th>
                        <th>SGST (%)</th>
                        <th>CESS (%)</th>
                        <th>GST Amt (₹)</th>
                        <th>Total (₹)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="billItems"></tbody>
                <tfoot id="billFooter"></tfoot>
            </table>
        </div>

        <!-- Bill Summary -->
        <div class="row mt-4">
            <div class="col-12 col-md-6">
                <div class="card" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; border: none;">
                    <div class="card-body">
                        <h5 class="card-title mb-3">📊 GST Summary</h5>
                        <table class="table table-sm table-borderless mb-0">
                            <tbody>
                                <tr>
                                    <th>Subtotal (Before GST)</th>
                                    <td id="gstSubtotal" class="text-end">₹0.00</td>
                                </tr>
                                <tr>
                                    <th>CGST Amount</th>
                                    <td id="cgstAmount" class="text-end">₹0.00</td>
                                </tr>
                                <tr>
                                    <th>SGST Amount</th>
                                    <td id="sgstAmount" class="text-end">₹0.00</td>
                                </tr>
                                <tr>
                                    <th>CESS Amount</th>
                                    <td id="cessAmount" class="text-end">₹0.00</td>
                                </tr>
                                <tr class="border-top border-light">
                                    <th class="fs-5">Total GST</th>
                                    <td id="totalGST" class="text-end fs-5 fw-bold">₹0.00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-6">
                <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
                    <div class="card-body">
                        <h5 class="card-title mb-3">💰 Bill Summary</h5>
                        <div class="row g-3">
                            <div class="col-6">
                                <label class="form-label fw-bold mb-0">Discount Type</label>
                                <select id="discountType" class="form-control">
                                    <option value="none">No Discount</option>
                                    <option value="percent">Percentage (%)</option>
                                    <option value="amount">Flat Amount (₹)</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label class="form-label fw-bold mb-0">Discount Value</label>
                                <input type="number" id="discountValue" step="0.01" min="0" value="0" class="form-control">
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-bold mb-0">Old Payment (Advance ₹)</label>
                                <input type="number" id="oldPayment" step="0.01" min="0" value="0" class="form-control">
                            </div>
                        </div>
                        <hr class="border-light">
                        <table class="table table-sm table-borderless mb-0">
                            <tbody>
                                <tr>
                                    <th>Subtotal</th>
                                    <td id="subTotal" class="text-end">₹0.00</td>
                                </tr>
                                <tr>
                                    <th>Round Off</th>
                                    <td id="roundOff" class="text-end">₹0.00</td>
                                </tr>
                                <tr class="border-top border-light">
                                    <th class="fs-5">Grand Total</th>
                                    <td id="grandTotal" class="text-end fs-5 fw-bold">₹0.00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <button class="btn checkout-btn w-100 text-white fw-bold mt-4" id="checkoutBtn">💾 Save & Print GST Bill</button>
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

    fetch("get_billnames_gst.php?q=" + encodeURIComponent(val))
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

            fetch("get_bill_gst.php?id=" + editBillId)
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
                        free: item.free,
                        cgst_rate: parseFloat(item.cgst_rate),
                        sgst_rate: parseFloat(item.sgst_rate),
                        cess_rate: parseFloat(item.cess_rate),
                        cgst_amount: parseFloat(item.cgst_amount),
                        sgst_amount: parseFloat(item.sgst_amount),
                        cess_amount: parseFloat(item.cess_amount)
                    }));

                    renderBill();



                    // 👇 Fetch old balance excluding this bill
                    fetch(`get_old_balance_gst.php?name=${encodeURIComponent(data.bill_name)}&exclude_id=${editBillId}`)
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
            let cgst_rate = parseFloat(productSelect.options[productSelect.selectedIndex].dataset.cgst) || 0;
            let sgst_rate = parseFloat(productSelect.options[productSelect.selectedIndex].dataset.sgst) || 0;
            let cess_rate = parseFloat(productSelect.options[productSelect.selectedIndex].dataset.cess) || 0;
            let free = parseInt(document.getElementById("freeQuantity").value);
            let quantity = qty + free;

            // Calculate GST amounts
            let itemSubtotal = price * quantity;
            let cgst_amount = roundToTwo(itemSubtotal * (cgst_rate / 100));
            let sgst_amount = roundToTwo(itemSubtotal * (sgst_rate / 100));
            let cess_amount = roundToTwo(itemSubtotal * (cess_rate / 100));
            let totalGST = cgst_amount + sgst_amount + cess_amount;
            let totalWithGST = itemSubtotal + totalGST;

            if (productId && quantity > 0) {
                billItems.push({
                    id: productId,
                    name: productName,
                    price: price,
                    qty: qty,
                    total: totalWithGST,
                    mrp: mrp,
                    unit: unit,
                    hsn: hsn,
                    free: free,
                    cgst_rate: cgst_rate,
                    sgst_rate: sgst_rate,
                    cess_rate: cess_rate,
                    cgst_amount: cgst_amount,
                    sgst_amount: sgst_amount,
                    cess_amount: cess_amount,
                    subtotal: itemSubtotal,
                    gst_amount: totalGST
                });
                renderBill();
            }
        });

        function roundToTwo(num) {
            return Math.round((num + Number.EPSILON) * 100) / 100;
        }

        // ---- Render Bill ----
        function renderBill() {
            let tbody = document.getElementById('billItems');
            let tfoot = document.getElementById('billFooter');

            tbody.innerHTML = "";
            tfoot.innerHTML = "";

            let subtotal = 0;
            let totalCGST = 0;
            let totalSGST = 0;
            let totalCESS = 0;
            let totalGST = 0;
            let grandTotal = 0;
            let totalQty = 0;

            billItems.forEach((item, index) => {
                subtotal += item.subtotal;
                totalCGST += item.cgst_amount;
                totalSGST += item.sgst_amount;
                totalCESS += item.cess_amount;
                totalGST += item.gst_amount;
                grandTotal += item.total;
                totalQty += Number(item.qty) + Number(item.free || 0);

                tbody.innerHTML += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${Number(item.qty) + Number(item.free || 0)}</td>
                        <td>${item.mrp}</td>
                        <td>${item.unit}</td>
                        <td>${item.hsn}</td>
                        <td>${item.cgst_rate.toFixed(2)}%</td>
                        <td>${item.sgst_rate.toFixed(2)}%</td>
                        <td>${item.cess_rate.toFixed(2)}%</td>
                        <td>${item.gst_amount.toFixed(2)}</td>
                        <td>${item.total.toFixed(2)}</td>
                        <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Remove</button></td>
                    </tr>
                `;
            });

            // Update GST Summary
            document.getElementById("gstSubtotal").textContent = "₹" + subtotal.toFixed(2);
            document.getElementById("cgstAmount").textContent = "₹" + totalCGST.toFixed(2);
            document.getElementById("sgstAmount").textContent = "₹" + totalSGST.toFixed(2);
            document.getElementById("cessAmount").textContent = "₹" + totalCESS.toFixed(2);
            document.getElementById("totalGST").textContent = "₹" + totalGST.toFixed(2);

            tfoot.innerHTML = `
                <tr class="fw-bold">
                    <td>Totals</td>
                    <td colspan="4"></td>
                    <td>${totalQty}</td>
                    <td colspan="3"></td>
                    <td>${totalGST.toFixed(2)}</td>
                    <td>${grandTotal.toFixed(2)}</td>
                    <td></td>
                </tr>
            `;

            // Discount calculation
            let discountType = document.getElementById("discountType").value;
            let discountValue = parseFloat(document.getElementById("discountValue").value) || 0;
            let discountAmount = 0;

            if (discountType === "percent") {
                discountAmount = grandTotal * (discountValue / 100);
            } else if (discountType === "amount") {
                discountAmount = discountValue;
            }

            let afterDiscount = grandTotal - discountAmount;

            // Old payment adjustment
            let oldPayment = parseFloat(document.getElementById("oldPayment").value) || 0;
            let finalTotal = afterDiscount + oldPayment;

            let rounded = Math.round(finalTotal);
            let roundoff = (rounded - finalTotal).toFixed(2);

            // Update totals on screen
            document.getElementById("subTotal").textContent = grandTotal.toFixed(2);
            document.getElementById("roundOff").textContent = roundoff;
            document.getElementById("grandTotal").textContent = rounded.toFixed(2);
        }
        
        document.getElementById('bill_name').addEventListener('blur', function() {
            let name = this.value.trim();
            if (name === '') return;

            fetch(`get_old_balance_gst.php?name=${encodeURIComponent(name)}`)
                .then(res => res.json())
                .then(data => {
                    let totalBalance = parseFloat(data.total_balance || 0);
                    document.getElementById('oldPayment').value = totalBalance > 0 ? totalBalance.toFixed(2) : '';

                    // Optional: log or show the list of old bills
                    if (Array.isArray(data.bills) && data.bills.length > 0) {
                        console.table(data.bills);
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

        // ---- Keyboard Shortcuts ----
        document.addEventListener('keydown', function(e) {
            // Ctrl+Enter or F5 - Checkout/Save
            if ((e.ctrlKey && e.key === 'Enter') || e.key === 'F5') {
                e.preventDefault();
                document.getElementById('checkoutBtn').click();
            }
            // Ctrl+N - New Bill (reload page)
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                if (confirm('Start a new bill? All unsaved changes will be lost.')) {
                    window.location.href = 'billing_gst.php';
                }
            }
            // Escape - Clear form
            if (e.key === 'Escape') {
                if (billItems.length > 0) {
                    if (confirm('Clear all items and start over?')) {
                        billItems = [];
                        document.getElementById('bill_name').value = '';
                        document.getElementById('address').value = '';
                        document.getElementById('phone').value = '';
                        document.getElementById('quantity').value = '';
                        document.getElementById('freeQuantity').value = '';
                        document.getElementById('discountValue').value = '0';
                        document.getElementById('oldPayment').value = '0';
                        renderBill();
                    }
                }
            }
            // Alt+A - Add Item
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                document.getElementById('addBtn').click();
            }
            // Ctrl+D - Go to Dashboard
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                window.location.href = 'dashboard_gst.php';
            }
            // Ctrl+B - Go to GST Bills List
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                window.location.href = 'bills_gst.php';
            }
            // F1 - Show keyboard shortcuts help
            if (e.key === 'F1') {
                e.preventDefault();
                alert('Keyboard Shortcuts:\n\n' +
                      'Ctrl+Enter / F5 - Checkout & Save Bill\n' +
                      'Ctrl+N - New Bill\n' +
                      'Escape - Clear Form\n' +
                      'Alt+A - Add Item\n' +
                      'Ctrl+D - Go to Dashboard\n' +
                      'Ctrl+B - Go to GST Bills List\n' +
                      'F1 - Show this help');
            }
        });

        // ---- Checkout ----
        document.getElementById('checkoutBtn').addEventListener('click', function() {
            if (billItems.length === 0) {
                alert("Add items first!");
                return;
            }

            var normalizedItems = billItems.map(function(item) {
                var pid = parseInt(item.id, 10);
                var q = Math.max(0, parseInt(item.qty, 10) || 0);
                var f = Math.max(0, parseInt(item.free, 10) || 0);
                var price = parseFloat(item.price) || 0;
                if (!pid || q + f <= 0) return null;
                return {
                    id: pid,
                    name: item.name,
                    price: price,
                    qty: q,
                    free: f,
                    total: item.total,
                    subtotal: item.subtotal,
                    mrp: item.mrp != null ? String(item.mrp) : '',
                    unit: item.unit || '',
                    hsn: item.hsn != null ? String(item.hsn) : '',
                    cgst_rate: item.cgst_rate,
                    sgst_rate: item.sgst_rate,
                    cess_rate: item.cess_rate,
                    cgst_amount: item.cgst_amount,
                    sgst_amount: item.sgst_amount,
                    cess_amount: item.cess_amount
                };
            }).filter(Boolean);

            if (normalizedItems.length === 0) {
                alert("Each line needs a valid product and quantity (paid and/or free).");
                return;
            }

            var payloadTotal = normalizedItems.reduce(function(s, i) { return s + i.total; }, 0);
            var payloadSubtotal = normalizedItems.reduce(function(s, i) { return s + i.subtotal; }, 0);
            let payload = {
                items: normalizedItems,
                total: payloadTotal,
                subtotal: payloadSubtotal,
                cgst_total: normalizedItems.reduce(function(s, i) { return s + i.cgst_amount; }, 0),
                sgst_total: normalizedItems.reduce(function(s, i) { return s + i.sgst_amount; }, 0),
                cess_total: normalizedItems.reduce(function(s, i) { return s + i.cess_amount; }, 0),
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

            fetch(editBillId ? 'update_bill_gst.php' : 'save_bill_gst.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(function(res) { return res.text(); })
                .then(function(data) {
                    var bid = data.trim();
                    if (/^\d+$/.test(bid)) {
                    window.open('print_bill_gst.php?bill_id=' + bid, '_blank');
                    setTimeout(function() {
                        window.location.href = 'bills_gst.php';
                    }, 1000);
                    } else {
                        try { var err = JSON.parse(data); alert('Error: ' + (err.error || data)); } catch (e) { alert('Error: ' + data); }
                    }
                });
        });
    </script>

</body>

</html>
