<?php
/**
 * PDF: Bill #, store, amount only — collector columns left blank for marking; staff updates website later.
 */
require 'fpdf.php';
include 'config.php';

session_start();
if (!isset($_SESSION['user'])) {
    http_response_code(403);
    exit('Unauthorized');
}

$data = json_decode(file_get_contents('php://input'), true);
$bill_ids = $data['bill_ids'] ?? [];
if (!is_array($bill_ids) || empty($bill_ids)) {
    http_response_code(400);
    exit('No bills selected');
}

$ids = array_map('intval', $bill_ids);
$ids = array_filter($ids, function ($id) { return $id > 0; });
if (empty($ids)) {
    http_response_code(400);
    exit('Invalid bill ids');
}

$idList = implode(',', $ids);
$order = 'FIELD(id,' . $idList . ')';
$sql = "SELECT id, billname, total FROM bills WHERE id IN ($idList) ORDER BY $order";
$res = $conn->query($sql);
$rows = [];
while ($res && ($r = $res->fetch_assoc())) {
    $rows[] = $r;
}

if (empty($rows)) {
    http_response_code(404);
    exit('No bills found');
}

class PaymentListPDF extends FPDF
{
    public function Header()
    {
        // Same style as invoice PDF (print_bill.php)
        $this->SetFont('Arial', 'I', 10);
        $this->Cell(0, 6, '+ May you be richly rewarded by the Lord +', 0, 1, 'C');
        $this->Ln(2);
        $this->SetFont('Arial', 'B', 8);
        $this->SetFillColor(200, 200, 200);
        $this->Cell(0, 8, 'BILL PAYMENT LIST', 0, 1, 'C', true);
        $this->Ln(2);

        $half = 97;
        $this->SetFont('Arial', '', 10);
        $this->Cell($half, 6, 'YEGOVA FUSION CORNER', 0, 0, 'L');
        $this->Cell($half, 6, 'Generated: ' . date('d-m-Y h:i A'), 0, 1, 'R');
        $this->Cell($half, 6, 'YEGOVA MOBILES', 0, 0, 'L');
        $this->Cell($half, 6, 'Collector sheet', 0, 1, 'R');
        $this->Cell($half, 6, 'Puthiamputhur, Thoothukudi', 0, 0, 'L');
        $this->Cell($half, 6, '', 0, 1, 'R');
        $this->Cell($half, 6, 'Contact: 9843059986 | FSSAI: 12425029000464', 0, 0, 'L');
        $this->Cell($half, 6, '', 0, 1, 'R');
        $this->Ln(4);
    }

    public function Footer()
    {
        $this->SetY(-12);
        $this->SetFont('Arial', 'I', 8);
        $this->Cell(0, 5, 'Page ' . $this->PageNo() . '/{nb}', 0, 0, 'C');
    }
}

$pdf = new PaymentListPDF('P', 'mm', 'A4');
$pdf->AliasNbPages();
$pdf->SetMargins(8, 8, 8);
$pdf->AddPage();

$wBill = 18;
$wStore = 48;
$wPrice = 24;
// Collector area — blank (~104mm) for handwriting
$wPayMark = 28;
$wCollected = 26;
$wDue = 26;
$wRemarks = 24;

$pdf->SetFont('Arial', 'B', 7);
$pdf->SetFillColor(220, 220, 220);
$pdf->Cell($wBill, 8, 'Bill No', 1, 0, 'C', true);
$pdf->Cell($wStore, 8, 'Store name', 1, 0, 'C', true);
$pdf->Cell($wPrice, 8, 'Bill amt (Rs)', 1, 0, 'C', true);
$pdf->Cell($wPayMark + $wCollected + $wDue + $wRemarks, 8, 'For collector — mark below (update on website when returned)', 1, 1, 'C', true);

$pdf->SetFont('Arial', 'B', 7);
$pdf->Cell($wBill, 6, '', 1, 0, 'C', true);
$pdf->Cell($wStore, 6, '', 1, 0, 'C', true);
$pdf->Cell($wPrice, 6, '', 1, 0, 'C', true);
$pdf->Cell($wPayMark, 6, 'Paid / Unpaid / Partial', 1, 0, 'C', true);
$pdf->Cell($wCollected, 6, 'Amt collected', 1, 0, 'C', true);
$pdf->Cell($wDue, 6, 'Due (if partial)', 1, 0, 'C', true);
$pdf->Cell($wRemarks, 6, 'Remarks', 1, 1, 'C', true);

$pdf->SetFont('Arial', '', 8);
$sumTotal = 0;
$h = 10;

foreach ($rows as $r) {
    $id = (int) $r['id'];
    $name = $r['billname'] ?? '';
    if (strlen($name) > 38) {
        $name = substr($name, 0, 35) . '...';
    }
    $total = (float) ($r['total'] ?? 0);
    $sumTotal += $total;

    $pdf->Cell($wBill, $h, '#' . $id, 1, 0, 'C');
    $pdf->Cell($wStore, $h, $name, 1, 0, 'L');
    $pdf->Cell($wPrice, $h, number_format($total, 2, '.', ''), 1, 0, 'R');
    $pdf->Cell($wPayMark, $h, '', 1, 0, 'C');
    $pdf->Cell($wCollected, $h, '', 1, 0, 'C');
    $pdf->Cell($wDue, $h, '', 1, 0, 'C');
    $pdf->Cell($wRemarks, $h, '', 1, 1, 'C');
}

$pdf->SetFont('Arial', 'B', 8);
$pdf->SetFillColor(240, 240, 240);
$pdf->Cell($wBill + $wStore, 7, 'Total bill amount', 1, 0, 'R', true);
$pdf->Cell($wPrice, 7, number_format($sumTotal, 2, '.', ''), 1, 0, 'R', true);
$pdf->Cell($wPayMark + $wCollected + $wDue + $wRemarks, 7, '', 1, 1, 'C', true);

$pdf->Ln(5);
$pdf->SetFont('Arial', '', 8);
$pdf->MultiCell(0, 4, 'Only Bill No, store and bill amount are printed from the system. Collector fills Paid / Unpaid / Partial, amount collected, due if partial, and remarks. Enter those values on the website (Mark Payment) when the sheet is returned.', 0, 'L');

$filename = 'bill_payment_list_' . date('Ymd_His') . '.pdf';
header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="' . $filename . '"');
$pdf->Output('I', $filename);
