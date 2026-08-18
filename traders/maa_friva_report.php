<?php
include 'config.php';
require_once 'auth_helper.php';
require_once 'gst_helpers.php';
requireSection('gst');

$gstConfig = gstConfig();
define('CGST_RATE', floatval($gstConfig['cgst_rate']));
define('SGST_RATE', floatval($gstConfig['sgst_rate']));

function calcGst($lineTotal)
{
    $inclusive = floatval($lineTotal);
    $taxable = round($inclusive / 1.05, 2);
    $cgst = round($taxable * CGST_RATE / 100, 4);
    $sgst = round($taxable * SGST_RATE / 100, 4);
    $total = round($taxable + $cgst + $sgst, 3);
    return compact('taxable', 'cgst', 'sgst', 'total');
}

function salesColumnHeaders()
{
    return [
        'Date',
        'Inv. No.',
        'Party Name',
        'Product Name',
        'HSN Code',
        'UoM',
        'Qty.',
        'Taxable Value',
        'IGST',
        'CGST',
        'SGST',
        'Cess',
        'Total',
    ];
}

function formatReportDate($date)
{
    return date('d-M-y', strtotime($date));
}

function buildSalesRow($row)
{
    $hsn = resolveGstHsn($row['product_name'], $row['bill_hsn'], $row['product_hsn']);
    $paidQty = intval($row['quantity']);
    $paidTotal = gstPaidLineAmount($row['price'], $paidQty);
    $gst = calcGst($paidTotal);
    $invNo = formatGstBillNo($row['gst_serial'] ?? 0, $row['gst_fy'] ?? '');

    return [
        'inv_no' => $invNo,
        'hsn' => $hsn,
        'gst' => $gst,
        'cells' => [
            formatReportDate($row['bill_date']),
            $invNo,
            $row['billname'],
            $row['product_name'],
            $hsn,
            $row['unit'],
            $paidQty,
            number_format($gst['taxable'], 2, '.', ''),
            '0',
            number_format($gst['cgst'], 4, '.', ''),
            number_format($gst['sgst'], 4, '.', ''),
            '0',
            number_format($gst['total'], 3, '.', ''),
        ],
    ];
}

function excelEscape($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

$from = $_GET['from'] ?? '';
$to   = $_GET['to'] ?? '';

$where = "WHERE " . gstReportFilterSql() . " AND " . gstTradersBillFilterSql('b');
if (!empty($from) && !empty($to)) {
    $fromEsc = $conn->real_escape_string($from);
    $toEsc   = $conn->real_escape_string($to);
    $where .= " AND DATE(b.bill_date) BETWEEN '$fromEsc' AND '$toEsc'";
}

// Deduplicate in PHP: if products/bills were imported 3× without PRIMARY KEY,
// JOIN multiplies every line. Keep one row per bill_item id.
$sql = "SELECT
            bi.id AS bill_item_id,
            b.id AS bill_id,
            b.bill_date,
            b.billname,
            b.address,
            b.phone,
            b.gst_serial,
            b.gst_fy,
            p.name AS product_name,
            p.category,
            bi.hsn AS bill_hsn,
            p.hsn AS product_hsn,
            bi.quantity,
            bi.free,
            bi.unit,
            bi.mrp,
            bi.price,
            bi.total
        FROM bill_items bi
        JOIN bills b ON bi.bill_id = b.id
        JOIN products p ON bi.product_id = p.id
        $where
        ORDER BY b.bill_date ASC, b.id ASC, p.name ASC";

$result = $conn->query($sql);
$rows = [];
$seenItemIds = [];
if ($result) {
    while ($r = $result->fetch_assoc()) {
        $iid = (int) $r['bill_item_id'];
        if (isset($seenItemIds[$iid])) {
            continue;
        }
        $seenItemIds[$iid] = true;
        if (isGstReportProduct($r['product_name'])) {
            $rows[] = $r;
        }
    }
}

if (isset($_GET['download']) && $_GET['download'] === '1') {
    $filename = 'maa_friva_milkshake_gst_' . date('Y-m-d_His') . '.xls';
    header('Content-Type: application/vnd.ms-excel; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Pragma: no-cache');
    header('Expires: 0');

    $headers = salesColumnHeaders();
    echo "\xEF\xBB\xBF";
    echo '<html><head><meta charset="UTF-8"></head><body>';
    echo '<table border="1" cellspacing="0" cellpadding="4">';

    echo '<tr><th colspan="' . count($headers) . '">Sales</th></tr>';
    echo '<tr>';
    foreach ($headers as $h) {
        echo '<th>' . excelEscape($h) . '</th>';
    }
    echo '</tr>';

    foreach ($rows as $row) {
        $built = buildSalesRow($row);
        echo '<tr>';
        foreach ($built['cells'] as $i => $cell) {
            if ($i === 0 || $i === 4) {
                echo '<td style="mso-number-format:\'@\';">' . excelEscape($cell) . '</td>';
            } else {
                echo '<td>' . excelEscape($cell) . '</td>';
            }
        }
        echo '</tr>';
    }

    echo '<tr><td colspan="' . count($headers) . '">&nbsp;</td></tr>';
    echo '<tr><th colspan="' . count($headers) . '">Sales Return</th></tr>';
    echo '<tr>';
    foreach ($headers as $h) {
        echo '<th>' . excelEscape($h) . '</th>';
    }
    echo '</tr>';

    echo '</table></body></html>';
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>GST Excel Report</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>

<body class="container mt-4">
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h2>📊 GST Excel Report</h2>
        <div class="d-flex gap-2 flex-wrap">
            <a href="dashboard_gst.php" class="btn btn-outline-secondary btn-sm">← GST Home</a>
            <a href="gst_bills.php" class="btn btn-outline-secondary btn-sm">Cavins Bills</a>
            <a href="logout.php" class="btn btn-outline-danger btn-sm">Logout</a>
        </div>
    </div>

    <p class="text-muted">
        Includes <strong>MAA</strong>, <strong>Friva</strong>, <strong>Milkshake</strong>, <strong>milk</strong>, <strong>Cavins</strong>, and <strong>Snacks</strong> (cup cakes, ompodi, mixture, moongdal)
        from all bills (Normal Billing + GST Billing). Maaza/Maasa excluded.
        Other products on the same bill are excluded. CGST &amp; SGST/UTGST are calculated at 2.5% each (5% total GST).
        HSN is taken from the database if saved; otherwise default HSN from <code>gst_config.php</code> is used automatically.
    </p>

    <form method="get" class="row g-2 mb-4 align-items-end">
        <div class="col-md-3">
            <label class="form-label">From Date</label>
            <input type="date" name="from" class="form-control" value="<?= htmlspecialchars($from) ?>">
        </div>
        <div class="col-md-3">
            <label class="form-label">To Date</label>
            <input type="date" name="to" class="form-control" value="<?= htmlspecialchars($to) ?>">
        </div>
        <div class="col-md-2">
            <button type="submit" class="btn btn-primary w-100">Filter</button>
        </div>
        <div class="col-md-2">
            <a href="?from=<?= urlencode($from) ?>&to=<?= urlencode($to) ?>&download=1"
                class="btn btn-success w-100">⬇ Download Excel</a>
        </div>
    </form>

    <div class="table-responsive">
        <h5 class="mt-2">Sales</h5>
        <table class="table table-bordered table-sm">
            <thead class="table-dark">
                <tr>
                    <th>Date</th>
                    <th>Inv. No.</th>
                    <th>Party Name</th>
                    <th>Product Name</th>
                    <th>HSN Code</th>
                    <th>UoM</th>
                    <th>Qty.</th>
                    <th>Taxable Value</th>
                    <th>IGST</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>Cess</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $sumTaxable = $sumCgst = $sumSgst = $sumTotal = 0;
                if (empty($rows)):
                ?>
                    <tr>
                        <td colspan="13" class="text-center text-muted">No matching bills found for this date range.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($rows as $row):
                        $built = buildSalesRow($row);
                        $gst = $built['gst'];
                        $hsn = $built['hsn'];
                        $sumTaxable += $gst['taxable'];
                        $sumCgst    += $gst['cgst'];
                        $sumSgst    += $gst['sgst'];
                        $sumTotal   += $gst['total'];
                        $hsnFromConfig = trim((string) $row['bill_hsn']) === '' && trim((string) $row['product_hsn']) === '';
                    ?>
                        <tr>
                            <td><?= formatReportDate($row['bill_date']) ?></td>
                            <td><?= htmlspecialchars($built['inv_no']) ?></td>
                            <td><?= htmlspecialchars($row['billname']) ?></td>
                            <td><?= htmlspecialchars($row['product_name']) ?></td>
                            <td>
                                <?= htmlspecialchars($hsn) ?>
                                <?php if ($hsnFromConfig): ?>
                                    <span class="badge bg-secondary" title="Default HSN from gst_config.php">auto</span>
                                <?php endif; ?>
                            </td>
                            <td><?= htmlspecialchars($row['unit']) ?></td>
                            <td><?= intval($row['quantity']) ?></td>
                            <td><?= number_format($gst['taxable'], 2) ?></td>
                            <td>0</td>
                            <td><?= number_format($gst['cgst'], 4) ?></td>
                            <td><?= number_format($gst['sgst'], 4) ?></td>
                            <td>0</td>
                            <td><?= number_format($gst['total'], 3) ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
            <?php if (!empty($rows)): ?>
                <tfoot class="table-secondary fw-bold">
                    <tr>
                        <td colspan="7" class="text-end">Grand Total</td>
                        <td><?= number_format($sumTaxable, 2) ?></td>
                        <td>0</td>
                        <td><?= number_format($sumCgst, 4) ?></td>
                        <td><?= number_format($sumSgst, 4) ?></td>
                        <td>0</td>
                        <td><?= number_format($sumTotal, 3) ?></td>
                    </tr>
                </tfoot>
            <?php endif; ?>
        </table>

        <h5 class="mt-4">Sales Return</h5>
        <table class="table table-bordered table-sm">
            <thead class="table-light">
                <tr>
                    <th>Date</th>
                    <th>Inv. No.</th>
                    <th>Party Name</th>
                    <th>Product Name</th>
                    <th>HSN Code</th>
                    <th>UoM</th>
                    <th>Qty.</th>
                    <th>Taxable Value</th>
                    <th>IGST</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>Cess</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="13" class="text-center text-muted">No sales returns</td>
                </tr>
            </tbody>
        </table>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
