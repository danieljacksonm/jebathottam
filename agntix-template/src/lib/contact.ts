/** Public business contact — used across footer, contact page, and SEO schema. */
export const BUSINESS = {
  name: "Canaan Travel Hub",
  domain: "canaantravelhub.com",
  siteUrl: "https://canaantravelhub.com",
  phone: "7092771754",
  phoneDisplay: "+91 70927 71754",
  phoneE164: "+917092771754",
  /** Primary domain email */
  email: "managingdirector@canaantravelhub.com",
  /** Flyer / public booking email — both are in active use */
  emailAlt: "canaantravelhub@gmail.com",
  /** Both inboxes for display and enquiry notifications */
  emails: [
    "managingdirector@canaantravelhub.com",
    "canaantravelhub@gmail.com",
  ] as const,
  facebook: "https://www.facebook.com/share/14mvJi3ZWV8/",
  /** Instagram URL — TODO: owner must provide verified profile link */
  instagram: "" as string,
  whatsappUrl: "https://wa.me/917092771754",
  tagline: "Cross Borders. Discover Blessings.",
  /** Working hours confirmed by owner */
  hoursDisplay: "Monday–Saturday, 9:00 AM – 6:00 PM",
  hoursSchema: "Mo-Sa 09:00-18:00",
} as const;
