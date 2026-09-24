import { BUSINESS } from "@/lib/contact";
import { SITE_URL } from "@/lib/seo";

/** Plain-text site summary for AI crawlers (llms.txt convention). */
export const LLMS_TXT = `# Canaan Travel Hub

> Travel company offering verified packages where published, plus enquiry-based flights, train tickets, hotels, visa assistance, corporate travel, and custom trip planning. Destination and place pages use photographs that match the named place.

## What we offer

- **Verified packages**: Kodaikanal 1N/2D (from INR 1,799 pp for 6 guests) and Darjeeling 3N/4D plans (from INR 6,550 pp, NJP–NJP) with published itineraries.
- **Travel services (enquiry-based)**: Flight assistance, train ticket assistance (not Indian Railways), hotel booking help, visa document guidance (no approval guarantees), travel consulting, corporate travel.
- **Destinations & place guides**: Named destinations and tourist places with matching photography. Custom planning where packages are not yet published.
- **Working hours**: ${BUSINESS.hoursDisplay}
- **Languages**: English, Tamil (ta), Hindi (hi) at ${SITE_URL}/en, /ta, /hi.

## Key pages

- Home: ${SITE_URL}/en
- Destinations: ${SITE_URL}/en/destinations
- Packages: ${SITE_URL}/en/packages
- Travel services: ${SITE_URL}/en/services
- Train tickets: ${SITE_URL}/en/services/train-tickets
- Travel consulting: ${SITE_URL}/en/services/travel-consulting
- Flights: ${SITE_URL}/en/flights
- Hotels: ${SITE_URL}/en/hotels
- Visa: ${SITE_URL}/en/visa
- Corporate travel: ${SITE_URL}/en/corporate-travel
- Plan your trip: ${SITE_URL}/en/plan-your-trip
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
