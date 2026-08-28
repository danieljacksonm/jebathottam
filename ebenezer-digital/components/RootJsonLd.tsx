import { headers } from "next/headers";
import { SITE_EMAIL, SITE_PHONE_DISPLAY } from "@/lib/site-contact";
import { siteKindFromHost, SITE_URL } from "@/lib/site-url";

/** Studio-only Organization schema — other hosts define their own JSON-LD in section layouts. */
export function RootJsonLd() {
  const kind = siteKindFromHost(headers().get("host"));
  if (kind !== "studio") return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ebenezer Digital Services",
    url: SITE_URL,
    description:
      "Professional data entry, virtual assistance, travel booking support, and web development. Trusted by clients worldwide.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: SITE_EMAIL,
      telephone: SITE_PHONE_DISPLAY,
      availableLanguage: [
        "English",
        "Hindi",
        "Tamil",
        "Telugu",
        "Malayalam",
        "Kannada",
        "Bengali",
        "Marathi",
        "Gujarati",
        "Punjabi",
        "Urdu",
        "Spanish",
        "French",
        "Arabic",
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
