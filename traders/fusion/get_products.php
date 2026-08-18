<?php
include 'config.php';
require_once 'auth_helper.php';
requireBillingAccess();
ensureBillsCreatedByColumn($conn);

$data = json_decode(file_get_contents("php://input"), true);
$billIds = $data['bill_ids'] ?? [];

if (empty($billIds)) {
    echo "<p class='text-danger'>No bills selected.</p>";
    exit;
}

$billIds = array_map('intval', $billIds);
if (isBrandRep()) {
    $section = $conn->real_escape_string((string) currentSection());
    $safe = implode(',', $billIds);
    $ok = [];
    $owned = $conn->query("SELECT id FROM bills WHERE id IN ($safe) AND created_by = '$section'");
    if ($owned) {
        while ($r = $owned->fetch_assoc()) {
            $ok[] = (int) $r['id'];
        }
    }
    $billIds = $ok;
}

if (empty($billIds)) {
    echo "<p class='text-danger'>No bills selected.</p>";
    exit;
}

$ids = implode(",", $billIds);

$sql = "SELECT p.name, bi.quantity, bi.total, ( bi.total) as total,
               (bi.total - (p.original * bi.quantity)) as profit
        FROM bill_items bi
        JOIN products p ON p.id = bi.product_id
        WHERE bi.bill_id IN ($ids) order by p.name asc";

$result = $conn->query($sql);

$totalAmount = 0;
$totalProfit = 0;

echo "<table class='table table-bordered'>
        <thead>
            <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th>Profit</th>
            </tr>
        </thead><tbody>";

while ($row = $result->fetch_assoc()) {
    $totalAmount += $row['total'];
    $totalProfit += $row['profit'];

    echo "<tr>
            <td>{$row['name']}</td>
            <td>{$row['quantity']}</td>
            <td>₹" . number_format($row['total'], 2) . "</td>
            <td>₹" . number_format($row['total'], 2) . "</td>
            <td class='text-success'>₹" . number_format($row['profit'], 2) . "</td>
          </tr>";
}

echo "</tbody></table>";
echo "<h5 class='mt-3'>Total Amount: <span class='text-primary'>₹" . number_format($totalAmount, 2) . "</span></h5>";
echo "<h5>Total Profit: <span class='text-success'>₹" . number_format($totalProfit, 2) . "</span></h5>";
