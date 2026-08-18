<?php
/**
 * Temporary error viewer — DELETE after site works.
 * Open: http://traders.yegova.store/debug_500.php
 */
ini_set('display_errors', '1');
error_reporting(E_ALL);

echo "<pre>PHP " . PHP_VERSION . "\n";

try {
    include 'config.php';
    echo "DB connect: OK\n";

    require_once 'gst_helpers.php';
    echo "gst_helpers: OK\n";

    ensureGstBillColumns($conn);
    echo "ensureGstBillColumns: OK\n";

    $r = $conn->query("SHOW COLUMNS FROM bills LIKE 'gst_serial'");
    echo "gst_serial column: " . ($r && $r->num_rows ? 'YES' : 'NO') . "\n";

    $sql = "SELECT COUNT(*) AS c FROM bills WHERE " . gstTradersBillFilterSql();
    echo "SQL: $sql\n";
    $res = $conn->query($sql);
    if (!$res) {
        echo "Query error: " . $conn->error . "\n";
    } else {
        echo "Bill count: " . $res->fetch_assoc()['c'] . "\n";
    }

    echo "\nAll good. Delete this file now.\n";
} catch (Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n" . $e->getFile() . ':' . $e->getLine();
}
echo "</pre>";
