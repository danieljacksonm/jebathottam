<?php
include 'config.php';
require_once 'auth_helper.php';
require_once 'gst_helpers.php';
requireSection('gst');

$gstCfg = gstConfig();
$categories = gstCategories();
$gstSnackKeywords = json_encode($gstCfg['gst_product_keywords']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>GST Billing by Category</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        body { background-color: #f0f4f8; }
        .card { border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .cat-btn { border-radius: 25px; padding: 10px 20px; margin: 4px; font-weight: 600; }
        .cat-btn.active { box-shadow: 0 0 0 3px rgba(0,123,255,0.5); }
        .product-card {
            border-radius: 10px;
            border: 1px solid #dee2e6;
            padding: 12px;
            margin-bottom: 10px;
            background: #fff;
            transition: box-shadow 0.2s;
        }
        .product-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .product-name { font-weight: 600; color: #333; }
        .product-meta { font-size: 0.9rem; color: #666; }
        .qty-input { width: 70px; text-align: center; }
        .bill-table th { background: #2c3e50; color: #fff; }
        .bill-table td { vertical-align: middle; }
        .bill-qty-input { width: 70px; text-align: center; }
        .bill-price-input { width: 80px; text-align: right; }
        #productList { max-height: 55vh; overflow-y: auto; }
        #productListWrap { position: relative; }
        .suggest-wrap { position: relative; }
        .suggest-list { position: absolute; top: 100%; left: 0; right: 0; z-index: 1000; max-height: 200px; overflow-y: auto; }
        .suggest-list .list-group-item { cursor: pointer; }
        .suggest-list .list-group-item:hover { background-color: #e9ecef; }
    </style>
</head>
<body class="container-fluid py-3">

    <div class="card p-3 p-md-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
            <h2 class="mb-0">🧾 GST Billing</h2>
            <div class="d-flex gap-2 flex-wrap">
                <a href="gst_billing_categories.php" class="btn btn-outline-secondary">🔄 New Bill</a>
                <a href="dashboard_gst.php" class="btn btn-success">⬅ Back</a>
            </div>
        </div>

        <!-- Customer & Category row -->
        <div class="row g-2 mb-3">
            <div class="col-12 col-md-3 suggest-wrap">
                <input type="text" id="bill_name" class="form-control" placeholder="Customer / Bill Name" required autocomplete="off">
                <ul id="nameSuggestions" class="list-group suggest-list" style="display: none;"></ul>
            </div>
            <div class="col-12 col-md-3 suggest-wrap">
                <input type="text" id="address" class="form-control" placeholder="Address" autocomplete="off">
                <ul id="addressSuggestions" class="list-group suggest-list" style="display: none;"></ul>
            </div>
            <div class="col-12 col-md-3">
                <input type="text" id="phone" class="form-control" placeholder="Phone">
            </div>
        </div>

        <div class="d-flex flex-wrap gap-2 mb-3">
            <?php foreach ($categories as $cat): ?>
                <button type="button" class="cat-btn btn btn-outline-primary" data-category="<?= htmlspecialchars($cat) ?>">
                    <?= htmlspecialchars($cat) ?>
                </button>
            <?php endforeach; ?>
        </div>

        <div class="row">
            <!-- Products by category -->
            <div class="col-12 col-lg-6" id="productListWrap">
                <h5 class="mb-2">Products</h5>
                <input type="search" id="productSearch" class="form-control mb-2" placeholder="🔍 Search product in this category..." autocomplete="off">
                <div id="productList" class="mb-2">
                    <p class="text-muted">Select a category above to load products.</p>
                </div>
                <div id="addCategoryBtnWrap" class="mb-3" style="display: none;">
                    <button type="button" class="btn btn-success w-100" id="addCategoryToBillBtn">Add to Bill</button>
                </div>
            </div>

            <!-- Bill cart -->
            <div class="col-12 col-lg-6">
                <h5 class="mb-2">Current Bill</h5>
                <div class="table-responsive">
                    <table class="table table-bordered bill-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>HSN</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Taxable</th>
                                <th>CGST</th>
                                <th>SGST</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="billItems"></tbody>
                        <tfoot id="billFooter"></tfoot>
                    </table>
                </div>
                <div class="row g-2 mt-2">
                    <div class="col-6 col-md-3">
                        <label class="form-label small">Discount type</label>
                        <select id="discountType" class="form-select form-select-sm">
                            <option value="none">None</option>
                            <option value="percent">%</option>
                            <option value="amount">₹ Amount</option>
                        </select>
                    </div>
                    <div class="col-6 col-md-3">
                        <label class="form-label small">Discount value</label>
                        <input type="number" id="discountValue" class="form-control form-control-sm" step="0.01" min="0" value="0">
                    </div>
                    <div class="col-6 col-md-3">
                        <label class="form-label small">Old payment (₹)</label>
                        <input type="number" id="oldPayment" class="form-control form-control-sm" step="0.01" min="0" value="0">
                    </div>
                </div>
                <div class="mt-3 small text-muted">
                    Taxable: ₹<span id="totalTaxable">0.00</span> &nbsp;|&nbsp;
                    CGST: ₹<span id="totalCgst">0.00</span> &nbsp;|&nbsp;
                    SGST: ₹<span id="totalSgst">0.00</span> &nbsp;|&nbsp;
                    Subtotal: ₹<span id="subTotal">0.00</span> &nbsp;|&nbsp;
                    Round off: <span id="roundOff">0.00</span> &nbsp;|&nbsp;
                    <strong>Grand Total: ₹<span id="grandTotal">0.00</span></strong>
                </div>
                <button type="button" class="btn btn-primary btn-lg w-100 mt-3" id="checkoutBtn">✅ Checkout & Save Bill</button>
            </div>
        </div>
    </div>

    <script>
        const CGST_RATE = <?= floatval($gstCfg['cgst_rate']) ?>;
        const SGST_RATE = <?= floatval($gstCfg['sgst_rate']) ?>;
        const categories = <?= json_encode(array_values($categories)) ?>;
        const GST_MATCH_KEYWORDS = <?= $gstSnackKeywords ?>;
        let billItems = [];

        function calcGst(total) {
            const inclusive = parseFloat(total) || 0;
            const taxable = Math.round(inclusive / 1.05 * 100) / 100;
            const cgst = Math.round(taxable * CGST_RATE / 100 * 10000) / 10000;
            const sgst = Math.round(taxable * SGST_RATE / 100 * 10000) / 10000;
            return { taxable, cgst, sgst };
        }

        function isGstProductName(name) {
            const n = (name || '').toLowerCase();
            if (n.includes('maaza') || n.includes('maasa')) return false;
            if (n.includes('cavin') || n.includes('friva') || n.includes('milkshake') || n.includes('milk')) return true;
            if (/\bmaa\b/.test(n) || n.includes('maa fd')) return true;
            return GST_MATCH_KEYWORDS.some(function(kw) { return n.includes(kw); });
        }
        let grandTotal = 0;
        let currentCategory = '';
        let editBillId = null;

        // Load bill for editing
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'edit' && urlParams.get('id')) {
            editBillId = urlParams.get('id');
            fetch('get_bill.php?id=' + editBillId)
                .then(r => r.json())
                .then(function(data) {
                    if (data.error) { alert(data.error); return; }
                    document.getElementById('bill_name').value = data.bill_name || '';
                    document.getElementById('address').value = data.address || '';
                    document.getElementById('phone').value = data.phone || '';
                    document.getElementById('discountType').value = data.discount_type || 'none';
                    document.getElementById('discountValue').value = data.discount_value || 0;
                    document.getElementById('oldPayment').value = data.old_payment || 0;
                    billItems = (data.items || []).filter(function(item) {
                        return isGstProductName(item.name);
                    }).map(function(item) {
                        return {
                            id: item.id,
                            name: item.name,
                            price: parseFloat(item.price),
                            qty: parseInt(item.qty, 10) || 0,
                            free: parseInt(item.free, 10) || 0,
                            total: parseFloat(item.total),
                            unit: item.unit || '',
                            mrp: item.mrp != null ? String(item.mrp) : '',
                            hsn: item.hsn != null ? String(item.hsn) : ''
                        };
                    });
                    renderBill();
                })
                .catch(function() { alert('Failed to load bill.'); });
        }

        document.querySelectorAll('.cat-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentCategory = this.dataset.category || '';
                loadProducts(currentCategory);
            });
        });

        function loadProducts(category) {
            const url = 'get_gst_products_by_category.php' + (category ? '?category=' + encodeURIComponent(category) : '');
            document.getElementById('productList').innerHTML = '<p class="text-muted">Loading...</p>';
            fetch(url)
                .then(r => r.json())
                .then(data => {
                    const list = document.getElementById('productList');
                    const products = data.products || [];
                    if (products.length === 0) {
                        list.innerHTML = '<p class="text-muted">No products in this category.</p>';
                        document.getElementById('addCategoryBtnWrap').style.display = 'none';
                        return;
                    }
                    list.innerHTML = products.map(p => {
                        const stock = parseInt(p.stock) || 0;
                        const freeStock = parseInt(p.free_stock) || 0;
                        return `
                            <div class="product-card" data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${p.price}" data-unit="${p.unit||''}" data-mrp="${p.mrp||''}" data-hsn="${p.hsn||''}" data-stock="${stock}" data-freestock="${freeStock}">
                                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
                                    <div class="product-name">${escapeHtml(p.name)}</div>
                                    <div class="product-meta">₹${Number(p.price).toFixed(2)} &nbsp;|&nbsp; HSN: ${p.hsn||'-'} &nbsp;|&nbsp; Stock: ${stock}, Free: ${freeStock}</div>
                                </div>
                                <div class="d-flex align-items-center gap-2 mt-2">
                                    <label class="small mb-0">Qty:</label>
                                    <input type="number" class="form-control form-control-sm qty-input" min="0" value="" placeholder="0" max="${stock}" data-qty>
                                    <label class="small mb-0">Free:</label>
                                    <input type="number" class="form-control form-control-sm qty-input" min="0" value="" placeholder="0" max="${freeStock}" data-free>
                                </div>
                            </div>
                        `;
                    }).join('');

                    document.getElementById('addCategoryBtnWrap').style.display = 'block';
                    const ps = document.getElementById('productSearch');
                    if (ps) { ps.value = ''; }
                })
                .catch(() => {
                    document.getElementById('productList').innerHTML = '<p class="text-danger">Failed to load products.</p>';
                    document.getElementById('addCategoryBtnWrap').style.display = 'none';
                });
        }

        document.getElementById('productSearch')?.addEventListener('input', function() {
            const q = this.value.trim().toLowerCase();
            document.querySelectorAll('#productList .product-card').forEach(function(card) {
                const name = (card.dataset.name || '').toLowerCase();
                card.style.display = (!q || name.indexOf(q) !== -1) ? '' : 'none';
            });
        });

        document.getElementById('addCategoryToBillBtn').addEventListener('click', function() {
            const cards = document.querySelectorAll('#productList .product-card');
            let added = 0;
            cards.forEach(card => {
                const qtyInput = card.querySelector('[data-qty]');
                const freeInput = card.querySelector('[data-free]');
                let qty = parseInt(qtyInput.value, 10) || 0;
                let free = parseInt(freeInput.value, 10) || 0;
                const stock = parseInt(card.dataset.stock) || 0;
                const freeStock = parseInt(card.dataset.freestock) || 0;
                if (qty > stock) { qty = stock; qtyInput.value = stock; }
                if (free > freeStock) { free = freeStock; freeInput.value = freeStock; }
                if (qty <= 0 && free <= 0) return;
                const id = card.dataset.id;
                const name = card.dataset.name;
                const price = parseFloat(card.dataset.price);
                const unit = card.dataset.unit || '';
                const mrp = card.dataset.mrp || '';
                const hsn = card.dataset.hsn || '';
                const total = price * (qty + free);
                billItems.push({ id, name, price, qty, total, mrp, unit, hsn, free });
                added++;
                qtyInput.value = '';
                freeInput.value = '';
            });
            if (added > 0) renderBill();
        });

        function escapeHtml(s) {
            const div = document.createElement('div');
            div.textContent = s;
            return div.innerHTML;
        }

        function renderBill() {
            const tbody = document.getElementById('billItems');
            const tfoot = document.getElementById('billFooter');
            tbody.innerHTML = '';
            grandTotal = 0;
            let sumTaxable = 0, sumCgst = 0, sumSgst = 0;
            billItems.forEach((item, idx) => {
                const gst = calcGst(item.total);
                grandTotal += item.total;
                sumTaxable += gst.taxable;
                sumCgst += gst.cgst;
                sumSgst += gst.sgst;
                const totalQty = Number(item.qty) + Number(item.free || 0);
                tbody.innerHTML += `
                    <tr>
                        <td>${escapeHtml(item.name)}</td>
                        <td>${escapeHtml(item.hsn || '')}</td>
                        <td><input type="number" class="form-control form-control-sm bill-price-input" step="0.01" min="0" value="${item.price}" data-idx="${idx}"></td>
                        <td><input type="number" class="form-control form-control-sm bill-qty-input" min="0" value="${totalQty}" data-idx="${idx}"></td>
                        <td>${gst.taxable.toFixed(2)}</td>
                        <td>${gst.cgst.toFixed(4)}</td>
                        <td>${gst.sgst.toFixed(4)}</td>
                        <td class="bill-row-total">₹${item.total.toFixed(2)}</td>
                        <td><button type="button" class="btn btn-danger btn-sm" data-remove="${idx}">Remove</button></td>
                    </tr>
                `;
            });
            tbody.querySelectorAll('[data-remove]').forEach(btn => {
                btn.addEventListener('click', function() {
                    billItems.splice(parseInt(this.dataset.remove), 1);
                    renderBill();
                });
            });
            tbody.querySelectorAll('.bill-price-input').forEach(input => {
                input.addEventListener('change', function() {
                    const idx = parseInt(this.dataset.idx, 10);
                    let val = parseFloat(this.value);
                    if (isNaN(val) || val < 0) val = 0;
                    this.value = val;
                    const item = billItems[idx];
                    const totalQty = Number(item.qty) + Number(item.free || 0);
                    item.price = val;
                    item.total = val * totalQty;
                    billItems[idx] = item;
                    renderBill();
                });
            });
            tbody.querySelectorAll('.bill-qty-input').forEach(input => {
                input.addEventListener('change', function() {
                    const idx = parseInt(this.dataset.idx, 10);
                    let val = parseInt(this.value, 10) || 0;
                    if (val < 0) val = 0;
                    this.value = val;
                    const item = billItems[idx];
                    item.qty = val;
                    item.free = 0;
                    item.total = item.price * val;
                    billItems[idx] = item;
                    renderBill();
                });
            });

            let subtotal = grandTotal;
            const discountType = document.getElementById('discountType').value;
            const discountVal = parseFloat(document.getElementById('discountValue').value) || 0;
            let discountAmt = 0;
            if (discountType === 'percent') discountAmt = subtotal * (discountVal / 100);
            else if (discountType === 'amount') discountAmt = discountVal;
            let afterDiscount = subtotal - discountAmt;
            const oldPay = parseFloat(document.getElementById('oldPayment').value) || 0;
            let finalTotal = afterDiscount + oldPay;
            const rounded = Math.round(finalTotal);
            const roundoff = (rounded - finalTotal).toFixed(2);

            tfoot.innerHTML = '<tr class="fw-bold"><td colspan="4">Total</td><td>' + sumTaxable.toFixed(2) + '</td><td>' + sumCgst.toFixed(4) + '</td><td>' + sumSgst.toFixed(4) + '</td><td>₹' + grandTotal.toFixed(2) + '</td><td></td></tr>';
            document.getElementById('totalTaxable').textContent = sumTaxable.toFixed(2);
            document.getElementById('totalCgst').textContent = sumCgst.toFixed(4);
            document.getElementById('totalSgst').textContent = sumSgst.toFixed(4);
            document.getElementById('subTotal').textContent = subtotal.toFixed(2);
            document.getElementById('roundOff').textContent = roundoff;
            document.getElementById('grandTotal').textContent = rounded.toFixed(2);
        }

        document.getElementById('checkoutBtn').addEventListener('click', function() {
            if (billItems.length === 0) {
                alert('Add at least one item to the bill.');
                return;
            }
            const billName = document.getElementById('bill_name').value.trim();
            if (!billName) {
                alert('Enter customer / bill name.');
                return;
            }
            // Normalize items so stock is deducted correctly: integer qty/free, total = price * (qty + free)
            const normalizedItems = billItems.map(function(item) {
                var qty = Math.max(0, parseInt(item.qty, 10) || 0);
                var free = Math.max(0, parseInt(item.free, 10) || 0);
                if (qty === 0 && free === 0) return null;
                var price = parseFloat(item.price) || 0;
                return {
                    id: parseInt(item.id, 10),
                    name: item.name,
                    price: price,
                    qty: qty,
                    free: free,
                    total: price * (qty + free),
                    unit: item.unit || '',
                    mrp: item.mrp != null ? String(item.mrp) : '',
                    hsn: item.hsn != null ? String(item.hsn) : ''
                };
            }).filter(Boolean);
            if (normalizedItems.length === 0) {
                alert('All items have zero quantity. Add at least one.');
                return;
            }
            var payloadTotal = normalizedItems.reduce(function(sum, it) { return sum + it.total; }, 0);
            const payload = {
                bill_name: billName,
                address: document.getElementById('address').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                items: normalizedItems,
                total: payloadTotal,
                discount_type: document.getElementById('discountType').value,
                discount_value: document.getElementById('discountValue').value,
                old_payment: document.getElementById('oldPayment').value
            };
            if (editBillId) payload.bill_id = parseInt(editBillId, 10);
            const apiUrl = editBillId ? 'update_bill.php' : 'save_gst_bill.php';
            fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(r => r.text())
            .then(data => {
                let bid = '';
                try {
                    const j = JSON.parse(data);
                    if (j.error) { alert('Error: ' + j.error); return; }
                    bid = String(j.bill_id || '');
                } catch (e) {
                    bid = data.trim();
                }
                if (/^\d+$/.test(bid)) {
                    window.open('print_gst_bill.php?bill_id=' + bid, '_blank');
                    billItems = [];
                    editBillId = null;
                    renderBill();
                    document.getElementById('bill_name').value = '';
                    document.getElementById('address').value = '';
                    document.getElementById('phone').value = '';
                    document.getElementById('discountValue').value = '0';
                    document.getElementById('oldPayment').value = '0';
                    if (window.history && window.history.replaceState) window.history.replaceState({}, '', 'gst_billing_categories.php');
                    setTimeout(function() { window.location.href = 'gst_bills.php'; }, 800);
                } else {
                    try { const err = JSON.parse(data); alert('Error: ' + (err.error || data)); } catch(e) { alert('Error: ' + data); }
                }
            })
            .catch(() => alert('Network error.'));
        });

        function showSuggestions(field, list) {
            var q = field.value.trim();
            if (q.length < 1) { list.style.display = 'none'; return; }
            var fieldParam = (field.id === 'address') ? '&field=address' : '&field=name';
            var api = (field.id === 'bill_name') ? 'get_gst_customers.php?q=' + encodeURIComponent(q) : 'get_bill_suggestions.php?q=' + encodeURIComponent(q) + fieldParam;
            fetch(api)
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    list.innerHTML = '';
                    if (!data || data.length === 0) { list.style.display = 'none'; return; }
                    data.forEach(function(row) {
                        var li = document.createElement('li');
                        li.className = 'list-group-item list-group-item-action';
                        if (field.id === 'bill_name') {
                            li.textContent = (typeof row === 'string') ? row : row.billname;
                            if (typeof row === 'string') {
                                li.dataset.billname = row;
                                li.dataset.address = '';
                                li.dataset.phone = '';
                                li.onclick = function() {
                                    document.getElementById('bill_name').value = row;
                                    document.getElementById('nameSuggestions').style.display = 'none';
                                };
                                list.appendChild(li);
                                return;
                            }
                        } else {
                            li.textContent = (row.address || '') ? (row.address.substring(0, 50) + (row.address.length > 50 ? '…' : '')) : '(No address)';
                        }
                        li.dataset.billname = row.billname || '';
                        li.dataset.address = row.address || '';
                        li.dataset.phone = row.phone || '';
                        li.onclick = function() {
                            document.getElementById('bill_name').value = this.dataset.billname;
                            document.getElementById('address').value = this.dataset.address;
                            document.getElementById('phone').value = this.dataset.phone;
                            document.getElementById('nameSuggestions').style.display = 'none';
                            document.getElementById('addressSuggestions').style.display = 'none';
                        };
                        list.appendChild(li);
                    });
                    list.style.display = 'block';
                })
                .catch(function() { list.style.display = 'none'; });
        }
        var suggestTimer;
        document.getElementById('bill_name').addEventListener('input', function() {
            clearTimeout(suggestTimer);
            var list = document.getElementById('nameSuggestions');
            suggestTimer = setTimeout(function() { showSuggestions(document.getElementById('bill_name'), list); }, 200);
        });
        document.getElementById('bill_name').addEventListener('focus', function() {
            if (this.value.trim().length >= 1) showSuggestions(this, document.getElementById('nameSuggestions'));
        });
        document.getElementById('address').addEventListener('input', function() {
            clearTimeout(suggestTimer);
            var list = document.getElementById('addressSuggestions');
            suggestTimer = setTimeout(function() { showSuggestions(document.getElementById('address'), list); }, 200);
        });
        document.getElementById('address').addEventListener('focus', function() {
            if (this.value.trim().length >= 1) showSuggestions(this, document.getElementById('addressSuggestions'));
        });
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.suggest-wrap')) {
                document.getElementById('nameSuggestions').style.display = 'none';
                document.getElementById('addressSuggestions').style.display = 'none';
            }
        });

        document.getElementById('bill_name').addEventListener('blur', function() {
            const name = this.value.trim();
            if (!name) return;
            fetch('get_old_balance.php?name=' + encodeURIComponent(name))
                .then(r => r.json())
                .then(d => {
                    const bal = parseFloat(d.total_balance || 0);
                    if (bal > 0) document.getElementById('oldPayment').value = bal.toFixed(2);
                    renderBill();
                })
                .catch(() => {});
        });

        document.getElementById('discountType').addEventListener('change', renderBill);
        document.getElementById('discountValue').addEventListener('input', renderBill);
        document.getElementById('oldPayment').addEventListener('input', renderBill);
    </script>
</body>
</html>
