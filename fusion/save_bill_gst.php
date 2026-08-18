<?php
include 'config_gst.php';

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
$subtotal  = floatval($data['subtotal']);
$cgst_total = floatval($data['cgst_total']);
$sgst_total = floatval($data['sgst_total']);
$cess_total = floatval($data['cess_total']);
$discount_type     = $conn->real_escape_string($data['discount_type']);
$discount_value     = $conn->real_escape_string($data['discount_value']);
$old_payment     = $conn->real_escape_string($data['old_payment']);

// Calculate average GST percentage
$gst_percentage = $subtotal > 0 ? (($cgst_total + $sgst_total + $cess_total) / $subtotal) * 100 : 0;

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

    // --- STEP 1: Insert GST bill header ---
    $sql = "INSERT INTO gst_bills (billname, address, phone, total, subtotal, cgst_total, sgst_total, cess_total, gst_percentage, bill_date, old_payment, discount_type, discount_value) 
            VALUES ('$bill_name', '$address', '$phone', $total, $subtotal, $cgst_total, $sgst_total, $cess_total, $gst_percentage, NOW(), '$old_payment', '$discount_type', $discount_value)";
    if (!$conn->query($sql)) {
        throw new Exception('Insert GST bill failed: ' . $conn->error);
    }
    $bill_id = $conn->insert_id;

    // --- STEP 2: Insert GST bill items + deduct stock + add history ---
    foreach ($data['items'] as $item) {
        $pid   = intval($item['id']);
        $price = floatval($item['price']);
        $qty   = max(0, intval($item['qty'] ?? 0));
        $free  = max(0, intval($item['free'] ?? 0));
        if ($qty + $free <= 0) {
            continue;
        }
        if ($pid <= 0) {
            throw new Exception('Invalid product id in GST bill line');
        }
        $chk = $conn->query("SELECT id FROM gst_products WHERE id = $pid LIMIT 1");
        if (!$chk || $chk->num_rows === 0) {
            throw new Exception("GST Product not found (id $pid). Cannot save GST bill.");
        }
        
        $subtotal_item = $price * ($qty + $free);
        $total = $item['total'];
        $unit  = $conn->real_escape_string($item['unit'] ?? '');
        $mrp   = $conn->real_escape_string($item['mrp'] ?? '');
        $hsn   = $conn->real_escape_string($item['hsn'] ?? '');
        $cgst_rate = floatval($item['cgst_rate'] ?? 0);
        $sgst_rate = floatval($item['sgst_rate'] ?? 0);
        $cess_rate = floatval($item['cess_rate'] ?? 0);
        $cgst_amount = floatval($item['cgst_amount'] ?? 0);
        $sgst_amount = floatval($item['sgst_amount'] ?? 0);
        $cess_amount = floatval($item['cess_amount'] ?? 0);
        $item_total_with_gst = floatval($item['total'] ?? 0);

        if (!$conn->query("INSERT INTO gst_bill_items 
            (bill_id, product_id, price, quantity, total, unit, mrp, hsn, free, 
             cgst_rate, sgst_rate, cess_rate, cgst_amount, sgst_amount, cess_amount, item_total_with_gst)
            VALUES ($bill_id, $pid, $price, $qty, $total, '$unit', '$mrp', '$hsn', $free,
             $cgst_rate, $sgst_rate, $cess_rate, $cgst_amount, $sgst_amount, $cess_amount, $item_total_with_gst)")) {
            throw new Exception('Insert GST bill item failed: ' . $conn->error);
        }

        if (!$conn->query("UPDATE gst_products SET stock = stock - $qty, free_stock = free_stock - $free WHERE id = $pid")) {
            throw new Exception('GST Stock update failed: ' . $conn->error);
        }

        $res = $conn->query("SELECT stock, free_stock FROM gst_products WHERE id = $pid");
        $row = $res->fetch_assoc();
        $new_stock = $row['stock'];
        $new_free_stock = $row['free_stock'];

        if ($qty > 0) {
            if (!$conn->query("INSERT INTO gst_stock_history 
                (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at) 
                VALUES ($pid, $new_stock + $qty, $new_stock, $qty, 'OUT', 'sale', $bill_id, NOW())")) {
                throw new Exception('GST Stock history failed: ' . $conn->error);
            }
        }
        if ($free > 0) {
            if (!$conn->query("INSERT INTO gst_stock_history 
                (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at) 
                VALUES ($pid, $new_free_stock + $free, $new_free_stock, $free, 'OUT', 'sale_free', $bill_id, NOW())")) {
                throw new Exception('GST Stock history failed: ' . $conn->error);
            }
        }
    }
    $conn->commit();
    echo $bill_id;
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
