import type { PackageDetails } from "@/data/package-details";
import type { LocalizedString, LocalizedStringList } from "@/lib/content/types";

const CANCEL: LocalizedString = {
  en: "Cancellation and refunds follow supplier rules and Canaan’s published Cancellation & Refund Policy. Ask before you pay any advance — see /cancellation.",
  ta: "ரத்து மற்றும் பணத்திரும்பல் சப்ளையர் விதிகள் மற்றும் Canaan Cancellation & Refund Policy-ஐப் பின்பற்றும். முன்பணத்திற்கு முன் கேளுங்கள் — /cancellation.",
  hi: "रद्दीकरण और रिफंड सप्लायर नियमों और Canaan की Cancellation & Refund Policy के अनुसार होते हैं। अग्रिम भुगतान से पहले पूछें — /cancellation।",
};

const PAY: LocalizedString = {
  en: "Payment schedule and accepted methods are shared only when you confirm the trip. Do not transfer funds to unverified accounts.",
  ta: "பயணம் உறுதிப்படுத்தும்போது மட்டுமே பணம் செலுத்தும் விவரங்கள் பகிரப்படும். சரிபார்க்கப்படாத கணக்குகளுக்கு பணம் அனுப்பாதீர்கள்.",
  hi: "यात्रा पुष्टि पर ही भुगतान विवरण साझा होते हैं। असत्यापित खातों में धन न भेजें।",
};

const ENQUIRE_PRICING: LocalizedStringList = {
  en: [
    "Pricing is enquiry-based — not a published catalogue rate",
    "Quote depends on travel dates, group size, and stay category",
    "No fake “from” price is shown until Canaan verifies options",
  ],
  ta: [
    "விலை விசாரணை அடிப்படை — வெளியிடப்பட்ட விலை அல்ல",
    "தேதிகள், குழு அளவு, தங்கல் வகையைப் பொறுத்தது",
    "சரிபார்ப்புக்கு முன் போலி விலை காட்டப்படாது",
  ],
  hi: [
    "मूल्य पूछताछ-आधारित है — प्रकाशित कैटलॉग दर नहीं",
    "तिथियाँ, समूह आकार और ठहराव श्रेणी पर निर्भर",
    "सत्यापन से पहले नकली “from” कीमत नहीं दिखती",
  ],
};

function enquireShell(parts: {
  suitableFor: LocalizedString;
  startingLocation: LocalizedString;
  destination: LocalizedString;
  hotelCategory: LocalizedString;
  transportSummary: LocalizedString;
  mealPlan: LocalizedString;
  inclusions: { en: string[]; ta: string[]; hi: string[] };
  exclusions: { en: string[]; ta: string[]; hi: string[] };
  accommodationNote: LocalizedString;
  transportDetails: { en: string[]; ta: string[]; hi: string[] };
  itinerary: PackageDetails["itinerary"];
  faqs: PackageDetails["faqs"];
}): PackageDetails {
  return {
    suitableFor: parts.suitableFor,
    startingLocation: parts.startingLocation,
    destination: parts.destination,
    hotelCategory: parts.hotelCategory,
    transportSummary: parts.transportSummary,
    mealPlan: parts.mealPlan,
    pricingAssumptions: ENQUIRE_PRICING,
    inclusions: parts.inclusions,
    exclusions: parts.exclusions,
    accommodationNote: parts.accommodationNote,
    transportDetails: parts.transportDetails,
    cancellationPolicy: CANCEL,
    paymentTerms: PAY,
    itinerary: parts.itinerary,
    faqs: parts.faqs,
  };
}

export const enquiryPackageDetails: Record<string, PackageDetails> = {
  "kodai-3n4d-family": enquireShell({
    suitableFor: {
      en: "Families and friend groups wanting a paced 4-day Kodaikanal stay",
      ta: "4 நாள் கொடைக்கானல் தங்கலை விரும்பும் குடும்பங்கள்",
      hi: "4 दिवसीय कोडाइकनाल ठहराव चाहने वाले परिवार",
    },
    startingLocation: {
      en: "Kodai Road / Madurai / Coimbatore (as planned after enquiry)",
      ta: "கொடை ரோடு / மதுரை / கோயம்புத்தூர் (விசாரணைக்குப் பிறகு)",
      hi: "कोडई रोड / मदुरै / कोयंबटूर (पूछताछ के बाद)",
    },
    destination: {
      en: "Kodaikanal",
      ta: "கொடைக்கானல்",
      hi: "कोडाइकनाल",
    },
    hotelCategory: {
      en: "Confirmed after enquiry (budget to premium)",
      ta: "விசாரணைக்குப் பிறகு உறுதி (பட்ஜெட் முதல் பிரீமியம்)",
      hi: "पूछताछ के बाद पुष्टि (बजट से प्रीमियम)",
    },
    transportSummary: {
      en: "Private vehicle options sized to your group — confirmed in quote",
      ta: "குழு அளவுக்கு தனியார் வாகனம் — மேற்கோளில் உறுதி",
      hi: "समूह के अनुसार निजी वाहन — कोट में पुष्टि",
    },
    mealPlan: {
      en: "Meal plan selected after enquiry (often breakfast + dinner)",
      ta: "விசாரணைக்குப் பிறகு உணவுத் திட்டம்",
      hi: "पूछताछ के बाद भोजन योजना",
    },
    inclusions: {
      en: [
        "Stay for 3 nights (category confirmed in quote)",
        "Sightseeing framework for lake, valley, and pine areas",
        "Trip coordination by Canaan Travel Hub",
      ],
      ta: [
        "3 இரவு தங்கல் (வகை மேற்கோளில்)",
        "ஏரி, பள்ளத்தாக்கு, பைன் சுற்றுலா கட்டமைப்பு",
        "Canaan Travel Hub ஒருங்கிணைப்பு",
      ],
      hi: [
        "3 रात ठहराव (श्रेणी कोट में)",
        "झील, घाटी, पाइन साइटसीइंग ढांचा",
        "Canaan Travel Hub समन्वय",
      ],
    },
    exclusions: {
      en: [
        "Airfare / train tickets unless added in quote",
        "Personal expenses and optional activities",
        "Anything not listed in your confirmed quote",
      ],
      ta: [
        "விமானம் / ரயில் (மேற்கோளில் சேர்க்காவிட்டால்)",
        "தனிப்பட்ட செலவுகள்",
        "உறுதிப்படுத்திய மேற்கோளில் இல்லாதவை",
      ],
      hi: [
        "हवाई / ट्रेन (कोट में न जोड़ा हो तो)",
        "व्यक्तिगत खर्च",
        "पुष्टि कोट में न हो तो कुछ भी",
      ],
    },
    accommodationNote: {
      en: "We match stay style to your budget after checking availability for your dates — no hotel names are promised until confirmed.",
      ta: "தேதிகளுக்கு கிடைக்கும் தன்மைக்குப் பிறகு தங்கல் — உறுதிக்கு முன் ஹோட்டல் பெயர் வாக்குறுதி இல்லை.",
      hi: "तिथियों की उपलब्धता के बाद ठहराव — पुष्टि से पहले होटल नाम वादा नहीं।",
    },
    transportDetails: {
      en: [
        "Pickup point confirmed after enquiry",
        "Local sightseeing vehicle sized to guest count",
      ],
      ta: ["பிக்அப் விசாரணைக்குப் பிறகு", "சுற்றுலா வாகனம் விருந்தினர் எண்ணிக்கைக்கு"],
      hi: ["पिकअप पूछताछ के बाद", "साइटसीइंग वाहन अतिथि संख्या के अनुसार"],
    },
    itinerary: [
      {
        day: 1,
        title: {
          en: "Arrive & lake orientation",
          ta: "வருகை & ஏரி அறிமுகம்",
          hi: "आगमन और झील परिचय",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Transfer to Kodaikanal, check-in, gentle lake-side evening.",
              ta: "கொடைக்கானல் பரிமாற்றம், செக்-இன், மென்மையான ஏரி மாலை.",
              hi: "कोडाइकनाल ट्रांसफर, चेक-इन, हल्की झील शाम।",
            },
          },
        ],
        overnight: {
          en: "Overnight in Kodaikanal",
          ta: "கொடைக்கானலில் இரவு",
          hi: "कोडाइकनाल में रात्रि",
        },
      },
      {
        day: 2,
        title: {
          en: "Valley viewpoints",
          ta: "பள்ளத்தாக்கு காட்சிகள்",
          hi: "घाटी व्यू पॉइंट",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Classic valley tour stops paced for families (exact list confirmed in quote).",
              ta: "குடும்ப வேகத்தில் பள்ளத்தாக்கு சுற்றுலா (பட்டியல் மேற்கோளில்).",
              hi: "पारिवारिक गति से घाटी टूर (सूची कोट में)।",
            },
          },
        ],
        overnight: {
          en: "Overnight in Kodaikanal",
          ta: "கொடைக்கானலில் இரவு",
          hi: "कोडाइकनाल में रात्रि",
        },
      },
      {
        day: 3,
        title: {
          en: "Pines & open views",
          ta: "பைன் & திறந்த காட்சிகள்",
          hi: "पाइन और खुले दृश्य",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Pine forest walks and viewpoint time; optional quieter stops for children.",
              ta: "பைன் நடை மற்றும் காட்சி நேரம்; குழந்தைகளுக்கு அமைதியான நிறுத்தங்கள்.",
              hi: "पाइन वॉक और व्यू समय; बच्चों के लिए शांत स्टॉप।",
            },
          },
        ],
        overnight: {
          en: "Overnight in Kodaikanal",
          ta: "கொடைக்கானலில் இரவு",
          hi: "कोडाइकनाल में रात्रि",
        },
      },
      {
        day: 4,
        title: {
          en: "Morning leisure & departure",
          ta: "காலை ஓய்வு & புறப்பாடு",
          hi: "सुबह फुरसत और प्रस्थान",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Checkout and transfer as planned in your confirmed quote.",
              ta: "செக்அவுட் மற்றும் உறுதிப்படுத்திய மேற்கோள் படி பரிமாற்றம்.",
              hi: "चेकआउट और पुष्टि कोट के अनुसार ट्रांसफर।",
            },
          },
        ],
      },
    ],
    faqs: [
      {
        question: {
          en: "Why is there no starting price?",
          ta: "தொடக்க விலை ஏன் இல்லை?",
          hi: "शुरुआती कीमत क्यों नहीं?",
        },
        answer: {
          en: "Stay and vehicle rates change by season and group size. Canaan shares a verified quote after your enquiry — we do not invent catalogue prices.",
          ta: "பருவம் மற்றும் குழு அளவால் விலை மாறும். விசாரணைக்குப் பிறகு சரிபார்க்கப்பட்ட மேற்கோள்.",
          hi: "सीजन और समूह आकार से दरें बदलती हैं। पूछताछ के बाद सत्यापित कोट।",
        },
      },
    ],
  }),

  "goa-3n4d-beach": enquireShell({
    suitableFor: {
      en: "Families and couples wanting a Goa beach-led stay",
      ta: "கோவா கடற்கரை தங்கலை விரும்பும் குடும்பங்கள் / ஜோடிகள்",
      hi: "गोवा बीच ठहराव चाहने वाले परिवार / जोड़े",
    },
    startingLocation: {
      en: "Goa airport / railway (as planned)",
      ta: "கோவா விமான நிலையம் / ரயில்",
      hi: "गोवा एयरपोर्ट / रेलवे",
    },
    destination: { en: "Goa", ta: "கோவா", hi: "गोवा" },
    hotelCategory: {
      en: "Beach-area stay category confirmed after enquiry",
      ta: "கடற்கரை பகுதி தங்கல் — விசாரணைக்குப் பிறகு",
      hi: "बीच-एरिया ठहराव — पूछताछ के बाद",
    },
    transportSummary: {
      en: "Airport transfers and local hops optional in quote",
      ta: "விமான நிலைய பரிமாற்றம் மற்றும் உள்ளூர் பயணம் விருப்பம்",
      hi: "एयरपोर्ट ट्रांसफर और लोकल यात्राएँ वैकल्पिक",
    },
    mealPlan: {
      en: "Usually breakfast; other meals as preferred",
      ta: "பொதுவாக காலை உணவு; மற்றவை விருப்பம்",
      hi: "आमतौर पर नाश्ता; अन्य भोजन पसंद अनुसार",
    },
    inclusions: {
      en: [
        "3 nights stay framework (area confirmed in quote)",
        "Suggested beach / leisure pacing",
        "Optional fort or market stops on request",
      ],
      ta: [
        "3 இரவு தங்கல் கட்டமைப்பு",
        "கடற்கரை / ஓய்வு வேகம்",
        "கோட்டை அல்லது சந்தை விருப்பம்",
      ],
      hi: [
        "3 रात ठहराव ढांचा",
        "बीच / फुरसत गति",
        "किला या बाज़ार विकल्प",
      ],
    },
    exclusions: {
      en: [
        "Flights unless added",
        "Water sports and personal expenses",
        "Items not in your confirmed quote",
      ],
      ta: ["விமானம் (சேர்க்காவிட்டால்)", "நீர் விளையாட்டுகள்", "மேற்கோளில் இல்லாதவை"],
      hi: ["उड़ानें (न जोड़ी हों तो)", "वाटर स्पोर्ट्स", "कोट में न हो तो"],
    },
    accommodationNote: {
      en: "North vs South Goa stay is chosen with you — we do not force a generic hotel list.",
      ta: "வடக்கு / தெற்கு கோவா தங்கல் உங்களுடன் தேர்வு.",
      hi: "उत्तर / दक्षिण गोवा ठहराव आपके साथ चुना जाता है।",
    },
    transportDetails: {
      en: ["Arrival transfer options", "Day hops as required"],
      ta: ["வருகை பரிமாற்றம்", "நாள் பயணங்கள் தேவைக்கு"],
      hi: ["आगमन ट्रांसफर", "दिन की यात्राएँ आवश्यकतानुसार"],
    },
    itinerary: [
      {
        day: 1,
        title: {
          en: "Arrive & beach evening",
          ta: "வருகை & கடற்கரை மாலை",
          hi: "आगमन और बीच शाम",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Check-in near your preferred beach belt; easy first evening.",
              ta: "விருப்ப கடற்கரை பகுதியில் செக்-இன்.",
              hi: "पसंदीदा बीच बेल्ट में चेक-इन।",
            },
          },
        ],
        overnight: { en: "Overnight in Goa", ta: "கோவாவில் இரவு", hi: "गोवा में रात्रि" },
      },
      {
        day: 2,
        title: {
          en: "Beach day + optional heritage",
          ta: "கடற்கரை நாள் + பாரம்பரியம்",
          hi: "बीच दिन + हेरिटेज",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Morning beach time; optional fort or chapel visit if you want culture balance.",
              ta: "காலை கடற்கரை; விருப்ப கோட்டை / தேவாலயம்.",
              hi: "सुबह बीच; वैकल्पिक किला / चैपल।",
            },
          },
        ],
        overnight: { en: "Overnight in Goa", ta: "கோவாவில் இரவு", hi: "गोवा में रात्रि" },
      },
      {
        day: 3,
        title: {
          en: "Leisure or market stroll",
          ta: "ஓய்வு அல்லது சந்தை",
          hi: "फुरसत या बाज़ार",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Free pacing — spa, markets, or a quieter beach stretch.",
              ta: "சுதந்திர வேகம் — சந்தை அல்லது அமைதியான கடற்கரை.",
              hi: "मुक्त गति — बाज़ार या शांत बीच।",
            },
          },
        ],
        overnight: { en: "Overnight in Goa", ta: "கோவாவில் இரவு", hi: "गोवा में रात्रि" },
      },
      {
        day: 4,
        title: {
          en: "Departure",
          ta: "புறப்பாடு",
          hi: "प्रस्थान",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Checkout and transfer to airport/station as quoted.",
              ta: "செக்அவுட் மற்றும் மேற்கோள் படி பரிமாற்றம்.",
              hi: "चेकआउट और कोट के अनुसार ट्रांसफर।",
            },
          },
        ],
      },
    ],
    faqs: [
      {
        question: {
          en: "North Goa or South Goa?",
          ta: "வடக்கு கோவாவா தெற்கு கோவாவா?",
          hi: "उत्तर गोवा या दक्षिण गोवा?",
        },
        answer: {
          en: "We help you choose after hearing whether you want busier beach belts or quieter stretches — the package is not locked to one strip.",
          ta: "பிஸியான அல்லது அமைதியான கடற்கரை தேர்வுக்கு உதவுகிறோம்.",
          hi: "व्यस्त या शांत बीच चुनने में मदद करते हैं।",
        },
      },
    ],
  }),

  "bali-4n5d-couple": enquireShell({
    suitableFor: {
      en: "Couples and honeymoon travellers (first Bali trip friendly)",
      ta: "ஜோடிகள் மற்றும் தேனிலவு பயணிகள்",
      hi: "जोड़े और हनीमून यात्री",
    },
    startingLocation: {
      en: "Denpasar (DPS) — flights planned after enquiry",
      ta: "டென்பசர் (DPS) — விமானம் விசாரணைக்குப் பிறகு",
      hi: "डेनपासर (DPS) — उड़ान पूछताछ के बाद",
    },
    destination: { en: "Bali, Indonesia", ta: "பாலி, இந்தோனேசியா", hi: "बाली, इंडोनेशिया" },
    hotelCategory: {
      en: "Ubud + coastal split or single-base — confirmed in quote",
      ta: "உபுட் + கடற்கரை பிரிவு அல்லது ஒரே தளம்",
      hi: "उबुद + तटीय विभाजन या एक बेस",
    },
    transportSummary: {
      en: "Private transfers between areas as quoted",
      ta: "பகுதிகளுக்கு இடையே தனியார் பரிமாற்றம்",
      hi: "क्षेत्रों के बीच निजी ट्रांसफर",
    },
    mealPlan: {
      en: "Breakfast commonly included; dinners as preferred",
      ta: "பொதுவாக காலை உணவு; இரவு உணவு விருப்பம்",
      hi: "आमतौर पर नाश्ता; रात्रि भोजन पसंद अनुसार",
    },
    inclusions: {
      en: [
        "4-night stay framework",
        "Suggested Ubud culture + beach balance",
        "Visa and flight guidance on request",
      ],
      ta: ["4 இரவு தங்கல்", "உபுட் + கடற்கரை சமநிலை", "விசா & விமான வழிகாட்டல்"],
      hi: ["4 रात ठहराव", "उबुद + बीच संतुलन", "वीज़ा व उड़ान मार्गदर्शन"],
    },
    exclusions: {
      en: [
        "International airfare until added to quote",
        "Visa fees paid to authorities",
        "Optional activities (rafting, boat days) unless quoted",
      ],
      ta: ["சர்வதேச விமானம்", "விசா கட்டணம்", "விருப்ப செயல்பாடுகள்"],
      hi: ["अंतरराष्ट्रीय उड़ान", "वीज़ा शुल्क", "वैकल्पिक गतिविधियाँ"],
    },
    accommodationNote: {
      en: "International hotels are quoted only after checking live availability for your dates.",
      ta: "உங்கள் தேதிகளுக்கு நேரடி கிடைக்கும் தன்மைக்குப் பிறகு ஹோட்டல் மேற்கோள்.",
      hi: "आपकी तिथियों की लाइव उपलब्धता के बाद होटल कोट।",
    },
    transportDetails: {
      en: ["Airport arrival transfer options", "Inter-area private car as needed"],
      ta: ["விமான நிலைய பரிமாற்றம்", "பகுதிகளுக்கு இடையே கார்"],
      hi: ["एयरपोर्ट ट्रांसफर", "क्षेत्रों के बीच कार"],
    },
    itinerary: [
      {
        day: 1,
        title: {
          en: "Arrive & settle",
          ta: "வருகை & அமைதல்",
          hi: "आगमन और सेटल",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Airport meet (if quoted), transfer to first base, easy evening.",
              ta: "விமான நிலைய சந்திப்பு (மேற்கோள் இருந்தால்), முதல் தளம்.",
              hi: "एयरपोर्ट मिलन (यदि कोट में), पहला बेस।",
            },
          },
        ],
        overnight: { en: "Overnight in Bali", ta: "பாலியில் இரவு", hi: "बाली में रात्रि" },
      },
      {
        day: 2,
        title: {
          en: "Ubud culture day",
          ta: "உபுட் கலாச்சார நாள்",
          hi: "उबुद संस्कृति दिन",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Rice terrace / temple culture pacing suitable for couples (exact sites in quote).",
              ta: "நெல் வயல் / கோயில் கலாச்சாரம் (தளங்கள் மேற்கோளில்).",
              hi: "राइस टेरेस / मंदिर संस्कृति (साइट कोट में)।",
            },
          },
        ],
        overnight: { en: "Overnight in Bali", ta: "பாலியில் இரவு", hi: "बाली में रात्रि" },
      },
      {
        day: 3,
        title: {
          en: "Coastal transfer & beach time",
          ta: "கடற்கரை பரிமாற்றம் & நேரம்",
          hi: "तटीय ट्रांसफर और बीच",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Move toward a coastal base if split-stay; otherwise a beach day trip.",
              ta: "பிரிவு தங்கல் என்றால் கடற்கரை தளம்; இல்லையெனில் நாள் பயணம்.",
              hi: "स्प्लिट स्टे हो तो तटीय बेस; नहीं तो डे ट्रिप।",
            },
          },
        ],
        overnight: { en: "Overnight in Bali", ta: "பாலியில் இரவு", hi: "बाली में रात्रि" },
      },
      {
        day: 4,
        title: {
          en: "Leisure & optional sunset point",
          ta: "ஓய்வு & விருப்ப சூரிய அஸ்தமனம்",
          hi: "फुरसत और वैकल्पिक सूर्यास्त",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Spa, beach, or a well-known sunset viewpoint if you request it in the quote.",
              ta: "ஸ்பா, கடற்கரை அல்லது சூரிய அஸ்தமன காட்சி.",
              hi: "स्पॉ, बीच या सूर्यास्त व्यू।",
            },
          },
        ],
        overnight: { en: "Overnight in Bali", ta: "பாலியில் இரவு", hi: "बाली में रात्रि" },
      },
      {
        day: 5,
        title: {
          en: "Departure",
          ta: "புறப்பாடு",
          hi: "प्रस्थान",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Checkout and airport transfer as confirmed.",
              ta: "செக்அவுட் மற்றும் விமான நிலைய பரிமாற்றம்.",
              hi: "चेकआउट और एयरपोर्ट ट्रांसफर।",
            },
          },
        ],
      },
    ],
    faqs: [
      {
        question: {
          en: "Do you include flights and visas?",
          ta: "விமானம் மற்றும் விசா சேர்க்கப்படுமா?",
          hi: "क्या उड़ान और वीज़ा शामिल हैं?",
        },
        answer: {
          en: "We can assist with both on request. Official visa fees and airline fares are never invented — they appear only in your verified quote.",
          ta: "கோரிக்கையின் பேரில் உதவலாம். அதிகாரப்பூர்வ கட்டணங்கள் மேற்கோளில் மட்டுமே.",
          hi: "अनुरोध पर सहायता। आधिकारिक शुल्क केवल कोट में।",
        },
      },
    ],
  }),

  "madurai-2n3d-temple": enquireShell({
    suitableFor: {
      en: "Pilgrims, heritage travellers, and families",
      ta: "யாத்திரிகர்கள், பாரம்பரிய பயணிகள், குடும்பங்கள்",
      hi: "तीर्थयात्री, हेरिटेज यात्री, परिवार",
    },
    startingLocation: {
      en: "Madurai airport / railway",
      ta: "மதுரை விமான நிலையம் / ரயில்",
      hi: "मदुरै एयरपोर्ट / रेलवे",
    },
    destination: { en: "Madurai", ta: "மதுரை", hi: "मदुरै" },
    hotelCategory: {
      en: "City stay near temple / central areas — confirmed after enquiry",
      ta: "கோயில் / நகர மைய தங்கல் — விசாரணைக்குப் பிறகு",
      hi: "मंदिर / सिटी सेंटर ठहराव — पूछताछ के बाद",
    },
    transportSummary: {
      en: "Local transfers and optional day trips (e.g. Rameswaram) on request",
      ta: "உள்ளூர் பரிமாற்றம்; ராமேஸ்வரம் போன்ற நாள் பயணம் விருப்பம்",
      hi: "लोकल ट्रांसफर; रामेश्वरम जैसे डे ट्रिप वैकल्पिक",
    },
    mealPlan: {
      en: "Breakfast common; temple-area vegetarian meals easy to arrange",
      ta: "காலை உணவு பொதுவானது; கோயில் பகுதி சைவம் எளிது",
      hi: "नाश्ता सामान्य; मंदिर क्षेत्र शाकाहारी आसान",
    },
    inclusions: {
      en: [
        "2 nights Madurai stay framework",
        "Meenakshi Temple visit planning notes",
        "Optional heritage stops on request",
      ],
      ta: ["2 இரவு மதுரை", "மீனாட்சி பார்வை திட்டம்", "பாரம்பரிய நிறுத்தங்கள் விருப்பம்"],
      hi: ["2 रात मदुरै", "मीनाक्षी विजिट योजना", "हेरिटेज स्टॉप वैकल्पिक"],
    },
    exclusions: {
      en: ["Special darshan fees unless quoted", "Personal offerings", "Unquoted day trips"],
      ta: ["சிறப்பு தரிசன கட்டணம்", "தனிப்பட்ட காணிக்கை", "மேற்கோள் இல்லாத நாள் பயணம்"],
      hi: ["विशेष दर्शन शुल्क", "व्यक्तिगत भेंट", "बिना कोट डे ट्रिप"],
    },
    accommodationNote: {
      en: "We prefer stays that make early temple visits practical — exact property confirmed after dates.",
      ta: "அதிகாலை கோயில் வருகைக்கு ஏற்ற தங்கல் — தேதிக்குப் பிறகு உறுதி.",
      hi: "सुबह मंदिर के लिए व्यावहारिक ठहराव — तिथियों के बाद।",
    },
    transportDetails: {
      en: ["Station/airport pickup options", "In-city hops as needed"],
      ta: ["நிலையம்/விமான நிலையம் பிக்அப்", "நகர பயணங்கள்"],
      hi: ["स्टेशन/एयरपोर्ट पिकअप", "शहर यात्राएँ"],
    },
    itinerary: [
      {
        day: 1,
        title: {
          en: "Arrive & temple evening",
          ta: "வருகை & கோயில் மாலை",
          hi: "आगमन और मंदिर शाम",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Check-in; Meenakshi Temple visit with dress-code guidance.",
              ta: "செக்-இன்; உடை விதிகளுடன் மீனாட்சி பார்வை.",
              hi: "चेक-इन; ड्रेस कोड के साथ मीनाक्षी विजिट।",
            },
          },
        ],
        overnight: { en: "Overnight in Madurai", ta: "மதுரையில் இரவு", hi: "मदुरै में रात्रि" },
      },
      {
        day: 2,
        title: {
          en: "Heritage morning & local food",
          ta: "பாரம்பரிய காலை & உணவு",
          hi: "हेरिटेज सुबह और भोजन",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Palace / museum options and Madurai food stops as you prefer.",
              ta: "அரண்மனை / அருங்காட்சியகம் மற்றும் உணவு நிறுத்தங்கள்.",
              hi: "महल / संग्रहालय और भोजन स्टॉप।",
            },
          },
        ],
        overnight: { en: "Overnight in Madurai", ta: "மதுரையில் இரவு", hi: "मदुरै में रात्रि" },
      },
      {
        day: 3,
        title: {
          en: "Optional circuit or departure",
          ta: "விருப்ப சுற்று அல்லது புறப்பாடு",
          hi: "वैकल्पिक सर्किट या प्रस्थान",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Rameswaram / Kanyakumari add-on if quoted; otherwise departure.",
              ta: "ராமேஸ்வரம் / கன்னியாகுமரி விருப்பம்; இல்லையெனில் புறப்பாடு.",
              hi: "रामेश्वरम / कन्याकुमारी विकल्प; नहीं तो प्रस्थान।",
            },
          },
        ],
      },
    ],
    faqs: [
      {
        question: {
          en: "Can you add Rameswaram?",
          ta: "ராமேஸ்வரத்தை சேர்க்கலாமா?",
          hi: "क्या रामेश्वरम जोड़ सकते हैं?",
        },
        answer: {
          en: "Yes — as an enquiry add-on with realistic travel time. We will not invent same-day miracles that ignore road distance.",
          ta: "ஆம் — நடைமுறை பயண நேரத்துடன் விசாரணை சேர்ப்பு. சாலை தூரத்தைப் புறக்கணித்து ஒரே நாளில் முடிக்க மாட்டோம்.",
          hi: "हाँ — वास्तविक यात्रा समय के साथ पूछताछ ऐड-ऑन।",
        },
      },
    ],
  }),

  "delhi-agra-3n4d": enquireShell({
    suitableFor: {
      en: "First-time North India visitors, families, and heritage travellers",
      ta: "வட இந்தியா முதல் வருகை, குடும்பங்கள், பாரம்பரிய பயணிகள்",
      hi: "उत्तर भारत पहली यात्रा, परिवार, हेरिटेज यात्री",
    },
    startingLocation: {
      en: "Delhi (airport / railway) — Agra day by train or road",
      ta: "டெல்லி — ஆக்ரா நாள் ரயில் அல்லது சாலை",
      hi: "दिल्ली — आगरा दिन ट्रेन या सड़क",
    },
    destination: {
      en: "Delhi & Agra",
      ta: "டெல்லி & ஆக்ரா",
      hi: "दिल्ली और आगरा",
    },
    hotelCategory: {
      en: "Delhi nights + optional Agra night — confirmed after enquiry",
      ta: "டெல்லி இரவுகள் + விருப்ப ஆக்ரா இரவு",
      hi: "दिल्ली रातें + वैकल्पिक आगरा रात",
    },
    transportSummary: {
      en: "Intercity train or private car — chosen after enquiry",
      ta: "நகரங்களுக்கு இடையே ரயில் அல்லது கார்",
      hi: "इंटरसिटी ट्रेन या निजी कार",
    },
    mealPlan: {
      en: "Breakfast common; other meals flexible",
      ta: "காலை உணவு பொதுவானது",
      hi: "नाश्ता सामान्य",
    },
    inclusions: {
      en: [
        "3-night stay framework across Delhi (and Agra if split)",
        "Suggested heritage pacing for Old Delhi / New Delhi icons",
        "Dedicated Agra / Taj circuit day outline",
      ],
      ta: ["3 இரவு தங்கல் கட்டமைப்பு", "டெல்லி பாரம்பரிய வேகம்", "ஆக்ரா / தாஜ் நாள்"],
      hi: ["3 रात ठहराव ढांचा", "दिल्ली हेरिटेज गति", "आगरा / ताज दिन"],
    },
    exclusions: {
      en: [
        "Monument entry tickets unless quoted",
        "Flights into Delhi unless added",
        "Guide fees unless included in quote",
      ],
      ta: ["நினைவுச்சின்ன நுழைவு", "டெல்லி விமானம்", "வழிகாட்டி கட்டணம்"],
      hi: ["स्मारक प्रवेश", "दिल्ली उड़ान", "गाइड शुल्क"],
    },
    accommodationNote: {
      en: "Hotel areas are chosen for early Taj timing if you overnight in Agra — never promised until quoted.",
      ta: "ஆக்ரா இரவு இருந்தால் தாஜ் நேரத்திற்கு ஏற்ற பகுதி — மேற்கோளுக்குப் பிறகு.",
      hi: "आगरा रात हो तो ताज टाइमिंग के लिए एरिया — कोट के बाद।",
    },
    transportDetails: {
      en: ["Delhi local hops", "Delhi–Agra train or car as quoted"],
      ta: ["டெல்லி உள்ளூர்", "டெல்லி–ஆக்ரா ரயில்/கார்"],
      hi: ["दिल्ली लोकल", "दिल्ली–आगरा ट्रेन/कार"],
    },
    itinerary: [
      {
        day: 1,
        title: {
          en: "Arrive Delhi",
          ta: "டெல்லி வருகை",
          hi: "दिल्ली आगमन",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Check-in; light orientation (India Gate / local food as energy allows).",
              ta: "செக்-இன்; இலகுவான அறிமுகம்.",
              hi: "चेक-इन; हल्का ओरिएंटेशन।",
            },
          },
        ],
        overnight: { en: "Overnight in Delhi", ta: "டெல்லியில் இரவு", hi: "दिल्ली में रात्रि" },
      },
      {
        day: 2,
        title: {
          en: "Delhi heritage day",
          ta: "டெல்லி பாரம்பரிய நாள்",
          hi: "दिल्ली हेरिटेज दिन",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Old Delhi / major monuments pacing — exact list in your quote.",
              ta: "பழைய டெல்லி / முக்கிய நினைவுச்சின்னங்கள்.",
              hi: "पुरानी दिल्ली / प्रमुख स्मारक।",
            },
          },
        ],
        overnight: { en: "Overnight in Delhi", ta: "டெல்லியில் இரவு", hi: "दिल्ली में रात्रि" },
      },
      {
        day: 3,
        title: {
          en: "Agra & Taj circuit",
          ta: "ஆக்ரா & தாஜ் சுற்று",
          hi: "आगरा और ताज सर्किट",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Early Taj visit window; Agra Fort optional; return to Delhi or overnight Agra if quoted.",
              ta: "அதிகாலை தாஜ்; ஆக்ரா கோட்டை விருப்பம்.",
              hi: "सुबह ताज; आगरा किला वैकल्पिक।",
            },
          },
        ],
        overnight: {
          en: "Delhi or Agra (as quoted)",
          ta: "டெல்லி அல்லது ஆக்ரா (மேற்கோள் படி)",
          hi: "दिल्ली या आगरा (कोट के अनुसार)",
        },
      },
      {
        day: 4,
        title: {
          en: "Buffer morning & departure",
          ta: "காலை இடையகம் & புறப்பாடு",
          hi: "सुबह बफर और प्रस्थान",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Checkout and airport/station transfer.",
              ta: "செக்அவுட் மற்றும் பரிமாற்றம்.",
              hi: "चेकआउट और ट्रांसफर।",
            },
          },
        ],
      },
    ],
    faqs: [
      {
        question: {
          en: "Will you include Jaipur (Golden Triangle)?",
          ta: "ஜெய்ப்பூர் (கோல்டன் டிரையாங்கிள்) சேர்க்கப்படுமா?",
          hi: "क्या जयपुर (गोल्डन ट्रायंगल) शामिल होगा?",
        },
        answer: {
          en: "Yes as a separate enquiry extension — a proper Jaipur day needs realistic time, so we will not squeeze it into this 4-day outline without lengthening the trip.",
          ta: "தனியான நீட்டிப்பாக ஆம் — நேரத்தை புறக்கணித்து பிசைய மாட்டோம்.",
          hi: "अलग एक्सटेंशन के रूप में हाँ — समय अनदेखा कर नहीं ठूंसेंगे।",
        },
      },
    ],
  }),

  "ooty-2n3d-escape": enquireShell({
    suitableFor: {
      en: "Weekenders, families, and couples",
      ta: "வார இறுதி பயணிகள், குடும்பங்கள், ஜோடிகள்",
      hi: "वीकेंड यात्री, परिवार, जोड़े",
    },
    startingLocation: {
      en: "Coimbatore / Ooty local — confirmed after enquiry",
      ta: "கோயம்புத்தூர் / ஊட்டி — விசாரணைக்குப் பிறகு",
      hi: "कोयंबटूर / ऊटी — पूछताछ के बाद",
    },
    destination: { en: "Ooty (Udhagamandalam)", ta: "ஊட்டி", hi: "ऊटी" },
    hotelCategory: {
      en: "Hill-station stay category confirmed after enquiry",
      ta: "மலை விடுதி வகை — விசாரணைக்குப் பிறகு",
      hi: "हिल-स्टेशन ठहराव — पूछताछ के बाद",
    },
    transportSummary: {
      en: "Private vehicle for sightseeing as quoted",
      ta: "சுற்றுலாவுக்கு தனியார் வாகனம்",
      hi: "साइटसीइंग के लिए निजी वाहन",
    },
    mealPlan: {
      en: "Breakfast common; dinner optional in quote",
      ta: "காலை உணவு பொதுவானது",
      hi: "नाश्ता सामान्य",
    },
    inclusions: {
      en: [
        "2 nights Ooty stay framework",
        "Lake / garden / viewpoint pacing suggestions",
        "Trip coordination by Canaan",
      ],
      ta: ["2 இரவு ஊட்டி", "ஏரி / தோட்டம் / காட்சி வேகம்", "Canaan ஒருங்கிணைப்பு"],
      hi: ["2 रात ऊटी", "झील / गार्डन / व्यू गति", "Canaan समन्वय"],
    },
    exclusions: {
      en: ["Toy train tickets unless quoted", "Personal shopping", "Unquoted activities"],
      ta: ["டாய் ட்ரெய்ன் (மேற்கோள் இல்லையெனில்)", "ஷாப்பிங்", "மேற்கோள் இல்லாதவை"],
      hi: ["टॉय ट्रेन (बिना कोट)", "शॉपिंग", "बिना कोट गतिविधियाँ"],
    },
    accommodationNote: {
      en: "Peak-season Ooty fills fast — we only confirm properties after checking your dates.",
      ta: "உச்ச காலத்தில் விரைவில் நிரம்பும் — தேதிக்குப் பிறகு உறுதி.",
      hi: "पीक सीजन में जल्दी भरता है — तिथियों के बाद पुष्टि।",
    },
    transportDetails: {
      en: ["Arrival transfer options", "Local sightseeing vehicle"],
      ta: ["வருகை பரிமாற்றம்", "சுற்றுலா வாகனம்"],
      hi: ["आगमन ट्रांसफर", "साइटसीइंग वाहन"],
    },
    itinerary: [
      {
        day: 1,
        title: {
          en: "Arrive & lake evening",
          ta: "வருகை & ஏரி மாலை",
          hi: "आगमन और झील शाम",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Check-in; Ooty Lake / local stroll as energy allows.",
              ta: "செக்-இன்; ஊட்டி ஏரி நடை.",
              hi: "चेक-इन; ऊटी लेक वॉक।",
            },
          },
        ],
        overnight: { en: "Overnight in Ooty", ta: "ஊட்டியில் இரவு", hi: "ऊटी में रात्रि" },
      },
      {
        day: 2,
        title: {
          en: "Gardens & viewpoints",
          ta: "தோட்டங்கள் & காட்சிகள்",
          hi: "गार्डन और व्यू पॉइंट",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Botanical garden options and misty viewpoints — exact list in quote.",
              ta: "தாவரவியல் பூங்கா மற்றும் காட்சி முனைகள்.",
              hi: "बॉटनिकल गार्डन और व्यू पॉइंट।",
            },
          },
        ],
        overnight: { en: "Overnight in Ooty", ta: "ஊட்டியில் இரவு", hi: "ऊटी में रात्रि" },
      },
      {
        day: 3,
        title: {
          en: "Departure",
          ta: "புறப்பாடு",
          hi: "प्रस्थान",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Morning leisure and transfer as planned.",
              ta: "காலை ஓய்வு மற்றும் பரிமாற்றம்.",
              hi: "सुबह फुरसत और ट्रांसफर।",
            },
          },
        ],
      },
    ],
    faqs: [
      {
        question: {
          en: "Is the Nilgiri Mountain Railway included?",
          ta: "நீலகிரி மலை ரயில் சேர்க்கப்படுமா?",
          hi: "क्या नीलगिरी माउंटेन रेलवे शामिल है?",
        },
        answer: {
          en: "Only if seats are available and you ask us to include them in the quote. We never invent confirmed train berths.",
          ta: "இருக்கை கிடைத்து மேற்கோளில் சேர்த்தால் மட்டும்.",
          hi: "सीट उपलब्ध हो और कोट में जोड़ने को कहें तभी।",
        },
      },
    ],
  }),

  "darjeeling-tea-experience": enquireShell({
    suitableFor: {
      en: "Tea lovers and travellers who want a softer Darjeeling pace",
      ta: "தேயிலை ஆர்வலர்கள் மற்றும் மென்மையான டார்ஜீலிங் வேகம்",
      hi: "चाय प्रेमी और नरम दार्जिलिंग गति चाहने वाले",
    },
    startingLocation: {
      en: "NJP / Bagdogra — transfers planned after enquiry",
      ta: "NJP / பாக்டோக்ரா — விசாரணைக்குப் பிறகு",
      hi: "NJP / बागडोगरा — पूछताछ के बाद",
    },
    destination: { en: "Darjeeling", ta: "டார்ஜீலிங்", hi: "दार्जिलिंग" },
    hotelCategory: {
      en: "Tea-country or town stay — confirmed after enquiry",
      ta: "தேயிலை நாடு அல்லது நகர தங்கல்",
      hi: "चाय देश या टाउन ठहराव",
    },
    transportSummary: {
      en: "NJP transfers + local sightseeing vehicle as quoted",
      ta: "NJP பரிமாற்றம் + சுற்றுலா வாகனம்",
      hi: "NJP ट्रांसफर + साइटसीइंग वाहन",
    },
    mealPlan: {
      en: "Breakfast common; other meals as preferred",
      ta: "காலை உணவு பொதுவானது",
      hi: "नाश्ता सामान्य",
    },
    inclusions: {
      en: [
        "3-night Darjeeling framework with tea-estate emphasis",
        "Tiger Hill / Mall Road options",
        "Toy Train segment only if IRCTC seats can be secured",
      ],
      ta: ["தேயிலை முக்கியத்துவம் கொண்ட 3 இரவு", "டைகர் ஹில் / மால் ரோடு", "IRCTC இருக்கை இருந்தால் டாய் ட்ரெய்ன்"],
      hi: ["चाय जोर के साथ 3 रात", "टाइगर हिल / मॉल रोड", "IRCTC सीट हो तो टॉय ट्रेन"],
    },
    exclusions: {
      en: [
        "Published Mimbusty/Tabakoshi fixed rates (separate packages)",
        "Unconfirmed Toy Train seats",
        "Personal shopping",
      ],
      ta: ["வெளியிடப்பட்ட Mimbusty/Tabakoshi விலைகள்", "உறுதியற்ற டாய் ட்ரெய்ன்", "ஷாப்பிங்"],
      hi: ["प्रकाशित Mimbusty/Tabakoshi दरें", "अपुष्ट टॉय ट्रेन", "शॉपिंग"],
    },
    accommodationNote: {
      en: "Distinct from our published NJP–NJP tour hotels — stay style is chosen after your enquiry.",
      ta: "வெளியிடப்பட்ட NJP–NJP ஹோட்டல்களிலிருந்து வேறு — விசாரணைக்குப் பிறகு.",
      hi: "प्रकाशित NJP–NJP होटलों से अलग — पूछताछ के बाद।",
    },
    transportDetails: {
      en: ["NJP/Bagdogra pickup options", "Local Sumo/Innova class as available"],
      ta: ["NJP/Bagdogra பிக்அப்", "Sumo/Innova வகுப்பு கிடைக்கும்போது"],
      hi: ["NJP/Bagdogra पिकअप", "Sumo/Innova क्लास उपलब्धता पर"],
    },
    itinerary: [
      {
        day: 1,
        title: {
          en: "Arrive & settle in Darjeeling",
          ta: "வருகை & டார்ஜீலிங் அமைதல்",
          hi: "आगमन और दार्जिलिंग सेटल",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Transfer from NJP/Bagdogra; Mall Road evening if timing allows.",
              ta: "NJP/Bagdogra பரிமாற்றம்; நேரம் இருந்தால் மால் ரோடு.",
              hi: "NJP/Bagdogra ट्रांसफर; समय हो तो मॉल रोड।",
            },
          },
        ],
        overnight: {
          en: "Overnight in Darjeeling area",
          ta: "டார்ஜீலிங் பகுதியில் இரவு",
          hi: "दार्जिलिंग क्षेत्र में रात्रि",
        },
      },
      {
        day: 2,
        title: {
          en: "Tiger Hill & town sights",
          ta: "டைகர் ஹில் & நகர காட்சிகள்",
          hi: "टाइगर हिल और टाउन साइट्स",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Sunrise viewpoint attempt (weather dependent) and classic town stops.",
              ta: "சூரிய உதய காட்சி (வானிலை) மற்றும் நகர நிறுத்தங்கள்.",
              hi: "सूर्योदय व्यू (मौसम पर) और टाउन स्टॉप।",
            },
          },
        ],
        overnight: {
          en: "Overnight in Darjeeling area",
          ta: "டார்ஜீலிங் பகுதியில் இரவு",
          hi: "दार्जिलिंग क्षेत्र में रात्रि",
        },
      },
      {
        day: 3,
        title: {
          en: "Tea estate day",
          ta: "தேயிலை தோட்ட நாள்",
          hi: "चाय बागान दिन",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Tea garden visit / tasting where available; quieter ridge time.",
              ta: "தேயிலை தோட்ட பார்வை / ருசித்தல்; அமைதியான மலை நேரம்.",
              hi: "चाय बागान विजिट / टेस्टिंग; शांत रिज समय।",
            },
          },
        ],
        overnight: {
          en: "Overnight in Darjeeling area",
          ta: "டார்ஜீலிங் பகுதியில் இரவு",
          hi: "दार्जिलिंग क्षेत्र में रात्रि",
        },
      },
      {
        day: 4,
        title: {
          en: "Return to NJP",
          ta: "NJP திரும்புதல்",
          hi: "NJP वापसी",
        },
        parts: [
          {
            label: { en: "Focus", ta: "கவனம்", hi: "फोकस" },
            detail: {
              en: "Checkout and drop at NJP/Bagdogra as quoted.",
              ta: "செக்அவுட் மற்றும் NJP/Bagdogra டிராப்.",
              hi: "चेकआउट और NJP/Bagdogra ड्रॉप।",
            },
          },
        ],
      },
    ],
    faqs: [
      {
        question: {
          en: "How is this different from the published Darjeeling tours?",
          ta: "வெளியிடப்பட்ட டார்ஜீலிங் டூர்களிலிருந்து எப்படி வேறு?",
          hi: "प्रकाशित दार्जिलिंग टूर से कैसे अलग?",
        },
        answer: {
          en: "Published Mimbusty/Tabakoshi packages have fixed starting prices and set night bases. This tea-experience outline is fully enquiry-priced and can emphasise estate time differently.",
          ta: "வெளியிடப்பட்டவை நிலையான விலை; இது முழு விசாரணை விலை மற்றும் தேயிலை நேர முக்கியத்துவம்.",
          hi: "प्रकाशित पैकेजों की तय कीमतें हैं; यह पूर्ण पूछताछ मूल्य और चाय समय जोर।",
        },
      },
    ],
  }),
};
