<?php
include 'config.php';
require_once 'auth_helper.php';
requireBillingAccess();
ensureBillsCreatedByColumn($conn);

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['bill_id']) || empty($data['items'])) {
    http_response_code(400);
    echo "Invalid data";
    exit;
}

$bill_id   = intval($data['bill_id']);
assertRepOwnsBill($conn, $bill_id);
$bill_name = $conn->real_escape_string($data['bill_name']);
$address   = $conn->real_escape_string($data['address']);
$phone     = $conn->real_escape_string($data['phone']);
$discount_type     = $conn->real_escape_string($data['discount_type']);
$discount_value     = $conn->real_escape_string($data['discount_value']);
$old_payment     = $conn->real_escape_string($data['old_payment']);
$total     = floatval($data['total']);

$conn->begin_transaction();
try {
    // --- STEP 1: Update product quantities by restoring stock/free_stock from current bill items ---
    $sql_old = "SELECT product_id, quantity, free FROM bill_items WHERE bill_id = $bill_id";
    $res_old = $conn->query($sql_old);
    if (!$res_old) {
        throw new Exception('Fetch old items failed: ' . $conn->error);
    }

    while ($row = $res_old->fetch_assoc()) {
        $pid  = (int) $row['product_id'];
        $qty  = max(0, (int)($row['quantity'] ?? 0));
        $free = max(0, (int)($row['free'] ?? 0));
        if ($pid <= 0 || ($qty === 0 && $free === 0)) {
            continue;
        }

        if (!$conn->query("UPDATE products SET stock = stock + $qty, free_stock = free_stock + $free WHERE id = $pid")) {
            throw new Exception('Stock restore failed: ' . $conn->error);
        }
        if ($conn->affected_rows < 1) {
            throw new Exception("Cannot update bill: product #$pid was removed from the catalog. Restore or re-add the product, or delete this bill from the Bills list.");
        }

        $res = $conn->query("SELECT stock, free_stock FROM products WHERE id = $pid");
        $prod = $res ? $res->fetch_assoc() : null;
        if (!$prod) {
            throw new Exception('Stock restore verification failed for product #' . $pid);
        }

        if ($qty > 0) {
            $old_s = (int)$prod['stock'] - $qty;
            $new_s = (int)$prod['stock'];
            if (!$conn->query("INSERT INTO stock_history 
                (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at) 
                VALUES ($pid, $old_s, $new_s, $qty, 'IN', 'bill_restore', $bill_id, NOW())")) {
                throw new Exception('Stock history failed: ' . $conn->error);
            }
        }
        if ($free > 0) {
            $old_f = (int)$prod['free_stock'] - $free;
            $new_f = (int)$prod['free_stock'];
            if (!$conn->query("INSERT INTO stock_history 
                (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at) 
                VALUES ($pid, $old_f, $new_f, $free, 'IN', 'bill_restore_free', $bill_id, NOW())")) {
                throw new Exception('Stock history failed: ' . $conn->error);
            }
        }
    }

    // --- STEP 2: Delete old bill items ---
    if (!$conn->query("DELETE FROM bill_items WHERE bill_id=$bill_id")) {
        throw new Exception('Delete bill items failed: ' . $conn->error);
    }

    // --- STEP 3: Update bill header ---
    $sql = "UPDATE bills 
            SET billname='$bill_name', address='$address', phone='$phone', total='$total', old_payment='$old_payment', discount_type='$discount_type', discount_value='$discount_value'
            WHERE id=$bill_id";
    if (!$conn->query($sql)) {
        throw new Exception('Update bill failed: ' . $conn->error);
    }

    // --- STEP 4: Insert new items and update product quantities (deduct stock and free_stock) ---
    $linesInserted = 0;
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
        $chk = $conn->query("SELECT id, name, category FROM products WHERE id = $pid LIMIT 1");
        if (!$chk || $chk->num_rows === 0) {
            throw new Exception("Product not found (id $pid). Cannot update bill.");
        }
        if (isBrandRep()) {
            $prodChk = $chk->fetch_assoc();
            if (!$prodChk || !fusionProductMatchesBrand($prodChk['name'] ?? '', $prodChk['category'] ?? '', currentBrandLabel())) {
                throw new Exception('You can bill only ' . currentBrandLabel() . ' products.');
            }
        }
        $total = $price * ($qty + $free);
        $unit  = $conn->real_escape_string($item['unit'] ?? '');
        $mrp   = $conn->real_escape_string($item['mrp'] ?? '');
        $hsn   = $conn->real_escape_string($item['hsn'] ?? '');

        if (!$conn->query("INSERT INTO bill_items 
            (bill_id, product_id, price, quantity, total, unit, mrp, hsn, free)
            VALUES ($bill_id, $pid, $price, $qty, $total, '$unit', '$mrp', '$hsn', $free)")) {
            throw new Exception('Insert bill item failed: ' . $conn->error);
        }
        $linesInserted++;

        if (!$conn->query("UPDATE products SET stock = stock - $qty, free_stock = free_stock - $free WHERE id = $pid")) {
            throw new Exception('Stock update failed: ' . $conn->error);
        }

        $res = $conn->query("SELECT stock, free_stock FROM products WHERE id = $pid");
        $prod = $res->fetch_assoc();
        $new_s = (int)$prod['stock'];
        $new_f = (int)$prod['free_stock'];

        if ($qty > 0) {
            if (!$conn->query("INSERT INTO stock_history 
                (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at) 
                VALUES ($pid, $new_s + $qty, $new_s, $qty, 'OUT', 'bill_update', $bill_id, NOW())")) {
                throw new Exception('Stock history failed: ' . $conn->error);
            }
        }
        if ($free > 0) {
            if (!$conn->query("INSERT INTO stock_history 
                (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at) 
                VALUES ($pid, $new_f + $free, $new_f, $free, 'OUT', 'bill_update_free', $bill_id, NOW())")) {
                throw new Exception('Stock history failed: ' . $conn->error);
            }
        }
    }

    if ($linesInserted === 0) {
        throw new Exception('Bill must have at least one line with quantity (paid or free).');
    }

    $conn->commit();
    echo $bill_id;
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
