import type { SeoLocale } from "@/lib/site-url";
import { EN_SHELL, type ShellMessages } from "./en-shell";

/** Client-safe shell translations (no fs). Server uses loadMessages(). */
const OVERRIDES: Partial<Record<SeoLocale, Partial<ShellMessages>>> = {
  hi: {
    home: "होम",
    services: "सेवाएँ",
    journal: "जर्नल",
    news: "समाचार",
    store: "स्टोर",
    tools: "टूल्स",
    network: "नेटवर्क",
    saas: "SaaS",
    hardware: "हार्डवेयर",
    discover: "खोजें",
    info: "जानकारी",
    contact: "संपर्क",
    search: "खोज",
    subscribe: "सदस्यता",
    readMore: "और पढ़ें",
    language: "भाषा",
  },
  ta: {
    home: "முகப்பு",
    services: "சேவைகள்",
    journal: "ஜர்னல்",
    news: "செய்திகள்",
    store: "கடை",
    tools: "கருவிகள்",
    network: "நெட்வொர்க்",
    saas: "SaaS",
    hardware: "வன்பொருள்",
    discover: "கண்டறி",
    info: "தகவல்",
    contact: "தொடர்பு",
    search: "தேடல்",
    subscribe: "சந்தா",
    readMore: "மேலும் படிக்க",
    language: "மொழி",
  },
  es: {
    services: "Servicios",
    journal: "Revista",
    news: "Noticias",
    store: "Tienda",
    tools: "Herramientas",
    network: "Red",
    hardware: "Hardware",
    discover: "Descubrir",
    info: "Info",
  },
  fr: {
    services: "Services",
    journal: "Journal",
    news: "Actualités",
    store: "Boutique",
    tools: "Outils",
    network: "Réseau",
    hardware: "Matériel",
    discover: "Découvrir",
    info: "Info",
  },
  de: {
    services: "Leistungen",
    journal: "Journal",
    news: "Nachrichten",
    store: "Shop",
    tools: "Tools",
    network: "Netzwerk",
    hardware: "Hardware",
    discover: "Entdecken",
    info: "Info",
  },
};

export function clientShellMessages(locale: SeoLocale): ShellMessages {
  return { ...EN_SHELL, ...OVERRIDES[locale] };
}
