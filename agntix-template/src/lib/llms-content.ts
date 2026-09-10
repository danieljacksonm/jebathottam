import { BUSINESS } from "@/lib/contact";
import { SITE_URL } from "@/lib/seo";

/** Plain-text site summary for AI crawlers (llms.txt convention). */
export const LLMS_TXT = `# Canaan Travel Hub

> Kodaikanal tour packages and digital travel services from Tamil Nadu, India.

## What we offer

- **Kodaikanal packages**: Verified 1 Night / 2 Days package with 2 / 4 / 6 guest tiers (from INR 1,799 per person). Includes stay, breakfast, dinner, valley tour, and complimentary campfire. Custom rates for larger groups.
- **Worldwide tourism support**: Flight booking assistance, hotel stays, visa guidance, and custom tour planning for destinations beyond Kodaikanal.
- **Working hours**: ${BUSINESS.hoursDisplay}
- **Languages**: English, Tamil (ta), Hindi (hi) at ${SITE_URL}/en, /ta, /hi.

## Key pages

- Home: ${SITE_URL}/en
- Packages: ${SITE_URL}/en/packages
- Flagship package: ${SITE_URL}/en/packages/kodai-1n2d
- Plan your trip: ${SITE_URL}/en/plan-your-trip
- Kodaikanal guide: ${SITE_URL}/en/kodaikanal
- Digital services: ${SITE_URL}/en/services
- Blog: ${SITE_URL}/en/blog
- Enquire: ${SITE_URL}/en/enquire

## Contact

- Phone / WhatsApp: ${BUSINESS.phoneDisplay}
- Email: ${BUSINESS.emails.join(" · ")}
- Hours: ${BUSINESS.hoursDisplay}
- Website: ${SITE_URL}

## Sitemap

${SITE_URL}/sitemap.xml
`;
