import { Suspense } from "react";
import { AiStudio } from "./studio/AiStudio";
import { SiteLegalLinks } from "@/components/SiteLegalLinks";
import { SITE_EMAIL, SITE_PHONE_DISPLAY } from "@/lib/site-contact";

export default function AiPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="ai-os is-land grid min-h-screen place-items-center">
            Opening Eben AI…
          </div>
        }
      >
        <AiStudio />
      </Suspense>

      <footer className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:bottom-0 focus-within:left-0 focus-within:right-0 focus-within:z-50 focus-within:bg-black/90 focus-within:p-4">
        <SiteLegalLinks className="text-center text-xs text-white/70" linkClassName="hover:text-white" />
      </footer>

      <section className="sr-only">
        <p>Ask anything with Eben AI</p>
        <p>
          An intelligent space for thinking, creating and discovering. Hosted by
          Ebenezer Digital on our own open-source model.
        </p>
        <p>
          Contact Ebenezer Digital at {SITE_EMAIL} or {SITE_PHONE_DISPLAY}.
        </p>
        <h2>Ask</h2>
        <p>Write a question. Plan a trip. Draft a message. Think out loud.</p>
        <h2>Create</h2>
        <p>Shape outlines, websites, and writing without leaving the conversation.</p>
        <h2>Analyze</h2>
        <p>Drop a document or describe a problem. The assistant stays with the work.</p>
        <h2>Discover</h2>
        <p>Explore world news, store products, and billing help from the same calm space.</p>
      </section>
    </>
  );
}
