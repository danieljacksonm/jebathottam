<?php
/**
 * Mobile Shop Billing System Configuration
 * This file connects to the same database but uses mobile shop specific tables
 */

// Include main config for database connection
include 'config.php';

// Mobile Shop Settings
$mobile_settings = [
    'shop_name' => 'Mobile Shop',
    'shop_address' => 'Puthiamputhur, Thoothukudi',
    'shop_phone' => '9843059986',
    'paper_width' => '80mm',  // Thermal printer width for left-side printing
    'paper_height' => '297mm', // A4 height
    'print_margin_left' => '10mm',
    'print_margin_top' => '10mm'
];
?>
