<?php
include 'config.php';
require_once 'fusion_helpers.php';

// Fetch all products with MRP
$sql = "SELECT name, price, mrp, category FROM products WHERE mrp > 0 ORDER BY category ASC, name ASC";
$res = $conn->query($sql);

$products = [];
while ($row = $res ? $res->fetch_assoc() : []) {
    $products[] = $row;
}

// -----------------------------------------------------------------------
// Real product images — sourced from official brand stores and retail CDNs.
// Cavinkart (CavinKare official store): cavinkart.com/cdn/shop/files/
// Zepto CDN (confirmed working): cdn.zeptonow.com/production/cms/product_variant/
// bbassets (BigBasket CDN): www.bbassets.com/media/uploads/p/l/
// -----------------------------------------------------------------------
// Helper: return local path if file exists, else null
function localImg($file) {
    $path = __DIR__ . '/product_images/' . $file;
    if (file_exists($path)) return 'product_images/' . $file;
    return null;
}

// Helper: return first existing local image from list
function firstExistingImg($files) {
    foreach ($files as $f) {
        $img = localImg($f);
        if ($img !== null) return $img;
    }
    return null;
}

function productImageUrl($name, $category) {
    $n = mb_strtolower(trim($name));

    // ── CAMPA ──────────────────────────────────────────────────────────────
    if (strpos($n, 'energy lemon') !== false)
        return firstExistingImg(['campa_energy_lemon.jpeg', 'campa_lemon_bb.jpg', 'campa_cola.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Campa';
    if (strpos($n, 'energy neon') !== false)
        return firstExistingImg(['campa_energy_neon.jpeg', 'campa_energy_lemon.jpeg', 'campa_lemon_bb.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Campa';
    if (strpos($n, 'energy orange') !== false)
        return firstExistingImg(['campa_energy_orange.png', 'campa_orange_bb.jpg', 'campa_mango.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Campa';
    if (strpos($n, 'energy purple') !== false || strpos($n, 'energy black') !== false)
        return firstExistingImg(['campa_energy_purple.png', 'campa_cola.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Campa';
    if (strpos($n, 'panner soda') !== false || strpos($n, 'paneer soda') !== false)
        return firstExistingImg(['campa_panner_soda.jpg', 'campa_lemon_bb.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Campa';
    if (strpos($n, 'campo') !== false || (strpos($n, 'campa') !== false && strpos($n, 'mango') !== false))
        return firstExistingImg(['campa_mango.jpg', 'campa_orange_bb.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Campa';
    if (strpos($n, 'campa') !== false && strpos($n, 'cola') !== false)
        return firstExistingImg(['campa_cola.jpg', 'campa_lemon_bb.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Campa';
    if (strpos($n, 'campa') !== false)
        return firstExistingImg(['campa_lemon_bb.jpg', 'campa_energy_lemon.jpeg', 'campa_cola.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Campa';

    // ── CAVINS MILK (170 ml) ────────────────────────────────────────────────
    if (strpos($n, 'badam') !== false && strpos($n, 'milk') !== false)
        return firstExistingImg(['cavins_badam_milk.jpg', 'cavins_badam_milkshake.jpg', 'cavins_choco_milk.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Cavins';
    if ((strpos($n, 'choco') !== false || strpos($n, 'chocolate') !== false) && strpos($n, 'milk') !== false && strpos($n, 'milkshake') === false)
        return firstExistingImg(['cavins_choco_milk.jpg', 'cavins_choco_milkshake.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Cavins';
    if (strpos($n, 'pista') !== false && strpos($n, 'milk') !== false)
        return firstExistingImg(['cavins_pista_milk.jpg', 'cavins_badam_milk.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Cavins';
    if (strpos($n, 'rose') !== false && strpos($n, 'milk') !== false)
        return firstExistingImg(['cavins_rose_milk.jpg', 'cavins_badam_milk.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Cavins';

    // ── CAVINS MILKSHAKE ────────────────────────────────────────────────────
    if (strpos($n, 'butterscotch') !== false)
        return firstExistingImg(['cavins_butterscotch_milkshake.jpg', 'cavins_badam_milkshake.jpg', 'cavins_choco_milkshake.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Cavins';
    if ((strpos($n, 'choco') !== false || strpos($n, 'chocolate') !== false) && strpos($n, 'milkshake') !== false)
        return firstExistingImg(['cavins_choco_milkshake.jpg', 'cavins_choco_milkshake_bb.jpg', 'cavins_choco_milk.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Cavins';
    if (strpos($n, 'strawberry') !== false && strpos($n, 'milkshake') !== false)
        return firstExistingImg(['cavins_strawberry_milkshake.jpg', 'cavins_choco_milkshake.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Cavins';
    if ((strpos($n, 'vanilla') !== false || strpos($n, 'vannila') !== false) && strpos($n, 'milkshake') !== false)
        return firstExistingImg(['cavins_vanilla_milkshake.jpg', 'cavins_badam_milkshake.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Cavins';

    // ── CAVINS CUP CAKES & SNACKS ────────────────────────────────────────────
    // Cavins cakes share badam milkshake image as visual stand-in until dedicated images arrive
    if (strpos($n, 'brownie') !== false)
        return firstExistingImg(['cavins_brownie.jpg', 'cavins_choco_milkshake_bb.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Cavins';
    if (strpos($n, 'choco') !== false && strpos($n, 'cup') !== false)
        return firstExistingImg(['cavins_choco_cupcake.jpg', 'cavins_choco_milkshake_bb.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Cavins';
    if (strpos($n, 'strawber') !== false && strpos($n, 'cup') !== false)
        return firstExistingImg(['cavins_strawberry_cupcake.jpg', 'cavins_strawberry_milkshake.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Cavins';
    if ((strpos($n, 'vannila') !== false || strpos($n, 'vanilla') !== false) && strpos($n, 'cup') !== false)
        return firstExistingImg(['cavins_vanilla_cupcake.jpg', 'cavins_vanilla_milkshake.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Cavins';
    if (strpos($n, 'moongdal') !== false || strpos($n, 'moong') !== false)
        return firstExistingImg(['cavins_moongdal.jpg', 'lays_big.jpg', 'lays.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Snack';

    // ── MAA JUICE ────────────────────────────────────────────────────────────
    if (preg_match('/\bmaa\b/i', $n) && strpos($n, 'apple') !== false)
        return firstExistingImg(['maa_apple.jpg', 'maa_mango.png']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=MAA';
    if (preg_match('/\bmaa\b/i', $n) && strpos($n, 'guava') !== false)
        return firstExistingImg(['maa_guava.jpg', 'maa_mango.png']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=MAA';
    if (preg_match('/\bmaa\b/i', $n) && strpos($n, 'litchi') !== false)
        return firstExistingImg(['maa_litchi.jpg', 'maa_mango.png']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=MAA';
    if (preg_match('/\bmaa\b/i', $n))
        return firstExistingImg(['maa_mango.png', 'maaza.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=MAA';

    // ── FRIVA ────────────────────────────────────────────────────────────────
    if (strpos($n, 'friva') !== false && strpos($n, 'apple') !== false)
        return firstExistingImg(['friva_apple.jpg', 'maa_mango.png']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Friva';
    if (strpos($n, 'friva') !== false && strpos($n, 'litchi') !== false)
        return firstExistingImg(['friva_litchi.jpg', 'maa_mango.png']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Friva';
    if (strpos($n, 'friva') !== false && strpos($n, 'mixed') !== false)
        return firstExistingImg(['friva_mixed.jpg', 'maa_mango.png']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Friva';
    if (strpos($n, 'friva') !== false && strpos($n, 'orange') !== false)
        return firstExistingImg(['friva_orange.jpg', 'maa_mango.png']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Friva';
    if (strpos($n, 'friva') !== false)
        return firstExistingImg(['maa_mango.png', 'maaza.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Friva';

    // ── COCA-COLA BRANDS ────────────────────────────────────────────────────
    if (strpos($n, 'maaza') !== false)
        return firstExistingImg(['maaza.jpg', 'fanta.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Maaza';
    if (strpos($n, 'thums up') !== false || strpos($n, 'thumbs up') !== false)
        return firstExistingImg(['thums_up.jpg', 'coca_cola.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Thums+Up';
    if (strpos($n, 'sprite') !== false)
        return firstExistingImg(['sprite.jpg', 'limca.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Sprite';
    if (strpos($n, 'limca') !== false)
        return firstExistingImg(['limca.jpg', 'fanta.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Limca';
    if (strpos($n, 'fanta') !== false)
        return firstExistingImg(['fanta.jpg', 'limca.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Fanta';
    if (strpos($n, 'minute maid') !== false)
        return firstExistingImg(['maaza.jpg', 'fanta.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Minute+Maid';
    if (strpos($n, 'cococola') !== false || strpos($n, 'coca') !== false)
        return firstExistingImg(['coca_cola.jpg', 'limca.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Coca-Cola';

    // ── LAYS / SNACKS ────────────────────────────────────────────────────────
    if (strpos($n, 'lays') !== false)
        return firstExistingImg(['lays_big.jpg', 'lays.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Lays';
    if (strpos($n, 'doritos') !== false)
        return firstExistingImg(['doritos.jpg', 'lays_big.jpg', 'lays.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Doritos';
    if (strpos($n, 'cheetos') !== false)
        return firstExistingImg(['cheetos.jpg', 'lays_big.jpg', 'lays.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Cheetos';
    if (strpos($n, 'kk') !== false || strpos($n, 'kurkure') !== false)
        return firstExistingImg(['kk_kurkure.jpg', 'lays_big.jpg', 'lays.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Kurkure';
    if (strpos($n, 'pickle') !== false)
        return firstExistingImg(['pickle.jpg', 'lays_big.jpg', 'lays.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Pickle';
    if (strpos($n, 'tata') !== false)
        return firstExistingImg(['tata_salt.jpg', 'lays_big.jpg', 'lays.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Tata';

    // ── Category fallbacks ────────────────────────────────────────────────────
    $cat = mb_strtolower(trim((string)$category));
    if ($cat === 'campa' || strpos($cat, 'soft drink') !== false)
        return firstExistingImg(['campa_lemon_bb.jpg', 'campa_energy_lemon.jpeg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Campa';
    if ($cat === 'cavins' || $cat === 'snacks')
        return firstExistingImg(['cavins_choco_milkshake.jpg', 'cavins_badam_milk.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Cavins';
    if ($cat === 'maa')
        return firstExistingImg(['maa_mango.png', 'maaza.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=MAA';
    if ($cat === 'friva')
        return firstExistingImg(['maa_mango.png', 'maaza.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Friva';
    if ($cat === 'milkshake')
        return firstExistingImg(['cavins_badam_milkshake.jpg', 'cavins_choco_milkshake.jpg']) ?: 'https://placehold.co/300x300/0f766e/ffffff?text=Milkshake';
    return 'https://placehold.co/300x300/0f766e/ffffff?text=' . urlencode(ucwords($name));
}

// Group products by category
$grouped = [];
foreach ($products as $p) {
    $cat = $p['category'] ?: 'Other';
    $grouped[$cat][] = $p;
}
// Sort categories
ksort($grouped);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>YEGOVA FUSION CORNER — Products</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        :root {
            --fc-teal:  #0f766e;
            --fc-dark:  #115e59;
            --fc-light: #f0fdfa;
        }
        * { box-sizing: border-box; }
        body {
            font-family: 'Poppins', sans-serif;
            background: var(--fc-light);
            margin: 0;
        }

        /* ── Hero header ── */
        .hero {
            background: linear-gradient(135deg, var(--fc-teal), var(--fc-dark));
            color: #fff;
            padding: 28px 20px 24px;
            text-align: center;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 3px 12px rgba(0,0,0,.25);
        }
        .hero h1 { font-size: 1.5rem; font-weight: 700; margin: 0; letter-spacing: .5px; }
        .hero p  { font-size: .85rem; opacity: .85; margin: 4px 0 0; }
        .login-btn {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,.18);
            border: 1px solid rgba(255,255,255,.45);
            color: #fff;
            font-size: .78rem;
            padding: 5px 14px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 600;
            backdrop-filter: blur(4px);
            white-space: nowrap;
            transition: background .2s;
        }
        .login-btn:hover { background: rgba(255,255,255,.32); color: #fff; }

        /* ── Search bar ── */
        .search-wrap {
            background: #fff;
            padding: 12px 16px;
            border-bottom: 1px solid #d1fae5;
            position: sticky;
            top: 92px;
            z-index: 90;
        }
        .search-wrap input {
            border-radius: 40px;
            border: 1.5px solid #0f766e55;
            padding: 8px 20px;
            width: 100%;
            max-width: 520px;
            display: block;
            margin: 0 auto;
            font-size: .95rem;
            outline: none;
            transition: border-color .2s;
        }
        .search-wrap input:focus { border-color: var(--fc-teal); }

        /* ── Category tabs ── */
        .cat-tabs {
            background: #fff;
            padding: 8px 12px;
            display: flex;
            gap: 8px;
            overflow-x: auto;
            border-bottom: 1px solid #d1fae5;
            position: sticky;
            top: 148px;
            z-index: 89;
            scrollbar-width: none;
        }
        .cat-tabs::-webkit-scrollbar { display: none; }
        .cat-tab {
            flex-shrink: 0;
            background: #f0fdfa;
            border: 1.5px solid #0f766e44;
            color: var(--fc-teal);
            border-radius: 20px;
            padding: 4px 16px;
            font-size: .82rem;
            font-weight: 600;
            cursor: pointer;
            transition: background .15s, color .15s;
            white-space: nowrap;
        }
        .cat-tab.active, .cat-tab:hover {
            background: var(--fc-teal);
            color: #fff;
            border-color: var(--fc-teal);
        }

        /* ── Products grid ── */
        .section-title {
            font-weight: 700;
            color: var(--fc-dark);
            font-size: 1.05rem;
            padding: 18px 16px 6px;
            border-left: 4px solid var(--fc-teal);
            margin: 0;
        }
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 14px;
            padding: 12px 16px 20px;
        }
        @media (max-width: 400px) {
            .products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 10px 10px 16px; }
        }

        .product-card {
            background: #fff;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,.08);
            display: flex;
            flex-direction: column;
            transition: transform .18s, box-shadow .18s;
        }
        .product-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(15,118,110,.18); }
        .product-card img {
            width: 100%;
            aspect-ratio: 1 / 1;
            object-fit: contain;
            background: #f8f8f8;
            padding: 8px;
        }
        .product-card .info {
            padding: 8px 10px 10px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .product-card .pname {
            font-size: .8rem;
            font-weight: 600;
            color: #1e3a38;
            line-height: 1.35;
            margin-bottom: 6px;
        }
        .product-card .mrp-badge {
            display: inline-block;
            background: var(--fc-teal);
            color: #fff;
            font-size: .78rem;
            font-weight: 700;
            border-radius: 6px;
            padding: 2px 9px;
            align-self: flex-start;
        }

        /* ── Footer ── */
        footer {
            text-align: center;
            padding: 18px;
            font-size: .78rem;
            color: #666;
            border-top: 1px solid #d1fae5;
            margin-top: 10px;
        }

        /* hide category section */
        .cat-section { display: block; }
        .cat-section.hidden { display: none; }
    </style>
</head>
<body>

<!-- ── Hero ── -->
<div class="hero">
    <h1>🍹 YEGOVA FUSION CORNER</h1>
    <p>Puthiamputhur, Thoothukudi &nbsp;·&nbsp; 9843059986</p>
    <a href="index.php?login=1" class="login-btn">🔐 Staff Login</a>
</div>

<!-- ── Search ── -->
<div class="search-wrap">
    <input type="search" id="searchBox" placeholder="🔍 Search product…" autocomplete="off">
</div>

<!-- ── Category tabs ── -->
<div class="cat-tabs" id="catTabs">
    <div class="cat-tab active" data-cat="all">All</div>
    <?php foreach (array_keys($grouped) as $cat): ?>
    <div class="cat-tab" data-cat="<?= htmlspecialchars($cat) ?>"><?= htmlspecialchars($cat) ?></div>
    <?php endforeach; ?>
</div>

<!-- ── Products ── -->
<div id="allSections">
<?php foreach ($grouped as $cat => $items): ?>
<div class="cat-section" data-cat="<?= htmlspecialchars($cat) ?>">
    <div class="section-title"><?= htmlspecialchars($cat) ?></div>
    <div class="products-grid">
        <?php foreach ($items as $p): ?>
        <?php $img = productImageUrl($p['name'], $p['category'] ?? ''); ?>
        <div class="product-card" data-name="<?= htmlspecialchars(mb_strtolower($p['name'])) ?>">
            <img src="<?= htmlspecialchars($img) ?>"
                 alt="<?= htmlspecialchars($p['name']) ?>"
                 loading="lazy"
                 onerror="this.onerror=null;this.src='https://placehold.co/300x300/0f766e/ffffff?text=<?= urlencode(substr($p['name'],0,20)) ?>'">
            <div class="info">
                <div class="pname"><?= htmlspecialchars($p['name']) ?></div>
                <?php if ($p['mrp'] > 0): ?>
                <span class="mrp-badge">MRP ₹<?= number_format($p['mrp'], 0) ?></span>
                <?php endif; ?>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</div>
<?php endforeach; ?>
</div>

<footer>YEGOVA FUSION CORNER &nbsp;|&nbsp; Puthiamputhur, Thoothukudi &nbsp;|&nbsp; 📞 9843059986</footer>

<script>
// ── Category filter ──
const tabs = document.querySelectorAll('.cat-tab');
const sections = document.querySelectorAll('.cat-section');

tabs.forEach(tab => {
    tab.addEventListener('click', function () {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const chosen = this.dataset.cat;
        sections.forEach(sec => {
            if (chosen === 'all' || sec.dataset.cat === chosen) {
                sec.classList.remove('hidden');
            } else {
                sec.classList.add('hidden');
            }
        });
        document.getElementById('searchBox').value = '';
    });
});

// ── Search filter ──
document.getElementById('searchBox').addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector('.cat-tab[data-cat="all"]').classList.add('active');

    sections.forEach(sec => { sec.classList.remove('hidden'); });

    if (!q) return;

    sections.forEach(sec => {
        const cards = sec.querySelectorAll('.product-card');
        let visible = 0;
        cards.forEach(card => {
            const name = card.dataset.name || '';
            card.style.display = name.includes(q) ? '' : 'none';
            if (name.includes(q)) visible++;
        });
        sec.classList.toggle('hidden', visible === 0);
    });
});
</script>
</body>
</html>
