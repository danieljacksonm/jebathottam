<?php
include 'config_gst.php';
session_start();

if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit;
}
// Date filter
$where = "";
if (!empty($_GET['from']) && !empty($_GET['to'])) {
    $from = $conn->real_escape_string($_GET['from']);
    $to   = $conn->real_escape_string($_GET['to']);
    $where = "WHERE DATE(b.created_at) BETWEEN '$from' AND '$to'";
}

// Bill-wise Sales (GST)
$sql_bill = "SELECT 
                b.id as bill_id,
                b.bill_date, 
                b.billname, 
                b.total, 
                b.subtotal,
                b.cgst_total,
                b.sgst_total,
                b.cess_total,
                b.created_at,
                SUM(bi.total - ((bi.quantity + IFNULL(bi.free,0)) * p.original)) as profit
             FROM gst_bill_items bi
             JOIN gst_bills b ON bi.bill_id = b.id
             JOIN gst_products p ON bi.product_id = p.id
             $where
             GROUP BY b.id
             ORDER BY b.bill_date DESC";
$result_bill = $conn->query($sql_bill);

// Product-wise Sales (GST)
$sql_product = "SELECT p.name,
                   SUM(bi.quantity) as qty_sold,
                   SUM(bi.total) as sales,
                   SUM(bi.total - ((bi.quantity + IFNULL(bi.free,0)) * p.original)) as profit
                FROM gst_bill_items bi
                JOIN gst_products p ON bi.product_id = p.id
                JOIN gst_bills b ON bi.bill_id = b.id
                $where
                GROUP BY p.id
                ORDER BY p.name ASC";
$result_product = $conn->query($sql_product);

// Date-wise Summary (GST)
$sql_date = "SELECT DATE(b.bill_date) as sale_date,
                SUM(bi.quantity) as qty_sold,
                SUM(bi.total) as sales,
                SUM(bi.total - ((bi.quantity + IFNULL(bi.free,0)) * p.original)) as profit
             FROM gst_bill_items bi
             JOIN gst_bills b ON bi.bill_id = b.id
             JOIN gst_products p ON bi.product_id = p.id
             $where
             GROUP BY DATE(b.bill_date)
             ORDER BY sale_date ASC";
$result_date = $conn->query($sql_date);

// Store date-wise data in array for reuse in chart
$date_data = [];
while ($r = $result_date->fetch_assoc()) {
    $date_data[] = $r;
}

// Stock Report (GST)
$sql_stock = "SELECT id, name, stock, price, original
              FROM gst_products ORDER BY name ASC";
$result_stock = $conn->query($sql_stock);
$result_stock1 = $conn->query($sql_stock);

?>
<!DOCTYPE html>
<html>

<head>
    <title>GST Sales Dashboard</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/app.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .card-body { padding: 1.5rem; }
        .card { margin-bottom: 1rem; }
        .form-control { margin-bottom: 0.5rem; }
        .table-responsive { margin-top: 1rem; }
        .btn { margin: 0.25rem; }
        .row { margin-bottom: 0.5rem; }
        .alert { margin-bottom: 1rem; }
    </style>
</head>

<body class="container py-4">
    <div class="card p-4">
        <div class="card-header-style d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h2 class="mb-0">📊 GST Sales Dashboard</h2>
            <a href="dashboard_gst.php" class="btn btn-success btn-sm">⬅ Back</a>
        </div>

    <!-- Date Filter -->
    <form method="get" class="row g-2 mb-4">
        <div class="col-md-3">
            <input type="date" name="from" class="form-control" value="<?= $_GET['from'] ?? '' ?>">
        </div>
        <div class="col-md-3">
            <input type="date" name="to" class="form-control" value="<?= $_GET['to'] ?? '' ?>">
        </div>
        <div class="col-md-2">
            <button type="submit" class="btn btn-primary">Filter</button>
        </div>

    </form>


    <!-- Tabs -->
    <ul class="nav nav-tabs">
        <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="#bill">Bill-wise</a></li>
        <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#product">Product-wise</a></li>
        <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#date">Date-wise</a></li>
        <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#stock">Stock</a></li>
        <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#stockonly">Stock Only</a></li>
        <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#charts">Charts</a></li>
    </ul>

    <div class="tab-content mt-3">
        <!-- Bill-wise -->
        <div class="tab-pane fade show active" id="bill">
            <div class="d-flex justify-content-end mb-2">
                <button class="btn btn-danger btn-sm" onclick="downloadPDF('billTable','GST Bill Report')">⬇ Download PDF</button>
            </div>
            <table id="billTable" class="table table-bordered">
                <thead>
                    <tr>
                        <th>Bill No</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Subtotal</th>
                        <th>CGST</th>
                        <th>SGST</th>
                        <th>CESS</th>
                        <th>Total</th>
                        <th>Profit</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $total_sales = 0;
                    $total_profit = 0;
                    $total_subtotal = 0;
                    $total_cgst = 0;
                    $total_sgst = 0;
                    $total_cess = 0;
                    while ($row = $result_bill->fetch_assoc()):
                        $total_sales += $row['total'];
                        $total_profit += $row['profit'];
                        $total_subtotal += $row['subtotal'];
                        $total_cgst += $row['cgst_total'];
                        $total_sgst += $row['sgst_total'];
                        $total_cess += $row['cess_total'];
                    ?>
                        <tr>
                            <td><?= $row['bill_id'] ?></td>
                            <td><?= date('d-m-Y', strtotime($row['bill_date'])) ?></td>
                            <td><?= htmlspecialchars($row['billname']) ?></td>
                            <td>₹<?= number_format($row['subtotal'], 2) ?></td>
                            <td>₹<?= number_format($row['cgst_total'], 2) ?></td>
                            <td>₹<?= number_format($row['sgst_total'], 2) ?></td>
                            <td>₹<?= number_format($row['cess_total'], 2) ?></td>
                            <td>₹<?= number_format($row['total'], 2) ?></td>
                            <td>₹<?= number_format($row['profit'], 2) ?></td>
                        </tr>
                    <?php endwhile; ?>
                </tbody>
                <tfoot>
                    <tr class="fw-bold">
                        <td colspan="3" class="text-end">Total</td>
                        <td>₹<?= number_format($total_subtotal, 2) ?></td>
                        <td>₹<?= number_format($total_cgst, 2) ?></td>
                        <td>₹<?= number_format($total_sgst, 2) ?></td>
                        <td>₹<?= number_format($total_cess, 2) ?></td>
                        <td>₹<?= number_format($total_sales, 2) ?></td>
                        <td>₹<?= number_format($total_profit, 2) ?></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- Product-wise -->
        <div class="tab-pane fade" id="product">
            <div class="d-flex justify-content-end mb-2">
                <button class="btn btn-danger btn-sm" onclick="downloadPDF('productTable','GST Product Report')">⬇ Download PDF</button>
            </div>
            <table id="productTable" class="table table-bordered">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty Sold</th>
                        <th>Sales</th>
                        <th>Profit</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $total_qty = 0;
                    $total_sales = 0;
                    $total_profit = 0;
                    while ($row = $result_product->fetch_assoc()):
                        $total_qty += $row['qty_sold'];
                        $total_sales += $row['sales'];
                        $total_profit += $row['profit'];
                    ?>
                        <tr>
                            <td><?= htmlspecialchars($row['name']) ?></td>
                            <td><?= $row['qty_sold'] ?></td>
                            <td>₹<?= number_format($row['sales'], 2) ?></td>
                            <td>₹<?= number_format($row['profit'], 2) ?></td>
                        </tr>
                    <?php endwhile; ?>
                </tbody>
                <tfoot>
                    <tr class="fw-bold">
                        <td class="text-end">Total</td>
                        <td><?= $total_qty ?></td>
                        <td>₹<?= number_format($total_sales, 2) ?></td>
                        <td>₹<?= number_format($total_profit, 2) ?></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- Date-wise -->
        <div class="tab-pane fade" id="date">
            <div class="d-flex justify-content-end mb-2">
                <button class="btn btn-danger btn-sm" onclick="downloadPDF('dateTable','GST Date Report')">⬇ Download PDF</button>
            </div>
            <table id="dateTable"class="table table-bordered">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Qty</th>
                        <th>Sales</th>
                        <th>Profit</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $total_qty = 0;
                    $total_sales = 0;
                    $total_profit = 0;
                    foreach ($date_data as $row):
                        $total_qty += $row['qty_sold'];
                        $total_sales += $row['sales'];
                        $total_profit += $row['profit'];
                    ?>
                        <tr>
                            <td><?= $row['sale_date'] ?></td>
                            <td><?= $row['qty_sold'] ?></td>
                            <td>₹<?= number_format($row['sales'], 2) ?></td>
                            <td>₹<?= number_format($row['profit'], 2) ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
                <tfoot>
                    <tr class="fw-bold">
                        <td class="text-end">Total</td>
                        <td><?= $total_qty ?></td>
                        <td>₹<?= number_format($total_sales, 2) ?></td>
                        <td>₹<?= number_format($total_profit, 2) ?></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- Stock -->
        <div class="tab-pane fade" id="stock">
            <div class="d-flex justify-content-end mb-2">
                <button class="btn btn-danger btn-sm" onclick="downloadPDF('stockTable','GST Stock Report')">⬇ Download PDF</button>
            </div>
            <table id="stockTable" class="table table-bordered">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Stock</th>
                        <th>Selling Price</th>
                        <th>Original Price</th>
                        <th>Total Selling Value</th>
                        <th>Total Original Value</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $total_stock = 0;
                    $total_selling_value = 0;
                    $total_original_value = 0;

                    while ($row = $result_stock->fetch_assoc()):
                        $product_selling_total = $row['stock'] * $row['price'];
                        $product_original_total = $row['stock'] * $row['original'];

                        $total_stock += $row['stock'];
                        $total_selling_value += $product_selling_total;
                        $total_original_value += $product_original_total;
                    ?>
                        <tr>
                            <td><?= htmlspecialchars($row['name']) ?></td>
                            <td><?= $row['stock'] ?></td>
                            <td>₹<?= number_format($row['price'], 2) ?></td>
                            <td>₹<?= number_format($row['original'], 2) ?></td>
                            <td>₹<?= number_format($product_selling_total, 2) ?></td>
                            <td>₹<?= number_format($product_original_total, 2) ?></td>
                        </tr>
                    <?php endwhile; ?>
                </tbody>
                <tfoot>
                    <tr class="fw-bold">
                        <td class="text-end">Total Stock</td>
                        <td><?= $total_stock ?></td>
                        <td colspan="4"></td>
                    </tr>
                    <tr class="fw-bold">
                        <td class="text-end">Total Selling Value</td>
                        <td colspan="5">₹<?= number_format($total_selling_value, 2) ?></td>
                    </tr>
                    <tr class="fw-bold">
                        <td class="text-end">Total Original Value</td>
                        <td colspan="5">₹<?= number_format($total_original_value, 2) ?></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- Stock Only-->
        <div class="tab-pane fade" id="stockonly">
            <div class="d-flex justify-content-end mb-2">
                <button class="btn btn-danger btn-sm" onclick="downloadPDF('stockonlyTable','GST Stock Only Report')">⬇ Download PDF</button>
            </div>
            <table id="stockonlyTable" class="table table-bordered">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Stock</th>
                        <th>Selling Price</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $total_stock = 0;
                    $total_selling_value = 0;
                    $total_original_value = 0;

                    while ($row = $result_stock1->fetch_assoc()):
                        $product_selling_total = $row['stock'] * $row['price'];
                        $product_original_total = $row['stock'] * $row['original'];

                        $total_stock += $row['stock'];
                        $total_selling_value += $product_selling_total;
                        $total_original_value += $product_original_total;
                    ?>
                        <tr>
                            <td><?= htmlspecialchars($row['name']) ?></td>
                            <td><?= $row['stock'] ?></td>
                            <td>₹<?= number_format($row['price'], 2) ?></td>
                        </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>

        <!-- Charts -->
        <div class="tab-pane fade" id="charts">
            <canvas id="salesChart" height="100"></canvas>
            <script>
                const labels = <?= json_encode(array_column($date_data, 'sale_date')) ?>;
                const salesData = <?= json_encode(array_column($date_data, 'sales')) ?>;
                const profitData = <?= json_encode(array_column($date_data, 'profit')) ?>;
                new Chart(document.getElementById('salesChart'), {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                                label: 'Sales',
                                data: salesData,
                                borderColor: 'blue',
                                fill: false
                            },
                            {
                                label: 'Profit',
                                data: profitData,
                                borderColor: 'green',
                                fill: false
                            }
                        ]
                    }
                });
            </script>
        </div>
    </div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

<script>
async function downloadPDF(tableId, title) {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById(tableId);

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let y = 20;

    pdf.setFontSize(16);
    pdf.text(title, pageWidth / 2, 15, { align: "center" });
    pdf.addImage(imgData, "PNG", 10, y, pdfWidth, pdfHeight);

    pdf.save(title + ".pdf");
}
</script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </div>
</body>

</html>
