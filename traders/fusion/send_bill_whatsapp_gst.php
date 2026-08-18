<?php
session_start();
include 'config_gst.php';

if (!isset($_SESSION['user'])) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Not logged in']);
    exit;
}

$bill_id = isset($_GET['bill_id']) ? (int)$_GET['bill_id'] : 0;
if ($bill_id <= 0) {
    echo json_encode(['ok' => false, 'error' => 'Invalid bill ID']);
    exit;
}

$bill = $conn->query("SELECT id, billname, phone, pdf_file, total FROM gst_bills WHERE id = $bill_id")->fetch_assoc();
if (!$bill) {
    echo json_encode(['ok' => false, 'error' => 'GST Bill not found']);
    exit;
}

$phone = preg_replace('/\D/', '', $bill['phone'] ?? '');
if (strlen($phone) === 10) $phone = '91' . $phone;
if (empty($phone)) {
    echo json_encode(['ok' => false, 'error' => 'No phone number for this GST bill']);
    exit;
}

$folder = __DIR__ . '/invoices/';
$filename = $bill['pdf_file'] ?? '';

if (empty($filename) || !file_exists($folder . $filename)) {
    $_GET['bill_id'] = $bill_id;
    $_GET['save_only'] = 1;
    include __DIR__ . '/print_bill_gst.php';
    $bill = $conn->query("SELECT pdf_file FROM gst_bills WHERE id = $bill_id")->fetch_assoc();
    $filename = $bill['pdf_file'] ?? '';
}
if (empty($filename) || !file_exists($folder . $filename)) {
    echo json_encode(['ok' => false, 'error' => 'Could not generate GST PDF']);
    exit;
}

if (!file_exists(__DIR__ . '/config_whatsapp.php')) {
    echo json_encode(['ok' => false, 'error' => 'WhatsApp not configured. Add config_whatsapp.php.']);
    exit;
}
require __DIR__ . '/config_whatsapp.php';

if (empty($wa_access_token) || empty($wa_phone_number_id) || empty($wa_site_base_url)) {
    echo json_encode(['ok' => false, 'error' => 'WhatsApp API not configured. Set WA_ACCESS_TOKEN, WA_PHONE_NUMBER_ID and WA_SITE_BASE_URL in config_whatsapp.php']);
    exit;
}

// Use get_bill_pdf_gst.php so the URL returns Content-Type: application/pdf (proper PDF file)
$doc_url = rtrim($wa_site_base_url, '/') . '/get_bill_pdf_gst.php?bill_id=' . $bill_id;
$payload = [
    'messaging_product' => 'whatsapp',
    'recipient_type'    => 'individual',
    'to'                => $phone,
    'type'              => 'document',
    'document'          => [
        'link'    => $doc_url,
        'caption' => 'GST Bill #' . $bill_id . ' - Total ₹' . number_format((float)$bill['total'], 2),
        'filename' => 'GST_Bill_' . $bill_id . '.pdf'
    ]
];

$ch = curl_init('https://graph.facebook.com/v18.0/' . $wa_phone_number_id . '/messages');
curl_setopt_array($ch, [
    CURLOPT_POST            => true,
    CURLOPT_POSTFIELDS      => json_encode($payload),
    CURLOPT_HTTPHEADER      => [
        'Authorization: Bearer ' . $wa_access_token,
        'Content-Type: application/json'
    ],
    CURLOPT_RETURNTRANSFER  => true,
    CURLOPT_TIMEOUT         => 30
]);
$response = curl_exec($ch);
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http >= 200 && $http < 300) {
    echo json_encode(['ok' => true, 'message' => 'GST Bill sent to customer on WhatsApp']);
    exit;
}

$err = json_decode($response, true);
$err_msg = isset($err['error']['message']) ? $err['error']['message'] : ($response ?: 'Request failed');
echo json_encode(['ok' => false, 'error' => $err_msg]);
