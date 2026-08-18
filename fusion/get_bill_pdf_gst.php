<?php
include 'config_gst.php';

$bill_id = isset($_GET['bill_id']) ? (int)$_GET['bill_id'] : 0;

if ($bill_id <= 0) {
    http_response_code(400);
    exit;
}

$bill = $conn->query("SELECT pdf_file FROM gst_bills WHERE id = $bill_id")->fetch_assoc();
if (!$bill || empty($bill['pdf_file'])) {
    http_response_code(404);
    exit;
}

$filepath = __DIR__ . '/invoices/' . $bill['pdf_file'];
if (!file_exists($filepath)) {
    http_response_code(404);
    exit;
}

header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="' . $bill['pdf_file'] . '"');
header('Content-Length: ' . filesize($filepath));
readfile($filepath);
?>
