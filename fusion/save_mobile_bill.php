<?php
include 'config_mobile.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['items'])) {
    echo json_encode(['error' => 'No items provided']);
    exit;
}

$conn->begin_transaction();

try {
    // Insert bill
    $customer_name = $conn->real_escape_string($data['customer_name']);
    $customer_phone = $conn->real_escape_string($data['customer_phone']);
    $total = floatval($data['total']);
    $paid_amount = floatval($data['paid_amount']);

    $sql = "INSERT INTO mobile_sales_bills (customer_name, customer_phone, total, paid_amount) 
            VALUES ('$customer_name', '$customer_phone', $total, $paid_amount)";
    
    if (!$conn->query($sql)) {
        throw new Exception('Failed to insert bill');
    }

    $bill_id = $conn->insert_id;

    // Insert items and update stock
    foreach ($data['items'] as $item) {
        $product_id = (int)$item['id'];
        $product_name = $conn->real_escape_string($item['name']);
        $price = floatval($item['price']);
        $quantity = (int)$item['qty'];
        $item_total = floatval($item['total']);

        $sql = "INSERT INTO mobile_sales_items (bill_id, product_id, product_name, price, quantity, total) 
                VALUES ($bill_id, $product_id, '$product_name', $price, $quantity, $item_total)";
        
        if (!$conn->query($sql)) {
            throw new Exception('Failed to insert bill item');
        }

        // Update stock
        $sql = "UPDATE mobile_products SET stock = stock - $quantity WHERE id = $product_id";
        if (!$conn->query($sql)) {
            throw new Exception('Failed to update stock');
        }

        // Add to stock history
        $old_stock = $conn->query("SELECT stock + $quantity as old_stock FROM mobile_products WHERE id = $product_id")
                          ->fetch_assoc()['old_stock'];
        $new_stock = $conn->query("SELECT stock FROM mobile_products WHERE id = $product_id")
                          ->fetch_assoc()['stock'];

        $sql = "INSERT INTO mobile_stock_history (product_id, old_stock, new_stock, change_qty, change_type, reference_type, reference_id) 
                VALUES ($product_id, $old_stock, $new_stock, $quantity, 'OUT', 'mobile_sale', $bill_id)";
        if (!$conn->query($sql)) {
            throw new Exception('Failed to add stock history');
        }
    }

    $conn->commit();
    echo $bill_id;

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['error' => $e->getMessage()]);
}
?>
