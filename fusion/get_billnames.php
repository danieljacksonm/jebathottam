<?php
include 'config.php';

$q = $_GET['q'] ?? '';

$stmt = $conn->prepare("SELECT billname FROM bills WHERE billname LIKE ? ORDER BY billname ASC LIMIT 20");
$search = "%".$q."%";
$stmt->bind_param("s", $search);
$stmt->execute();
$result = $stmt->get_result();

$names = [];
while($row = $result->fetch_assoc()) {
    $names[] = $row['billname'];  // NO DISTINCT
}

echo json_encode($names);
?>
