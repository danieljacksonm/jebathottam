import { AnimateSection, AnimateOne } from "../components/AnimateOnScroll";
import ScrollParallax from "../components/ScrollParallax";

const items = [
  { client: "Retail Co.", project: "E-commerce product data migration", outcome: "2,000+ listings migrated; clean categories and images", type: "Data entry & admin" },
  { client: "Travel Agency", project: "Booking portal & client dashboards", outcome: "Custom portal live; flight and hotel booking managed in-house", type: "Web development" },
  { client: "Restaurant Group", project: "Reservation & table management system", outcome: "PHP-based system with email confirmations", type: "PHP / Laravel" },
  { client: "Consulting Firm", project: "Lead generation landing page", outcome: "Single-page site with form capture; fast load, mobile-ready", type: "Landing page" },
  { client: "Law Firm", project: "Document conversion (bulk)", outcome: "Scanned legal docs to searchable PDF and Word", type: "Document conversion" },
  { client: "Tour Operator", project: "Itinerary & booking support", outcome: "Ongoing itinerary updates, confirmations, client comms", type: "Travel & booking" },
  { client: "Startup", project: "Virtual assistance & form handling", outcome: "Ongoing admin and form-based workflows", type: "Virtual assistance" },
  { client: "SMB", project: "Website refresh & optimization", outcome: "Updated content, speed improvements, small fixes", type: "Web & technical" },
];

export default function CompletedProjectsPage() {
  return (
    <ScrollParallax>
      <section className="section-padding pt-[5.25rem] border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="section-reveal container-wide">
          <AnimateOne variant="from-right">
            <p className="section-intro-p text-[var(--accent)] font-display font-semibold text-sm uppercase tracking-widest mb-3">Portfolio</p>
            <h1 className="section-h2-reveal font-display text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
              Completed client projects
            </h1>
            <p className="section-sub-p text-[var(--text-muted)] max-w-2xl mb-16">
              A snapshot of recent deliveries across data entry, web development, travel support, and more.
            </p>
          </AnimateOne>
          <AnimateSection variant="stagger-slow" className="space-y-4">
            {items.map((item) => (
              <div key={`${item.client}-${item.project}`} className="aos-item card-dark rounded-xl p-6 sm:p-8 border border-[var(--border)] card-shine-bottom flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <div className="sm:min-w-[180px]">
                  <p className="font-display font-semibold text-[var(--text)]">{item.client}</p>
                  <p className="text-[var(--accent)] text-xs uppercase tracking-wider mt-0.5">{item.type}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--text)]">{item.project}</p>
                  <p className="text-[var(--text-muted)] text-sm mt-1">{item.outcome}</p>
                </div>
              </div>
            ))}
          </AnimateSection>
        </div>
      </section>
    </ScrollParallax>
  );
}
