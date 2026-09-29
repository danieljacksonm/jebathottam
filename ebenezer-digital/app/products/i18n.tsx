"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type StoreLocale =
  | "en"
  | "hi"
  | "ta"
  | "te"
  | "ml"
  | "kn"
  | "bn"
  | "mr"
  | "gu"
  | "pa"
  | "ur"
  | "es"
  | "fr"
  | "ar"
  | "de"
  | "pt"
  | "ru"
  | "ja"
  | "ko"
  | "zh"
  | "tr"
  | "id";

type Dict = Record<string, string>;

type StoreI18nValue = {
  locale: StoreLocale;
  setLocale: (next: StoreLocale) => void;
  t: (key: string) => string;
  rtl: boolean;
  /** Prefix current locale onto an internal path for SEO URLs. */
  lp: (path: string) => string;
};

const dictionaries: Record<string, Dict> = {
  en: {
    products: "Products",
    categories: "Categories",
    bundles: "Bundles",
    freeTool: "Free Tool",
    freebies: "Freebies",
    account: "Account",
    searchPrompt: "What are you looking for?",
    searchPlaceholder: "Search products, categories, bundles…",
    noResults: "No products match that search.",
    heroKicker: "Ebenezer Store · Worldwide digital",
    heroTag: "Premium kits and software for creators and businesses — instant download, anywhere in the world.",
    exploreProducts: "Explore products",
    viewBundles: "View bundles",
    featured: "Featured",
    bestSellers: "Best sellers",
    dragSwipe: "Drag / swipe",
    justDropped: "Just dropped",
    startFree: "START FREE.",
    continueShopping: "Continue shopping",
    completeOrder: "Complete your order",
    buyNow: "Buy now",
    getFree: "Get free access",
    getStartedFree: "Get started free",
    addToCart: "Add to cart",
  },
  hi: {
    products: "प्रोडक्ट्स",
    categories: "कैटेगरी",
    bundles: "बंडल्स",
    freeTool: "फ्री टूल",
    freebies: "फ्रीबीज़",
    account: "अकाउंट",
    searchPrompt: "आप क्या ढूंढ रहे हैं?",
    searchPlaceholder: "प्रोडक्ट, कैटेगरी, बंडल खोजें…",
    noResults: "कोई प्रोडक्ट नहीं मिला।",
    heroKicker: "Ebenezer Store · दुनिया भर के लिए",
    heroTag: "प्रीमियम किट और सॉफ्टवेयर — दुनिया में कहीं भी तुरंत डाउनलोड। कीमत USD में।",
    exploreProducts: "प्रोडक्ट्स देखें",
    viewBundles: "बंडल्स देखें",
    featured: "फीचर्ड",
    bestSellers: "बेस्ट सेलर्स",
    dragSwipe: "ड्रैग / स्वाइप",
    justDropped: "अभी नया",
    startFree: "फ्री से शुरू करें",
    continueShopping: "खरीदारी जारी रखें",
    completeOrder: "अपना ऑर्डर पूरा करें",
    buyNow: "अभी खरीदें",
    getFree: "फ्री एक्सेस",
    getStartedFree: "फ्री शुरू करें",
    addToCart: "कार्ट में जोड़ें",
  },
  ta: {
    products: "தயாரிப்புகள்",
    categories: "வகைகள்",
    bundles: "பண்டில்கள்",
    freeTool: "இலவச கருவி",
    freebies: "இலவசங்கள்",
    account: "கணக்கு",
    searchPrompt: "நீங்கள் என்ன தேடுகிறீர்கள்?",
    searchPlaceholder: "தயாரிப்புகள், வகைகள், பண்டில்கள் தேடுங்கள்…",
    noResults: "பொருத்தமான தயாரிப்புகள் இல்லை.",
    heroKicker: "Ebenezer Store / டிஜிட்டல் தயாரிப்புகள்",
    heroTag: "உங்கள் ஐடியாக்களை முன்னோக்கி நகர்த்தும் டிஜிட்டல் தயாரிப்புகள்.",
    exploreProducts: "தயாரிப்புகளை பாருங்கள்",
    viewBundles: "பண்டில்களை பாருங்கள்",
    featured: "முக்கியவை",
    bestSellers: "அதிகம் விற்பனையானவை",
    dragSwipe: "டிராக் / ஸ்வைப்",
    justDropped: "புதிய வெளியீடு",
    startFree: "இலவசமாக தொடங்குங்கள்",
    continueShopping: "ஷாப்பிங் தொடரவும்",
    completeOrder: "உங்கள் ஆர்டரை முடிக்கவும்",
    buyNow: "இப்போது வாங்கவும்",
    getFree: "இலவச அணுகல்",
    getStartedFree: "இலவசமாக தொடங்கு",
    addToCart: "கார்டில் சேர்",
  },
  es: {
    products: "Productos",
    categories: "Categorías",
    bundles: "Paquetes",
    freeTool: "Herramienta gratis",
    freebies: "Gratis",
    account: "Cuenta",
    searchPrompt: "¿Qué estás buscando?",
    searchPlaceholder: "Buscar productos, categorías, paquetes…",
    noResults: "No hay productos para esa búsqueda.",
    heroKicker: "Ebenezer Store / Productos digitales",
    heroTag: "Productos digitales diseñados para impulsar ideas.",
    exploreProducts: "Explorar productos",
    viewBundles: "Ver paquetes",
    featured: "Destacado",
    bestSellers: "Más vendidos",
    dragSwipe: "Arrastra / desliza",
    justDropped: "Recién lanzado",
    startFree: "EMPIEZA GRATIS",
    continueShopping: "Seguir comprando",
    completeOrder: "Completa tu pedido",
    buyNow: "Comprar ahora",
    getFree: "Acceso gratis",
    getStartedFree: "Empezar gratis",
    addToCart: "Agregar al carrito",
  },
  fr: {
    products: "Produits",
    categories: "Catégories",
    bundles: "Packs",
    freeTool: "Outil gratuit",
    freebies: "Gratuits",
    account: "Compte",
    searchPrompt: "Que cherchez-vous ?",
    searchPlaceholder: "Rechercher produits, catégories, packs…",
    noResults: "Aucun produit trouvé.",
    heroKicker: "Ebenezer Store / Produits numériques",
    heroTag: "Des produits numériques pour faire avancer vos idées.",
    exploreProducts: "Explorer les produits",
    viewBundles: "Voir les packs",
    featured: "En vedette",
    bestSellers: "Meilleures ventes",
    dragSwipe: "Glisser / balayer",
    justDropped: "Nouveau",
    startFree: "COMMENCER GRATUIT",
    continueShopping: "Continuer vos achats",
    completeOrder: "Finalisez votre commande",
    buyNow: "Acheter maintenant",
    getFree: "Accès gratuit",
    getStartedFree: "Commencer gratuitement",
    addToCart: "Ajouter au panier",
  },
  ar: {
    products: "المنتجات",
    categories: "الفئات",
    bundles: "الباقات",
    freeTool: "أداة مجانية",
    freebies: "مجاني",
    account: "الحساب",
    searchPrompt: "ماذا تبحث عن؟",
    searchPlaceholder: "ابحث عن منتجات أو فئات أو باقات…",
    noResults: "لا توجد نتائج مطابقة.",
    heroKicker: "Ebenezer Store / منتجات رقمية",
    heroTag: "منتجات رقمية مصممة لدفع أفكارك للأمام.",
    exploreProducts: "استكشف المنتجات",
    viewBundles: "عرض الباقات",
    featured: "مميز",
    bestSellers: "الأكثر مبيعاً",
    dragSwipe: "اسحب",
    justDropped: "إصدار جديد",
    startFree: "ابدأ مجاناً",
    continueShopping: "متابعة التسوق",
    completeOrder: "أكمل طلبك",
    buyNow: "اشتر الآن",
    getFree: "وصول مجاني",
    getStartedFree: "ابدأ مجاناً",
    addToCart: "أضف إلى السلة",
  },
  de: {
    products: "Produkte",
    categories: "Kategorien",
    bundles: "Bundles",
    freeTool: "Gratis-Tool",
    freebies: "Gratis",
    account: "Konto",
    searchPrompt: "Wonach suchen Sie?",
    searchPlaceholder: "Produkte, Kategorien, Bundles suchen…",
    noResults: "Keine passenden Produkte gefunden.",
    heroKicker: "Ebenezer Store / Digitale Produkte",
    heroTag: "Digitale Produkte, die Ideen voranbringen.",
    exploreProducts: "Produkte entdecken",
    viewBundles: "Bundles ansehen",
    featured: "Empfohlen",
    bestSellers: "Bestseller",
    dragSwipe: "Ziehen / wischen",
    justDropped: "Neu erschienen",
    startFree: "KOSTENLOS STARTEN",
    continueShopping: "Weiter einkaufen",
    completeOrder: "Bestellung abschließen",
    buyNow: "Jetzt kaufen",
    getFree: "Kostenlos erhalten",
    getStartedFree: "Kostenlos starten",
    addToCart: "In den Warenkorb",
  },
  pt: {
    products: "Produtos",
    categories: "Categorias",
    bundles: "Pacotes",
    freeTool: "Ferramenta grátis",
    freebies: "Grátis",
    account: "Conta",
    searchPrompt: "O que você está procurando?",
    searchPlaceholder: "Buscar produtos, categorias, pacotes…",
    noResults: "Nenhum produto encontrado.",
    heroKicker: "Ebenezer Store / Produtos digitais",
    heroTag: "Produtos digitais para impulsionar ideias.",
    exploreProducts: "Explorar produtos",
    viewBundles: "Ver pacotes",
    featured: "Destaque",
    bestSellers: "Mais vendidos",
    dragSwipe: "Arraste / deslize",
    justDropped: "Acabou de sair",
    startFree: "COMECE GRÁTIS",
    continueShopping: "Continuar comprando",
    completeOrder: "Concluir pedido",
    buyNow: "Comprar agora",
    getFree: "Acesso grátis",
    getStartedFree: "Começar grátis",
    addToCart: "Adicionar ao carrinho",
  },
  ru: {
    products: "Продукты",
    categories: "Категории",
    bundles: "Наборы",
    freeTool: "Бесплатный инструмент",
    freebies: "Бесплатно",
    account: "Аккаунт",
    searchPrompt: "Что вы ищете?",
    searchPlaceholder: "Поиск продуктов, категорий, наборов…",
    noResults: "Подходящие продукты не найдены.",
    heroKicker: "Ebenezer Store / Цифровые продукты",
    heroTag: "Цифровые продукты, которые двигают идеи вперед.",
    exploreProducts: "Смотреть продукты",
    viewBundles: "Смотреть наборы",
    featured: "Рекомендуем",
    bestSellers: "Хиты продаж",
    dragSwipe: "Тяните / свайпайте",
    justDropped: "Новый релиз",
    startFree: "НАЧНИТЕ БЕСПЛАТНО",
    continueShopping: "Продолжить покупки",
    completeOrder: "Оформите заказ",
    buyNow: "Купить сейчас",
    getFree: "Получить бесплатно",
    getStartedFree: "Начать бесплатно",
    addToCart: "В корзину",
  },
  ja: {
    products: "商品",
    categories: "カテゴリ",
    bundles: "バンドル",
    freeTool: "無料ツール",
    freebies: "無料",
    account: "アカウント",
    searchPrompt: "何をお探しですか？",
    searchPlaceholder: "商品・カテゴリ・バンドルを検索…",
    noResults: "一致する商品がありません。",
    heroKicker: "Ebenezer Store / デジタル商品",
    heroTag: "アイデアを前進させるデジタル商品。",
    exploreProducts: "商品を見る",
    viewBundles: "バンドルを見る",
    featured: "注目",
    bestSellers: "人気商品",
    dragSwipe: "ドラッグ / スワイプ",
    justDropped: "新着",
    startFree: "無料で開始",
    continueShopping: "買い物を続ける",
    completeOrder: "注文を完了",
    buyNow: "今すぐ購入",
    getFree: "無料で入手",
    getStartedFree: "無料で始める",
    addToCart: "カートに追加",
  },
  ko: {
    products: "제품",
    categories: "카테고리",
    bundles: "번들",
    freeTool: "무료 도구",
    freebies: "무료",
    account: "계정",
    searchPrompt: "무엇을 찾고 계신가요?",
    searchPlaceholder: "제품, 카테고리, 번들 검색…",
    noResults: "일치하는 제품이 없습니다.",
    heroKicker: "Ebenezer Store / 디지털 제품",
    heroTag: "아이디어를 앞으로 나아가게 하는 디지털 제품.",
    exploreProducts: "제품 둘러보기",
    viewBundles: "번들 보기",
    featured: "추천",
    bestSellers: "베스트셀러",
    dragSwipe: "드래그 / 스와이프",
    justDropped: "신규 출시",
    startFree: "무료로 시작",
    continueShopping: "쇼핑 계속하기",
    completeOrder: "주문 완료",
    buyNow: "지금 구매",
    getFree: "무료 이용",
    getStartedFree: "무료 시작",
    addToCart: "장바구니 담기",
  },
  zh: {
    products: "产品",
    categories: "分类",
    bundles: "组合包",
    freeTool: "免费工具",
    freebies: "免费",
    account: "账户",
    searchPrompt: "你在找什么？",
    searchPlaceholder: "搜索产品、分类、组合包…",
    noResults: "没有匹配的产品。",
    heroKicker: "Ebenezer Store / 数字产品",
    heroTag: "推动创意前进的数字产品。",
    exploreProducts: "探索产品",
    viewBundles: "查看组合包",
    featured: "精选",
    bestSellers: "畅销产品",
    dragSwipe: "拖动 / 滑动",
    justDropped: "新品发布",
    startFree: "免费开始",
    continueShopping: "继续购物",
    completeOrder: "完成订单",
    buyNow: "立即购买",
    getFree: "免费获取",
    getStartedFree: "免费开始",
    addToCart: "加入购物车",
  },
  tr: {
    products: "Ürünler",
    categories: "Kategoriler",
    bundles: "Paketler",
    freeTool: "Ücretsiz araç",
    freebies: "Ücretsiz",
    account: "Hesap",
    searchPrompt: "Ne arıyorsunuz?",
    searchPlaceholder: "Ürün, kategori, paket ara…",
    noResults: "Eşleşen ürün bulunamadı.",
    heroKicker: "Ebenezer Store / Dijital ürünler",
    heroTag: "Fikirlerinizi ileri taşıyan dijital ürünler.",
    exploreProducts: "Ürünleri keşfet",
    viewBundles: "Paketleri gör",
    featured: "Öne çıkan",
    bestSellers: "En çok satanlar",
    dragSwipe: "Sürükle / kaydır",
    justDropped: "Yeni çıktı",
    startFree: "ÜCRETSİZ BAŞLA",
    continueShopping: "Alışverişe devam et",
    completeOrder: "Siparişi tamamla",
    buyNow: "Şimdi al",
    getFree: "Ücretsiz al",
    getStartedFree: "Ücretsiz başla",
    addToCart: "Sepete ekle",
  },
  id: {
    products: "Produk",
    categories: "Kategori",
    bundles: "Bundel",
    freeTool: "Alat gratis",
    freebies: "Gratis",
    account: "Akun",
    searchPrompt: "Apa yang Anda cari?",
    searchPlaceholder: "Cari produk, kategori, bundel…",
    noResults: "Produk tidak ditemukan.",
    heroKicker: "Ebenezer Store / Produk digital",
    heroTag: "Produk digital untuk mendorong ide Anda maju.",
    exploreProducts: "Jelajahi produk",
    viewBundles: "Lihat bundel",
    featured: "Unggulan",
    bestSellers: "Terlaris",
    dragSwipe: "Geser / sapu",
    justDropped: "Baru rilis",
    startFree: "MULAI GRATIS",
    continueShopping: "Lanjut belanja",
    completeOrder: "Selesaikan pesanan",
    buyNow: "Beli sekarang",
    getFree: "Dapatkan gratis",
    getStartedFree: "Mulai gratis",
    addToCart: "Tambah ke keranjang",
  },
};

const KEY = "ebenezer-store-locale";

// India locales: real UI strings (do not copy English).
const INDIA_STORE: Record<string, Dict> = {
  te: {
    products: "ఉత్పత్తులు",
    categories: "వర్గాలు",
    bundles: "బండిల్స్",
    freeTool: "ఉచిత సాధనం",
    freebies: "ఉచితం",
    account: "ఖాతా",
    searchPrompt: "మీరు ఏమి వెతుకుతున్నారు?",
    searchPlaceholder: "ఉత్పత్తులు, వర్గాలు వెతకండి…",
    noResults: "సరిపోలే ఉత్పత్తులు లేవు.",
    heroKicker: "Ebenezer Store · డిజిటల్ ఉత్పత్తులు",
    heroTag: "సృష్టికర్తలు మరియు వ్యాపారాల కోసం ప్రీమియం కిట్లు — వెంటనే డౌన్‌లోడ్.",
    exploreProducts: "ఉత్పత్తులు చూడండి",
    viewBundles: "బండిల్స్ చూడండి",
    featured: "ఫీచర్డ్",
    bestSellers: "ఎక్కువ అమ్మకాలు",
    dragSwipe: "లాగండి / స్వైప్",
    justDropped: "కొత్తవి",
    startFree: "ఉచితంగా ప్రారంభించండి",
    continueShopping: "షాపింగ్ కొనసాగించండి",
    completeOrder: "ఆర్డర్ పూర్తి చేయండి",
    buyNow: "ఇప్పుడే కొనండి",
    getFree: "ఉచిత యాక్సెస్",
    getStartedFree: "ఉచితంగా మొదలుపెట్టండి",
    addToCart: "కార్ట్‌కు జోడించండి",
  },
  ml: {
    products: "ഉൽപ്പന്നങ്ങൾ",
    categories: "വിഭാഗങ്ങൾ",
    bundles: "ബണ്ടിലുകൾ",
    freeTool: "സൗജന്യ ഉപകരണം",
    freebies: "സൗജന്യം",
    account: "അക്കൗണ്ട്",
    searchPrompt: "നിങ്ങൾ എന്താണ് തിരയുന്നത്?",
    searchPlaceholder: "ഉൽപ്പന്നങ്ങൾ, വിഭാഗങ്ങൾ തിരയുക…",
    noResults: "യോജിക്കുന്ന ഉൽപ്പന്നങ്ങൾ ഇല്ല.",
    heroKicker: "Ebenezer Store · ഡിജിറ്റൽ ഉൽപ്പന്നങ്ങൾ",
    heroTag: "സ്രഷ്ടാക്കൾക്കും ബിസിനസുകൾക്കും പ്രീമിയം കിറ്റുകൾ — ഉടൻ ഡൗൺലോഡ്.",
    exploreProducts: "ഉൽപ്പന്നങ്ങൾ കാണുക",
    viewBundles: "ബണ്ടിലുകൾ കാണുക",
    featured: "തിരഞ്ഞെടുത്തവ",
    bestSellers: "കൂടുതൽ വിറ്റവ",
    dragSwipe: "വലിക്കുക / സ്വൈപ്പ്",
    justDropped: "പുതിയത്",
    startFree: "സൗജന്യമായി തുടങ്ങുക",
    continueShopping: "ഷോപ്പിംഗ് തുടരുക",
    completeOrder: "ഓർഡർ പൂർത്തിയാക്കുക",
    buyNow: "ഇപ്പോൾ വാങ്ങുക",
    getFree: "സൗജന്യ ആക്സസ്",
    getStartedFree: "സൗജന്യമായി തുടങ്ങുക",
    addToCart: "കാർട്ടിലേക്ക് ചേർക്കുക",
  },
  kn: {
    products: "ಉತ್ಪನ್ನಗಳು",
    categories: "ವರ್ಗಗಳು",
    bundles: "ಬಂಡಲ್‌ಗಳು",
    freeTool: "ಉಚಿತ ಸಾಧನ",
    freebies: "ಉಚಿತ",
    account: "ಖಾತೆ",
    searchPrompt: "ನೀವು ಏನು ಹುಡುಕುತ್ತಿದ್ದೀರಿ?",
    searchPlaceholder: "ಉತ್ಪನ್ನಗಳು, ವರ್ಗಗಳನ್ನು ಹುಡುಕಿ…",
    noResults: "ಹೊಂದುವ ಉತ್ಪನ್ನಗಳಿಲ್ಲ.",
    heroKicker: "Ebenezer Store · ಡಿಜಿಟಲ್ ಉತ್ಪನ್ನಗಳು",
    heroTag: "ರಚನೆಕಾರರು ಮತ್ತು ವ್ಯಾಪಾರಗಳಿಗೆ ಪ್ರೀಮಿಯಂ ಕಿಟ್‌ಗಳು — ತಕ್ಷಣ ಡೌನ್‌ಲೋಡ್.",
    exploreProducts: "ಉತ್ಪನ್ನಗಳನ್ನು ನೋಡಿ",
    viewBundles: "ಬಂಡಲ್‌ಗಳನ್ನು ನೋಡಿ",
    featured: "ಆಯ್ದವು",
    bestSellers: "ಹೆಚ್ಚು ಮಾರಾಟ",
    dragSwipe: "ಎಳೆಯಿರಿ / ಸ್ವೈಪ್",
    justDropped: "ಹೊಸತು",
    startFree: "ಉಚಿತವಾಗಿ ಆರಂಭಿಸಿ",
    continueShopping: "ಶಾಪಿಂಗ್ ಮುಂದುವರಿಸಿ",
    completeOrder: "ಆರ್ಡರ್ ಪೂರ್ಣಗೊಳಿಸಿ",
    buyNow: "ಈಗ ಖರೀದಿಸಿ",
    getFree: "ಉಚಿತ ಪ್ರವೇಶ",
    getStartedFree: "ಉಚಿತವಾಗಿ ಆರಂಭಿಸಿ",
    addToCart: "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
  },
  bn: {
    products: "পণ্য",
    categories: "বিভাগ",
    bundles: "বান্ডেল",
    freeTool: "ফ্রি টুল",
    freebies: "ফ্রি",
    account: "অ্যাকাউন্ট",
    searchPrompt: "আপনি কী খুঁজছেন?",
    searchPlaceholder: "পণ্য, বিভাগ খুঁজুন…",
    noResults: "মেলে এমন পণ্য নেই।",
    heroKicker: "Ebenezer Store · ডিজিটাল পণ্য",
    heroTag: "ক্রিয়েটর ও ব্যবসার জন্য প্রিমিয়াম কিট — সাথে সাথে ডাউনলোড।",
    exploreProducts: "পণ্য দেখুন",
    viewBundles: "বান্ডেল দেখুন",
    featured: "নির্বাচিত",
    bestSellers: "বেশি বিক্রি",
    dragSwipe: "টানুন / সোয়াইপ",
    justDropped: "নতুন",
    startFree: "বিনামূল্যে শুরু করুন",
    continueShopping: "কেনাকাটা চালিয়ে যান",
    completeOrder: "অর্ডার শেষ করুন",
    buyNow: "এখন কিনুন",
    getFree: "ফ্রি অ্যাক্সেস",
    getStartedFree: "বিনামূল্যে শুরু করুন",
    addToCart: "কার্টে যোগ করুন",
  },
  mr: {
    products: "उत्पादने",
    categories: "विभाग",
    bundles: "बंडल्स",
    freeTool: "मोफत साधन",
    freebies: "मोफत",
    account: "खाते",
    searchPrompt: "तुम्ही काय शोधत आहात?",
    searchPlaceholder: "उत्पादने, विभाग शोधा…",
    noResults: "जुळणारी उत्पादने नाहीत.",
    heroKicker: "Ebenezer Store · डिजिटल उत्पादने",
    heroTag: "क्रिएटर्स आणि व्यवसायांसाठी प्रीमियम किट — लगेच डाउनलोड.",
    exploreProducts: "उत्पादने पहा",
    viewBundles: "बंडल्स पहा",
    featured: "निवडक",
    bestSellers: "सर्वाधिक विक्री",
    dragSwipe: "ओढा / स्वाइप",
    justDropped: "नवे",
    startFree: "मोफत सुरू करा",
    continueShopping: "खरेदी सुरू ठेवा",
    completeOrder: "ऑर्डर पूर्ण करा",
    buyNow: "आता खरेदी करा",
    getFree: "मोफत प्रवेश",
    getStartedFree: "मोफत सुरू करा",
    addToCart: "कार्टमध्ये जोडा",
  },
  gu: {
    products: "ઉત્પાદનો",
    categories: "શ્રેણીઓ",
    bundles: "બંડલ",
    freeTool: "મફત સાધન",
    freebies: "મફત",
    account: "ખાતું",
    searchPrompt: "તમે શું શોધો છો?",
    searchPlaceholder: "ઉત્પાદનો, શ્રેણીઓ શોધો…",
    noResults: "મેળ ખાતા ઉત્પાદનો નથી.",
    heroKicker: "Ebenezer Store · ડિજિટલ ઉત્પાદનો",
    heroTag: "ક્રિએટર્સ અને વ્યવસાયો માટે પ્રીમિયમ કિટ — તરત ડાઉનલોડ.",
    exploreProducts: "ઉત્પાદનો જુઓ",
    viewBundles: "બંડલ જુઓ",
    featured: "પસંદ કરેલા",
    bestSellers: "સૌથી વધુ વેચાણ",
    dragSwipe: "ખેંચો / સ્વાઇપ",
    justDropped: "નવું",
    startFree: "મફત શરૂ કરો",
    continueShopping: "ખરીદી ચાલુ રાખો",
    completeOrder: "ઓર્ડર પૂરો કરો",
    buyNow: "હમણાં ખરીદો",
    getFree: "મફત ઍક્સેસ",
    getStartedFree: "મફત શરૂ કરો",
    addToCart: "કાર્ટમાં ઉમેરો",
  },
  pa: {
    products: "ਉਤਪਾਦ",
    categories: "ਸ਼੍ਰੇਣੀਆਂ",
    bundles: "ਬੰਡਲ",
    freeTool: "ਮੁਫ਼ਤ ਟੂਲ",
    freebies: "ਮੁਫ਼ਤ",
    account: "ਖਾਤਾ",
    searchPrompt: "ਤੁਸੀਂ ਕੀ ਲੱਭ ਰਹੇ ਹੋ?",
    searchPlaceholder: "ਉਤਪਾਦ, ਸ਼੍ਰੇਣੀਆਂ ਲੱਭੋ…",
    noResults: "ਮੇਲ ਖਾਂਦੇ ਉਤਪਾਦ ਨਹੀਂ।",
    heroKicker: "Ebenezer Store · ਡਿਜੀਟਲ ਉਤਪਾਦ",
    heroTag: "ਕ੍ਰਿਏਟਰਾਂ ਅਤੇ ਕਾਰੋਬਾਰਾਂ ਲਈ ਪ੍ਰੀਮੀਅਮ ਕਿੱਟਾਂ — ਤੁਰੰਤ ਡਾਊਨਲੋਡ।",
    exploreProducts: "ਉਤਪਾਦ ਵੇਖੋ",
    viewBundles: "ਬੰਡਲ ਵੇਖੋ",
    featured: "ਚੁਣੇ ਹੋਏ",
    bestSellers: "ਸਭ ਤੋਂ ਵੱਧ ਵਿਕਰੀ",
    dragSwipe: "ਖਿੱਚੋ / ਸਵਾਈਪ",
    justDropped: "ਨਵੇਂ",
    startFree: "ਮੁਫ਼ਤ ਸ਼ੁਰੂ ਕਰੋ",
    continueShopping: "ਖਰੀਦਦਾਰੀ ਜਾਰੀ ਰੱਖੋ",
    completeOrder: "ਆਰਡਰ ਪੂਰਾ ਕਰੋ",
    buyNow: "ਹੁਣੇ ਖਰੀਦੋ",
    getFree: "ਮੁਫ਼ਤ ਪਹੁੰਚ",
    getStartedFree: "ਮੁਫ਼ਤ ਸ਼ੁਰੂ ਕਰੋ",
    addToCart: "ਕਾਰਟ ਵਿੱਚ ਪਾਓ",
  },
  ur: {
    products: "مصنوعات",
    categories: "زمرے",
    bundles: "بنڈلز",
    freeTool: "مفت ٹول",
    freebies: "مفت",
    account: "اکاؤنٹ",
    searchPrompt: "آپ کیا تلاش کر رہے ہیں؟",
    searchPlaceholder: "مصنوعات، زمرے تلاش کریں…",
    noResults: "کوئی مماثل مصنوعات نہیں۔",
    heroKicker: "Ebenezer Store · ڈیجیٹل مصنوعات",
    heroTag: "تخلیق کاروں اور کاروبار کے لیے پریمیم کٹس — فوری ڈاؤن لوڈ۔",
    exploreProducts: "مصنوعات دیکھیں",
    viewBundles: "بنڈلز دیکھیں",
    featured: "منتخب",
    bestSellers: "زیادہ فروخت",
    dragSwipe: "کھینچیں / سوائپ",
    justDropped: "نئے",
    startFree: "مفت شروع کریں",
    continueShopping: "خریداری جاری رکھیں",
    completeOrder: "آرڈر مکمل کریں",
    buyNow: "ابھی خریدیں",
    getFree: "مفت رسائی",
    getStartedFree: "مفت شروع کریں",
    addToCart: "کارٹ میں شامل کریں",
  },
};

for (const loc of ["te", "ml", "kn", "bn", "mr", "gu", "pa", "ur"] as const) {
  const extra = INDIA_STORE[loc];
  (dictionaries as Record<string, Dict>)[loc] = extra
    ? { ...dictionaries.en, ...extra }
    : dictionaries.en;
}

const Ctx = createContext<StoreI18nValue | null>(null);

function hasLocale(code: string | undefined | null): code is StoreLocale {
  return Boolean(code && (dictionaries as Record<string, Dict>)[code]);
}

function localePath(locale: StoreLocale, path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return clean;
  return `/${locale}${clean}`;
}

export function StoreI18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<StoreLocale>("en");

  useEffect(() => {
    const path = window.location.pathname;
    const fromUrl = path.match(/^\/([a-z]{2})(\/|$)/i)?.[1]?.toLowerCase();
    if (hasLocale(fromUrl)) {
      setLocaleState(fromUrl);
      localStorage.setItem(KEY, fromUrl);
      return;
    }
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("eben-locale="))
      ?.split("=")[1];
    if (hasLocale(cookie)) {
      setLocaleState(cookie);
      return;
    }
    const saved = localStorage.getItem(KEY);
    if (hasLocale(saved)) {
      setLocaleState(saved);
      return;
    }
    const nav = (navigator.language || "en").slice(0, 2);
    if (hasLocale(nav)) setLocaleState(nav);
  }, []);

  const setLocale = (next: StoreLocale) => {
    setLocaleState(next);
    localStorage.setItem(KEY, next);
    document.cookie = `eben-locale=${next}; path=/; max-age=31536000; samesite=lax`;
    const path = window.location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/i, "") || "/";
    const clean = path.startsWith("/") ? path : `/${path}`;
    const target = localePath(next, clean);
    if (target !== window.location.pathname) {
      window.location.assign(target + window.location.search + window.location.hash);
    }
  };

  const value = useMemo<StoreI18nValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => dictionaries[locale]?.[key] || dictionaries.en[key] || key,
      rtl: locale === "ar" || locale === "ur",
      lp: (path) => localePath(locale, path),
    }),
    [locale]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStoreI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStoreI18n must be used inside StoreI18nProvider");
  return ctx;
}
