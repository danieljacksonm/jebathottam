import Image from "next/image";
import { AnimateSection, AnimateOne } from "../components/AnimateOnScroll";
import ScrollParallax from "../components/ScrollParallax";
import HorizontalScroll, { HorizontalScrollItem } from "../components/HorizontalScroll";
import { IMG } from "@/lib/images";

export default function ServicesPage() {
  return (
    <ScrollParallax>
      <section className="section-padding pt-[5.25rem] bg-[var(--bg-soft)] border-t border-[var(--border)]">
        <div className="section-reveal container-wide">
          <AnimateOne variant="from-right">
            <h1 className="font-display section-head heading-shine section-h2-reveal text-3xl sm:text-4xl font-bold text-center lg:text-left mb-4">
              What we do
            </h1>
            <p className="section-sub-p section-copy-reveal text-[var(--text-muted)] text-center lg:text-left max-w-2xl mb-20">
              From admin tasks to web development and travel support—a range of digital services tailored to your needs.
            </p>
          </AnimateOne>

          <AnimateSection variant="zoom-in" className="mb-16">
            <p className="section-intro-p hscroll-label-reveal text-[var(--text-muted)] text-sm mb-4">Swipe or drag to explore</p>
            <HorizontalScroll>
              {[
                { label: "Digital & admin", img: IMG.services.digital, alt: "Data and admin" },
                { label: "Travel & booking", img: IMG.services.travel, alt: "Travel" },
                { label: "Web & technical", img: IMG.services.web, alt: "Web development" },
                { label: "Other services", img: IMG.services.other, alt: "Online support" },
              ].map((item) => (
                <HorizontalScrollItem key={item.label}>
                  <div className="horizontal-scroll-card card-dark card-service card-service-hover rounded-xl overflow-hidden h-full">
                    <div className="relative aspect-[4/3] img-hover-overlay">
                      <Image src={item.img} alt={item.alt} fill sizes="380px" className="object-cover" />
                    </div>
                    <p className="hscroll-card-label p-4 font-display font-semibold text-[var(--text)] text-sm uppercase tracking-wider">
                      {item.label}
                    </p>
                  </div>
                </HorizontalScrollItem>
              ))}
            </HorizontalScroll>
          </AnimateSection>

          <div className="space-y-20">
            {[
              { category: "Digital & admin", img: IMG.services.digital, alt: "Data and admin work", items: [
                { title: "Data entry", desc: "Accurate, timely data entry from forms, spreadsheets, or documents into your preferred format or system." },
                { title: "Document conversion", desc: "Convert between PDF, Word, Excel, images—with care for layout and content." },
                { title: "Online form handling", desc: "Fill forms, submit applications, and manage form-based workflows on your behalf." },
                { title: "Virtual assistance", desc: "Email management, scheduling, research, and other administrative tasks handled remotely." },
              ]},
              { category: "Travel & booking", img: IMG.services.travel, alt: "Travel and booking", items: [
                { title: "Flight, bus & train booking", desc: "Assistance searching and booking flights, buses, and trains to your dates and preferences." },
                { title: "Tour planning support", desc: "Help with itinerary ideas, tour options, and activity bookings for your trips." },
                { title: "Reservation management", desc: "Hotel and other reservation support, changes, and follow-up so your plans stay organized." },
              ]},
              { category: "Web & technical", img: IMG.services.web, alt: "Web development and tech", items: [
                { title: "Website development", desc: "Custom websites to your requirements—from simple business sites to more complex solutions." },
                { title: "Landing pages", desc: "Conversion-focused landing pages for campaigns, products, or lead generation." },
                { title: "PHP & Laravel", desc: "Backend applications, APIs, and web apps built with PHP and Laravel." },
                { title: "Fixes & optimization", desc: "Bug fixes, speed improvements, and updates to keep your existing site running smoothly." },
              ]},
              { category: "Other online services", img: IMG.services.other, alt: "Online support and portals", items: [
                { title: "Account setup", desc: "Help creating and configuring online accounts, profiles, and dashboards." },
                { title: "Online portals", desc: "Support using portals, logins, and submitting information where you need an extra pair of hands." },
                { title: "Tech support for small business", desc: "Guidance and hands-on support for small business tools, websites, and basic tech tasks." },
              ]},
            ].map((block) => (
              <div key={block.category}>
                <AnimateSection variant="fade-up" className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                  <AnimateOne variant="fade-up">
                    <p className="service-cat-label text-[var(--accent)] font-display font-semibold text-sm uppercase tracking-widest">
                      {block.category}
                    </p>
                  </AnimateOne>
                  <div className="aos-item section-img-wrap relative w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-[var(--border)] shrink-0">
                    <Image src={block.img} alt={block.alt} fill sizes="192px" className="object-cover" />
                  </div>
                </AnimateSection>
                <AnimateSection variant={block.items.length === 4 ? "stagger-slow" : "fade-up"} className={`grid sm:grid-cols-2 gap-5 ${block.items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
                  {block.items.map((item) => (
                    <div key={item.title} className="aos-item card-dark card-service card-service-hover rounded-xl p-6">
                      <h2 className="service-card-title font-display font-semibold text-[var(--text)] mb-2">{item.title}</h2>
                      <p className="service-card-desc text-[var(--text-muted)] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </AnimateSection>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollParallax>
  );
}
