<?php
include 'config.php';
require_once 'auth_helper.php';
requireSectionApi('gst');

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing bill id"]);
    exit;
}

$bill_id = intval($_GET['id']);

// --- Fetch bill header ---
$sql = "SELECT id, billname, address, phone, total, discount_type, discount_value, old_payment, paid_amount 
        FROM bills 
        WHERE id = $bill_id";
$res = $conn->query($sql);

if ($res->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Bill not found"]);
    exit;
}

$bill = $res->fetch_assoc();

// --- Fetch bill items ---
// LEFT JOIN so edit still loads lines if a product was removed from catalog
$sql_items = "SELECT bi.product_id AS id, bi.price, bi.quantity AS qty, bi.total,
                     bi.unit, bi.mrp, bi.hsn, bi.free,
                     COALESCE(p.name, CONCAT('Product #', bi.product_id)) AS name
              FROM bill_items bi
              LEFT JOIN products p ON bi.product_id = p.id
              WHERE bi.bill_id = $bill_id";
$res_items = $conn->query($sql_items);

$items = [];
while ($row = $res_items->fetch_assoc()) {
    $items[] = [
        "id"    => $row['id'],
        "name"  => $row['name'],
        "price" => $row['price'],
        "qty"   => $row['qty'],
        "total" => $row['total'],
        "unit"  => $row['unit'],
        "mrp"   => $row['mrp'],
        "hsn"   => $row['hsn'],
        "free"  => $row['free']
    ];
}

// --- Return JSON response ---
echo json_encode([
    "bill_id"         => $bill['id'],
    "bill_name"       => $bill['billname'],
    "address"         => $bill['address'],
    "phone"           => $bill['phone'],
    "total"           => $bill['total'],
    "discount_type"   => $bill['discount_type'] ?? '',
    "discount_value"  => $bill['discount_value'] ?? 0,
    "old_payment"     => $bill['old_payment'] ?? 0,
    "paid_amount"     => $bill['paid_amount'] ?? 0,
    "items"           => $items
]);
?>
