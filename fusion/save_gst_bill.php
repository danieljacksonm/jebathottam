<?php
/**
 * Save bill from GST site — assigns FY serial (Apr→Mar resets to 1).
 */
include 'config.php';
require_once 'gst_helpers.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['items'])) {
    http_response_code(400);
    echo "Invalid data";
    exit;
}

$bill_name = $conn->real_escape_string($data['bill_name']);
$address   = $conn->real_escape_string($data['address']);
$phone     = $conn->real_escape_string($data['phone']);
$total     = floatval($data['total']);
$discount_type  = $conn->real_escape_string($data['discount_type']);
$discount_value = $conn->real_escape_string($data['discount_value']);
$old_payment    = $conn->real_escape_string($data['old_payment']);

ensureGstBillColumns($conn);
$next = nextGstFySerial($conn);
$fy = $conn->real_escape_string($next['fy']);
$serial = (int) $next['serial'];

$conn->begin_transaction();
try {
    $validLines = 0;
    foreach ($data['items'] as $item) {
        $q = max(0, intval($item['qty'] ?? 0));
        $f = max(0, intval($item['free'] ?? 0));
        if ($q + $f > 0 && intval($item['id']) > 0) {
            $validLines++;
        }
    }
    if ($validLines === 0) {
        throw new Exception('Add at least one product with quantity (paid or free).');
    }

    $sql = "INSERT INTO bills (billname, address, phone, total, bill_date, old_payment, discount_type, discount_value, gst_fy, gst_serial)
            VALUES ('$bill_name', '$address', '$phone', $total, NOW(), '$old_payment', '$discount_type', $discount_value, '$fy', $serial)";
    if (!$conn->query($sql)) {
        throw new Exception('Insert bill failed: ' . $conn->error);
    }
    $bill_id = $conn->insert_id;

    foreach ($data['items'] as $item) {
        $pid   = intval($item['id']);
        $price = floatval($item['price']);
        $qty   = max(0, intval($item['qty'] ?? 0));
        $free  = max(0, intval($item['free'] ?? 0));
        if ($qty + $free <= 0) {
            continue;
        }
        if ($pid <= 0) {
            throw new Exception('Invalid product id in bill line');
        }
        $chk = $conn->query("SELECT id FROM products WHERE id = $pid LIMIT 1");
        if (!$chk || $chk->num_rows === 0) {
            throw new Exception("Product not found (id $pid). Cannot save bill.");
        }
        $lineTotal = $price * ($qty + $free);
        $unit  = $conn->real_escape_string($item['unit'] ?? '');
        $mrp   = $conn->real_escape_string($item['mrp'] ?? '');
        $hsn   = $conn->real_escape_string($item['hsn'] ?? '');

        if (!$conn->query("INSERT INTO bill_items
            (bill_id, product_id, price, quantity, total, unit, mrp, hsn, free)
            VALUES ($bill_id, $pid, $price, $qty, $lineTotal, '$unit', '$mrp', '$hsn', $free)")) {
            throw new Exception('Insert bill item failed: ' . $conn->error);
        }

        if (!$conn->query("UPDATE products SET stock = stock - $qty, free_stock = free_stock - $free WHERE id = $pid")) {
            throw new Exception('Stock update failed: ' . $conn->error);
        }

        $res = $conn->query("SELECT stock, free_stock FROM products WHERE id = $pid");
        $row = $res->fetch_assoc();
        $new_stock = $row['stock'];
        $new_free_stock = $row['free_stock'];

        if ($qty > 0) {
            if (!$conn->query("INSERT INTO stock_history
                (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at)
                VALUES ($pid, $new_stock + $qty, $new_stock, $qty, 'OUT', 'sale', $bill_id, NOW())")) {
                throw new Exception('Stock history failed: ' . $conn->error);
            }
        }
        if ($free > 0) {
            if (!$conn->query("INSERT INTO stock_history
                (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at)
                VALUES ($pid, $new_free_stock + $free, $new_free_stock, $free, 'OUT', 'sale_free', $bill_id, NOW())")) {
                throw new Exception('Stock history failed: ' . $conn->error);
            }
        }
    }
    $conn->commit();
    header('Content-Type: application/json');
    echo json_encode(['bill_id' => $bill_id, 'gst_serial' => $serial, 'gst_fy' => $next['fy']]);
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
