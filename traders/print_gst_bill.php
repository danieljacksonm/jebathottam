<?php
/**
 * GST bill PDF print — PHP 8.4 safe.
 * Shows real error text if PDF fails (no blank HTTP 500).
 */
ob_start();

try {
    require __DIR__ . '/fpdf.php';
    include __DIR__ . '/config.php';
    require_once __DIR__ . '/auth_helper.php';
    require_once __DIR__ . '/gst_helpers.php';

    startAppSession();
    if (empty($_SESSION['section']) || $_SESSION['section'] !== 'gst') {
        throw new Exception('Please login to GST Traders first, then open print again.');
    }

    function ptxt($s)
    {
        $s = (string) $s;
        if ($s === '') {
            return '';
        }
        if (function_exists('iconv')) {
            $o = @iconv('UTF-8', 'ISO-8859-1//TRANSLIT//IGNORE', $s);
            if ($o !== false) {
                return $o;
            }
        }
        return preg_replace('/[^\x20-\x7E]/', '?', $s);
    }

    $bill_id = isset($_GET['bill_id']) ? (int) $_GET['bill_id'] : 0;
    if ($bill_id <= 0) {
        throw new Exception('Invalid bill id');
    }

    $billRes = $conn->query("SELECT * FROM bills WHERE id = $bill_id LIMIT 1");
    if (!$billRes) {
        throw new Exception('DB error loading bill: ' . $conn->error);
    }
    $bill = $billRes->fetch_assoc();
    if (!$bill) {
        throw new Exception('Bill not found: #' . $bill_id);
    }

    $items = $conn->query(
        "SELECT bi.*,
                COALESCE(p.name, CONCAT('Product #', bi.product_id)) AS name,
                p.hsn AS product_hsn
         FROM bill_items bi
         LEFT JOIN products p ON bi.product_id = p.id
         WHERE bi.bill_id = $bill_id
         ORDER BY bi.id ASC"
    );
    if (!$items) {
        throw new Exception('DB error loading items: ' . $conn->error);
    }

    $dummy_items = [];
    $sumTaxable = 0.0;
    $sumCgst = 0.0;
    $sumSgst = 0.0;
    while ($r = $items->fetch_assoc()) {
        $r['hsn'] = resolveGstHsn($r['name'], $r['hsn'] ?? '', $r['product_hsn'] ?? '');
        $paidTotal = gstPaidLineAmount($r['price'], $r['quantity']);
        $gst = calcGstLine($paidTotal);
        $r['taxable'] = $gst['taxable'];
        $r['cgst'] = $gst['cgst'];
        $r['sgst'] = $gst['sgst'];
        $r['line_total'] = $paidTotal;
        $sumTaxable += $gst['taxable'];
        $sumCgst += $gst['cgst'];
        $sumSgst += $gst['sgst'];
        $dummy_items[] = $r;
    }

    if (!class_exists('PDF', false)) {
        class PDF extends FPDF
        {
            function Header()
            {
                $this->SetFont('Arial', 'I', 10);
                $this->Cell(0, 6, '+ May you be richly rewarded by the Lord +', 0, 1, 'C');
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
                    $l += isset($cw[$c]) ? $cw[$c] : 500;
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
                        $this->MultiCell($cell['w'] - 2, $lineHeight, (string) $cell['text'], 0, 'L');
                    } else {
                        $this->SetXY($x, $y);
                        $this->Cell($cell['w'], $rowH, (string) $cell['text'], 0, 0, $cell['align'] ?? 'C');
                    }
                    $x += $cell['w'];
                }
                $this->SetXY($this->lMargin, $y + $rowH);
            }
        }
    }

    $pdf = new PDF('P', 'mm', 'A4');
    $pdf->AddPage();

    $gstCfg = gstConfig();
    $company = ptxt($gstCfg['company_name'] ?? 'YEGOVA TRADERS');
    $companyAddr = ptxt($gstCfg['company_address'] ?? 'Puthiamputhur, Thoothukudi');
    $companyPhone = ptxt($gstCfg['company_phone'] ?? '9843059986');
    $displayBillNo = ptxt(getGstDisplayBillNo($conn, $bill));

    $pdf->SetFont('Arial', '', 10);
    $pdf->Cell(95, 6, $company, 0, 0, 'L');
    $pdf->Cell(95, 6, 'Customer: ' . ptxt(ucfirst(strtolower((string) ($bill['billname'] ?? '')))), 0, 1, 'C');
    $pdf->Cell(95, 6, $companyAddr, 0, 0, 'L');
    $pdf->Cell(95, 6, 'Phone: ' . ptxt((string) ($bill['phone'] ?? '')), 0, 1, 'C');

    $companyGstin = trim((string) ($gstCfg['company_gstin'] ?? ''));
    if ($companyGstin !== '') {
        $pdf->Cell(95, 6, 'GSTIN: ' . ptxt($companyGstin), 0, 0, 'L');
    } else {
        $pdf->Cell(95, 6, 'Contact: ' . $companyPhone, 0, 0, 'L');
    }
    $pdf->Cell(95, 6, 'Address: ' . ptxt((string) ($bill['address'] ?? '')), 0, 1, 'C');
    if ($companyGstin !== '') {
        $pdf->Cell(95, 6, 'Contact: ' . $companyPhone, 0, 0, 'L');
        $pdf->Cell(95, 6, '', 0, 1, 'C');
    }
    $pdf->Cell(95, 6, 'Bill No: ' . $displayBillNo, 0, 0, 'L');
    $billDate = !empty($bill['bill_date']) ? date('d-m-Y', strtotime($bill['bill_date'])) : date('d-m-Y');
    $pdf->Cell(95, 6, 'Date: ' . $billDate, 0, 1, 'C');
    $pdf->Ln(3);

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

    $grand_total = 0.0;
    $total_qty = 0;

    if (count($dummy_items) === 0) {
        $pdf->SetFont('Arial', 'I', 9);
        $pdf->Cell(140, 10, 'No items on this bill.', 1, 1, 'C');
    }

    foreach ($dummy_items as $row) {
        $qty = intval($row['quantity']) + intval($row['free']);
        $unit = (string) ($row['unit'] ?? '');
        if ($unit === 'Glass Btl') {
            $unit = 'G-Btl';
        }
        $lineTotal = (float) $row['line_total'];

        $pdf->drawBillRow([
            ['w' => 34, 'text' => ptxt($row['name']), 'multiline' => true],
            ['w' => 16, 'text' => ptxt($row['hsn'])],
            ['w' => 10, 'text' => (string) $qty],
            ['w' => 12, 'text' => ptxt($unit)],
            ['w' => 18, 'text' => number_format((float) $row['taxable'], 2)],
            ['w' => 16, 'text' => number_format((float) $row['cgst'], 4)],
            ['w' => 16, 'text' => number_format((float) $row['sgst'], 4)],
            ['w' => 18, 'text' => number_format($lineTotal, 2)],
        ]);

        $grand_total += $lineTotal;
        $total_qty += $qty;
    }

    $pdf->SetFont('Arial', 'B', 9);
    $pdf->Cell(34, 8, 'Totals', 1);
    $pdf->Cell(16, 8, '', 1);
    $pdf->Cell(10, 8, (string) $total_qty, 1, 0, 'C');
    $pdf->Cell(12, 8, '', 1);
    $pdf->Cell(18, 8, number_format($sumTaxable, 2), 1, 0, 'C');
    $pdf->Cell(16, 8, number_format($sumCgst, 4), 1, 0, 'C');
    $pdf->Cell(16, 8, number_format($sumSgst, 4), 1, 0, 'C');
    $pdf->Cell(18, 8, number_format($grand_total, 2), 1, 1, 'C');
    $pdf->Ln(8);

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

    $discountValue = floatval($bill['discount_value'] ?? 0);
    $discountType = (string) ($bill['discount_type'] ?? 'none');
    if ($discountValue > 0) {
        $label = ($discountType === 'percent') ? ("Discount ({$discountValue}%)") : 'Discount Amount';
        $discAmt = ($discountType === 'percent') ? ($grand_total * $discountValue / 100) : $discountValue;
        $pdf->Cell(30, 8, ptxt($label), 1, 0);
        $pdf->Cell(30, 8, number_format($discAmt, 2), 1, 1, 'C');
        $grand_total -= $discAmt;
    }

    $oldPayment = floatval($bill['old_payment'] ?? 0);
    if ($oldPayment > 0) {
        $pdf->Cell(30, 8, 'Old Payment', 1, 0);
        $pdf->Cell(30, 8, number_format($oldPayment, 2), 1, 1, 'C');
        $grand_total += $oldPayment;
    }

    $rounded = round($grand_total);
    $roundoff = $rounded - $grand_total;
    $pdf->Cell(30, 8, 'Round Off', 1, 0);
    $pdf->Cell(30, 8, number_format($roundoff, 2), 1, 1, 'C');
    $pdf->SetFont('Arial', 'B', 9);
    $pdf->Cell(30, 8, 'Grand Total', 1, 0);
    $pdf->Cell(30, 8, number_format($rounded, 2), 1, 1, 'C');

    $pdf->Ln(8);
    $pdf->SetFont('Arial', 'I', 8);
    $pdf->Cell(0, 6, '---------------------------------  X  ---------------------------------', 0, 1, 'C');
    $pdf->Ln(3);

    $startY = $pdf->GetY();
    $pdf->Rect(10, $startY, 190, 45);
    $pdf->SetY($startY + 8);
    $gpay = ptxt($gstCfg['gpay_phone'] ?? $companyPhone);
    $acc = ptxt($gstCfg['bank_account'] ?? '013100050059415');
    $ifsc = ptxt($gstCfg['bank_ifsc'] ?? 'TMBL0000013');
    $pdf->SetX(20);
    $pdf->SetFont('Arial', '', 10);
    $pdf->MultiCell(170, 6, "Payment Details:\nPhone No: $gpay\nAccount No: $acc\nIFSC Code: $ifsc");

    $pdf->Ln(4);
    $pdf->SetFont('Arial', 'B', 12);
    $pdf->Cell(0, 10, 'Grand Total: Rs. ' . number_format($rounded, 2), 0, 1, 'C');

    // Clear any accidental HTML/warnings before PDF headers
    if (ob_get_length()) {
        ob_clean();
    }
    $pdf->Output('I', 'invoice_' . $bill_id . '.pdf');
    exit;
} catch (Throwable $e) {
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    http_response_code(200);
    header('Content-Type: text/plain; charset=utf-8');
    echo "PRINT ERROR\n\n";
    echo $e->getMessage() . "\n\n";
    echo $e->getFile() . ' : ' . $e->getLine() . "\n";
    exit;
}
