import type { SeoLocale } from "@/lib/site-url";
import {
  EN_HOME,
  EN_STUDIO,
  type HomeMessages,
  type StudioMessages,
} from "./page-messages";

const HOME_OVERRIDES: Partial<Record<SeoLocale, Partial<HomeMessages>>> = {
  ta: {
    kicker: "Ebenezer Digital Services",
    build: "கட்டமைக்கிறோம்",
    digital: "டிஜிட்டல்",
    experiences: "அனுபவங்கள்.",
    sceneBuild: "நேரத்துக்குள் வெளியாகும் வலைத்தளங்கள், அமைப்புகள் மற்றும் செயல்பாடுகள்.",
    sceneDigital: "தெளிவான குறியீடு, நம்பகமான வழங்கல், மக்கள் நம்பும் இடைமுகங்கள்.",
    sceneExperiences: "நம்பகமான துணை தேவைப்படும் வணிகங்களுக்கான டிஜிட்டல் வேலை.",
    subtextSuffix:
      "உலகம் முழுவதும் குழுக்களுக்கான வலை உருவாக்கம், இ-காமmerce, ஆட்டomation மற்றும் தொடர்ச்சியான ஆதரவு.",
    ctaStart: "திட்டத்தை தொடங்குங்கள் →",
    ctaWork: "எங்கள் பணியைப் பாருங்கள்",
    ctaServices: "எங்கள் சேவைகள்",
  },
  hi: {
    build: "बनाते हैं",
    digital: "डिजिटल",
    experiences: "अनुभव।",
    sceneBuild: "समय पर डिलीवर होने वाली वेबसाइट, सिस्टम और ऑपरेशन।",
    sceneDigital: "साफ कोड, भरोसेमंद डिलीवरी, और भरोसेमंद इंटरफेस।",
    sceneExperiences: "विश्वसनीय साझेदार की जरूरत वाले व्यवसायों के लिए डिजिटल काम।",
    subtextSuffix: "वैश्विक टीमों के लिए वेब डेवलपमेंट, ई-कॉमर्स, ऑटomation और सहायता।",
    ctaStart: "प्रोजेक्ट शुरू करें →",
    ctaWork: "हमारा काम देखें",
    ctaServices: "हमारी सेवाएँ",
  },
};

const STUDIO_OVERRIDES: Partial<Record<SeoLocale, Partial<StudioMessages>>> = {
  ta: {
    work: "பணிகள்",
    process: "செயல்முறை",
    about: "எங்களைப் பற்றி",
    whatWeDo: "நாம் என்ன செய்கிறோம்.",
    servicesIntro:
      "நிர்வாக பணிகள் முதல் வலை உருவாக்கம் மற்றும் பயண ஆதரவு வரை — உங்கள் தேவைக்கேற்ற டிஜிட்டல் சேவைகள்.",
    startProject: "திட்டத்தை தொடங்குங்கள் →",
  },
  hi: {
    work: "काम",
    process: "प्रक्रिया",
    about: "हमारे बारे में",
    whatWeDo: "हम क्या करते हैं।",
    servicesIntro:
      "एडमिन से वेब डेवलपमेंट और ट्रैवल सपोर्ट तक — आपकी जरूरत के अनुसार डिजिटल सेवाएँ।",
    startProject: "प्रोजेक्ट शुरू करें →",
  },
};

export function clientHomeMessages(locale: SeoLocale): HomeMessages {
  return { ...EN_HOME, ...HOME_OVERRIDES[locale] };
}

export function clientStudioMessages(locale: SeoLocale): StudioMessages {
  return { ...EN_STUDIO, ...STUDIO_OVERRIDES[locale] };
}
