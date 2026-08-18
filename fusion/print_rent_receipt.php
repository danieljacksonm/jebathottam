<?php
require('fpdf.php');
include 'config.php';

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$row = $conn->query("SELECT * FROM home_rent_receipts WHERE id = $id")->fetch_assoc();

if (!$row) {
    die('Receipt not found');
}

class RentPDF extends FPDF
{
    function Header()
    {
        $this->SetFont('Arial', 'B', 16);
        $this->Cell(0, 10, 'HOME RENT RECEIPT', 0, 1, 'C');
        $this->SetFont('Arial', '', 10);
        $this->Cell(0, 6, 'Yegova Fusion Corner', 0, 1, 'C');
        $this->Ln(4);
    }
}

$pdf = new RentPDF('P', 'mm', 'A4');
$pdf->AddPage();
$pdf->SetFont('Arial', '', 11);

$monthLabel = $row['rent_month'];
if (preg_match('/^(\d{4})-(\d{2})$/', $row['rent_month'], $m)) {
    $monthLabel = date('F Y', strtotime($row['rent_month'] . '-01'));
}

$pdf->Cell(50, 8, 'Receipt No:', 0, 0);
$pdf->Cell(0, 8, $row['id'], 0, 1);
$pdf->Cell(50, 8, 'Date:', 0, 0);
$pdf->Cell(0, 8, date('d-m-Y', strtotime($row['paid_date'])), 0, 1);
$pdf->Ln(4);

$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 8, 'Received From', 0, 1);
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(0, 8, $row['tenant_name'], 0, 1);
$pdf->Ln(2);

$pdf->SetFont('Arial', '', 11);
$pdf->MultiCell(0, 8, 'The sum of Rupees ' . number_format($row['amount'], 2) . ' received towards home rent for the month of ' . $monthLabel . '.', 0, 'L');
$pdf->Ln(4);

$pdf->Cell(50, 8, 'Payment Mode:', 0, 0);
$pdf->Cell(0, 8, $row['payment_mode'], 0, 1);

if (!empty($row['notes'])) {
    $pdf->Cell(50, 8, 'Notes:', 0, 0);
    $pdf->Cell(0, 8, $row['notes'], 0, 1);
}

$pdf->Ln(20);
$pdf->Cell(0, 8, 'Authorized Signature', 0, 1, 'R');

$pdf->Output('I', 'rent_receipt_' . $row['id'] . '.pdf');
