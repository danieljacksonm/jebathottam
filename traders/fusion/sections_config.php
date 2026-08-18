<?php
/**
 * Four sections — one login, password opens the matching section.
 */
return [
    'billing' => [
        'title'    => 'Normal Billing',
        'password' => 'billing123',
        'redirect' => 'dashboard.php',
    ],
    'gst' => [
        'title'    => 'GST Billing',
        'password' => 'gst123',
        'redirect' => 'dashboard_gst.php',
    ],
    'mobile' => [
        'title'    => 'Mobile Billing',
        'password' => 'mobile123',
        'redirect' => 'dashboard_mobile.php',
    ],
    'rent' => [
        'title'    => 'Home Rent',
        'password' => 'rent123',
        'redirect' => 'rent_dashboard.php',
    ],
    'campa' => [
        'title'    => 'Campa Representative',
        'password' => 'campa@123',
        'redirect' => 'dashboard.php',
        'brand'    => 'Campa',
    ],
    'cavins' => [
        'title'    => 'Cavins Representative',
        'password' => 'cavins@123',
        'redirect' => 'dashboard.php',
        'brand'    => 'Cavins',
    ],
];
