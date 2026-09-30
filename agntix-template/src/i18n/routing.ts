import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ta", "hi"],
  defaultLocale: "en",
  localePrefix: "always",
  // HTML hreflang from page metadata is the source of truth.
  // The middleware header was pointing x-default at "/" while pages use "/en".
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
