<?php
/**
 * Fusion Corner shop settings (non-GST daily billing).
 * Edit bank / GPay / GST hide here — no need to change combine_bills.php.
 */
return [
    'company_name'  => 'YEGOVA FUSION CORNER',
    'company_address' => 'Puthiamputhur, Thoothukudi',
    'company_phone' => '9843059986',
    'fssai' => '12425029000464',

    'gpay_phone' => '9843059986',
    'bank_account' => '013100050059415',
    'bank_ifsc' => 'TMBL0000013',
    'bank_name' => 'TMB',

    /**
     * Hide GST-only products from Fusion billing.
     * false = show all products on Fusion (Maa / Friva / Milkshake included).
     */
    'hide_gst_products_in_billing' => false,

    'gst_hide_keywords' => [
        'cavin', 'friva', 'milkshake', 'maa fd',
        'cup cake', 'cupcake', 'ompodi', 'omapodi',
        'southindia mix', 'south india mix', 'moongdal', 'moong dal',
        'choco cup', 'strawber', 'vannila', 'vanilla cup',
    ],

    /** Category buttons to hide when hide_gst_products_in_billing is on */
    'gst_hide_categories' => ['Maa', 'Friva', 'Milkshake', 'Cavins'],
];
