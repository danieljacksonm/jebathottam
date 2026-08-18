<?php
/**
 * Temporary debug — login to GST first, then open:
 * print_gst_debug.php?bill_id=1580
 */
error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once __DIR__ . '/auth_helper.php';
startAppSession();

header('Content-Type: text/plain; charset=utf-8');

echo "PHP " . PHP_VERSION . "\n";
echo "Dir: " . __DIR__ . "\n";
echo "Session section: " . (string) ($_SESSION['section'] ?? '(none)') . "\n\n";

include __DIR__ . '/config.php';
require_once __DIR__ . '/gst_helpers.php';

$bill_id = isset($_GET['bill_id']) ? (int) $_GET['bill_id'] : 1580;
$r = $conn->query("SELECT id, billname, gst_serial, gst_fy, total FROM bills WHERE id = $bill_id");
$bill = $r ? $r->fetch_assoc() : null;
echo $bill ? ("Bill OK: " . json_encode($bill) . "\n") : ("Bill #$bill_id not found / error: " . $conn->error . "\n");

$i = $conn->query("SELECT COUNT(*) AS c FROM bill_items WHERE bill_id = $bill_id");
$row = $i ? $i->fetch_assoc() : null;
echo 'Items count: ' . (string) ($row['c'] ?? ('error ' . $conn->error)) . "\n\n";

if (empty($_SESSION['section']) || $_SESSION['section'] !== 'gst') {
    echo "NOT LOGGED IN to GST.\n";
    echo "1) Open index.php and login\n";
    echo "2) Then open print_gst_bill.php?bill_id=$bill_id\n";
} else {
    echo "Logged in OK.\n";
    echo "Now open: print_gst_bill.php?bill_id=$bill_id\n";
    echo "If PDF fails, that page will show PRINT ERROR text instead of blank 500.\n";
}
