<?php
require('fpdf.php');
include 'config.php';
require_once 'auth_helper.php';
require_once 'fusion_helpers.php';
requireAnySection(['billing', 'gst', 'mobile', 'rent', 'campa', 'cavins']);
ensureBillsCreatedByColumn($conn);

$fc = fusionConfig();
$companyName  = $fc['company_name'];
$companyAddr  = $fc['company_address'];
$companyPhone = $fc['company_phone'];
$fssai        = $fc['fssai'] ?? '12425029000464';
$gpayPhone    = $fc['gpay_phone'] ?? $companyPhone;
$bankAccount  = $fc['bank_account'] ?? '';
$bankIfsc     = $fc['bank_ifsc'] ?? '';

$data = json_decode(file_get_contents("php://input"), true);
$bill_ids = $data['bill_ids'] ?? [];

if (empty($bill_ids)) {
    die("No bills selected!");
}

$bills = [];
foreach ($bill_ids as $id) {
    $id = (int) $id;
    assertRepOwnsBill($conn, $id);
    $bill = $conn->query("SELECT * FROM bills WHERE id = $id")->fetch_assoc();
    if (!$bill) {
        continue;
    }

    $items = $conn->query("
        SELECT bi.*, p.name, p.mrp
        FROM bill_items bi
        JOIN products p ON bi.product_id = p.id
        WHERE bill_id = $id
    ");
    $bill['items'] = [];
    while ($r = $items->fetch_assoc()) {
        $bill['items'][] = $r;
    }
    $bills[] = $bill;
}

class PDF extends FPDF
{
    public $colWidths = [54, 12, 16, 16, 16, 20];
    public $sectionW = 134;
    public $qrFile;
    public $companyName = 'YEGOVA FUSION CORNER';
    public $companyAddr = 'Puthiamputhur, Thoothukudi';
    public $companyPhone = '9843059986';
    public $fssai = '12425029000464';
    public $gpayPhone = '9843059986';
    public $bankAccount = '';
    public $bankIfsc = '';
    public $pageBottom = 202;
    public $footerReserve = 62;

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

    function billNoLabel($bill)
    {
        if (!empty($bill['gst_serial'])) {
            return (int) $bill['gst_serial'] . (!empty($bill['gst_fy']) ? ' / ' . $bill['gst_fy'] : '');
        }
        return (string) $bill['id'];
    }

    function calcRoundedTotal($bill, $itemsSubtotal)
    {
        $grand = $itemsSubtotal;
        if (!empty($bill['discount_value']) && (float) $bill['discount_value'] > 0) {
            $discount = (isset($bill['discount_type']) && $bill['discount_type'] == 'percent')
                ? $grand * ((float) $bill['discount_value'] / 100)
                : (float) $bill['discount_value'];
            $grand -= $discount;
        }
        if (!empty($bill['old_payment']) && (float) $bill['old_payment'] > 0) {
            $grand += (float) $bill['old_payment'];
        }
        return round($grand);
    }

    /**
     * Draw one bill column. $items = remaining lines to print.
     * Returns leftover items (empty = finished, footer printed).
     */
    function BillSectionPart($bill, $x, $y, array $items, $isContinuation = false)
    {
        $w = $this->sectionW;
        $half = $w / 2;
        $compact = count($bill['items']) > 18;
        $lineHeight = $compact ? 3.6 : 4.5;
        $padding = $compact ? 0.8 : 1.2;
        $minRow = $compact ? 5.5 : 7;
        $fontSize = $compact ? 7 : 8;

        $this->SetXY($x, $y);

        if (!$isContinuation) {
            $this->SetFont('Arial', 'B', 9);
            $this->Cell($w, 5, '+ May you be richly rewarded by the Lord +', 0, 1, 'C');

            $this->SetX($x);
            $this->SetFont('Arial', 'B', 9);
            $this->Cell($half, 5, $this->companyName, 0, 0, 'L');
            $this->SetFont('Arial', '', 8);
            $this->Cell($half, 5, 'Bill No: ' . $this->billNoLabel($bill), 0, 1, 'R');

            $this->SetX($x);
            $this->Cell($half, 5, $this->companyAddr, 0, 0, 'L');
            $this->Cell($half, 5, 'Cust: ' . ucfirst(strtolower($bill['billname'])), 0, 1, 'R');

            $this->SetX($x);
            $phoneLine = 'Contact: ' . $this->companyPhone;
            if (trim((string) $this->fssai) !== '') {
                $phoneLine .= ' | FSSAI: ' . $this->fssai;
            }
            $this->Cell($half, 5, $phoneLine, 0, 0, 'L');
            $this->Cell($half, 5, 'Phone: ' . $bill['phone'], 0, 1, 'R');

            $this->SetX($x);
            $this->Cell($half, 5, 'Date: ' . date('d-m-Y', strtotime($bill['bill_date'])), 0, 0, 'L');
            $this->Cell($half, 5, 'Addr: ' . substr($bill['address'], 0, 40), 0, 1, 'R');
            $this->Ln(1);
        } else {
            $this->SetFont('Arial', 'B', 8);
            $this->Cell($w, 5, 'Bill No: ' . $this->billNoLabel($bill) . '  (continued)', 0, 1, 'C');
            $this->Ln(1);
        }

        $this->SetX($x);
        $this->SetFont('Arial', 'B', $fontSize);
        $this->SetFillColor(220, 220, 220);
        foreach (['Item', 'Qty', 'Unit', 'MRP', 'Rate', 'Total'] as $i => $header) {
            $this->Cell($this->colWidths[$i], 5.5, $header, 1, 0, 'C', true);
        }
        $this->Ln();

        $this->SetFont('Arial', '', $fontSize);
        $pageSubtotal = 0;
        $pageQty = 0;
        $remaining = [];
        $drawn = 0;

        foreach ($items as $idx => $row) {
            $qty = $row['quantity'] + $row['free'];
            $mrp = $row['mrp'] ?: 0;
            $total = $row['total'];
            $rate = $qty > 0 ? $total / $qty : 0;
            $unit = $row['unit'] ?? '';

            $itemW = $this->colWidths[0];
            $nbLines = $this->NbLines($itemW - 2, $row['name']);
            $cellHeight = max($minRow, ($lineHeight * $nbLines) + ($padding * 2));

            $yBefore = $this->GetY();
            // Leave room for totals + summary + paid/due + QR
            if ($yBefore + $cellHeight + $this->footerReserve > $this->pageBottom) {
                $remaining = array_slice($items, $idx);
                break;
            }

            $this->SetX($x);
            $this->Rect($x, $yBefore, $itemW, $cellHeight);
            $this->SetXY($x + 1, $yBefore + $padding);
            $this->MultiCell($itemW - 2, $lineHeight, $row['name'], 0, 'L');

            $this->SetXY($x + $itemW, $yBefore);
            $this->Cell($this->colWidths[1], $cellHeight, $qty, 1, 0, 'C');
            $this->Cell($this->colWidths[2], $cellHeight, $unit, 1, 0, 'C');
            $this->Cell($this->colWidths[3], $cellHeight, number_format((float) $mrp, 2, '.', ''), 1, 0, 'R');
            $this->Cell($this->colWidths[4], $cellHeight, number_format((float) $rate, 2, '.', ''), 1, 0, 'R');
            $this->Cell($this->colWidths[5], $cellHeight, number_format((float) $total, 2, '.', ''), 1, 1, 'R');

            $this->SetY($yBefore + $cellHeight);
            $pageSubtotal += $total;
            $pageQty += $qty;
            $drawn++;
        }

        // Full bill item totals (all pages) for summary
        $allSubtotal = 0;
        $allQty = 0;
        foreach ($bill['items'] as $r) {
            $allSubtotal += $r['total'];
            $allQty += $r['quantity'] + $r['free'];
        }

        if (!empty($remaining)) {
            $this->SetX($x);
            $this->SetFont('Arial', 'I', 7);
            $this->Cell($w, 5, '… continued on next page …', 0, 1, 'C');
            return $remaining;
        }

        // Finished — table total + summary + paid/due
        $this->SetX($x);
        $this->SetFont('Arial', 'B', $fontSize);
        $this->Cell($this->colWidths[0], 5, 'Total', 1);
        $this->Cell($this->colWidths[1], 5, $allQty, 1, 0, 'C');
        $this->Cell($this->colWidths[2], 5, '', 1);
        $this->Cell($this->colWidths[3], 5, '', 1);
        $this->Cell($this->colWidths[4], 5, '', 1);
        $this->Cell($this->colWidths[5], 5, number_format((float) $allSubtotal, 2, '.', ''), 1, 1, 'R');

        $sumW = 56;
        $sumX = $x + ($w - $sumW) / 2;
        $grand = $allSubtotal;

        $this->Ln(1.5);
        $this->SetX($sumX);
        $this->SetFont('Arial', 'B', 8);
        $this->SetFillColor(230, 230, 230);
        $this->Cell($sumW, 5, 'Bill Summary', 1, 1, 'C', true);

        $this->SetFont('Arial', '', 8);
        $this->SetX($sumX);
        $this->Cell(28, 4.5, 'Subtotal', 1);
        $this->Cell(28, 4.5, number_format((float) $grand, 2, '.', ''), 1, 1, 'R');

        if (!empty($bill['discount_value']) && (float) $bill['discount_value'] > 0) {
            $discount = (isset($bill['discount_type']) && $bill['discount_type'] == 'percent')
                ? $grand * ((float) $bill['discount_value'] / 100)
                : (float) $bill['discount_value'];
            $label = (isset($bill['discount_type']) && $bill['discount_type'] == 'percent')
                ? 'Discount (' . (float) $bill['discount_value'] . '%)'
                : 'Discount';
            $this->SetX($sumX);
            $this->Cell(28, 4.5, $label, 1);
            $this->Cell(28, 4.5, number_format($discount, 2, '.', ''), 1, 1, 'R');
            $grand -= $discount;
        }

        if (!empty($bill['old_payment']) && (float) $bill['old_payment'] > 0) {
            $this->SetX($sumX);
            $this->Cell(28, 4.5, 'Old Balance', 1);
            $this->Cell(28, 4.5, number_format((float) $bill['old_payment'], 2, '.', ''), 1, 1, 'R');
            $grand += (float) $bill['old_payment'];
        }

        $rounded = round($grand);
        $roundoff = $rounded - $grand;
        $this->SetX($sumX);
        $this->Cell(28, 4.5, 'Round Off', 1);
        $this->Cell(28, 4.5, number_format($roundoff, 2, '.', ''), 1, 1, 'R');

        $this->SetFont('Arial', 'B', 8);
        $this->SetX($sumX);
        $this->Cell(28, 5, 'Grand Total', 1);
        $this->Cell(28, 5, number_format($rounded, 2, '.', ''), 1, 1, 'R');

        $paid = (float) ($bill['paid_amount'] ?? 0);
        $due = max(0, $rounded - $paid);
        $this->SetFont('Arial', '', 8);
        $this->SetX($sumX);
        $this->Cell(28, 4.5, 'Paid', 1);
        $this->Cell(28, 4.5, number_format($paid, 2, '.', ''), 1, 1, 'R');
        $this->SetFont('Arial', 'B', 8);
        $this->SetX($sumX);
        $this->SetFillColor($due > 0 ? 255 : 220, $due > 0 ? 230 : 255, $due > 0 ? 230 : 220);
        $this->Cell(28, 5, 'Balance Due', 1, 0, 'L', true);
        $this->Cell(28, 5, number_format($due, 2, '.', ''), 1, 1, 'R', true);

        $qrSize = 14;
        $qrX = $x + ($w - $qrSize) / 2;
        $qrY = $this->GetY() + 2;
        if ($qrY + $qrSize + 10 < $this->pageBottom && file_exists($this->qrFile)) {
            $this->Image($this->qrFile, $qrX, $qrY, $qrSize, $qrSize);
            $this->SetY($qrY + $qrSize + 1);
        } else {
            $this->SetY($this->GetY() + 2);
        }

        $this->SetFont('Arial', '', 6.5);
        $this->SetX($x);
        $payLine = 'GPay: ' . $this->gpayPhone;
        if ($this->bankAccount !== '') {
            $payLine .= ' | A/C: ' . $this->bankAccount;
        }
        if ($this->bankIfsc !== '') {
            $payLine .= ' | IFSC: ' . $this->bankIfsc;
        }
        $this->MultiCell($w, 3.5, $payLine . "\nThank you for shopping!", 0, 'C');

        return [];
    }
}

$pageW = 297.0;
$sideMargin = 10.0;
$gap = 14.0;
$sectionW = ($pageW - (2 * $sideMargin) - $gap) / 2;

$pdf = new PDF('L', 'mm', 'A4');
$pdf->SetAutoPageBreak(false);
$pdf->SetMargins($sideMargin, 8, $sideMargin);
$pdf->qrFile = __DIR__ . '/gpay_qr.jpeg';
if (!file_exists($pdf->qrFile)) {
    $pdf->qrFile = 'gpay_qr.jpeg';
}
$pdf->companyName = $companyName;
$pdf->companyAddr = $companyAddr;
$pdf->companyPhone = $companyPhone;
$pdf->fssai = $fssai;
$pdf->gpayPhone = $gpayPhone;
$pdf->bankAccount = $bankAccount;
$pdf->bankIfsc = $bankIfsc;
$pdf->sectionW = $sectionW;
$pdf->colWidths = [
    round($sectionW * 54 / 134, 1),
    round($sectionW * 12 / 134, 1),
    round($sectionW * 16 / 134, 1),
    round($sectionW * 16 / 134, 1),
    round($sectionW * 16 / 134, 1),
    0,
];
$sumFive = $pdf->colWidths[0] + $pdf->colWidths[1] + $pdf->colWidths[2] + $pdf->colWidths[3] + $pdf->colWidths[4];
$pdf->colWidths[5] = round($sectionW - $sumFive, 1);

$leftX = $sideMargin;
$rightX = $leftX + $sectionW + $gap;
$y = 8;

// Pair bills; each pair may span multiple pages if items overflow
for ($i = 0; $i < count($bills); $i += 2) {
    $leftBill = $bills[$i];
    $rightBill = $bills[$i + 1] ?? null;

    $leftRem = $leftBill['items'];
    $rightRem = $rightBill ? $rightBill['items'] : [];
    $leftDone = false;
    $rightDone = ($rightBill === null);
    $contL = false;
    $contR = false;
    $page = 0;

    while (!$leftDone || !$rightDone) {
        $pdf->AddPage();
        $page++;

        if ($rightBill) {
            $midX = $leftX + $sectionW + ($gap / 2);
            $pdf->SetDrawColor(180, 180, 180);
            $pdf->SetLineWidth(0.2);
            $pdf->Line($midX, 6, $midX, 204);
            $pdf->SetDrawColor(0, 0, 0);

            if (!$leftDone) {
                $leftRem = $pdf->BillSectionPart($leftBill, $leftX, $y, $leftRem, $contL);
                $contL = true;
                if (empty($leftRem)) {
                    $leftDone = true;
                }
            }
            if (!$rightDone) {
                $rightRem = $pdf->BillSectionPart($rightBill, $rightX, $y, $rightRem, $contR);
                $contR = true;
                if (empty($rightRem)) {
                    $rightDone = true;
                }
            }
        } else {
            $centerX = ($pageW - $sectionW) / 2;
            $leftRem = $pdf->BillSectionPart($leftBill, $centerX, $y, $leftRem, $contL);
            $contL = true;
            if (empty($leftRem)) {
                $leftDone = true;
            }
        }

        if ($page > 30) {
            break;
        }
    }
}

$pdf->Output('I', 'combined_' . date('Ymd_His') . '.pdf');
