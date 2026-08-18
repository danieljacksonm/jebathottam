<?php

function gstConfig()
{
    static $config = null;
    if ($config === null) {
        $config = require __DIR__ . '/gst_config.php';
    }
    return $config;
}

function gstCategories()
{
    return gstConfig()['gst_categories'];
}

function isExcludedGstProduct($name)
{
    $config = gstConfig();
    $n = mb_strtolower(trim($name));

    foreach ($config['excluded_keywords'] as $keyword) {
        if (strpos($n, $keyword) !== false) {
            return true;
        }
    }

    return false;
}

function isCavinsProduct($name)
{
    $n = mb_strtolower(trim($name));
    return strpos($n, 'cavin') !== false;
}

function isMaaBrand($name)
{
    $n = mb_strtolower(trim($name));
    return preg_match('/\bmaa\b/u', $n) === 1 || strpos($n, 'maa fd') !== false;
}

function isGstSnackProduct($name)
{
    $n = mb_strtolower(trim($name));
    $snackKeywords = [
        'cup cake', 'cupcake', 'ompodi', 'omapodi',
        'southindia mix', 'south india mix', 'moongdal', 'moong dal',
        'choco cup', 'strawber', 'vannila', 'vanilla cup',
    ];
    foreach ($snackKeywords as $kw) {
        if (strpos($n, $kw) !== false) {
            return true;
        }
    }
    return false;
}

function isGstSoftDrinkProduct($name)
{
    $n = mb_strtolower(trim($name));
    $keywords = [
        'campa', 'energy lemon', 'energy neon', 'energy orange',
        'energy purple', 'panner soda', 'paneer soda',
    ];
    foreach ($keywords as $kw) {
        if (strpos($n, $kw) !== false) {
            return true;
        }
    }
    return false;
}

function isGstReportProduct($name)
{
    if (isExcludedGstProduct($name)) {
        return false;
    }

    $n = mb_strtolower(trim($name));

    if (isCavinsProduct($name)) {
        return true;
    }
    if (strpos($n, 'friva') !== false) {
        return true;
    }
    if (strpos($n, 'milkshake') !== false) {
        return true;
    }
    if (strpos($n, 'milk') !== false) {
        return true;
    }
    if (isMaaBrand($name)) {
        return true;
    }
    if (isGstSnackProduct($name)) {
        return true;
    }
    if (isGstSoftDrinkProduct($name)) {
        return true;
    }

    foreach (gstConfig()['gst_product_keywords'] as $kw) {
        if (strpos($n, mb_strtolower($kw)) !== false) {
            return true;
        }
    }

    return false;
}

function gstKeywordMatchSql($column = 'p.name')
{
    $col = 'LOWER(' . $column . ')';
    $parts = [];

    foreach (gstConfig()['gst_product_keywords'] as $keyword) {
        $escaped = addslashes(mb_strtolower($keyword));
        $parts[] = "$col LIKE '%$escaped%'";
    }

    $parts[] = "$col REGEXP '(^|[[:space:]])maa([[:space:]]|fd)'";

    $match = '(' . implode(' OR ', $parts) . ')';
    $exclude = "(
        $col NOT LIKE '%maaza%'
        AND $col NOT LIKE '%maasa%'
        AND $col NOT LIKE '%mazaa%'
    )";

    return "$match AND $exclude";
}

function gstReportFilterSql()
{
    return gstKeywordMatchSql('p.name');
}

/** Only YEGOVA TRADERS bills: old imported history + new GST-site bills */
function gstTradersBillFilterSql()
{
    return '(b.gst_serial IS NOT NULL AND b.gst_serial > 0)';
}

function cavinsProductFilterSql()
{
    return "LOWER(p.name) LIKE '%cavin%'";
}

function cavinsProductWhereSql()
{
    return "LOWER(name) LIKE '%cavin%'";
}

function gstProductWhereSql()
{
    return gstKeywordMatchSql('name');
}

function deriveGstCategory($name, $dbCategory = '')
{
    $dbCat = trim((string) $dbCategory);
    foreach (gstCategories() as $cat) {
        if (strcasecmp($dbCat, $cat) === 0) {
            return $cat;
        }
    }

    if (isCavinsProduct($name)) {
        return 'Cavins';
    }
    if (isGstSoftDrinkProduct($name)) {
        return 'Soft Drinks';
    }
    if (isGstSnackProduct($name)) {
        return 'Snacks';
    }

    $n = mb_strtolower(trim($name));
    if (strpos($n, 'friva') !== false) {
        return 'Friva';
    }
    if (strpos($n, 'milkshake') !== false || strpos($n, 'milk') !== false) {
        return 'Milkshake';
    }
    if (isMaaBrand($name)) {
        return 'Maa';
    }

    return 'Other';
}

function billHasGstItems($conn, $billId)
{
    $billId = (int) $billId;
    $sql = "SELECT 1 FROM bill_items bi
            JOIN products p ON p.id = bi.product_id
            WHERE bi.bill_id = $billId AND " . gstReportFilterSql() . " LIMIT 1";
    $res = $conn->query($sql);
    return $res && $res->num_rows > 0;
}

function normalizeGstHsn($hsn)
{
    $hsn = preg_replace('/\D/', '', trim((string) $hsn));
    return $hsn === '' ? '' : $hsn;
}

function resolveGstHsn($productName, $billHsn, $productHsn)
{
    $config = gstConfig();

    foreach ([$productHsn, $billHsn] as $hsn) {
        $hsn = normalizeGstHsn($hsn);
        if ($hsn !== '') {
            return $hsn;
        }
    }

    $name = mb_strtolower(trim($productName));
    foreach ($config['hsn_by_keyword'] as $keyword => $hsn) {
        if (strpos($name, $keyword) !== false) {
            return $hsn;
        }
    }

    return $config['default_hsn'];
}

function calcGstLine($lineTotal)
{
    $config = gstConfig();
    $cgstRate = floatval($config['cgst_rate']);
    $sgstRate = floatval($config['sgst_rate']);

    $inclusive = floatval($lineTotal);
    $taxable = round($inclusive / 1.05, 2);
    $cgst = round($taxable * $cgstRate / 100, 4);
    $sgst = round($taxable * $sgstRate / 100, 4);
    $total = round($taxable + $cgst + $sgst, 3);

    return compact('taxable', 'cgst', 'sgst', 'total', 'cgstRate', 'sgstRate');
}

function billHasCavinsItems($conn, $billId)
{
    $billId = (int) $billId;
    $sql = "SELECT 1 FROM bill_items bi
            JOIN products p ON p.id = bi.product_id
            WHERE bi.bill_id = $billId AND " . cavinsProductFilterSql() . " LIMIT 1";
    $res = $conn->query($sql);
    return $res && $res->num_rows > 0;
}

/** Indian FY: Apr 1 → Mar 31 */
function gstFinancialYear($date = null)
{
    $ts = $date ? strtotime($date) : time();
    $y = (int) date('Y', $ts);
    $m = (int) date('n', $ts);
    if ($m >= 4) {
        $startY = $y;
        $endY = $y + 1;
    } else {
        $startY = $y - 1;
        $endY = $y;
    }
    return [
        'label' => $startY . '-' . substr((string) $endY, -2),
        'start' => sprintf('%04d-04-01', $startY),
        'end'   => sprintf('%04d-03-31', $endY),
    ];
}

function ensureGstBillColumns($conn)
{
    $chk = $conn->query("SHOW COLUMNS FROM bills LIKE 'gst_fy'");
    if ($chk && $chk->num_rows === 0) {
        $conn->query("ALTER TABLE bills ADD COLUMN gst_fy VARCHAR(10) DEFAULT NULL");
    }
    $chk2 = $conn->query("SHOW COLUMNS FROM bills LIKE 'gst_serial'");
    if ($chk2 && $chk2->num_rows === 0) {
        $conn->query("ALTER TABLE bills ADD COLUMN gst_serial INT DEFAULT NULL");
    }
}

function nextGstFySerial($conn, $billDate = null)
{
    ensureGstBillColumns($conn);
    $fy = gstFinancialYear($billDate);
    $label = $conn->real_escape_string($fy['label']);
    $start = $conn->real_escape_string($fy['start']);
    $end = $conn->real_escape_string($fy['end']);

    $res = $conn->query("SELECT MAX(gst_serial) AS m FROM bills
        WHERE gst_fy = '$label'
           OR (gst_serial IS NOT NULL AND DATE(bill_date) BETWEEN '$start' AND '$end')");
    $row = $res ? $res->fetch_assoc() : null;
    $max = (int) ($row['m'] ?? 0);
    return ['fy' => $fy['label'], 'serial' => $max + 1];
}

function assignGstFySerial($conn, $billId, $billDate = null)
{
    ensureGstBillColumns($conn);
    $billId = (int) $billId;
    $next = nextGstFySerial($conn, $billDate);
    $fy = $conn->real_escape_string($next['fy']);
    $serial = (int) $next['serial'];
    $conn->query("UPDATE bills SET gst_fy = '$fy', gst_serial = $serial WHERE id = $billId");
    return $next;
}

function formatGstBillNo($serial, $fyLabel = '')
{
    $serial = (int) $serial;
    if ($serial <= 0) {
        return '';
    }
    return $fyLabel !== '' ? ($serial . ' / ' . $fyLabel) : (string) $serial;
}

function getGstDisplayBillNo($conn, $bill)
{
    ensureGstBillColumns($conn);
    if (!empty($bill['gst_serial'])) {
        return formatGstBillNo($bill['gst_serial'], $bill['gst_fy'] ?? '');
    }
    // Fallback for old GST bills: rank within FY among GST-item bills
    $fy = gstFinancialYear($bill['bill_date'] ?? null);
    $start = $conn->real_escape_string($fy['start']);
    $end = $conn->real_escape_string($fy['end']);
    $billId = (int) $bill['id'];
    $sql = "SELECT COUNT(DISTINCT b.id) AS c
            FROM bills b
            JOIN bill_items bi ON bi.bill_id = b.id
            JOIN products p ON p.id = bi.product_id
            WHERE DATE(b.bill_date) BETWEEN '$start' AND '$end'
              AND " . gstReportFilterSql() . "
              AND (b.bill_date < (SELECT bill_date FROM bills WHERE id = $billId)
                   OR (b.bill_date = (SELECT bill_date FROM bills WHERE id = $billId) AND b.id <= $billId))";
    $res = $conn->query($sql);
    $row = $res ? $res->fetch_assoc() : null;
    $serial = (int) ($row['c'] ?? 0);
    return formatGstBillNo($serial, $fy['label']);
}

/**
 * Sync HSN/category; insert known products if missing (stock 0).
 */
function syncGstKnownProducts($conn)
{
    ensureGstBillColumns($conn);
    $known = gstConfig()['known_products'] ?? [];
    $synced = 0;

    foreach ($known as $item) {
        $name = $conn->real_escape_string($item['name']);
        $hsn = $conn->real_escape_string($item['hsn']);
        $category = $conn->real_escape_string($item['category']);

        $exists = $conn->query("SELECT id, hsn FROM products WHERE LOWER(name) = LOWER('$name') LIMIT 1");
        if ($exists && $exists->num_rows > 0) {
            $row = $exists->fetch_assoc();
            // Keep existing price/stock/MRP. Set category. Fill HSN only if empty.
            $hsnSql = (trim((string) ($row['hsn'] ?? '')) === '')
                ? ", hsn = '$hsn'"
                : '';
            $conn->query("UPDATE products SET category = '$category'$hsnSql WHERE LOWER(name) = LOWER('$name')");
            if ($conn->affected_rows > 0) {
                $synced++;
            }
        }
        // Do not insert blank products — use present-site products only.
    }

    backfillGstFySerials($conn);
    return $synced;
}

/** Assign FY serials only to OLD Fusion bills with GST items (up to cutoff date). New Fusion bills are never imported. */
function backfillGstFySerials($conn)
{
    ensureGstBillColumns($conn);
    $cutoff = gstConfig()['import_old_bills_until'] ?? '2026-07-30';
    $cutoffEsc = $conn->real_escape_string($cutoff);

    $sql = "SELECT DISTINCT b.id, b.bill_date
            FROM bills b
            JOIN bill_items bi ON bi.bill_id = b.id
            JOIN products p ON p.id = bi.product_id
            WHERE (b.gst_serial IS NULL OR b.gst_serial = 0)
              AND DATE(b.bill_date) <= '$cutoffEsc'
              AND " . gstReportFilterSql() . "
            ORDER BY b.bill_date ASC, b.id ASC";
    $res = $conn->query($sql);
    if (!$res) {
        return 0;
    }

    $counters = [];
    $n = 0;
    while ($row = $res->fetch_assoc()) {
        $fy = gstFinancialYear($row['bill_date']);
        $label = $fy['label'];
        if (!isset($counters[$label])) {
            $max = $conn->query("SELECT MAX(gst_serial) AS m FROM bills WHERE gst_fy = '" . $conn->real_escape_string($label) . "'");
            $mrow = $max ? $max->fetch_assoc() : null;
            $counters[$label] = (int) ($mrow['m'] ?? 0);
        }
        $counters[$label]++;
        $serial = $counters[$label];
        $id = (int) $row['id'];
        $fyEsc = $conn->real_escape_string($label);
        $conn->query("UPDATE bills SET gst_fy = '$fyEsc', gst_serial = $serial WHERE id = $id AND (gst_serial IS NULL OR gst_serial = 0)");
        $n++;
    }
    return $n;
}
