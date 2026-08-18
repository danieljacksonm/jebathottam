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
function gstTradersBillFilterSql($alias = '')
{
    $col = $alias !== '' ? ($alias . '.gst_serial') : 'gst_serial';
    return "($col IS NOT NULL AND $col > 0)";
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
    // Fast path: category already set (Traders / synced products)
    $cats = [];
    foreach (gstCategories() as $c) {
        $cats[] = "'" . addslashes($c) . "'";
    }
    $catSql = 'category IN (' . implode(',', $cats) . ')';

    // Fallback for products not yet categorized
    return "( ($catSql) OR (" . gstKeywordMatchSql('name') . ") )";
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
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;

    $chk = $conn->query("SHOW COLUMNS FROM bills LIKE 'gst_fy'");
    if ($chk && $chk->num_rows === 0) {
        $conn->query("ALTER TABLE bills ADD COLUMN gst_fy VARCHAR(10) DEFAULT NULL");
    }
    $chk2 = $conn->query("SHOW COLUMNS FROM bills LIKE 'gst_serial'");
    if ($chk2 && $chk2->num_rows === 0) {
        $conn->query("ALTER TABLE bills ADD COLUMN gst_serial INT DEFAULT NULL");
    }
}

/**
 * Live Traders DB may not have stock_history — create it when missing.
 */
function ensureStockHistoryTable($conn)
{
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;

    $chk = $conn->query("SHOW TABLES LIKE 'stock_history'");
    if ($chk && $chk->num_rows > 0) {
        // Older dumps require note NOT NULL — make inserts safe
        $col = $conn->query("SHOW COLUMNS FROM stock_history LIKE 'note'");
        if ($col && $col->num_rows > 0) {
            $info = $col->fetch_assoc();
            $hasDefault = array_key_exists('Default', $info) && $info['Default'] !== null;
            if (!$hasDefault && strtoupper((string) ($info['Null'] ?? '')) === 'NO') {
                @$conn->query("ALTER TABLE stock_history MODIFY COLUMN note VARCHAR(100) NOT NULL DEFAULT ''");
            }
        }
        return;
    }

    $conn->query("CREATE TABLE IF NOT EXISTS stock_history (
        id INT NOT NULL AUTO_INCREMENT,
        product_id INT NOT NULL,
        old_stock INT NOT NULL,
        new_stock INT NOT NULL,
        change_qty INT NOT NULL,
        change_type ENUM('IN','OUT') NOT NULL,
        reference_type VARCHAR(50) DEFAULT NULL,
        reference_id INT DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        note VARCHAR(100) NOT NULL DEFAULT '',
        PRIMARY KEY (id),
        KEY idx_stock_history_product (product_id),
        KEY idx_stock_history_date (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
}

/**
 * Ensure bills.id is AUTO_INCREMENT so insert_id works on checkout.
 */
function ensureBillsIdAutoIncrement($conn)
{
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;

    $col = $conn->query("SHOW COLUMNS FROM bills LIKE 'id'");
    if (!$col || $col->num_rows === 0) {
        return;
    }
    $info = $col->fetch_assoc();
    $extra = strtolower((string) ($info['Extra'] ?? ''));
    if (strpos($extra, 'auto_increment') !== false) {
        return;
    }

    $maxRes = $conn->query("SELECT COALESCE(MAX(id), 0) AS m FROM bills");
    $next = 1;
    if ($maxRes && ($row = $maxRes->fetch_assoc())) {
        $next = max(1, ((int) $row['m']) + 1);
    }

    // Make sure id is primary key + auto increment
    $pk = $conn->query("SHOW INDEX FROM bills WHERE Key_name = 'PRIMARY'");
    if (!$pk || $pk->num_rows === 0) {
        @$conn->query("ALTER TABLE bills ADD PRIMARY KEY (id)");
    }
    @$conn->query("ALTER TABLE bills MODIFY id INT NOT NULL AUTO_INCREMENT");
    @$conn->query("ALTER TABLE bills AUTO_INCREMENT = $next");
}

/**
 * Resolve mysqli insert_id reliably (some hosts return 0 incorrectly).
 */
function resolveInsertedBillId($conn, $fy = '', $serial = 0)
{
    $billId = (int) $conn->insert_id;
    if ($billId > 0) {
        return $billId;
    }

    $lr = $conn->query("SELECT LAST_INSERT_ID() AS lid");
    if ($lr && ($row = $lr->fetch_assoc())) {
        $billId = (int) ($row['lid'] ?? 0);
        if ($billId > 0) {
            return $billId;
        }
    }

    $fy = $conn->real_escape_string($fy);
    $serial = (int) $serial;
    if ($fy !== '' && $serial > 0) {
        $qr = $conn->query("SELECT id FROM bills WHERE gst_fy = '$fy' AND gst_serial = $serial ORDER BY id DESC LIMIT 1");
        if ($qr && ($row = $qr->fetch_assoc())) {
            $billId = (int) $row['id'];
            if ($billId > 0) {
                return $billId;
            }
        }
    }

    $qr = $conn->query("SELECT id FROM bills ORDER BY id DESC LIMIT 1");
    if ($qr && ($row = $qr->fetch_assoc())) {
        return (int) $row['id'];
    }

    return 0;
}



/**
 * Floor for next serial: from July 1 series starts at 101 (configurable).
 */
function gstSerialFloorForDate($billDate = null)
{
    $cfg = gstConfig();
    $start = (int) ($cfg['invoice_serial_start'] ?? 1);
    $from = $cfg['invoice_serial_start_date'] ?? null;
    if ($start <= 1 || !$from) {
        return 0;
    }
    $day = $billDate ? date('Y-m-d', strtotime($billDate)) : date('Y-m-d');
    if ($day >= $from) {
        return $start - 1; // so next = 101 when max is below that
    }
    return 0;
}

function nextGstFySerial($conn, $billDate = null)
{
    ensureGstBillColumns($conn);
    $fy = gstFinancialYear($billDate);
    $label = $conn->real_escape_string($fy['label']);

    $res = $conn->query("SELECT MAX(gst_serial) AS m FROM bills WHERE gst_fy = '$label'");
    $row = $res ? $res->fetch_assoc() : null;
    $max = (int) ($row['m'] ?? 0);
    $floor = gstSerialFloorForDate($billDate);
    $serial = max($max, $floor) + 1;
    return ['fy' => $fy['label'], 'serial' => $serial];
}

/**
 * Paid line amount for GST (free qty is scheme — not taxed).
 */
function gstPaidLineAmount($price, $quantity)
{
    return round(floatval($price) * max(0, intval($quantity)), 2);
}

/**
 * One-time / sync: renumber GST bills so first on/after start date = 101, then continue.
 * Pre-start-date bills in same FY get 1, 2, 3…
 */
function renumberGstInvoiceSerials($conn)
{
    ensureGstBillColumns($conn);
    $cfg = gstConfig();
    $startDate = $cfg['invoice_serial_start_date'] ?? '2026-07-01';
    $startSerial = (int) ($cfg['invoice_serial_start'] ?? 101);
    $startEsc = $conn->real_escape_string($startDate);

    $sql = "SELECT DISTINCT b.id, b.bill_date
            FROM bills b
            JOIN bill_items bi ON bi.bill_id = b.id
            JOIN products p ON p.id = bi.product_id
            WHERE " . gstReportFilterSql() . "
            ORDER BY b.bill_date ASC, b.id ASC";
    $res = $conn->query($sql);
    if (!$res) {
        return 0;
    }

    $counters = []; // fy => ['pre' => n, 'post' => n]
    $n = 0;
    while ($row = $res->fetch_assoc()) {
        $fy = gstFinancialYear($row['bill_date']);
        $label = $fy['label'];
        if (!isset($counters[$label])) {
            $counters[$label] = ['pre' => 0, 'post' => $startSerial - 1];
        }
        $day = date('Y-m-d', strtotime($row['bill_date']));
        if ($day >= $startEsc) {
            $counters[$label]['post']++;
            $serial = $counters[$label]['post'];
        } else {
            $counters[$label]['pre']++;
            $serial = $counters[$label]['pre'];
        }
        $id = (int) $row['id'];
        $fyEsc = $conn->real_escape_string($label);
        $conn->query("UPDATE bills SET gst_fy = '$fyEsc', gst_serial = $serial WHERE id = $id");
        $n++;
    }
    return $n;
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
    // Fast path only — never run heavy ranking queries on list pages
    if (!empty($bill['gst_serial'])) {
        return formatGstBillNo($bill['gst_serial'], $bill['gst_fy'] ?? '');
    }
    return '#' . (int) ($bill['id'] ?? 0);
}

/**
 * Light sync only (no backfill). Safe for page load.
 * Pass $doBackfill=true only for one-time migration.
 */
function syncGstKnownProducts($conn, $doBackfill = false)
{
    static $done = false;
    if ($done && !$doBackfill) {
        return 0;
    }
    $done = true;

    ensureGstBillColumns($conn);
    $known = gstConfig()['known_products'] ?? [];
    $synced = 0;

    foreach ($known as $item) {
        $name = $conn->real_escape_string($item['name']);
        $hsn = $conn->real_escape_string($item['hsn']);
        $category = $conn->real_escape_string($item['category']);

        $exists = $conn->query("SELECT id, hsn, category FROM products WHERE name = '$name' LIMIT 1");
        if ($exists && $exists->num_rows > 0) {
            $row = $exists->fetch_assoc();
            $sets = [];
            if (trim((string) ($row['category'] ?? '')) === '') {
                $sets[] = "category = '$category'";
            }
            if (trim((string) ($row['hsn'] ?? '')) === '') {
                $sets[] = "hsn = '$hsn'";
            }
            if ($sets) {
                $conn->query("UPDATE products SET " . implode(', ', $sets) . " WHERE id = " . (int) $row['id']);
                if ($conn->affected_rows > 0) {
                    $synced++;
                }
            }
        }
    }

    if ($doBackfill) {
        backfillGstFySerials($conn);
        renumberGstInvoiceSerials($conn);
    }
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
