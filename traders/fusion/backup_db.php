<?php
/**
 * Simple backup helper — downloads SQL inserts for main tables.
 * Login required. Run occasionally; prefer host panel backup for full DB.
 * Delete or protect this file after use if you do not need it.
 */
include __DIR__ . '/config.php';
require_once __DIR__ . '/auth_helper.php';
requireAnySection(['billing', 'gst', 'mobile', 'rent']);

$tables = ['products', 'bills', 'bill_items', 'stock_history'];
$filename = 'fusion_backup_' . date('Ymd_His') . '.sql';

header('Content-Type: application/sql; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

echo "-- Fusion Corner backup " . date('c') . "\n";
echo "SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS=0;\n\n";

foreach ($tables as $table) {
    $chk = $conn->query("SHOW TABLES LIKE '" . $conn->real_escape_string($table) . "'");
    if (!$chk || $chk->num_rows === 0) {
        echo "-- skip missing table `$table`\n\n";
        continue;
    }
    echo "-- TABLE `$table`\n";
    $res = $conn->query("SELECT * FROM `$table`");
    if (!$res) {
        echo "-- error: " . $conn->error . "\n\n";
        continue;
    }
    while ($row = $res->fetch_assoc()) {
        $cols = [];
        $vals = [];
        foreach ($row as $k => $v) {
            $cols[] = '`' . str_replace('`', '', $k) . '`';
            if ($v === null) {
                $vals[] = 'NULL';
            } else {
                $vals[] = "'" . $conn->real_escape_string($v) . "'";
            }
        }
        echo 'REPLACE INTO `' . $table . '` (' . implode(',', $cols) . ') VALUES (' . implode(',', $vals) . ");\n";
    }
    echo "\n";
}

echo "SET FOREIGN_KEY_CHECKS=1;\n";
