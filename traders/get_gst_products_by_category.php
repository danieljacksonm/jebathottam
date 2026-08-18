<?php
include 'config.php';
require_once 'auth_helper.php';
require_once 'gst_helpers.php';
requireSectionApi('gst');

$categories = gstCategories();
$filter = isset($_GET['category']) ? trim($_GET['category']) : '';

$sql = "SELECT id, name, price, stock, unit, mrp, hsn, original, free_stock, category
        FROM products
        WHERE " . gstProductWhereSql() . "
        GROUP BY id
        ORDER BY name ASC";
$stmt = $conn->query($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error', 'products' => [], 'categories' => $categories]);
    exit;
}

$all = [];
$seenIds = [];
while ($row = $stmt->fetch_assoc()) {
    $pid = (int) $row['id'];
    if (isset($seenIds[$pid])) {
        continue;
    }
    $seenIds[$pid] = true;
    if (!isGstReportProduct($row['name'])) {
        continue;
    }
    $cat = deriveGstCategory($row['name'], $row['category'] ?? '');
    if ($cat === 'Other') {
        continue;
    }
    $all[] = [
        'id'         => $pid,
        'name'       => $row['name'],
        'price'      => (float) $row['price'],
        'stock'      => (int) $row['stock'],
        'unit'       => $row['unit'] ?? '',
        'mrp'        => $row['mrp'] ?? '',
        'hsn'        => resolveGstHsn($row['name'], '', $row['hsn']),
        'original'   => (float) ($row['original'] ?? 0),
        'free_stock' => (int) ($row['free_stock'] ?? 0),
        'category'   => $cat,
    ];
}

if ($filter !== '' && strtolower($filter) !== 'all') {
    $products = array_values(array_filter($all, function ($p) use ($filter) {
        return $p['category'] === $filter;
    }));
} else {
    $products = $all;
}

header('Content-Type: application/json');
echo json_encode(['products' => $products, 'categories' => $categories]);
