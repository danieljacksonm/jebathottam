<?php
/**
 * GST Billing System Configuration
 * This file connects to the same database but uses GST-specific tables
 */

// Include main config for database connection
include 'config.php';

// GST Settings
$gst_settings = [
    'default_cgst_rate' => 9.0,   // 9% CGST
    'default_sgst_rate' => 9.0,   // 9% SGST
    'default_cess_rate' => 0.0,   // 0% CESS (can be overridden per product)
    'gst_enabled' => true,
    'show_hsn' => true,
    'show_gst_breakup' => true,
    'gst_rounding' => 2  // Decimal places for GST calculations
];

// Function to get GST rates for a product
function getGSTRates($product_id) {
    global $conn;
    
    $sql = "SELECT cgst_rate, sgst_rate, cess_rate, gst_applicable FROM gst_products WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $product = $result->fetch_assoc();
        return [
            'cgst_rate' => $product['cgst_rate'],
            'sgst_rate' => $product['sgst_rate'],
            'cess_rate' => $product['cess_rate'],
            'applicable' => $product['gst_applicable']
        ];
    }
    
    // Return default rates if product not found
    global $gst_settings;
    return [
        'cgst_rate' => $gst_settings['default_cgst_rate'],
        'sgst_rate' => $gst_settings['default_sgst_rate'],
        'cess_rate' => $gst_settings['default_cess_rate'],
        'applicable' => true
    ];
}

// Function to calculate GST amounts
function calculateGST($amount, $cgst_rate, $sgst_rate, $cess_rate = 0) {
    $cgst_amount = round($amount * ($cgst_rate / 100), 2);
    $sgst_amount = round($amount * ($sgst_rate / 100), 2);
    $cess_amount = round($amount * ($cess_rate / 100), 2);
    
    return [
        'cgst_amount' => $cgst_amount,
        'sgst_amount' => $sgst_amount,
        'cess_amount' => $cess_amount,
        'total_gst' => $cgst_amount + $sgst_amount + $cess_amount,
        'total_with_gst' => $amount + $cgst_amount + $sgst_amount + $cess_amount
    ];
}
?>
