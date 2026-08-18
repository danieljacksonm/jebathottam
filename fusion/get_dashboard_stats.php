<?php
include 'config.php';
include 'config_gst.php';

header('Content-Type: application/json');

$type = $_GET['type'] ?? '';

switch ($type) {
    case 'regular_bills':
        $result = $conn->query("SELECT COUNT(*) as count FROM bills");
        $row = $result->fetch_assoc();
        echo json_encode(['count' => $row['count']]);
        break;
        
    case 'gst_bills':
        $result = $conn->query("SELECT COUNT(*) as count FROM gst_bills");
        $row = $result->fetch_assoc();
        echo json_encode(['count' => $row['count']]);
        break;
        
    case 'mobile_sales':
        $result = $conn->query("SELECT COUNT(*) as count FROM mobile_sales_bills");
        $row = $result->fetch_assoc();
        echo json_encode(['count' => $row['count']]);
        break;
        
    case 'mobile_services':
        $result = $conn->query("SELECT COUNT(*) as count FROM mobile_service_jobs");
        $row = $result->fetch_assoc();
        echo json_encode(['count' => $row['count']]);
        break;
        
    case 'products':
        $result = $conn->query("SELECT COUNT(*) as count FROM products");
        $row = $result->fetch_assoc();
        echo json_encode(['count' => $row['count']]);
        break;
        
    case 'stock':
        $result = $conn->query("SELECT SUM(stock) + SUM(free_stock) as count FROM products");
        $row = $result->fetch_assoc();
        echo json_encode(['count' => $row['count'] ?? 0]);
        break;
        
    default:
        echo json_encode(['count' => 0]);
}
?>
