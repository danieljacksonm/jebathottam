<?php
include 'config.php';
header('Content-Type: application/json');

$ids = isset($_GET['ids']) ? trim($_GET['ids']) : '';
if ($ids === '') {
    echo json_encode([]);
    exit;
}

$parts = array_filter(array_map('intval', explode(',', $ids)));
$parts = array_unique(array_filter($parts, function ($id) { return $id > 0; }));
if (empty($parts)) {
    echo json_encode([]);
    exit;
}

$out = [];
foreach ($parts as $id) {
    $res = $conn->query("SELECT id, stock, free_stock FROM products WHERE id = $id LIMIT 1");
    if ($res && ($row = $res->fetch_assoc())) {
        $out[(string)$row['id']] = [
            'stock'      => max(0, (int)($row['stock'] ?? 0)),
            'free_stock' => max(0, (int)($row['free_stock'] ?? 0)),
        ];
    }
}
echo json_encode($out);
