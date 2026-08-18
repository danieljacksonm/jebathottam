<?php
/**
 * Serves the bill PDF with correct Content-Type so WhatsApp (and browsers) treat it as a PDF file.
 */
include 'config.php';

$bill_id = isset($_GET['bill_id']) ? (int)$_GET['bill_id'] : 0;
if ($bill_id <= 0) {
    http_response_code(400);
    exit('Invalid bill');
}

$bill = $conn->query("SELECT pdf_file FROM bills WHERE id = $bill_id")->fetch_assoc();
if (!$bill || empty($bill['pdf_file'])) {
    http_response_code(404);
    exit('PDF not found');
}

$folder = __DIR__ . '/invoices/';
$filename = $bill['pdf_file'];
$filepath = $folder . $filename;

if (!file_exists($filepath) || !is_readable($filepath)) {
    http_response_code(404);
    exit('File not found');
}

$safe_name = 'Bill_' . $bill_id . '.pdf';
header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="' . $safe_name . '"');
header('Content-Length: ' . filesize($filepath));
header('Cache-Control: private, max-age=3600');
readfile($filepath);
exit;
