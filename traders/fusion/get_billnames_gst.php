<?php
include 'config_gst.php';

header('Content-Type: application/json');

if (isset($_GET['q'])) {
    $query = $conn->real_escape_string($_GET['q']);
    $result = $conn->query("SELECT DISTINCT billname FROM gst_bills WHERE billname LIKE '%$query%' ORDER BY billname LIMIT 10");
    
    $names = [];
    while ($row = $result->fetch_assoc()) {
        $names[] = $row['billname'];
    }
    
    echo json_encode($names);
}
?>
