import Image from "next/image";
import { AnimateSection, AnimateOne } from "../components/AnimateOnScroll";
import ScrollParallax from "../components/ScrollParallax";
import { IMG } from "@/lib/images";

const products = [
  { name: "Data entry & admin solutions", desc: "Clean datasets, migrated catalogs, and organized records in your chosen format or system.", img: IMG.services.digital, alt: "Data and admin" },
  { name: "Web & app development", desc: "Websites, landing pages, booking portals, and web applications built to your specs.", img: IMG.services.web, alt: "Web development" },
  { name: "Travel & booking systems", desc: "Booking portals, itinerary tools, and reservation management for travel and hospitality.", img: IMG.services.travel, alt: "Travel and booking" },
  { name: "Document conversion", desc: "PDF to Word, image to text, bulk conversion with consistent formatting and quality checks.", img: IMG.services.other, alt: "Document services" },
  { name: "Virtual assistance packages", desc: "Ongoing admin support: email, scheduling, research, and form handling.", img: IMG.services.other, alt: "Virtual assistance" },
  { name: "Custom integrations", desc: "APIs, data feeds, and integrations that connect your tools and workflows.", img: IMG.services.web, alt: "Integrations" },
];

export default function ProductsPage() {
  return (
    <ScrollParallax>
      <section className="section-padding pt-[5.25rem] border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="section-reveal container-wide">
          <AnimateOne variant="from-left">
            <p className="section-intro-p text-[var(--accent)] font-display font-semibold text-sm uppercase tracking-widest mb-3">Our products</p>
            <h1 className="section-h2-reveal font-display text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
              What we deliver
            </h1>
            <p className="section-sub-p text-[var(--text-muted)] max-w-2xl mb-16">
              From ready-to-use solutions to custom builds—here are the types of products and deliverables we create for our clients.
            </p>
          </AnimateOne>
          <AnimateSection variant="slide-up-strong" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.name} className="aos-item card-dark card-service card-service-hover card-shine-bottom rounded-xl overflow-hidden border border-[var(--border)]">
                <div className="relative aspect-[4/3] img-hover-overlay">
                  <Image src={product.img} alt={product.alt} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" />
                </div>
                <div className="p-6">
                  <h2 className="service-card-title font-display font-semibold text-[var(--text)] mb-2">{product.name}</h2>
                  <p className="service-card-desc text-[var(--text-muted)] text-sm leading-relaxed">{product.desc}</p>
                </div>
              </div>
            ))}
          </AnimateSection>
        </div>
      </section>
    </ScrollParallax>
  );
}
