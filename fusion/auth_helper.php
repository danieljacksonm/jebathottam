<?php

function startAppSession()
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function requireSection($section)
{
    startAppSession();

    if (empty($_SESSION['section']) || $_SESSION['section'] !== $section) {
        header('Location: index.php');
        exit;
    }
}

function requireAnySection(array $sections)
{
    startAppSession();

    if (empty($_SESSION['section']) || !in_array($_SESSION['section'], $sections, true)) {
        header('Location: index.php');
        exit;
    }
}

function currentSection()
{
    startAppSession();
    return $_SESSION['section'] ?? null;
}

function sectionHomeUrl()
{
    $section = currentSection();
    if (!$section) {
        return 'index.php';
    }

    $config = require __DIR__ . '/sections_config.php';
    return $config[$section]['redirect'] ?? 'index.php';
}

function billingAccessSections()
{
    return ['billing', 'campa', 'cavins'];
}

function requireBillingAccess()
{
    requireAnySection(billingAccessSections());
}

function isBrandRep()
{
    $section = currentSection();
    return $section === 'campa' || $section === 'cavins';
}

function currentBrandLabel()
{
    $section = currentSection();
    if ($section === 'campa') {
        return 'Campa';
    }
    if ($section === 'cavins') {
        return 'Cavins';
    }
    return null;
}

function fusionCampaKeywords()
{
    return [
        'campa',
        'campo',
        'energy lemon',
        'energy neon',
        'energy orange',
        'energy purple',
        'panner soda',
        'paneer soda',
    ];
}

function fusionCavinsKeywords()
{
    return [
        'cavin',
        'cup cake',
        'cupcake',
        'brownie',
        'moongdal',
        'moong dal',
        'friva',
        'milkshake',
        'milk',
        'maa fd',
    ];
}

function fusionBrandHaystack($name, $category)
{
    return mb_strtolower(trim((string) $name) . ' ' . trim((string) $category));
}

function fusionIsMaazaName($hay)
{
    return strpos($hay, 'maaza') !== false
        || strpos($hay, 'maasa') !== false
        || strpos($hay, 'mazaa') !== false;
}

function fusionProductMatchesBrand($name, $category, $brand)
{
    if (!$brand) {
        return true;
    }
    $hay = fusionBrandHaystack($name, $category);
    $key = mb_strtolower($brand);

    if ($key === 'campa') {
        foreach (fusionCampaKeywords() as $kw) {
            if (strpos($hay, $kw) !== false) {
                return true;
            }
        }
        return false;
    }

    if ($key === 'cavins' || $key === 'cavin') {
        if (fusionIsMaazaName($hay) && strpos($hay, 'cavin') === false) {
            return false;
        }
        foreach (fusionCavinsKeywords() as $kw) {
            if (strpos($hay, $kw) !== false) {
                return true;
            }
        }
        if (preg_match('/\bmaa\b/u', $hay)) {
            return true;
        }
        return false;
    }

    return strpos($hay, $key) !== false;
}

function brandProductSqlFilter($alias = '')
{
    $brand = currentBrandLabel();
    if (!$brand) {
        return '';
    }
    $n = $alias !== '' ? "LOWER({$alias}.name)" : 'LOWER(name)';
    $c = $alias !== '' ? "LOWER(IFNULL({$alias}.category,''))" : "LOWER(IFNULL(category,''))";
    $hay = "CONCAT($n, ' ', $c)";

    $ors = [];
    if (strcasecmp($brand, 'Campa') === 0) {
        foreach (fusionCampaKeywords() as $kw) {
            $ors[] = "$hay LIKE '%" . addslashes($kw) . "%'";
        }
        return ' AND (' . implode(' OR ', $ors) . ')';
    }

    foreach (fusionCavinsKeywords() as $kw) {
        $ors[] = "$hay LIKE '%" . addslashes($kw) . "%'";
    }
    $ors[] = "$hay LIKE '%maa%'";
    $match = '(' . implode(' OR ', $ors) . ')';
    $notMaaza = "($hay NOT LIKE '%maaza%' AND $hay NOT LIKE '%maasa%' AND $hay NOT LIKE '%mazaa%')";
    return " AND (($match AND $notMaaza) OR $hay LIKE '%cavin%')";
}

function ensureBillsCreatedByColumn($conn)
{
    static $done = false;
    if ($done) {
        return;
    }
    $chk = $conn->query("SHOW COLUMNS FROM bills LIKE 'created_by'");
    if ($chk && $chk->num_rows === 0) {
        $conn->query("ALTER TABLE bills ADD COLUMN created_by VARCHAR(50) DEFAULT NULL");
    }
    $done = true;
}

function billsCreatedBySql()
{
    if (!isBrandRep()) {
        return '';
    }
    $section = currentSection();
    return " AND created_by = '" . addslashes($section) . "'";
}

function assertRepOwnsBill($conn, $billId)
{
    if (!isBrandRep()) {
        return;
    }
    ensureBillsCreatedByColumn($conn);
    $billId = (int) $billId;
    $section = $conn->real_escape_string((string) currentSection());
    $res = $conn->query("SELECT id FROM bills WHERE id = $billId AND created_by = '$section' LIMIT 1");
    if (!$res || $res->num_rows === 0) {
        http_response_code(403);
        exit('This bill is not yours.');
    }
}
