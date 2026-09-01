import type { Metadata } from "next";
import ContactForm from "../components/ContactForm";
import { SITE_EMAIL, SITE_PHONE_DISPLAY, SITE_PHONE_TEL, SITE_WHATSAPP_URL } from "@/lib/site-contact";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Contact | Ebenezer Digital Services",
  description:
    "Email, WhatsApp, or send a project brief. Ebenezer Digital replies quickly with a clear quote and timeline.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="bg-[#070708] px-4 pb-24 pt-24 sm:pt-28 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
        <div className="min-w-0">
          <p className="studio-kicker">Contact</p>
          <h1 className="studio-display mt-4 text-[2.35rem] leading-[0.95] sm:text-5xl lg:text-7xl">
            LET’S BUILD
            <br />
            SOMETHING
            <br />
            EXCEPTIONAL.
          </h1>
          <p className="mt-6 max-w-xl text-[var(--st-muted)]">
            Send a message with your requirements and we will get back to you as soon as possible.
          </p>
          <div className="mt-10 space-y-5 text-sm">
            <p>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">Email</span>
              <a href={`mailto:${SITE_EMAIL}`} className="text-white">
                {SITE_EMAIL}
              </a>
            </p>
            <p>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">Phone / WhatsApp</span>
              <a href={SITE_PHONE_TEL} className="text-white">
                {SITE_PHONE_DISPLAY}
              </a>
              {" · "}
              <a href={SITE_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-400">
                WhatsApp
              </a>
            </p>
          </div>
        </div>
        <div className="relative z-10 border border-[var(--st-line)] bg-black/40 p-5 sm:p-8">
          <h2 className="font-serif text-3xl">Tell us about it.</h2>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
