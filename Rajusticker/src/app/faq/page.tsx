import { FAQ } from "@/components/ui/FAQ";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

const FAQ_ITEMS = [
  {
    question: "What material are Raju Stickers wraps made from?",
    answer:
      "Premium PVC wrapping film at approximately 150 micron thickness with high-tack air-release adhesive for bubble-resistant installs.",
  },
  {
    question: "How do I apply the film?",
    answer:
      "Clean thoroughly, cut oversized panels, apply from the center outward with a squeegee, and use controlled heat on curves. Full chrome wraps are best left to professionals.",
  },
  {
    question: "Can I remove the wrap later?",
    answer:
      "Yes. Warm the film, peel at a low angle, and clean residual adhesive with a paint-safe remover. Healthy OEM paint is typically protected, not damaged, when removal is done correctly.",
  },
  {
    question: "How durable is the finish outdoors?",
    answer:
      "Films are designed with UV, scratch, and water resistance for road use. Longevity depends on climate, wash habits, and parking conditions.",
  },
  {
    question: "What sizes do you offer?",
    answer:
      "Full roll 1.52m × 18m, half roll 1.52m × 9m, and sample swatches. Custom text stickers are offered in small, medium, and large.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Most Indian orders ship within 3–7 business days. Orders above ₹15,000 qualify for free standard shipping.",
  },
  {
    question: "Can I order custom text stickers?",
    answer:
      "Yes. Use the Custom Stickers page to enter text, colour, size, quantity, and notes, then add to cart.",
  },
  {
    question: "What payment methods will you support?",
    answer:
      "Checkout is ready for Razorpay or Stripe. Until gateway credentials are connected, orders can be reserved without taking payment.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Unopened full rolls in original packaging may be eligible for return within 7 days. Cut film, installed film, and custom stickers are non-returnable. See the Returns page for details.",
  },
];

export const metadata = buildMetadata({
  title: "FAQ",
  description:
    "Answers about Raju Stickers materials, application, removal, durability, sizing, shipping, customization, payment, and returns.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <div className="container-x py-8 sm:py-12 max-w-3xl">
      <JsonLd data={faqJsonLd(FAQ_ITEMS)} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
      <FAQ items={FAQ_ITEMS} title="FAQ" />
    </div>
  );
}
