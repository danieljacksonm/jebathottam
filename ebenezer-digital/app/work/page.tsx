import Image from "next/image";
import { AnimateSection, AnimateOne } from "../components/AnimateOnScroll";
import ScrollParallax from "../components/ScrollParallax";
import ClipReveal from "../components/ClipReveal";
import { IMG } from "@/lib/images";

const projects = [
  { title: "E-Commerce Product Data Migration", desc: "Migrated 2,000+ product listings from an old platform to a new store with clean categories and images.", type: "Data entry & admin" },
  { title: "Travel Agency Booking Portal", desc: "Custom portal for a small travel agency to manage flight and hotel bookings with client dashboards.", type: "Web development" },
  { title: "Restaurant Reservation System", desc: "PHP-based reservation and table management system with email confirmations.", type: "PHP / Laravel" },
  { title: "Lead Generation Landing Page", desc: "Single-page site for a consulting firm with form capture and thank-you flow; fast load and mobile.", type: "Landing page" },
  { title: "Document Conversion for Law Firm", desc: "Bulk conversion of scanned legal documents to searchable PDF and Word with consistent formatting.", type: "Document conversion" },
  { title: "Tour Itinerary & Booking Support", desc: "Ongoing support for a tour operator: itinerary updates, booking confirmations, and client communication.", type: "Travel & booking" },
];

export default function WorkPage() {
  return (
    <ScrollParallax>
      <section className="section-padding pt-[5.25rem] bg-[var(--bg-soft)] border-t border-[var(--border)]">
        <div className="section-reveal container-wide">
          <AnimateOne variant="from-right">
            <ClipReveal direction="right" delay={100}>
              <h1 className="headline-blur-in section-h2-reveal font-display text-3xl sm:text-4xl font-bold text-center lg:text-left mb-4">
                Our work
              </h1>
            </ClipReveal>
            <p className="section-sub-p text-[var(--text-muted)] text-center lg:text-left max-w-2xl mb-16">
              A selection of projects we have delivered. Each built or completed to the client’s requirements and timeline.
            </p>
          </AnimateOne>
          <AnimateSection variant="zoom-in" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <div key={project.title} className="aos-item card-dark card-work card-work-hover rounded-xl overflow-hidden border-l-4 border-l-[var(--accent)]">
                <div className="relative aspect-video w-full overflow-hidden img-reveal-wrap img-hover-overlay">
                  <Image
                    src={IMG.work[i]}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover card-work-img"
                  />
                </div>
                <div className="p-6">
                  <span className="work-type-badge badge-pop text-xs font-medium text-[var(--accent)] uppercase tracking-wider">{project.type}</span>
                  <h2 className="work-card-title-hover font-display text-lg font-semibold text-[var(--text)] mt-2 mb-3">{project.title}</h2>
                  <p className="work-card-desc card-desc-hover text-[var(--text-muted)] text-sm leading-relaxed">{project.desc}</p>
                </div>
              </div>
            ))}
          </AnimateSection>
        </div>
      </section>
    </ScrollParallax>
  );
}
