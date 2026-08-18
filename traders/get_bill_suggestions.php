<?php
include 'config.php';
require_once 'auth_helper.php';
requireSectionApi('gst');

$q = isset($_GET['q']) ? trim($_GET['q']) : '';
$field = isset($_GET['field']) ? trim($_GET['field']) : '';

if (strlen($q) < 1) {
    echo json_encode([]);
    exit;
}

$search = '%' . $q . '%';

// Search by company/customer name only OR by place/address only — avoid mixing wrong data
if ($field === 'address') {
    $stmt = $conn->prepare("SELECT billname, address, phone FROM bills WHERE address LIKE ? ORDER BY billname ASC, id DESC LIMIT 15");
    $stmt->bind_param('s', $search);
} else {
    // default: search by name (company/customer)
    $stmt = $conn->prepare("SELECT billname, address, phone FROM bills WHERE billname LIKE ? ORDER BY billname ASC, id DESC LIMIT 15");
    $stmt->bind_param('s', $search);
}
$stmt->execute();
$res = $stmt->get_result();

$list = [];
$seen = [];
while ($row = $res->fetch_assoc()) {
    $key = ($field === 'address')
        ? (($row['address'] ?? '') . '|' . ($row['billname'] ?? '') . '|' . ($row['phone'] ?? ''))
        : (($row['billname'] ?? '') . '|' . ($row['address'] ?? '') . '|' . ($row['phone'] ?? ''));
    if (isset($seen[$key])) continue;
    $seen[$key] = true;
    $list[] = [
        'billname' => $row['billname'] ?? '',
        'address'  => $row['address'] ?? '',
        'phone'    => $row['phone'] ?? ''
    ];
}

header('Content-Type: application/json');
echo json_encode($list);
