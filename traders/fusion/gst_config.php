<?php
/**
 * GST settings — Maa / Friva / Milkshake / Cavins / Snacks / Soft Drinks.
 * Rates: CGST 2.5% + SGST 2.5% = 5% total (price inclusive).
 * Company on GST invoice: YEGOVA TRADERS
 */
return [
    'company_name' => 'YEGOVA TRADERS',
    'company_address' => 'Puthiamputhur, Thoothukudi',
    'company_phone' => '9843059986',

    /**
     * One-time only: when exporting old Fusion Corner GST bills to Traders,
     * include bills dated on/before this day. After export, sites use separate DBs
     * with NO ongoing link. New Fusion bills never go to Traders.
     * Format: Y-m-d
     */
    'import_old_bills_until' => '2026-07-30',

    'cgst_rate' => 2.5,
    'sgst_rate' => 2.5,

    'default_hsn' => '22029920',

    'gst_categories' => ['Maa', 'Friva', 'Milkshake', 'Cavins', 'Snacks', 'Soft Drinks'],

    'excluded_keywords' => [
        'maaza',
        'maasa',
        'mazaa',
    ],

    'valid_hsn_codes' => [
        '22029920',
        '22029930',
        '04029990',
        '21069099',
        '19059090',
    ],

    'gst_product_keywords' => [
        'cavin',
        'friva',
        'milkshake',
        'maa fd',
        'milk',
        'cup cake',
        'cupcake',
        'ompodi',
        'omapodi',
        'southindia mix',
        'south india mix',
        'moongdal',
        'moong dal',
        'choco cup',
        'strawber',
        'vannila',
        'vanilla cup',
        'campa',
        'energy lemon',
        'energy neon',
        'energy orange',
        'energy purple',
        'panner soda',
        'paneer soda',
    ],

    'hsn_by_keyword' => [
        'cup cake'          => '19059090',
        'cupcake'           => '19059090',
        'choco cup'         => '19059090',
        'strawber'          => '19059090',
        'vannila'           => '19059090',
        'vanilla cup'       => '19059090',
        'ompodi'            => '21069099',
        'omapodi'           => '21069099',
        'southindia mix'    => '21069099',
        'south india mix'   => '21069099',
        'moongdal'          => '21069099',
        'moong dal'         => '21069099',
        'campa'             => '22029920',
        'energy lemon'      => '22029920',
        'energy neon'       => '22029920',
        'energy orange'     => '22029920',
        'energy purple'     => '22029920',
        'panner soda'       => '22029920',
        'paneer soda'       => '22029920',
        'mango'             => '22029920',
        'apple'             => '22029930',
        'maa fd'            => '22029920',
        'friva'             => '21069099',
        'milkshake'         => '04029990',
        'milk'              => '04029990',
        'cavins'            => '21069099',
        'cavin'             => '21069099',
    ],

    'known_products' => [
        ['name' => 'CHOCO CUP CAKE',              'hsn' => '19059090', 'category' => 'Snacks'],
        ['name' => 'OMPODI',                      'hsn' => '21069099', 'category' => 'Snacks'],
        ['name' => 'SOUTHINDIA MIXER',            'hsn' => '21069099', 'category' => 'Snacks'],
        ['name' => 'STRAWBERY CUP CAKE',          'hsn' => '19059090', 'category' => 'Snacks'],
        ['name' => 'VANNILA CUP CAKE',            'hsn' => '19059090', 'category' => 'Snacks'],
        ['name' => 'MOONGDAL 15gm',               'hsn' => '21069099', 'category' => 'Snacks'],
        ['name' => '150ml campa mango',           'hsn' => '22029920', 'category' => 'Soft Drinks'],
        ['name' => '150ml energy lemon',          'hsn' => '22029920', 'category' => 'Soft Drinks'],
        ['name' => '150ml energy neon',           'hsn' => '22029920', 'category' => 'Soft Drinks'],
        ['name' => '150ml energy orange',         'hsn' => '22029920', 'category' => 'Soft Drinks'],
        ['name' => '150ml Energy Purple[black]',  'hsn' => '22029920', 'category' => 'Soft Drinks'],
        ['name' => '200ml panner soda',           'hsn' => '22029920', 'category' => 'Soft Drinks'],
    ],
];
