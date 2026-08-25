import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-url";
import { ContactForm } from "../ContactForm";
import { SITE_EMAIL, SITE_PHONE_DISPLAY, SITE_PHONE_TEL } from "@/lib/site-contact";

export const metadata: Metadata = pageMetadata({
  title: "Contact | Ebenezer Digital Information",
  description: "Send a message to Ebenezer Digital Information.",
  path: "/info/contact",
});

export default function InfoContactPage() {
  return (
    <section className="info-section" style={{ paddingTop: "4rem" }}>
      <p className="info-kicker">Contact</p>
      <h1 className="info-h2">Say hello</h1>
      <p className="info-lead">
        Tell us what you need. We keep this simple — name, email and message.
      </p>
      <ContactForm />
      <p style={{ marginTop: "1.5rem", color: "var(--info-muted)", fontSize: "0.95rem" }}>
        Or email{" "}
        <a href={`mailto:${SITE_EMAIL}`} style={{ color: "var(--info-accent)" }}>
          {SITE_EMAIL}
        </a>
        {" · "}
        <a href={SITE_PHONE_TEL} style={{ color: "var(--info-accent)" }}>
          {SITE_PHONE_DISPLAY}
        </a>
      </p>
    </section>
  );
}
