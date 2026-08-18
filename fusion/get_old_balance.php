<?php
include 'config.php';
header('Content-Type: application/json');

$name = trim($_GET['name'] ?? '');
$exclude_id = isset($_GET['exclude_id']) ? (int)$_GET['exclude_id'] : 0;

if ($name === '') {
    echo json_encode(['total_balance' => 0, 'bills' => []]);
    exit;
}

$name = $conn->real_escape_string($name);
$excludeCondition = $exclude_id > 0 ? "AND id != $exclude_id" : '';

$sql = "SELECT id, billname, total, paid_amount, discount_type, discount_value
        FROM bills
        WHERE LOWER(TRIM(billname)) = LOWER(TRIM('$name'))
        AND (total - paid_amount) > 0 $excludeCondition";


$result = $conn->query($sql);

$bills = [];
$total_balance = 0;

while ($row = $result->fetch_assoc()) {
    $total = floatval($row['total']);
    $paid  = floatval($row['paid_amount']);
    $type  = $row['discount_type'] ?? '';
    $value = floatval($row['discount_value'] ?? 0);

    // Calculate discount based on type
    if ($type === 'percent') {
        $discount = $total * ($value / 100);
    } else {
        $discount = $value;
    }

    // Calculate due after discount
    $due = ($total - $discount) - $paid;
    if ($due < 0) $due = 0;

    $bills[] = [
        'id' => $row['id'],
        'billname' => $row['billname'],
        'total' => $total,
        'paid_amount' => $paid,
        'discount_type' => $type,
        'discount_value' => $value,
        'due' => $due
    ];

    $total_balance += $due;
}

echo json_encode([
    'total_balance' => round($total_balance, 2),
    'bills' => $bills
]);
?>
