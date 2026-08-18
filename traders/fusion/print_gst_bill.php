<?php
require('fpdf.php');
include 'config.php';
require_once 'gst_helpers.php';

$bill_id = isset($_GET['bill_id']) ? (int)$_GET['bill_id'] : 0;

// Fetch bill info
$bill = $conn->query("SELECT * FROM bills WHERE id = $bill_id")->fetch_assoc();
if (!$bill) {
    $bill = [
        'id' => 'BILL-001',
        'bill_date' => date('Y-m-d'),
        'billname' => 'John Doe',
        'address' => 'Sample Address, City, State',
        'phone' => '9876543210',
        'pdf_file' => null
    ];
}

// GST items only — MAA, Friva, Milkshake, Cavins (from normal or GST billing)
$items = $conn->query("SELECT bi.*, p.name, p.hsn AS product_hsn
                       FROM bill_items bi
                       JOIN products p ON bi.product_id = p.id
                       WHERE bi.bill_id = $bill_id AND " . gstReportFilterSql());

$dummy_items = [];
$sumTaxable = $sumCgst = $sumSgst = 0;
while ($r = $items->fetch_assoc()) {
    $r['hsn'] = resolveGstHsn($r['name'], $r['hsn'], $r['product_hsn']);
    $gst = calcGstLine($r['total']);
    $r['taxable'] = $gst['taxable'];
    $r['cgst'] = $gst['cgst'];
    $r['sgst'] = $gst['sgst'];
    $sumTaxable += $gst['taxable'];
    $sumCgst += $gst['cgst'];
    $sumSgst += $gst['sgst'];
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
        $this->Cell(0, 8, 'INVOICE', 0, 1, 'C', true);
        $this->Ln(2);
    }

    function NbLines($w, $txt)
    {
        $cw = &$this->CurrentFont['cw'];
        if ($w == 0) {
            $w = $this->w - $this->rMargin - $this->x;
        }
        $wmax = ($w - 2 * $this->cMargin) * 1000 / $this->FontSize;
        $s = str_replace("\r", '', (string) $txt);
        $nb = strlen($s);
        if ($nb > 0 && $s[$nb - 1] == "\n") {
            $nb--;
        }
        $sep = -1;
        $i = 0;
        $j = 0;
        $l = 0;
        $nl = 1;
        while ($i < $nb) {
            $c = $s[$i];
            if ($c == "\n") {
                $i++;
                $sep = -1;
                $j = $i;
                $l = 0;
                $nl++;
                continue;
            }
            if ($c == ' ') {
                $sep = $i;
            }
            $l += $cw[$c] ?? 0;
            if ($l > $wmax) {
                if ($sep == -1) {
                    if ($i == $j) {
                        $i++;
                    }
                } else {
                    $i = $sep + 1;
                }
                $sep = -1;
                $j = $i;
                $l = 0;
                $nl++;
            } else {
                $i++;
            }
        }
        return $nl;
    }

    function drawBillRow($cells, $fontSize = 8)
    {
        $lineHeight = 5;
        $padding = 2;
        $this->SetFont('Arial', '', $fontSize);

        $maxLines = 1;
        foreach ($cells as $cell) {
            if (!empty($cell['multiline'])) {
                $maxLines = max($maxLines, $this->NbLines($cell['w'] - 2, $cell['text']));
            }
        }
        $rowH = max(10, ($lineHeight * $maxLines) + ($padding * 2));

        $x = $this->GetX();
        $y = $this->GetY();

        foreach ($cells as $cell) {
            $this->Rect($x, $y, $cell['w'], $rowH);

            if (!empty($cell['multiline'])) {
                $this->SetXY($x + 1, $y + $padding);
                $this->MultiCell($cell['w'] - 2, $lineHeight, $cell['text'], 0, 'L');
            } else {
                $this->SetXY($x, $y);
                $this->Cell($cell['w'], $rowH, $cell['text'], 0, 0, $cell['align'] ?? 'C');
            }

            $x += $cell['w'];
        }

        $this->SetXY($this->lMargin, $y + $rowH);
    }
}

$pdf = new PDF('P', 'mm', 'A4');
$pdf->AddPage();

// --- Company & Customer Info ---
$gstCfg = gstConfig();
$company = $gstCfg['company_name'] ?? 'YEGOVA TRADERS';
$companyAddr = $gstCfg['company_address'] ?? 'Puthiamputhur, Thoothukudi';
$companyPhone = $gstCfg['company_phone'] ?? '9843059986';
$displayBillNo = getGstDisplayBillNo($conn, $bill);

$pdf->SetFont('Arial', '', 10);
$pdf->Cell(95, 6, $company, 0, 0, 'L');
$pdf->Cell(95, 6, "Customer: " . ucfirst(strtolower($bill['billname'])), 0, 1, 'C');
$pdf->Cell(95, 6, $companyAddr, 0, 0, 'L');
$pdf->Cell(95, 6, "Phone: " . $bill['phone'], 0, 1, 'C');
$pdf->Cell(95, 6, "Contact: " . $companyPhone, 0, 0, 'L');
$pdf->Cell(95, 6, "Address: " . $bill['address'], 0, 1, 'C');
$pdf->Cell(95, 6, "Bill No: " . $displayBillNo, 0, 0, 'L');
$pdf->Cell(95, 6, "Date: " . date("d-m-Y", strtotime($bill['bill_date'])), 0, 1, 'C');
$pdf->Ln(3);

// --- Table Header ---
$pdf->SetFont('Arial', 'B', 9);
$pdf->SetFillColor(220, 220, 220);
$pdf->Cell(34, 8, 'Item', 1, 0, 'C', true);
$pdf->Cell(16, 8, 'HSN', 1, 0, 'C', true);
$pdf->Cell(10, 8, 'Qty', 1, 0, 'C', true);
$pdf->Cell(12, 8, 'Unit', 1, 0, 'C', true);
$pdf->Cell(18, 8, 'Taxable', 1, 0, 'C', true);
$pdf->Cell(16, 8, 'CGST', 1, 0, 'C', true);
$pdf->Cell(16, 8, 'SGST', 1, 0, 'C', true);
$pdf->Cell(18, 8, 'Total', 1, 1, 'C', true);

// --- Table Rows ---
$grand_total = $total_qty = 0;

foreach ($dummy_items as $row) {
    $qty = $row['quantity'] + $row['free'];
    if ($row['unit'] == "Glass Btl") $row['unit'] = "G-Btl";

    $pdf->drawBillRow([
        ['w' => 34, 'text' => $row['name'], 'multiline' => true],
        ['w' => 16, 'text' => $row['hsn']],
        ['w' => 10, 'text' => (string) $qty],
        ['w' => 12, 'text' => $row['unit']],
        ['w' => 18, 'text' => number_format($row['taxable'], 2)],
        ['w' => 16, 'text' => number_format($row['cgst'], 4)],
        ['w' => 16, 'text' => number_format($row['sgst'], 4)],
        ['w' => 18, 'text' => number_format($row['total'], 2)],
    ]);

    $grand_total += $row['total'];
    $total_qty   += $qty;
}

// --- Totals Row ---
$pdf->SetFont('Arial', 'B', 9);
$pdf->Cell(34, 8, 'Totals', 1);
$pdf->Cell(16, 8, '', 1);
$pdf->Cell(10, 8, $total_qty, 1, 0, 'C');
$pdf->Cell(12, 8, '', 1);
$pdf->Cell(18, 8, number_format($sumTaxable, 2), 1, 0, 'C');
$pdf->Cell(16, 8, number_format($sumCgst, 4), 1, 0, 'C');
$pdf->Cell(16, 8, number_format($sumSgst, 4), 1, 0, 'C');
$pdf->Cell(18, 8, number_format($grand_total, 2), 1, 1, 'C');
$pdf->Ln(10);

// --- Bill Summary ---
$pdf->SetFont('Arial', 'B', 10);
$pdf->SetFillColor(200, 200, 200);
$pdf->Cell(60, 8, 'Bill Summary', 1, 1, 'C', true);

$pdf->SetFont('Arial', '', 9);


$pdf->Cell(30, 8, 'Taxable Value', 1, 0);
$pdf->Cell(30, 8, number_format($sumTaxable, 2), 1, 1, 'C');
$pdf->Cell(30, 8, 'CGST @ 2.5%', 1, 0);
$pdf->Cell(30, 8, number_format($sumCgst, 4), 1, 1, 'C');
$pdf->Cell(30, 8, 'SGST @ 2.5%', 1, 0);
$pdf->Cell(30, 8, number_format($sumSgst, 4), 1, 1, 'C');
$pdf->Cell(30, 8, 'Subtotal', 1, 0);
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

$filename = "invoice_" . $bill['id'] . "_" . date("Ymd_His") . ".pdf";
$filepath = $folder . $filename;
$pdf->Output('F', $filepath);

$conn->query("UPDATE bills SET pdf_file = '$filename' WHERE id = $bill_id");

if (isset($_GET['save_only'])) {
    return;
}
$pdf->Output('I', $filename);
