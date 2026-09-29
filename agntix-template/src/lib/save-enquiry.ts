import { prisma } from "@/lib/prisma";
import { nextDocumentNumber } from "@/lib/document-numbers";
import { findOrCreateCustomer } from "@/lib/crm";

export type IncomingEnquiry = {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  country?: string;
  destination?: string;
  departureLocation?: string;
  packageSlug?: string;
  service?: string;
  travelType?: string;
  travelStartDate?: string;
  travelEndDate?: string;
  flexibleDates?: boolean;
  adults?: number;
  children?: number;
  infants?: number;
  budgetRange?: string;
  currency?: string;
  hotelPreference?: string;
  transportPreference?: string;
  specialRequirements?: string;
  message?: string;
  source?: string;
  sourcePage?: string;
  locale?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
};

function clip(value: string | undefined, max: number) {
  return (value || "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

export async function saveEnquiry(input: IncomingEnquiry) {
  const customer = await findOrCreateCustomer({
    name: input.name,
    email: input.email,
    phone: input.phone,
    whatsapp: input.whatsapp,
    country: input.country,
  });
  const referenceNumber = await nextDocumentNumber("ENQ");
  const enquiry = await prisma.enquiry.create({
    data: {
      referenceNumber,
      customerId: customer.id,
      customerName: clip(input.name, 80),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.replace(/\D/g, ""),
      whatsapp: (input.whatsapp || "").replace(/\D/g, ""),
      country: clip(input.country, 80),
      destination: clip(input.destination, 120),
      departureLocation: clip(input.departureLocation, 120),
      packageSlug: clip(input.packageSlug, 120),
      service: clip(input.service, 200),
      travelType: clip(input.travelType, 40),
      travelStartDate: clip(input.travelStartDate, 20),
      travelEndDate: clip(input.travelEndDate, 20),
      flexibleDates: Boolean(input.flexibleDates),
      adults: Math.max(1, Number(input.adults) || 1),
      children: Math.max(0, Number(input.children) || 0),
      infants: Math.max(0, Number(input.infants) || 0),
      budgetRange: clip(input.budgetRange, 80),
      currency: clip(input.currency, 8) || "INR",
      hotelPreference: clip(input.hotelPreference, 80),
      transportPreference: clip(input.transportPreference, 80),
      specialRequirements: clip(input.specialRequirements, 500),
      message: (input.message || "").trim().slice(0, 4000),
      source: clip(input.source, 40) || "Website",
      sourcePage: clip(input.sourcePage, 200),
      locale: clip(input.locale, 8) || "en",
      utmSource: clip(input.utmSource, 80),
      utmMedium: clip(input.utmMedium, 80),
      utmCampaign: clip(input.utmCampaign, 80),
      utmContent: clip(input.utmContent, 80),
      activities: {
        create: {
          kind: "status",
          body: "New enquiry received.",
        },
      },
    },
  });
  return enquiry;
}
