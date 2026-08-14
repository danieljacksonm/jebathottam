"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const journey = [
  {
    title: "CONTACT",
    objective: "Start with a clear ask.",
    activities: "Email or WhatsApp with what you need.",
    deliverables: "A first conversation, no commitment yet.",
  },
  {
    title: "DISCUSS",
    objective: "Understand the real goal.",
    activities: "Questions on format, timeline, and preferences.",
    deliverables: "A shared brief we can quote against.",
  },
  {
    title: "QUOTE",
    objective: "Agree before any work starts.",
    activities: "Clear price and delivery date.",
    deliverables: "Written terms you can plan around.",
  },
  {
    title: "BUILD",
    objective: "Do the work, stay visible.",
    activities: "Updates as we go. Immediate note if something changes.",
    deliverables: "Progress you can see, not surprises.",
  },
  {
    title: "DELIVER",
    objective: "Hand over, then stay available.",
    activities: "Final files, small revisions, ongoing support.",
    deliverables: "Work you can use, plus a team you can call again.",
  },
];

const stack = [
  { name: "Next.js", note: "Websites and product UIs" },
  { name: "React", note: "Interactive interfaces" },
  { name: "TypeScript", note: "Safer, clearer code" },
  { name: "Node.js", note: "APIs and services" },
  { name: "PHP", note: "Classic web backends" },
  { name: "Laravel", note: "Business applications" },
  { name: "MySQL", note: "Structured data" },
  { name: "GSAP", note: "Motion craft" },
  { name: "Three.js", note: "Selected 3D moments" },
];

const lab = [
  { title: "AI", body: "Eben AI on our own server — chat for the site, news, and products." },
  { title: "MOTION", body: "Scroll, type, and interface motion used with purpose, not noise." },
  { title: "AUTOMATION", body: "Admin, data, and booking support that keeps operations moving." },
  { title: "PROTOTYPES", body: "Fast product sketches before we commit to a full build." },
];

type Member = { id: string; name: string; role: string; photo?: string; bio?: string };

export default function StudioWorld() {
  const [team, setTeam] = useState<Member[]>([]);
  const [tech, setTech] = useState(stack[0].name);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setTeam(Array.isArray(data.team) ? data.team : []))
      .catch(() => setTeam([]));
  }, []);

  return (
    <>
      <section className="studio-marquee" aria-label="Capabilities">
        <p>
          DESIGN · DEVELOPMENT · TRAVEL DESKS · ADMIN SYSTEMS · AI · DIGITAL PRODUCTS · BRANDING · EXPERIENCES ·
          DESIGN · DEVELOPMENT · TRAVEL DESKS · ADMIN SYSTEMS · AI · DIGITAL PRODUCTS · BRANDING · EXPERIENCES ·
        </p>
      </section>

      <section className="relative overflow-hidden border-t border-[var(--st-line)] px-4 py-28 sm:px-8 lg:px-10">
        <p className="studio-kicker">Studio</p>
        <h2 className="studio-display mt-4 max-w-5xl text-5xl sm:text-8xl">
          WE TURN
          <br />
          COMPLEX IDEAS
          <br />
          INTO DIGITAL
          <br />
          PRODUCTS.
        </h2>
        <p className="mt-8 max-w-xl text-lg text-[var(--st-muted)]">
          Ebenezer Digital is a working studio — websites, systems, travel support, and AI.
          We keep communication plain, delivery on time, and the work useful.
        </p>
        <Link href="/why" className="mt-8 inline-block text-sm uppercase tracking-[0.16em] text-emerald-400" data-cursor="OPEN">
          Talk to our team →
        </Link>
      </section>

      <section id="platforms" className="relative overflow-hidden border-t border-[var(--st-line)] px-4 py-24 sm:px-8 lg:px-10">
        <p className="studio-kicker">Our products</p>
        <h2 className="studio-display mt-4 text-5xl sm:text-7xl">
          EVERYTHING
          <br />
          WE RUN.
        </h2>
        <p className="mt-4 max-w-xl text-[var(--st-muted)]">
          Same company. Open any product from here.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {[
            { href: "/blog/news", title: "NEWS", body: "World news desk — ebenezerdigital.info" },
            { href: "/blog", title: "JOURNAL", body: "Learning blog and articles" },
            { href: "/products", title: "STORE", body: "Digital products — ebenezerdigital.store" },
            { href: "/ai", title: "EBEN AI", body: "Chat on our own server" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border border-[var(--st-line)] bg-white/[0.03] p-8 hover:border-emerald-400/50"
              data-cursor="OPEN"
            >
              <h3 className="studio-display text-3xl">{item.title}</h3>
              <p className="mt-3 text-sm text-[var(--st-muted)]">{item.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="lab" className="relative overflow-hidden border-t border-[var(--st-line)] px-4 py-24 sm:px-8 lg:px-10">
        <p className="studio-kicker">Experiment</p>
        <h2 className="studio-display mt-4 text-5xl sm:text-7xl">THE DIGITAL LAB.</h2>
        <p className="mt-4 max-w-xl text-[var(--st-muted)]">
          Where we test the tools that later go into client work — AI, motion, and practical automation.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {lab.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="border border-[var(--st-line)] bg-white/[0.03] p-8 backdrop-blur-md"
            >
              <h3 className="studio-display text-3xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--st-muted)]">{item.body}</p>
            </motion.article>
          ))}
        </div>
        <Link href="/ai" className="mt-10 inline-block text-sm uppercase tracking-[0.16em] text-emerald-400" data-cursor="OPEN">
          Open Eben AI →
        </Link>
      </section>

      <section id="process" className="relative overflow-hidden border-t border-[var(--st-line)] px-4 py-24 sm:px-8 lg:px-10">
        <p className="studio-kicker">How we work</p>
        <h2 className="studio-display mt-4 text-5xl sm:text-7xl">A CLEAR PATH.</h2>
        <div className="mt-14 space-y-0">
          {journey.map((step, i) => (
            <article key={step.title} className="grid gap-4 border-t border-[var(--st-line)] py-10 md:grid-cols-[140px_1fr_1fr]">
              <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="studio-display text-4xl sm:text-5xl">{step.title}</h3>
              <div className="text-sm leading-relaxed text-[var(--st-muted)]">
                <p className="text-white">{step.objective}</p>
                <p className="mt-2">{step.activities}</p>
                <p className="mt-2">{step.deliverables}</p>
              </div>
            </article>
          ))}
        </div>
        <Link href="/process" className="mt-4 inline-block text-sm uppercase tracking-[0.16em] text-emerald-400">
          See how we build →
        </Link>
      </section>

      <section id="tech" className="relative overflow-hidden border-t border-[var(--st-line)] px-4 py-24 sm:px-8 lg:px-10">
        <p className="studio-kicker">Stack</p>
        <h2 className="studio-display mt-4 text-5xl sm:text-7xl">THE TOOLS WE USE.</h2>
        <p className="mt-4 max-w-xl text-[var(--st-muted)]">
          Real technologies from our work — not a logo wall of things we do not ship.
        </p>
        <div className="mt-12 flex flex-wrap gap-3">
          {stack.map((item) => (
            <button
              key={item.name}
              type="button"
              onMouseEnter={() => setTech(item.name)}
              onFocus={() => setTech(item.name)}
              className={`border px-5 py-3 text-sm ${
                tech === item.name ? "border-emerald-400 text-white" : "border-[var(--st-line)] text-white/40"
              }`}
              data-cursor="EXPLORE"
            >
              {item.name}
            </button>
          ))}
        </div>
        <p className="mt-8 max-w-md text-lg text-white">
          {stack.find((s) => s.name === tech)?.note}
        </p>
      </section>

      {team.length > 0 && (
        <section className="border-t border-[var(--st-line)] px-4 py-24 sm:px-8 lg:px-10">
          <p className="studio-kicker">People</p>
          <h2 className="studio-display mt-4 text-5xl sm:text-7xl">THE STUDIO.</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <article key={m.id} className="group overflow-hidden border border-[var(--st-line)]" data-cursor="OPEN">
                <div className="relative aspect-[3/4] bg-[#111]">
                  {m.photo ? (
                    <Image src={m.photo} alt={m.name} fill className="object-cover transition duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-end p-6 text-5xl text-white/20">{m.name.slice(0, 1)}</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl text-white">{m.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--st-muted)]">{m.role}</p>
                  {m.bio && <p className="mt-3 text-sm text-[var(--st-muted)]">{m.bio}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
