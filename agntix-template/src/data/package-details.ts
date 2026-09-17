import type { PackageId } from "@/data/packages";
import type { LocalizedString, LocalizedStringList } from "@/lib/content/types";

export type DayPart = {
  label: LocalizedString;
  detail: LocalizedString;
};

export type ItineraryDay = {
  day: number;
  title: LocalizedString;
  parts: DayPart[];
  overnight?: LocalizedString;
};

export type PackageDetails = {
  suitableFor: LocalizedString;
  startingLocation: LocalizedString;
  destination: LocalizedString;
  hotelCategory: LocalizedString;
  transportSummary: LocalizedString;
  mealPlan: LocalizedString;
  pricingAssumptions: LocalizedStringList;
  inclusions: LocalizedStringList;
  exclusions: LocalizedStringList;
  accommodationNote: LocalizedString;
  transportDetails: LocalizedStringList;
  cancellationPolicy: LocalizedString;
  paymentTerms: LocalizedString;
  itinerary: ItineraryDay[];
  faqs: { question: LocalizedString; answer: LocalizedString }[];
};

const OWNER_TODO_CANCEL: LocalizedString = {
  en: "Cancellation and refunds follow supplier rules and Canaan’s published Cancellation & Refund Policy. Ask Canaan before you pay any advance — see /cancellation.",
  ta: "ரத்து மற்றும் பணத்திரும்பல் சப்ளையர் விதிகள் மற்றும் Canaan Cancellation & Refund Policy-ஐப் பின்பற்றும். முன்பணத்திற்கு முன் கேளுங்கள் — /cancellation.",
  hi: "रद्दीकरण और रिफंड सप्लायर नियमों और Canaan की Cancellation & Refund Policy के अनुसार होते हैं। अग्रिम भुगतान से पहले पूछें — /cancellation।",
};

const OWNER_TODO_PAY: LocalizedString = {
  en: "Payment schedule and accepted methods are shared when you confirm the package. Do not transfer funds to unverified accounts.",
  ta: "பேக்கேஜ் உறுதிப்படுத்தும்போது பணம் செலுத்தும் அட்டவணை பகிரப்படும். சரிபார்க்கப்படாத கணக்குகளுக்கு பணம் அனுப்பாதீர்கள்.",
  hi: "पैकेज पुष्टि पर भुगतान अनुसूची साझा होती है। असत्यापित खातों में धन न भेजें।",
};

export const packageDetails: Record<PackageId, PackageDetails> = {
  "kodai-1n2d": {
    suitableFor: {
      en: "Couples, friends, and families (2, 4, or 6 guests — custom for larger groups)",
      ta: "ஜோடிகள், நண்பர்கள் மற்றும் குடும்பங்கள் (2, 4 அல்லது 6 — பெரிய குழுக்களுக்கு தனிப்பயன்)",
      hi: "जोड़े, मित्र और परिवार (2, 4 या 6 अतिथि — बड़े समूहों के लिए कस्टम)",
    },
    startingLocation: {
      en: "Kodaikanal (pickup / meeting point confirmed after enquiry)",
      ta: "கொடைக்கானல் (பிக்அப் விசாரணைக்குப் பிறகு உறுதி)",
      hi: "कोडाइकनाल (पिकअप पूछताछ के बाद पुष्टि)",
    },
    destination: {
      en: "Kodaikanal",
      ta: "கொடைக்கானல்",
      hi: "कोडाइकनाल",
    },
    hotelCategory: {
      en: "As per selected tier — Double Room, Junior Suite, or Family Unit",
      ta: "தேர்ந்த அடுக்குப்படி — டபுள் அறை, ஜூனியர் சூட் அல்லது குடும்ப யூனிட்",
      hi: "चयनित टियर के अनुसार — डबल रूम, जूनियर स्वीट या फ़ैमिली यूनिट",
    },
    transportSummary: {
      en: "Local sightseeing includes Valley Tour (1 day) as listed on the package",
      ta: "உள்ளூர் சுற்றுலாவில் Valley Tour (1 நாள்) சேர்க்கப்பட்டுள்ளது",
      hi: "स्थानीय साइटसीइंग में Valley Tour (1 दिन) शामिल",
    },
    mealPlan: {
      en: "Breakfast (1 day) and Dinner (1 day) included",
      ta: "காலை உணவு (1 நாள்) மற்றும் இரவு உணவு (1 நாள்) சேர்க்கப்பட்டுள்ளது",
      hi: "नाश्ता (1 दिन) और रात्रि भोजन (1 दिन) शामिल",
    },
    pricingAssumptions: {
      en: [
        "Prices are per person as published for each pax tier",
        "2 PAX: ₹2,999/person · 4 PAX: ₹1,999/person · 6 PAX: ₹1,799/person",
        "Larger groups: custom quote — contact Canaan for special rates",
        "Final confirmation may note seasonal or availability adjustments if any",
      ],
      ta: [
        "விலைகள் ஒவ்வொரு PAX அடுக்கிற்கும் ஒரு நபருக்கு",
        "2 PAX: ₹2,999 · 4 PAX: ₹1,999 · 6 PAX: ₹1,799",
        "பெரிய குழுக்கள்: தனிப்பயன் மேற்கோள்",
        "இறுதி உறுதிப்படுத்தலில் பருவ/கிடைப்பு மாற்றங்கள் இருந்தால் குறிப்பிடப்படும்",
      ],
      hi: [
        "कीमतें प्रत्येक PAX टियर के लिए प्रति व्यक्ति",
        "2 PAX: ₹2,999 · 4 PAX: ₹1,999 · 6 PAX: ₹1,799",
        "बड़े समूह: कस्टम कोटेशन",
        "अंतिम पुष्टि में सीजन/उपलब्धता बदलाव हो तो लिखा जाएगा",
      ],
    },
    inclusions: {
      en: [
        "1 Night Stay (room type as per selected pax package)",
        "Breakfast (1 Day)",
        "Dinner (1 Day)",
        "Valley Tour (1 Day)",
        "Complimentary Campfire",
      ],
      ta: [
        "1 இரவு தங்கல் (PAX பேக்கேஜ் அறை வகை)",
        "காலை உணவு (1 நாள்)",
        "இரவு உணவு (1 நாள்)",
        "Valley Tour (1 நாள்)",
        "இலவச கேம்ப்ஃபயர்",
      ],
      hi: [
        "1 रात ठहराव (चयनित PAX पैकेज का कमरा)",
        "नाश्ता (1 दिन)",
        "रात्रि भोजन (1 दिन)",
        "Valley Tour (1 दिन)",
        "मुफ़्त कैम्पफ़ायर",
      ],
    },
    exclusions: {
      en: [
        "Items not listed on this package",
        "Personal expenses and tips",
        "Long-distance travel to Kodaikanal (flights/trains available as digital support)",
      ],
      ta: [
        "இந்த பேக்கேஜில் பட்டியலிடப்படாதவை",
        "தனிப்பட்ட செலவுகள் மற்றும் டிப்ஸ்",
        "கொடைக்கானலுக்கு தொலைதூர பயணம் (டிஜிட்டல் ஆதரவாக விமானம்/ரயில்)",
      ],
      hi: [
        "इस पैकेज में सूचीबद्ध न हुई वस्तुएँ",
        "व्यक्तिगत खर्च और टिप",
        "कोडाइकनाल तक लंबी दूरी की यात्रा (डिजिटल सहायता के रूप में उड़ान/ट्रेन)",
      ],
    },
    accommodationNote: {
      en: "Stay type is fixed by tier: Double Room (2 adults), Junior Suite (4 adults), or Family Unit (6 guests). Exact property is confirmed at booking based on availability.",
      ta: "தங்கல் வகை அடுக்கால் நிர்ணயம்: டபுள் அறை (2), ஜூனியர் சூட் (4), அல்லது குடும்ப யூனிட் (6). சரியான சொத்து முன்பதிவில் கிடைப்பின்படி உறுதி.",
      hi: "ठहराव प्रकार टियर से तय: डबल रूम (2), जूनियर स्वीट (4), या फ़ैमिली यूनिट (6)। सटीक प्रॉपर्टी बुकिंग पर उपलब्धता के अनुसार पुष्टि।",
    },
    transportDetails: {
      en: [
        "Valley Tour (1 day) is included for local sightseeing",
        "Pickup and meeting points inside Kodaikanal are confirmed after enquiry",
      ],
      ta: [
        "உள்ளூர் சுற்றுலாவுக்கு Valley Tour (1 நாள்) சேர்க்கப்பட்டுள்ளது",
        "கொடைக்கானலுக்குள் பிக்அப்/சந்திப்பு விசாரணைக்குப் பிறகு உறுதி",
      ],
      hi: [
        "स्थानीय साइटसीइंग के लिए Valley Tour (1 दिन) शामिल",
        "कोडाइकनाल के अंदर पिकअप/मीटिंग पॉइंट पूछताछ के बाद तय",
      ],
    },
    cancellationPolicy: OWNER_TODO_CANCEL,
    paymentTerms: OWNER_TODO_PAY,
    itinerary: [
      {
        day: 1,
        title: {
          en: "Arrival, stay & valley tour",
          ta: "வரவு, தங்கல் & valley tour",
          hi: "आगमन, ठहराव और वैली टूर",
        },
        parts: [
          {
            label: { en: "Arrival", ta: "வரவு", hi: "आगमन" },
            detail: {
              en: "Check in to your selected room type (Double Room, Junior Suite, or Family Unit).",
              ta: "தேர்ந்த அறை வகையில் செக்-இன்.",
              hi: "चयनित कमरे में चेक-इन।",
            },
          },
          {
            label: { en: "Day", ta: "நாள்", hi: "दिन" },
            detail: {
              en: "Valley Tour (1 day) for local sightseeing.",
              ta: "உள்ளூர் சுற்றுலாவுக்கு Valley Tour (1 நாள்).",
              hi: "स्थानीय साइटसीइंग के लिए Valley Tour (1 दिन)।",
            },
          },
          {
            label: { en: "Evening", ta: "மாலை", hi: "शाम" },
            detail: {
              en: "Dinner included. Complimentary campfire.",
              ta: "இரவு உணவு சேர்க்கப்பட்டுள்ளது. இலவச கேம்ப்ஃபயர்.",
              hi: "रात्रि भोजन शामिल। मुफ़्त कैम्पफ़ायर।",
            },
          },
        ],
        overnight: {
          en: "Overnight in Kodaikanal (1 night stay)",
          ta: "கொடைக்கானலில் 1 இரவு தங்கல்",
          hi: "कोडाइकनाल में 1 रात ठहराव",
        },
      },
      {
        day: 2,
        title: {
          en: "Breakfast & departure",
          ta: "காலை உணவு & புறப்பாடு",
          hi: "नाश्ता और प्रस्थान",
        },
        parts: [
          {
            label: { en: "Morning", ta: "காலை", hi: "सुबह" },
            detail: {
              en: "Breakfast (1 day) included.",
              ta: "காலை உணவு (1 நாள்) சேர்க்கப்பட்டுள்ளது.",
              hi: "नाश्ता (1 दिन) शामिल।",
            },
          },
          {
            label: { en: "Checkout", ta: "செக்அவுட்", hi: "चेकआउट" },
            detail: {
              en: "Checkout after breakfast. Ask Canaan about longer custom stays or digital flight/hotel help.",
              ta: "காலை உணவுக்குப் பிறகு செக்அவுட். நீண்ட தனிப்பயன் தங்கல் அல்லது டிஜிட்டல் விமான/ஹோட்டல் உதவி கேளுங்கள்.",
              hi: "नाश्ते के बाद चेकआउट। लंबा कस्टम ठहराव या डिजिटल उड़ान/होटल मदद पूछें।",
            },
          },
        ],
      },
    ],
    faqs: [
      {
        question: {
          en: "What is included in every tier?",
          ta: "ஒவ்வொரு அடுக்கிலும் என்ன சேர்க்கப்பட்டுள்ளது?",
          hi: "हर टियर में क्या शामिल है?",
        },
        answer: {
          en: "1 night stay, breakfast (1 day), dinner (1 day), valley tour (1 day), and a complimentary campfire. Room type changes by pax package.",
          ta: "1 இரவு தங்கல், காலை உணவு (1 நாள்), இரவு உணவு (1 நாள்), valley tour (1 நாள்), இலவச கேம்ப்ஃபயர். அறை வகை PAX பேக்கேஜ் அடிப்படையில் மாறும்.",
          hi: "1 रात ठहराव, नाश्ता (1 दिन), रात्रि भोजन (1 दिन), वैली टूर (1 दिन) और मुफ़्त कैम्पफ़ायर। कमरा प्रकार PAX पैकेज से बदलता है।",
        },
      },
      {
        question: {
          en: "Can we book for more than 6 guests?",
          ta: "6 பேருக்கு மேல் முன்பதிவு செய்யலாமா?",
          hi: "क्या 6 से अधिक अतिथियों के लिए बुक कर सकते हैं?",
        },
        answer: {
          en: "Yes. Custom packages are available for larger groups — contact Canaan for special group rates.",
          ta: "ஆம். பெரிய குழுக்களுக்கு தனிப்பயன் பேக்கேஜ்கள் — சிறப்பு விலைக்கு Canaan-ஐ தொடர்பு கொள்ளுங்கள்.",
          hi: "हाँ। बड़े समूहों के लिए कस्टम पैकेज — विशेष दरों के लिए Canaan से संपर्क करें।",
        },
      },
      {
        question: {
          en: "Which price applies to my group?",
          ta: "எங்கள் குழுவுக்கு எந்த விலை?",
          hi: "हमारे समूह पर कौन सी कीमत लागू?",
        },
        answer: {
          en: "2 adults in a Double Room: ₹2,999 per person. 4 adults in a Junior Suite: ₹1,999 per person. 6 guests in a Family Unit: ₹1,799 per person.",
          ta: "2 பெரியவர்கள் டபுள் அறை: ₹2,999/நபர். 4 பெரியவர்கள் ஜூனியர் சூட்: ₹1,999/நபர். 6 விருந்தினர்கள் குடும்ப யூனிட்: ₹1,799/நபர்.",
          hi: "डबल रूम में 2 वयस्क: ₹2,999 प्रति व्यक्ति। जूनियर स्वीट में 4 वयस्क: ₹1,999। फ़ैमिली यूनिट में 6 अतिथि: ₹1,799।",
        },
      },
    ],
  },
};
