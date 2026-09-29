import overlay from "@/data/i18n/page-ui.json";
import type { ShellMessages } from "./en-shell";
import type {
  CommonCopy,
  ContactCopy,
  FooterCopy,
  HomeMessages,
  PortfolioCopy,
  StudioMessages,
} from "./page-messages";
import { SEO_LOCALES, type SeoLocale } from "./seo-locales";

export type PageChrome = {
  home: string;
  news: string;
  journal: string;
  blog: string;
  guides: string;
  about: string;
  search: string;
  subscribe: string;
  menu: string;
  close: string;
  refresh: string;
  updating: string;
  live: string;
  searchJournal: string;
  searchNews: string;
  searchPlaceholder: string;
  newsletter: string;
  openMenu: string;
  closeMenu: string;
};

export type PageUi = {
  we: string;
  build: string;
  digital: string;
  experiences: string;
  kicker: string;
  metaTitle: string;
  metaDescription: string;
  sceneBuild: string;
  sceneDigital: string;
  sceneExperiences: string;
  subtextSuffix: string;
  ctaStart: string;
  ctaWork: string;
  ctaServices: string;
  stats: { value: string; label: string }[];
  shell: ShellMessages;
  studio: StudioMessages;
  common: Pick<
    CommonCopy,
    | "menu"
    | "close"
    | "ecosystem"
    | "letsTalk"
    | "all"
    | "ongoing"
    | "completed"
    | "web"
    | "travel"
    | "privacy"
    | "terms"
    | "rights"
    | "previous"
    | "continue"
    | "sending"
    | "sendProject"
    | "exploreServices"
  >;
  portfolio: Pick<PortfolioCopy, "kicker" | "titleLine1" | "titleLine2" | "titleLine3" | "intro">;
  contact: Pick<
    ContactCopy,
    | "kicker"
    | "titleLine1"
    | "titleLine2"
    | "titleLine3"
    | "intro"
    | "email"
    | "phone"
    | "whatsapp"
    | "location"
    | "locationValue"
    | "hours"
    | "hoursValue"
    | "optWeb"
    | "optData"
    | "optTravel"
    | "optOther"
    | "stepWord"
    | "stepService"
    | "stepBudget"
    | "stepMessage"
    | "stepDetails"
    | "messagePlaceholder"
    | "namePlaceholder"
    | "receivedKicker"
    | "receivedTitle"
    | "receivedBody"
    | "errorBody"
  >;
  sections: {
    services: string;
    whatWeDeliver: string;
    howWeWork: string;
    technology: string;
    faq: string;
    relatedLinks: string;
    contactUs: string;
    allServices: string;
    whoItIsFor: string;
    serviceNotFound: string;
  };
  chrome: PageChrome;
  cards: { title: string; description: string }[];
  footer: Pick<FooterCopy, "titleLine1" | "titleLine2" | "titleLine3" | "titleAccent">;
};

const DATA = overlay as Record<string, PageUi>;

export function hasPageUi(locale: string): boolean {
  return Boolean(DATA[locale]?.build && DATA[locale]?.shell?.services);
}

export function switcherLocales(): readonly SeoLocale[] {
  return SEO_LOCALES.filter(
    (code) => code === "en" || code === "ta" || code === "hi" || hasPageUi(code)
  );
}

export function pageUi(locale: string): PageUi | null {
  return hasPageUi(locale) ? DATA[locale] : null;
}

export function pageHome(locale: string): Partial<HomeMessages> | null {
  const ui = pageUi(locale);
  if (!ui) return null;
  return {
    we: ui.we,
    build: ui.build,
    digital: ui.digital,
    experiences: ui.experiences,
    kicker: ui.kicker,
    metaTitle: ui.metaTitle,
    metaDescription: ui.metaDescription,
    sceneBuild: ui.sceneBuild,
    sceneDigital: ui.sceneDigital,
    sceneExperiences: ui.sceneExperiences,
    subtextSuffix: ui.subtextSuffix,
    ctaStart: ui.ctaStart,
    ctaWork: ui.ctaWork,
    ctaServices: ui.ctaServices,
  };
}

export function pageChrome(locale: string): PageChrome | null {
  return pageUi(locale)?.chrome ?? null;
}

export function homepageCards(locale: string): { title: string; description: string }[] | null {
  const cards = pageUi(locale)?.cards;
  return cards?.length ? cards : null;
}

/** Studio copy patch. Curated en/ta/hi JSON is applied after this and wins. */
export function pageStudioPatch(locale: string): {
  home?: Partial<HomeMessages>;
  studio?: Partial<StudioMessages>;
  pages?: {
    common?: Partial<CommonCopy>;
    stats?: { value: string; label: string }[];
    contact?: Partial<ContactCopy>;
    portfolio?: Partial<PortfolioCopy>;
    footer?: Partial<FooterCopy>;
  };
} | null {
  const ui = pageUi(locale);
  if (!ui) return null;
  return {
    home: pageHome(locale) ?? undefined,
    studio: ui.studio,
    pages: {
      common: ui.common,
      stats: ui.stats,
      contact: ui.contact,
      portfolio: ui.portfolio,
      footer: ui.footer,
    },
  };
}
