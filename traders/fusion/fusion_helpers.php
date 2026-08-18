<?php

function fusionConfig()
{
    static $cfg = null;
    if ($cfg === null) {
        $cfg = require __DIR__ . '/fusion_config.php';
    }
    return $cfg;
}

function isFusionGstOnlyProduct($name)
{
    $n = mb_strtolower(trim((string) $name));
    if ($n === '') {
        return false;
    }
    // Keep Maaza / Maasa on Fusion (not Traders GST)
    if (strpos($n, 'maaza') !== false || strpos($n, 'maasa') !== false || strpos($n, 'mazaa') !== false) {
        return false;
    }

    $cfg = fusionConfig();
    foreach ($cfg['gst_hide_keywords'] as $kw) {
        if (strpos($n, mb_strtolower($kw)) !== false) {
            return true;
        }
    }
    // Word "maa" (MAA juice) — not Maaza
    if (preg_match('/\bmaa\b/u', $n)) {
        return true;
    }
    if (strpos($n, 'milk') !== false && strpos($n, 'maaza') === false) {
        // milk / milkshake style GST drinks
        return true;
    }
    return false;
}

function fusionShouldHideGstProducts()
{
    return !empty(fusionConfig()['hide_gst_products_in_billing']);
}

function fusionBillingCategories(array $all)
{
    if (!fusionShouldHideGstProducts()) {
        return $all;
    }
    $hide = fusionConfig()['gst_hide_categories'] ?? [];
    return array_values(array_filter($all, function ($c) use ($hide) {
        return !in_array($c, $hide, true);
    }));
}
