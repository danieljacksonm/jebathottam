<?php
require('fpdf.php');
include 'config_gst.php';

$bill_id = isset($_GET['bill_id']) ? (int)$_GET['bill_id'] : 0;

// Fetch GST bill info
$bill = $conn->query("SELECT * FROM gst_bills WHERE id = $bill_id")->fetch_assoc();
if (!$bill) {
    $bill = [
        'id' => 'GST-BILL-001',
        'bill_date' => date('Y-m-d'),
        'billname' => 'John Doe',
        'address' => 'Sample Address, City, State',
        'phone' => '9876543210',
        'pdf_file' => null,
        'subtotal' => 0,
        'cgst_total' => 0,
        'sgst_total' => 0,
        'cess_total' => 0,
        'gst_percentage' => 18
    ];
}

// Fetch GST bill items
$items = $conn->query("SELECT bi.*, p.name 
                       FROM gst_bill_items bi
                       JOIN gst_products p ON bi.product_id = p.id
                       WHERE bill_id = $bill_id");

$dummy_items = [];
while ($r = $items->fetch_assoc()) {
    $dummy_items[] = $r;
}

class PDF extends FPDF
{
    function Header()
    {
        $this->SetFont('Arial', 'I', 10);
        $this->Cell(0, 6, "+ May you be richly rewarded by the Lord +", 0, 1, 'C');
        $this->Ln(3);
        $this->SetFont('Arial', 'B', 8);
        $this->SetFillColor(200, 200, 200);
        $this->Cell(0, 8, 'TAX INVOICE (GST)', 0, 1, 'C', true);
        $this->Ln(2);
    }
}

$pdf = new PDF('P', 'mm', 'A4');
$pdf->AddPage();

// --- Company & Customer Info ---
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(95, 6, "YEGOVA FUSION CORNER", 0, 0, 'L');
$pdf->Cell(95, 6, "Customer: " . ucfirst(strtolower($bill['billname'])), 0, 1, 'C');
$pdf->Cell(95, 6, "YEGOVA MOBILES", 0, 0, 'L');
$pdf->Cell(95, 6, "Phone: " . $bill['phone'], 0, 1, 'C');
$pdf->Cell(95, 6, "Puthiamputhur, Thoothukudi", 0, 0, 'L');
$pdf->Cell(95, 6, "Address: " . $bill['address'], 0, 1, 'C');
$pdf->Cell(95, 6, "Contact: 9843059986 | FSSAI: 12425029000464", 0, 0, 'L');
$pdf->Cell(95, 6, "GSTIN: [YOUR GSTIN HERE]", 0, 1, 'C');
$pdf->Cell(95, 6, "", 0, 0);
$pdf->Cell(95, 6, "Bill No: " . $bill['id'], 0, 1, 'C');
$pdf->Cell(95, 6, "", 0, 0);
$pdf->Cell(95, 6, "Date: " . date("d-m-Y", strtotime($bill['bill_date'])), 0, 1, 'C');
$pdf->Ln(3);

// --- Table Header ---
$pdf->SetFont('Arial', 'B', 8);
$pdf->SetFillColor(220, 220, 220);
$pdf->Cell(55, 8, 'Item Description', 1, 0, 'C', true);
$pdf->Cell(15, 8, 'HSN/SAC', 1, 0, 'C', true);
$pdf->Cell(12, 8, 'MRP', 1, 0, 'C', true);
$pdf->Cell(10, 8, 'Qty', 1, 0, 'C', true);
$pdf->Cell(10, 8, 'Unit', 1, 0, 'C', true);
$pdf->Cell(18, 8, 'Rate', 1, 0, 'C', true);
$pdf->Cell(12, 8, 'CGST %', 1, 0, 'C', true);
$pdf->Cell(12, 8, 'SGST %', 1, 0, 'C', true);
$pdf->Cell(12, 8, 'CESS %', 1, 0, 'C', true);
$pdf->Cell(24, 8, 'Amount', 1, 1, 'C', true);

// --- Table Rows ---
$pdf->SetFont('Arial', '', 8);
$grand_total = $total_qty = $total_price = 0;
$total_cgst = $total_sgst = $total_cess = 0;

foreach ($dummy_items as $row) {
    $price  = $row['price'];
    $qty    = $row['quantity'] + $row['free'];
    $total  = $row['total'];
    $subtotal = $row['total'] - ($row['cgst_amount'] + $row['sgst_amount'] + $row['cess_amount']);
    $single = $qty > 0 ? $subtotal / $qty : $price;

    if ($row['unit'] == "Glass Btl") $row['unit'] = "G-Btl";

    $pdf->Cell(55, 8, $row['name'], 1, 0, 'L');
    $pdf->Cell(15, 8, $row['hsn'], 1, 0, 'C');
    $pdf->Cell(12, 8, $row['mrp'], 1, 0, 'C');
    $pdf->Cell(10, 8, $qty, 1, 0, 'C');
    $pdf->Cell(10, 8, $row['unit'], 1, 0, 'C');
    $pdf->Cell(18, 8, number_format($single, 2), 1, 0, 'C');
    $pdf->Cell(12, 8, number_format($row['cgst_rate'], 2) . '%', 1, 0, 'C');
    $pdf->Cell(12, 8, number_format($row['sgst_rate'], 2) . '%', 1, 0, 'C');
    $pdf->Cell(12, 8, number_format($row['cess_rate'], 2) . '%', 1, 0, 'C');
    $pdf->Cell(24, 8, number_format($total, 2), 1, 1, 'C');

    $grand_total += $total;
    $total_qty   += $qty;
    $total_price += $price;
    $total_cgst += $row['cgst_amount'];
    $total_sgst += $row['sgst_amount'];
    $total_cess += $row['cess_amount'];
}

// --- Totals Row ---
$pdf->SetFont('Arial', 'B', 8);
$pdf->Cell(55, 8, 'Totals', 1);
$pdf->Cell(15, 8, '', 1);
$pdf->Cell(12, 8, '', 1);
$pdf->Cell(10, 8, $total_qty, 1, 0, 'C');
$pdf->Cell(10, 8, '', 1);
$pdf->Cell(18, 8, '', 1);
$pdf->Cell(12, 8, '', 1);
$pdf->Cell(12, 8, '', 1);
$pdf->Cell(12, 8, '', 1);
$pdf->Cell(24, 8, number_format($grand_total, 2), 1, 1, 'C');
$pdf->Ln(5);

// --- GST Summary ---
$pdf->SetFont('Arial', 'B', 10);
$pdf->SetFillColor(200, 200, 200);
$pdf->Cell(60, 8, 'GST Summary', 1, 1, 'C', true);

$pdf->SetFont('Arial', '', 9);
$pdf->Cell(30, 8, 'Subtotal (Before GST)', 1, 0);
$pdf->Cell(30, 8, number_format($bill['subtotal'], 2), 1, 1, 'C');

$pdf->Cell(30, 8, 'CGST Amount', 1, 0);
$pdf->Cell(30, 8, number_format($bill['cgst_total'], 2), 1, 1, 'C');

$pdf->Cell(30, 8, 'SGST Amount', 1, 0);
$pdf->Cell(30, 8, number_format($bill['sgst_total'], 2), 1, 1, 'C');

$pdf->Cell(30, 8, 'CESS Amount', 1, 0);
$pdf->Cell(30, 8, number_format($bill['cess_total'], 2), 1, 1, 'C');

$pdf->SetFont('Arial', 'B', 9);
$pdf->Cell(30, 8, 'Total GST', 1, 0);
$pdf->Cell(30, 8, number_format($bill['cgst_total'] + $bill['sgst_total'] + $bill['cess_total'], 2), 1, 1, 'C');

$pdf->Ln(5);

// --- Bill Summary ---
$pdf->SetFont('Arial', 'B', 10);
$pdf->SetFillColor(200, 200, 200);
$pdf->Cell(60, 8, 'Bill Summary', 1, 1, 'C', true);

$pdf->SetFont('Arial', '', 9);

$pdf->Cell(30, 8, 'Total Amount', 1, 0);
$pdf->Cell(30, 8, number_format($grand_total, 2), 1, 1, 'C');

if ($bill['discount_value'] > 0) {
    $label = ($bill['discount_type'] == 'percent') ?
        "Discount ({$bill['discount_value']}%)" :
        "Discount Amount";
    $pdf->Cell(30, 8, $label, 1, 0);
    $pdf->Cell(30, 8,  number_format( ($bill['discount_type'] == 'percent' ? $grand_total *  $bill['discount_value'] / 100 : $bill['discount_value']), 2), 1, 1, 'C');
    $grand_total -= ($bill['discount_type'] == 'percent') ? $grand_total * ($bill['discount_value'] / 100) : $bill['discount_value'];
}

if ($bill['old_payment'] > 0) {
    $pdf->Cell(30, 8, 'Old Payment', 1, 0);
    $pdf->Cell(30, 8, number_format($bill['old_payment'], 2), 1, 1, 'C');
    $grand_total += $bill['old_payment'];
}

$rounded = round($grand_total);
$roundoff = number_format($rounded - $grand_total, 2, '.', '');

$pdf->Cell(30, 8, 'Round Off', 1, 0);
$pdf->Cell(30, 8, number_format($roundoff, 2), 1, 1, 'C');

$pdf->SetFont('Arial', 'B', 9);
$pdf->Cell(30, 8, 'Grand Total', 1, 0);
$pdf->Cell(30, 8, number_format($rounded, 2), 1, 1, 'C');

// --- Divider Line ---
$pdf->Ln(8);
$pdf->SetFont('Arial', 'I', 8);
$pdf->Cell(0, 6, '---------------------------------  X  ---------------------------------', 0, 1, 'C');
$pdf->Ln(3);

// --- Payment Box ---
$startX = 10;
$startY = $pdf->GetY();
$boxWidth = 190;
$boxHeight = 60;
$pdf->Rect($startX, $startY, $boxWidth, $boxHeight);
// Add top padding (e.g., 5 units)
$paddingTop = 10;
$pdf->SetY($startY + $paddingTop);
// QR Code + Bank Details
$qrFile = "gpay_qr.jpeg";
$pdf->Image($qrFile, 50, $pdf->GetY(), 40, 40);
$pdf->SetXY(100, $startY + $paddingTop);
$pdf->SetFont('Arial', '', 10);
$pdf->MultiCell(120, 6, "Payment Details:\nPhone No: 9843059986\nAccount No: 013100050059415\nIFSC Code: TMBL0000013");

// --- Grand Total ---
$pdf->Ln(5);
$pdf->SetFont('Arial', 'B', 12);
$pdf->SetX($pdf->GetX() + 100);
$pdf->Cell(0, 10, "Grand Total: Rs. " . number_format($rounded, 2), 0, 1, 'C');

// --- Save PDF ---
$folder = "invoices/";
if (!is_dir($folder)) mkdir($folder, 0777, true);

if (!empty($bill['pdf_file']) && file_exists($folder . $bill['pdf_file'])) {
    unlink($folder . $bill['pdf_file']);
}

$filename = "gst_invoice_" . $bill['id'] . "_" . date("Ymd_His") . ".pdf";
$filepath = $folder . $filename;
$pdf->Output('F', $filepath);

$conn->query("UPDATE gst_bills SET pdf_file = '$filename' WHERE id = $bill_id");

if (isset($_GET['save_only'])) {
    return;
}
$pdf->Output('I', $filename);
