import { BUSINESS } from "@/lib/contact";
import { SITE_URL } from "@/lib/seo";

/** Plain-text site summary for AI crawlers (llms.txt convention). */
export const LLMS_TXT = `# Canaan Travel Hub

> Verified Kodaikanal packages, plus enquiry-first travel planning for named destinations and tourist places. Each destination and place page uses a photograph of that place, not a shared stock image.

## What we offer

- **Kodaikanal packages**: Verified 1 Night / 2 Days package with 2 / 4 / 6 guest tiers (from INR 1,799 per person). Includes stay, breakfast, dinner, valley tour, and complimentary campfire. Custom rates for larger groups.
- **Place guides**: Each tourist place has its own page and articles. Photographs and page titles name that place (for example Maldives pages use Maldives photographs).
- **Worldwide tourism support**: Flight booking assistance, hotel stays, visa guidance, and custom tour planning. Published package prices exist only for verified India circuits.
- **Working hours**: ${BUSINESS.hoursDisplay}
- **Languages**: English, Tamil (ta), Hindi (hi) at ${SITE_URL}/en, /ta, /hi.

## Key pages

- Home: ${SITE_URL}/en
- Packages: ${SITE_URL}/en/packages
- Flagship package: ${SITE_URL}/en/packages/kodai-1n2d
- Plan your trip: ${SITE_URL}/en/plan-your-trip
- Kodaikanal guide: ${SITE_URL}/en/kodaikanal
- Digital services: ${SITE_URL}/en/services
- Destinations: ${SITE_URL}/en/destinations
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
