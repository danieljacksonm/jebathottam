<?php
require('fpdf.php');
include 'config_mobile.php';

$service_id = isset($_GET['service_id']) ? (int)$_GET['service_id'] : 0;

// Fetch service info
$service = $conn->query("SELECT * FROM mobile_service_jobs WHERE id = $service_id")->fetch_assoc();
if (!$service) {
    die("Service not found");
}

if ($conn->error) {
    die("Error fetching service: " . $conn->error);
}

class PDF extends FPDF
{
    function Header()
    {
        // Header with gradient-like effect using lines
        $this->SetFillColor(240, 87, 108);
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
        $this->Cell(0, 5, 'Thank you for choosing our service!', 0, 1, 'C');
        $this->Cell(0, 5, 'Generated on: ' . date('d-m-Y H:i:s'), 0, 0, 'C');
        $this->SetTextColor(0, 0, 0);
    }
}

$pdf = new PDF('L', 'mm', 'A4');
$pdf->SetMargins(15, 45, 15);
$pdf->AddPage();

// Service title with background
$pdf->SetFillColor(240, 240, 240);
$pdf->Rect(15, 45, 277, 10, 'F');
$pdf->SetFont('Arial', 'B', 16);
$pdf->Cell(0, 10, 'SERVICE RECEIPT', 0, 1, 'C');
$pdf->Ln(5);

// Job info box
$pdf->SetFillColor(248, 249, 250);
$pdf->Rect(15, 60, 277, 18, 'F');
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(50, 7, 'Job No:', 0, 0, 'L');
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(80, 7, '#' . $service['id'], 0, 0, 'L');
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(40, 7, 'Date:', 0, 0, 'L');
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(0, 7, date('d-m-Y h:i A', strtotime($service['service_date'])), 0, 1, 'L');
$pdf->Ln(8);

// Customer details section
$pdf->SetFillColor(240, 87, 108);
$pdf->SetTextColor(255, 255, 255);
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 8, 'CUSTOMER DETAILS', 0, 1, 'L', true);
$pdf->SetTextColor(0, 0, 0);
$pdf->Ln(3);

$pdf->SetFillColor(248, 249, 250);
$pdf->Rect(15, $pdf->GetY(), 277, 18, 'F');
$pdf->Ln(2);
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(50, 7, 'Name:', 0, 0, 'L');
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(80, 7, $service['customer_name'], 0, 0, 'L');
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(40, 7, 'Phone:', 0, 0, 'L');
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(0, 7, $service['customer_phone'], 0, 1, 'L');
$pdf->Ln(8);

// Mobile details section
$pdf->SetFillColor(240, 87, 108);
$pdf->SetTextColor(255, 255, 255);
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 8, 'MOBILE DEVICE DETAILS', 0, 1, 'L', true);
$pdf->SetTextColor(0, 0, 0);
$pdf->Ln(3);

$pdf->SetFillColor(248, 249, 250);
$pdf->Rect(15, $pdf->GetY(), 277, 18, 'F');
$pdf->Ln(2);
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(50, 7, 'Brand:', 0, 0, 'L');
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(80, 7, $service['mobile_brand'], 0, 0, 'L');
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(40, 7, 'Model:', 0, 0, 'L');
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(0, 7, $service['mobile_model'], 0, 1, 'L');
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(50, 7, 'IMEI:', 0, 0, 'L');
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(0, 7, $service['mobile_imei'] ?: 'N/A', 0, 1, 'L');
$pdf->Ln(8);

// Problem details section
$pdf->SetFillColor(240, 87, 108);
$pdf->SetTextColor(255, 255, 255);
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 8, 'PROBLEM & SERVICE DETAILS', 0, 1, 'L', true);
$pdf->SetTextColor(0, 0, 0);
$pdf->Ln(3);

$pdf->SetFillColor(248, 249, 250);
$pdf->Rect(15, $pdf->GetY(), 277, 35, 'F');
$pdf->Ln(2);
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(0, 6, 'Problem Description:', 0, 1, 'L');
$pdf->SetFont('Arial', '', 10);
$pdf->MultiCell(0, 6, $service['problem_description'], 0, 'L');
$pdf->Ln(3);

$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(50, 7, 'Status:', 0, 0, 'L');
$pdf->SetFont('Arial', '', 11);
$statusColor = $service['status'] == 'Completed' ? 'green' : ($service['status'] == 'Pending' ? 'orange' : 'blue');
$pdf->SetTextColor($statusColor);
$pdf->Cell(80, 7, $service['status'], 0, 0, 'L');
$pdf->SetTextColor(0, 0, 0);
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(40, 7, 'Est. Cost:', 0, 0, 'L');
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(0, 7, '₹' . number_format($service['estimated_cost'], 2), 0, 1, 'L');
$pdf->Ln(8);

// Terms box
$pdf->SetFillColor(240, 240, 240);
$pdf->Rect(15, $pdf->GetY(), 277, 25, 'F');
$pdf->Ln(3);
$pdf->SetFont('Arial', 'I', 9);
$pdf->SetTextColor(128, 128, 128);
$pdf->Cell(0, 5, 'Terms & Conditions:', 0, 1, 'L');
$pdf->Cell(0, 5, '• Please keep this receipt for future reference.', 0, 1, 'L');
$pdf->Cell(0, 5, '• We are not responsible for data loss.', 0, 1, 'L');
$pdf->Cell(0, 5, '• Collect your device within 30 days.', 0, 1, 'L');
$pdf->SetTextColor(0, 0, 0);

// Save PDF
$filename = "mobile_service_" . $service['id'] . ".pdf";
$pdf->Output($filename, 'I');

// Update service with PDF filename
$conn->query("UPDATE mobile_service_jobs SET pdf_file = '$filename' WHERE id = $service_id");
?>
