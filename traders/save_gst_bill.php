<?php
/**
 * Save GST bill — simple & reliable.
 * Stock history is optional (never blocks checkout).
 */
include 'config.php';
require_once 'auth_helper.php';
require_once 'gst_helpers.php';
requireSectionApi('gst');

header('Content-Type: application/json; charset=utf-8');

function gstJsonFail($msg, $code = 400)
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg ?: 'Unknown error']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data) || empty($data['items']) || !is_array($data['items'])) {
    gstJsonFail('Invalid bill data. Add products and try again.');
}

$bill_name = trim((string) ($data['bill_name'] ?? ''));
if ($bill_name === '') {
    gstJsonFail('Enter customer / bill name.');
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
    ensureGstBillColumns($conn);
    ensureStockHistoryTable($conn);
} catch (Throwable $e) {
    // continue — bill save must not depend on helper setup
}

$next = nextGstFySerial($conn);
$fy = $next['fy'];
$serial = (int) $next['serial'];

$lines = [];
foreach ($data['items'] as $item) {
    $pid = (int) ($item['id'] ?? 0);
    $qty = max(0, (int) ($item['qty'] ?? 0));
    $free = max(0, (int) ($item['free'] ?? 0));
    if ($pid <= 0 || ($qty + $free) <= 0) {
        continue;
    }
    $price = floatval($item['price'] ?? 0);
    $lines[] = [
        'id' => $pid,
        'price' => $price,
        'qty' => $qty,
        'free' => $free,
        'total' => gstPaidLineAmount($price, $qty),
        'unit' => (string) ($item['unit'] ?? ''),
        'mrp' => (string) ($item['mrp'] ?? ''),
        'hsn' => (string) ($item['hsn'] ?? ''),
    ];
}
if (count($lines) === 0) {
    gstJsonFail('Add at least one product with quantity.');
}

$conn->begin_transaction();
try {
    // Explicit next id — works even if AUTO_INCREMENT is broken
    $maxRes = $conn->query('SELECT COALESCE(MAX(id), 0) AS m FROM bills FOR UPDATE');
    if (!$maxRes) {
        $maxRes = $conn->query('SELECT COALESCE(MAX(id), 0) AS m FROM bills');
    }
    if (!$maxRes) {
        throw new Exception('Cannot read bills table: ' . $conn->error);
    }
    $bill_id = ((int) $maxRes->fetch_assoc()['m']) + 1;
    if ($bill_id < 1) {
        $bill_id = 1;
    }

    $bn = $conn->real_escape_string($bill_name);
    $ad = $conn->real_escape_string($address);
    $ph = $conn->real_escape_string($phone);
    $dt = $conn->real_escape_string($discount_type);
    $fyEsc = $conn->real_escape_string($fy);

    $sql = "INSERT INTO bills
        (id, billname, address, phone, total, bill_date, old_payment, discount_type, discount_value, gst_fy, gst_serial, paid_amount)
        VALUES
        ($bill_id, '$bn', '$ad', '$ph', $total, NOW(), $old_payment, '$dt', $discount_value, '$fyEsc', $serial, 0)";

    // If paid_amount column missing, retry without it
    if (!$conn->query($sql)) {
        $sql2 = "INSERT INTO bills
            (id, billname, address, phone, total, bill_date, old_payment, discount_type, discount_value, gst_fy, gst_serial)
            VALUES
            ($bill_id, '$bn', '$ad', '$ph', $total, NOW(), $old_payment, '$dt', $discount_value, '$fyEsc', $serial)";
        if (!$conn->query($sql2)) {
            throw new Exception('Insert bill failed: ' . $conn->error);
        }
    }

    foreach ($lines as $item) {
        $pid = $item['id'];
        $price = $item['price'];
        $qty = $item['qty'];
        $free = $item['free'];
        $lineTotal = $item['total'];
        $unit = $conn->real_escape_string($item['unit']);
        $mrp = $conn->real_escape_string($item['mrp']);
        $hsn = $conn->real_escape_string($item['hsn']);

        $chk = $conn->query("SELECT id, stock, free_stock FROM products WHERE id = $pid LIMIT 1");
        if (!$chk || $chk->num_rows === 0) {
            throw new Exception("Product #$pid not found.");
        }
        $prod = $chk->fetch_assoc();

        if (!$conn->query("INSERT INTO bill_items
            (bill_id, product_id, price, quantity, total, unit, mrp, hsn, free)
            VALUES ($bill_id, $pid, $price, $qty, $lineTotal, '$unit', '$mrp', '$hsn', $free)")) {
            throw new Exception('Insert bill item failed: ' . $conn->error);
        }

        if (!$conn->query("UPDATE products SET stock = stock - $qty, free_stock = free_stock - $free WHERE id = $pid")) {
            throw new Exception('Stock update failed: ' . $conn->error);
        }

        // Optional history — never fail the bill for this
        $newStock = ((int) $prod['stock']) - $qty;
        $newFree = ((int) $prod['free_stock']) - $free;
        if ($qty > 0) {
            @$conn->query("INSERT INTO stock_history
                (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at, note)
                VALUES ($pid, " . ((int) $prod['stock']) . ", $newStock, $qty, 'OUT', 'sale', $bill_id, NOW(), '')");
        }
        if ($free > 0) {
            @$conn->query("INSERT INTO stock_history
                (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id, created_at, note)
                VALUES ($pid, " . ((int) $prod['free_stock']) . ", $newFree, $free, 'OUT', 'sale_free', $bill_id, NOW(), '')");
        }
    }

    $conn->commit();
    echo json_encode([
        'ok' => true,
        'bill_id' => $bill_id,
        'gst_serial' => $serial,
        'gst_fy' => $fy,
    ]);
} catch (Throwable $e) {
    $conn->rollback();
    gstJsonFail($e->getMessage() ?: 'Checkout failed', 500);
}
