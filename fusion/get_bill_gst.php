<?php
include 'config_gst.php';

header('Content-Type: application/json');

if (isset($_GET['id'])) {
    $bill_id = (int)$_GET['id'];
    
    // Get bill details
    $bill = $conn->query("SELECT * FROM gst_bills WHERE id = $bill_id")->fetch_assoc();
    
    if ($bill) {
        // Get bill items
        $items_result = $conn->query("SELECT bi.*, p.name 
                                   FROM gst_bill_items bi
                                   JOIN gst_products p ON bi.product_id = p.id
                                   WHERE bill_id = $bill_id");
        
        $items = [];
        while ($item = $items_result->fetch_assoc()) {
            $items[] = [
                'id' => $item['product_id'],
                'name' => $item['name'],
                'price' => $item['price'],
                'qty' => $item['quantity'],
                'total' => $item['item_total_with_gst'],
                'unit' => $item['unit'],
                'mrp' => $item['mrp'],
                'hsn' => $item['hsn'],
                'free' => $item['free'],
                'cgst_rate' => $item['cgst_rate'],
                'sgst_rate' => $item['sgst_rate'],
                'cess_rate' => $item['cess_rate'],
                'cgst_amount' => $item['cgst_amount'],
                'sgst_amount' => $item['sgst_amount'],
                'cess_amount' => $item['cess_amount']
            ];
        }
        
        echo json_encode([
            'bill_name' => $bill['billname'],
            'address' => $bill['address'],
            'phone' => $bill['phone'],
            'discount_type' => $bill['discount_type'],
            'discount_value' => $bill['discount_value'],
            'old_payment' => $bill['old_payment'],
            'items' => $items
        ]);
    } else {
        echo json_encode(['error' => 'Bill not found']);
    }
}
?>
