import type { Metadata } from "next";
import Link from "next/link";
import { SiteContactLinks } from "@/components/SiteContactLinks";
import { SITE_EMAIL } from "@/lib/site-contact";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service | Ebenezer Digital Services",
  description: "Terms of service for Ebenezer Digital websites, products, and client work.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <Link href="/" className="text-slate-400 hover:text-white text-sm no-underline">← Back to home</Link>
        <h1 className="mt-6">Terms of Service</h1>
        <p>By using this website and our services, you agree to communicate respectfully and provide accurate information in inquiries and project requests.</p>
        <p>Service timelines and deliverables are agreed in writing before work begins. Payment terms are defined per project.</p>
        <p>
          Questions about these terms: email <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>, call, or WhatsApp.
        </p>
        <SiteContactLinks className="not-prose mt-6 text-sm text-slate-300" linkClassName="hover:text-white" />
        <p className="text-slate-400 text-sm">Last updated: July 2026</p>
      </div>
    </main>
  );
}
