import { BUSINESS } from "@/lib/contact";

export type WhatsAppContext =
  | { type: "general" }
  | { type: "package"; packageName: string }
  | { type: "blog"; title?: string }
  | { type: "planTrip" }
  | { type: "contact" }
  | { type: "attraction"; name: string }
  | { type: "custom"; message: string };

export function whatsappMessage(ctx: WhatsAppContext): string {
  switch (ctx.type) {
    case "package":
      return `Hi Canaan Travel Hub, I am interested in the ${ctx.packageName} package. Please share availability and next steps.`;
    case "blog":
      return ctx.title
        ? `Hi Canaan Travel Hub, I have a question after reading “${ctx.title}” about Kodaikanal travel.`
        : `Hi Canaan Travel Hub, I have a question about your Kodaikanal travel guide.`;
    case "planTrip":
      return `Hi Canaan Travel Hub, I would like to plan a trip. Can you help with destinations, dates, and a suitable package?`;
    case "contact":
      return `Hi Canaan Travel Hub, I would like to get in touch about travel packages and planning.`;
    case "attraction":
      return `Hi Canaan Travel Hub, I am interested in visiting ${ctx.name} as part of a trip.`;
    case "custom":
      return ctx.message;
    default:
      return `Hi Canaan Travel Hub, I am interested in planning a trip with you.`;
  }
}

export function whatsappUrl(ctx: WhatsAppContext = { type: "general" }) {
  const text = encodeURIComponent(whatsappMessage(ctx));
  return `${BUSINESS.whatsappUrl}?text=${text}`;
}
