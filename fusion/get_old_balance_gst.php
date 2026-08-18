<?php
include 'config_gst.php';

header('Content-Type: application/json');

if (isset($_GET['name'])) {
    $name = $conn->real_escape_string($_GET['name']);
    $exclude_id = isset($_GET['exclude_id']) ? (int)$_GET['exclude_id'] : 0;
    
    $where_clause = $exclude_id > 0 ? "AND id != $exclude_id" : "";
    
    // Get unpaid bills for this customer
    $result = $conn->query("SELECT id, billname, total, paid_amount, bill_date 
                           FROM gst_bills 
                           WHERE billname = '$name' AND total > paid_amount $where_clause
                           ORDER BY bill_date ASC");
    
    $bills = [];
    $total_balance = 0;
    
    while ($row = $result->fetch_assoc()) {
        $balance = $row['total'] - $row['paid_amount'];
        if ($balance > 0) {
            $bills[] = [
                'id' => $row['id'],
                'bill_date' => $row['bill_date'],
                'total' => $row['total'],
                'paid_amount' => $row['paid_amount'],
                'balance' => $balance
            ];
            $total_balance += $balance;
        }
    }
    
    echo json_encode([
        'total_balance' => $total_balance,
        'bills' => $bills
    ]);
}
?>
