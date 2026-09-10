import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { BUSINESS } from "@/lib/contact";

export const SITE_NAME = BUSINESS.name;
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || BUSINESS.siteUrl
).replace(/\/$/, "");

export function localizedPath(locale: string, path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean === "/" ? "" : clean}`;
}

export function absoluteUrl(locale: string, path = "/") {
  return `${SITE_URL}${localizedPath(locale, path)}`;
}

export function languageAlternates(path = "/") {
  const languages: Record<string, string> = {
    "x-default": absoluteUrl(routing.defaultLocale, path),
  };
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(locale, path);
  }
  return languages;
}

type PageMetaInput = {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  absoluteTitle?: boolean;
};

export function pageMetadata({
  locale,
  path,
  title,
  description,
  image = "/brand/canaan-logo.jpeg",
  imageAlt = SITE_NAME,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  absoluteTitle = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(locale, path);
  const ogImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type,
      locale: locale === "ta" ? "ta_IN" : locale === "hi" ? "hi_IN" : "en_IN",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: ogImage, alt: imageAlt }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "TravelAgency", "LocalBusiness"],
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/canaan-logo.jpeg`,
    slogan: "Cross Borders. Discover Blessings.",
    email: [...BUSINESS.emails],
    telephone: BUSINESS.phoneE164,
    contactPoint: BUSINESS.emails.map((email) => ({
      "@type": "ContactPoint",
      telephone: BUSINESS.phoneE164,
      email,
      contactType: "customer service",
      availableLanguage: ["English", "Tamil", "Hindi"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    })),
    openingHours: BUSINESS.hoursSchema,
    inLanguage: ["en", "ta", "hi"],
    sameAs: [BUSINESS.facebook],
    areaServed: [
      {
        "@type": "TouristDestination",
        name: "Kodaikanal",
      },
      {
        "@type": "Country",
        name: "Worldwide",
      },
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "TouristTrip",
          name: "Kodaikanal tour packages",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Worldwide digital tourism services",
        },
      },
    ],
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ["en-IN", "ta-IN", "hi-IN"],
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function breadcrumbJsonLd(
  locale: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}

export function touristAttractionJsonLd(locale: string = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Kodaikanal",
    description:
      "Hill station in Tamil Nadu known for mist, pine forests, Kodai Lake, and unhurried highland travel.",
    url: absoluteUrl(locale, "/kodaikanal"),
    touristType: ["Family", "Couples", "Nature"],
    isAccessibleForFree: true,
  };
}

export function packageJsonLd(pkg: {
  name: string;
  description: string;
  image: string;
  priceFrom: number;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["Product", "TouristTrip"],
    name: pkg.name,
    description: pkg.description,
    image: pkg.image,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: pkg.priceFrom,
      // Starting / indicative price — not a live inventory claim
      availability: "https://schema.org/LimitedAvailability",
      url: pkg.url,
    },
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  image: string;
  url: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/canaan-logo.jpeg` },
    },
    mainEntityOfPage: article.url,
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}
