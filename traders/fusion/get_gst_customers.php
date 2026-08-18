<?php
include 'config.php';
require_once 'gst_helpers.php';

$q = isset($_GET['q']) ? trim($_GET['q']) : '';

if (strlen($q) < 1) {
    echo json_encode([]);
    exit;
}

$search = '%' . $q . '%';

$stmt = $conn->prepare("SELECT DISTINCT b.billname
    FROM bills b
    JOIN bill_items bi ON bi.bill_id = b.id
    JOIN products p ON p.id = bi.product_id
    WHERE b.billname LIKE ?
    AND " . gstReportFilterSql() . "
    AND " . gstTradersBillFilterSql() . "
    ORDER BY b.billname ASC
    LIMIT 20");
$stmt->bind_param('s', $search);
$stmt->execute();
$res = $stmt->get_result();

$names = [];
while ($row = $res->fetch_assoc()) {
    $names[] = $row['billname'];
}

header('Content-Type: application/json');
echo json_encode($names);
