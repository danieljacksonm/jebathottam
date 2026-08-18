<?php
include 'config.php';
require_once 'auth_helper.php';
require_once 'fusion_helpers.php';
requireBillingAccess();

// Derive category from DB category, then product name (and MRP for Cococola split)
function deriveCategory($name, $mrp, $dbCategory = '') {
    $dbCat = trim((string) $dbCategory);
    $known = ['Maa', 'Friva', 'Milkshake', 'Cavins', 'Campa', 'Lays', 'KK', 'Tata', 'Pickle', 'Doritos', 'Cheetos'];
    foreach ($known as $k) {
        if (strcasecmp($dbCat, $k) === 0) {
            return $k;
        }
    }

    $n = mb_strtolower(trim($name));
    if (strpos($n, 'campa') !== false) return 'Campa';
    if (strpos($n, 'cavin') !== false) return 'Cavins';
    if (strpos($n, 'lays') !== false) return 'Lays';
    if (strpos($n, 'kk') !== false) return 'KK';
    if (strpos($n, 'tata') !== false) return 'Tata';
    if (strpos($n, 'pickle') !== false) return 'Pickle';
    if (strpos($n, 'doritos') !== false) return 'Doritos';
    if (strpos($n, 'cheetos') !== false) return 'Cheetos';
    if (strpos($n, 'milkshake') !== false) return 'Milkshake';
    if (strpos($n, 'friva') !== false) return 'Friva';
    if (strpos($n, 'maa fd') !== false) return 'Maa';
    if (preg_match('/\bmaa\b/u', $n)) return 'Maa';
    if (preg_match('/(^|[[:space:]])maa([[:space:]]|fd)/u', $n)) return 'Maa';
    $m = floatval($mrp);
    if ($m > 0 && $m <= 10) return 'Cococola 10 MRP';
    if ($m > 10 && $m <= 20) return 'Cococola 20 MRP';
    return 'Cococola';
}

$isRep = isBrandRep();
$brand = currentBrandLabel();

$allCats = [
    'Lays', 'KK', 'Tata', 'Pickle', 'Doritos', 'Cheetos',
    'Cococola 10 MRP', 'Cococola 20 MRP', 'Cococola',
    'Maa', 'Friva', 'Milkshake', 'Cavins', 'Campa',
];

if ($isRep && $brand) {
    $categories = [$brand];
} else {
    $categories = fusionBillingCategories($allCats);
}

$filter = isset($_GET['category']) ? trim($_GET['category']) : '';

$sql = "SELECT id, name, price, stock, unit, mrp, hsn, original, free_stock, category FROM products ORDER BY name ASC";
$stmt = $conn->query($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error', 'products' => [], 'categories' => $categories]);
    exit;
}

$all = [];
while ($row = $stmt->fetch_assoc()) {
    if (fusionShouldHideGstProducts() && !$isRep && isFusionGstOnlyProduct($row['name'])) {
        continue;
    }
    if ($isRep && $brand && !fusionProductMatchesBrand($row['name'] ?? '', $row['category'] ?? '', $brand)) {
        continue;
    }
    $cat = deriveCategory($row['name'], $row['mrp'] ?? 0, $row['category'] ?? '');
    if ($isRep && $brand) {
        $cat = $brand;
    }
    $all[] = [
        'id'         => (int)$row['id'],
        'name'       => $row['name'],
        'price'      => (float)$row['price'],
        'stock'      => (int)$row['stock'],
        'unit'       => $row['unit'] ?? '',
        'mrp'        => $row['mrp'] ?? '',
        'hsn'        => $row['hsn'] ?? '',
        'original'   => (float)($row['original'] ?? 0),
        'free_stock' => (int)($row['free_stock'] ?? 0),
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
