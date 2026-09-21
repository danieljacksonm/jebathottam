import type { SeoLocale } from "@/lib/site-url";
import enJson from "@/data/i18n/messages/en.json";
import taJson from "@/data/i18n/messages/ta.json";
import hiJson from "@/data/i18n/messages/hi.json";
import {
  EN_HOME,
  EN_STUDIO,
  EN_SITE_PAGES,
  type StudioSiteCopy,
} from "./page-messages";

type Bundle = {
  home?: Partial<StudioSiteCopy["home"]>;
  studio?: Partial<StudioSiteCopy["studio"]>;
  pages?: Partial<Omit<StudioSiteCopy, "home" | "studio">>;
};

const BUNDLES: Partial<Record<SeoLocale, Bundle>> = {
  en: enJson as Bundle,
  ta: taJson as Bundle,
  hi: hiJson as Bundle,
};

function mergeCopy(base: StudioSiteCopy, patch?: Bundle): StudioSiteCopy {
  if (!patch) return base;
  return {
    home: { ...base.home, ...patch.home },
    studio: { ...base.studio, ...patch.studio },
    common: { ...base.common, ...patch.pages?.common },
    stats: patch.pages?.stats?.length ? patch.pages.stats : base.stats,
    contact: { ...base.contact, ...patch.pages?.contact },
    portfolio: { ...base.portfolio, ...patch.pages?.portfolio },
    footer: { ...base.footer, ...patch.pages?.footer },
    work: { ...base.work, ...patch.pages?.work },
    process: { ...base.process, ...patch.pages?.process },
    why: { ...base.why, ...patch.pages?.why },
  };
}

const EN_BASE: StudioSiteCopy = mergeCopy(
  {
    home: EN_HOME,
    studio: EN_STUDIO,
    ...EN_SITE_PAGES,
  },
  enJson as Bundle
);

export function getStudioSiteCopy(locale: SeoLocale): StudioSiteCopy {
  if (locale === "en") return EN_BASE;
  return mergeCopy(EN_BASE, BUNDLES[locale]);
}
