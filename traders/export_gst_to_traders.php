<?php
/**
 * ONE-TIME export: old Fusion Corner GST bills + GST products → Traders SQL file.
 * After import into a NEW Traders DB: no shared connection with Fusion Corner.
 *
 * Run once from present site:
 *   php export_gst_to_traders.php
 *   or browser: .../export_gst_to_traders.php
 */
include __DIR__ . '/config.php';
require_once __DIR__ . '/auth_helper.php';
require_once __DIR__ . '/gst_helpers.php';
requireSection('gst');

$cutoff = gstConfig()['import_old_bills_until'] ?? date('Y-m-d');
$cutoffEsc = $conn->real_escape_string($cutoff);
$outFile = __DIR__ . '/gst_traders_history_export.sql';

ensureGstBillColumns($conn);

$lines = [];
$lines[] = '-- YEGOVA TRADERS one-time history import';
$lines[] = '-- Generated: ' . date('Y-m-d H:i:s');
$lines[] = '-- GST bills from Fusion until: ' . $cutoff;
$lines[] = '-- Import into SEPARATE Traders database only. Then no shared link.';
$lines[] = 'SET NAMES utf8mb4;';
$lines[] = 'SET FOREIGN_KEY_CHECKS=0;';
$lines[] = '';
$lines[] = '-- Import this file ONLY ONCE. Tables must have PRIMARY KEY on id';
$lines[] = '-- (products, bills, bill_items). If data repeats 3×, run fix_duplicate_import.php';
$lines[] = '';
$lines[] = 'ALTER TABLE `bills` ADD COLUMN `gst_fy` VARCHAR(10) DEFAULT NULL;';
$lines[] = 'ALTER TABLE `bills` ADD COLUMN `gst_serial` INT DEFAULT NULL;';
$lines[] = '';

$prodRes = $conn->query("SELECT * FROM products WHERE " . gstProductWhereSql() . " ORDER BY id ASC");
$productIds = [];
$lines[] = '-- GST PRODUCTS';
if ($prodRes) {
    while ($p = $prodRes->fetch_assoc()) {
        $productIds[] = (int) $p['id'];
        $cat = deriveGstCategory($p['name'], $p['category'] ?? '');
        if ($cat !== 'Other') {
            $p['category'] = $cat;
        }
        if (trim((string) ($p['hsn'] ?? '')) === '') {
            $p['hsn'] = resolveGstHsn($p['name'], '', '');
        }
        $lines[] = buildReplace('products', $p);
    }
}
$lines[] = '';

if (empty($productIds)) {
    file_put_contents($outFile, implode("\n", $lines) . "\n");
    done($outFile, 0, 0, 0);
}

$idList = implode(',', $productIds);

$billRes = $conn->query("
    SELECT DISTINCT b.*
    FROM bills b
    JOIN bill_items bi ON bi.bill_id = b.id
    WHERE bi.product_id IN ($idList)
      AND DATE(b.bill_date) <= '$cutoffEsc'
    ORDER BY b.bill_date ASC, b.id ASC
");

$billIds = [];
$fyCounters = []; // label => ['pre' => n, 'post' => n]
$startDate = gstConfig()['invoice_serial_start_date'] ?? '2026-07-01';
$startSerial = (int) (gstConfig()['invoice_serial_start'] ?? 101);
$lines[] = '-- OLD FUSION BILLS (contain GST products)';
if ($billRes) {
    while ($b = $billRes->fetch_assoc()) {
        $billIds[] = (int) $b['id'];
        $fy = gstFinancialYear($b['bill_date']);
        $label = $fy['label'];
        if (!isset($fyCounters[$label])) {
            $fyCounters[$label] = ['pre' => 0, 'post' => $startSerial - 1];
        }
        $day = date('Y-m-d', strtotime($b['bill_date']));
        if ($day >= $startDate) {
            $fyCounters[$label]['post']++;
            $serial = $fyCounters[$label]['post'];
        } else {
            $fyCounters[$label]['pre']++;
            $serial = $fyCounters[$label]['pre'];
        }
        $b['gst_fy'] = $label;
        $b['gst_serial'] = $serial;
        $lines[] = buildReplace('bills', $b);
    }
}
$lines[] = '';

$itemCount = 0;
if (!empty($billIds)) {
    $billList = implode(',', $billIds);
    $itemRes = $conn->query("
        SELECT bi.*
        FROM bill_items bi
        WHERE bi.bill_id IN ($billList)
          AND bi.product_id IN ($idList)
        ORDER BY bi.bill_id ASC, bi.id ASC
    ");
    $lines[] = '-- BILL ITEMS (GST products only)';
    if ($itemRes) {
        while ($i = $itemRes->fetch_assoc()) {
            $itemCount++;
            $lines[] = buildReplace('bill_items', $i);
        }
    }
}

$lines[] = '';
$lines[] = 'SET FOREIGN_KEY_CHECKS=1;';
$lines[] = '-- Products: ' . count($productIds) . ' | Bills: ' . count($billIds) . ' | Items: ' . $itemCount;

file_put_contents($outFile, implode("\n", $lines) . "\n");
done($outFile, count($productIds), count($billIds), $itemCount);

function buildReplace($table, array $row)
{
    $cols = [];
    $vals = [];
    foreach ($row as $k => $v) {
        $cols[] = '`' . str_replace('`', '', $k) . '`';
        if ($v === null) {
            $vals[] = 'NULL';
        } elseif (is_int($v) || is_float($v) || (is_string($v) && is_numeric($v) && !preg_match('/^0\d+/', $v))) {
            // keep numbers as numbers, but keep phone-like strings quoted if needed
            if ($k === 'phone' || $k === 'hsn' || $k === 'unit' || $k === 'pdf_file' || $k === 'created_at'
                || $k === 'discount_type' || $k === 'gst_fy' || $k === 'name' || $k === 'billname'
                || $k === 'address' || $k === 'category' || $k === 'cgst' || $k === 'sgst' || $k === 'cess'
                || $k === 'cgst_amt' || $k === 'sgst_amt' || $k === 'cess_amt') {
                $vals[] = sqlStr($v);
            } else {
                $vals[] = is_numeric($v) ? $v : sqlStr($v);
            }
        } else {
            $vals[] = sqlStr($v);
        }
    }
    return 'REPLACE INTO `' . $table . '` (' . implode(',', $cols) . ') VALUES (' . implode(',', $vals) . ');';
}

function sqlStr($v)
{
    return "'" . str_replace(["\\", "'"], ["\\\\", "''"], (string) $v) . "'";
}

function done($outFile, $products, $bills, $items)
{
    $msg = "Export OK\nFile: $outFile\nProducts: $products\nBills: $bills\nGST items: $items\n\n"
        . "NEXT (separate sites, no connection after this):\n"
        . "1) Create NEW database for YEGOVA TRADERS\n"
        . "2) Import table structure from dbs14903137.sql (or empty tables)\n"
        . "3) Import gst_traders_history_export.sql into NEW DB\n"
        . "4) Point cococola_gst/config.php to NEW DB only\n"
        . "5) Keep Fusion site on OLD DB — new Fusion bills stay only there\n";
    if (PHP_SAPI === 'cli') {
        echo $msg;
    } else {
        header('Content-Type: text/plain; charset=utf-8');
        echo $msg;
    }
    exit;
}
