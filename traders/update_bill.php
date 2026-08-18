<?php
/**
 * Update GST bill — stock history is optional (never blocks save).
 */
include 'config.php';
require_once 'auth_helper.php';
require_once 'gst_helpers.php';
requireSectionApi('gst');

header('Content-Type: application/json; charset=utf-8');

function gstUpdateFail($msg, $code = 400)
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg ?: 'Unknown error']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data) || empty($data['bill_id']) || empty($data['items']) || !is_array($data['items'])) {
    gstUpdateFail('Invalid bill data.');
}

$bill_id = (int) $data['bill_id'];
if ($bill_id <= 0) {
    gstUpdateFail('Invalid bill id.');
}

$bill_name = trim((string) ($data['bill_name'] ?? ''));
if ($bill_name === '') {
    gstUpdateFail('Enter customer / bill name.');
}

$address = trim((string) ($data['address'] ?? ''));
$phone = trim((string) ($data['phone'] ?? ''));
$total = floatval($data['total'] ?? 0);
$discount_type = trim((string) ($data['discount_type'] ?? 'none'));
if ($discount_type === '') {
    $discount_type = 'none';
}
$discount_value = floatval($data['discount_value'] ?? 0);
$old_payment = floatval($data['old_payment'] ?? 0);

try {
    ensureStockHistoryTable($conn);
} catch (Throwable $e) {
    // ignore
}

$conn->begin_transaction();
try {
    $sql_old = "SELECT product_id, quantity, free FROM bill_items WHERE bill_id = $bill_id";
    $res_old = $conn->query($sql_old);
    if (!$res_old) {
        throw new Exception('Fetch old items failed: ' . $conn->error);
    }

    while ($row = $res_old->fetch_assoc()) {
        $pid = (int) $row['product_id'];
        $qty = max(0, (int) ($row['quantity'] ?? 0));
        $free = max(0, (int) ($row['free'] ?? 0));
        if ($pid <= 0 || ($qty === 0 && $free === 0)) {
            continue;
        }

        if (!$conn->query("UPDATE products SET stock = stock + $qty, free_stock = free_stock + $free WHERE id = $pid")) {
            throw new Exception('Stock restore failed: ' . $conn->error);
        }
        if ($conn->affected_rows < 1) {
            throw new Exception("Product #$pid missing from catalog. Cannot edit this bill.");
        }

        // optional history
        $res = $conn->query("SELECT stock, free_stock FROM products WHERE id = $pid");
        $prod = $res ? $res->fetch_assoc() : null;
        if ($prod) {
            if ($qty > 0) {
                $old_s = (int) $prod['stock'] - $qty;
                $new_s = (int) $prod['stock'];
                @$conn->query("INSERT INTO stock_history
                    (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at, note)
                    VALUES ($pid, $old_s, $new_s, $qty, 'IN', 'bill_restore', $bill_id, NOW(), '')");
            }
            if ($free > 0) {
                $old_f = (int) $prod['free_stock'] - $free;
                $new_f = (int) $prod['free_stock'];
                @$conn->query("INSERT INTO stock_history
                    (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at, note)
                    VALUES ($pid, $old_f, $new_f, $free, 'IN', 'bill_restore_free', $bill_id, NOW(), '')");
            }
        }
    }

    if (!$conn->query("DELETE FROM bill_items WHERE bill_id=$bill_id")) {
        throw new Exception('Delete bill items failed: ' . $conn->error);
    }

    $bn = $conn->real_escape_string($bill_name);
    $ad = $conn->real_escape_string($address);
    $ph = $conn->real_escape_string($phone);
    $dt = $conn->real_escape_string($discount_type);

    $sql = "UPDATE bills
            SET billname='$bn', address='$ad', phone='$ph', total=$total,
                old_payment=$old_payment, discount_type='$dt', discount_value=$discount_value
            WHERE id=$bill_id";
    if (!$conn->query($sql)) {
        throw new Exception('Update bill failed: ' . $conn->error);
    }

    $linesInserted = 0;
    foreach ($data['items'] as $item) {
        $pid = (int) ($item['id'] ?? 0);
        $price = floatval($item['price'] ?? 0);
        $qty = max(0, (int) ($item['qty'] ?? 0));
        $free = max(0, (int) ($item['free'] ?? 0));
        if ($qty + $free <= 0) {
            continue;
        }
        if ($pid <= 0) {
            throw new Exception('Invalid product id in bill line');
        }
        $chk = $conn->query("SELECT id, stock, free_stock FROM products WHERE id = $pid LIMIT 1");
        if (!$chk || $chk->num_rows === 0) {
            throw new Exception("Product #$pid not found.");
        }
        $prod = $chk->fetch_assoc();
        $lineTotal = gstPaidLineAmount($price, $qty);
        $unit = $conn->real_escape_string((string) ($item['unit'] ?? ''));
        $mrp = $conn->real_escape_string((string) ($item['mrp'] ?? ''));
        $hsn = $conn->real_escape_string((string) ($item['hsn'] ?? ''));

        if (!$conn->query("INSERT INTO bill_items
            (bill_id, product_id, price, quantity, total, unit, mrp, hsn, free)
            VALUES ($bill_id, $pid, $price, $qty, $lineTotal, '$unit', '$mrp', '$hsn', $free)")) {
            throw new Exception('Insert bill item failed: ' . $conn->error);
        }
        $linesInserted++;

        if (!$conn->query("UPDATE products SET stock = stock - $qty, free_stock = free_stock - $free WHERE id = $pid")) {
            throw new Exception('Stock update failed: ' . $conn->error);
        }

        $new_s = ((int) $prod['stock']) - $qty;
        $new_f = ((int) $prod['free_stock']) - $free;
        if ($qty > 0) {
            @$conn->query("INSERT INTO stock_history
                (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at, note)
                VALUES ($pid, " . ((int) $prod['stock']) . ", $new_s, $qty, 'OUT', 'bill_update', $bill_id, NOW(), '')");
        }
        if ($free > 0) {
            @$conn->query("INSERT INTO stock_history
                (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at, note)
                VALUES ($pid, " . ((int) $prod['free_stock']) . ", $new_f, $free, 'OUT', 'bill_update_free', $bill_id, NOW(), '')");
        }
    }

    if ($linesInserted === 0) {
        throw new Exception('Add at least one product with quantity.');
    }

    $conn->commit();
    echo json_encode(['ok' => true, 'bill_id' => $bill_id]);
} catch (Throwable $e) {
    $conn->rollback();
    gstUpdateFail($e->getMessage() ?: 'Update failed', 500);
}
