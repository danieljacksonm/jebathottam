<?php
require('fpdf.php');
include 'config_mobile.php';

$bill_id = isset($_GET['bill_id']) ? (int)$_GET['bill_id'] : 0;

// Fetch bill info
$bill = $conn->query("SELECT * FROM mobile_sales_bills WHERE id = $bill_id")->fetch_assoc();
if (!$bill) {
    die("Bill not found");
}

// Fetch bill items
$items = $conn->query("SELECT * FROM mobile_sales_items WHERE bill_id = $bill_id");
if (!$items) {
    die("Error fetching bill items: " . $conn->error);
}

class PDF extends FPDF
{
    function Header()
    {
        // Header with gradient-like effect using lines
        $this->SetFillColor(102, 126, 234);
        $this->Rect(10, 10, 277, 25, 'F');
        
        $this->SetTextColor(255, 255, 255);
        $this->SetFont('Arial', 'B', 20);
        $this->Cell(0, 12, 'MOBILE SHOP', 0, 1, 'C');
        $this->SetFont('Arial', '', 10);
        $this->Cell(0, 6, 'Puthiamputhur, Thoothukudi', 0, 1, 'C');
        $this->Cell(0, 6, 'Phone: 9843059986', 0, 1, 'C');
        $this->SetTextColor(0, 0, 0);
        $this->Ln(5);
    }

    function Footer()
    {
        $this->SetY(-20);
        $this->SetFont('Arial', 'I', 8);
        $this->SetTextColor(128, 128, 128);
        $this->Cell(0, 5, 'Thank you for shopping with us!', 0, 1, 'C');
        $this->Cell(0, 5, 'Generated on: ' . date('d-m-Y H:i:s'), 0, 0, 'C');
        $this->SetTextColor(0, 0, 0);
    }
}

$pdf = new PDF('L', 'mm', 'A4');
$pdf->SetMargins(15, 45, 15);
$pdf->AddPage();

// Bill title with background
$pdf->SetFillColor(240, 240, 240);
$pdf->Rect(15, 45, 277, 10, 'F');
$pdf->SetFont('Arial', 'B', 16);
$pdf->Cell(0, 10, 'SALES BILL', 0, 1, 'C');
$pdf->Ln(5);

// Customer info box
$pdf->SetFillColor(248, 249, 250);
$pdf->Rect(15, 60, 277, 25, 'F');
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(50, 7, 'Bill No:', 0, 0, 'L');
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(80, 7, '#' . $bill['id'], 0, 0, 'L');
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(40, 7, 'Date:', 0, 0, 'L');
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(0, 7, date('d-m-Y h:i A', strtotime($bill['bill_date'])), 0, 1, 'L');
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(50, 7, 'Customer:', 0, 0, 'L');
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(80, 7, $bill['customer_name'], 0, 0, 'L');
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(40, 7, 'Phone:', 0, 0, 'L');
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(0, 7, $bill['customer_phone'], 0, 1, 'L');
$pdf->Ln(8);

// Table header with color
$pdf->SetFillColor(102, 126, 234);
$pdf->SetTextColor(255, 255, 255);
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(100, 10, 'Item', 1, 0, 'L', true);
$pdf->Cell(50, 10, 'Price (₹)', 1, 0, 'R', true);
$pdf->Cell(30, 10, 'Qty', 1, 0, 'C', true);
$pdf->Cell(50, 10, 'Total (₹)', 1, 1, 'R', true);
$pdf->SetTextColor(0, 0, 0);

$pdf->SetFont('Arial', '', 10);
$total = 0;
$rowCount = 0;
while ($item = $items->fetch_assoc()) {
    // Alternate row colors
    if ($rowCount % 2 == 0) {
        $pdf->SetFillColor(248, 249, 250);
    } else {
        $pdf->SetFillColor(255, 255, 255);
    }
    $pdf->Cell(100, 8, $item['product_name'], 1, 0, 'L', true);
    $pdf->Cell(50, 8, number_format($item['price'], 2), 1, 0, 'R', true);
    $pdf->Cell(30, 8, $item['quantity'], 1, 0, 'C', true);
    $pdf->Cell(50, 8, number_format($item['total'], 2), 1, 1, 'R', true);
    $total += $item['total'];
    $rowCount++;
}

// Summary box
$pdf->Ln(5);
$pdf->SetFillColor(240, 240, 240);
$pdf->Rect(15, $pdf->GetY(), 277, 35, 'F');
$pdf->Ln(3);

$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(150, 8, 'Total Amount:', 0, 0, 'L');
$pdf->Cell(0, 8, '₹' . number_format($total, 2), 0, 1, 'R');
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(150, 7, 'Paid Amount:', 0, 0, 'L');
$pdf->Cell(0, 7, '₹' . number_format($bill['paid_amount'], 2), 0, 1, 'R');
$pdf->SetFont('Arial', 'B', 12);
$balance = $total - $bill['paid_amount'];
$pdf->Cell(150, 8, 'Balance Due:', 0, 0, 'L');
$pdf->SetTextColor($balance > 0 ? 220 : 34, $balance > 0 ? 53 : 139, $balance > 0 ? 69 : 34);
$pdf->Cell(0, 8, '₹' . number_format($balance, 2), 0, 1, 'R');
$pdf->SetTextColor(0, 0, 0);

$pdf->Ln(10);
$pdf->SetFont('Arial', 'I', 9);
$pdf->SetTextColor(128, 128, 128);
$pdf->Cell(0, 5, 'Terms & Conditions:', 0, 1, 'L');
$pdf->Cell(0, 5, '• Goods once sold will not be taken back.', 0, 1, 'L');
$pdf->Cell(0, 5, '• No warranty on accessories.', 0, 1, 'L');
$pdf->Cell(0, 5, '• Please check items before leaving.', 0, 1, 'L');
$pdf->SetTextColor(0, 0, 0);

// Save PDF
$filename = "mobile_bill_" . $bill['id'] . ".pdf";
$pdf->Output($filename, 'I');

// Update bill with PDF filename
$conn->query("UPDATE mobile_sales_bills SET pdf_file = '$filename' WHERE id = $bill_id");
?>
