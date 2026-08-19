import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-url";
import { SITE_EMAIL, SITE_PHONE_DISPLAY, SITE_PHONE_TEL, SITE_WHATSAPP_URL } from "@/lib/site-contact";

export const metadata: Metadata = pageMetadata({
  title: "Contact the newsroom | E> News",
  description:
    "Corrections, licensing, and press contact for Ebenezer World News. Editors reply on email, phone, and WhatsApp.",
  path: "/blog/newsroom/contact",
});

export default function NewsroomContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-emerald-400">E&gt; Newsroom</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Contact the desk</h1>
      <p className="mt-6 text-base leading-8 text-neutral-300">
        Use this page for corrections, source questions, and syndication. We publish a visible byline and
        timestamp on every story.
      </p>
      <ul className="mt-8 space-y-3 text-neutral-300">
        <li>
          Email:{" "}
          <a className="text-emerald-400 hover:underline" href={`mailto:${SITE_EMAIL}`}>
            {SITE_EMAIL}
          </a>
        </li>
        <li>
          Phone:{" "}
          <a className="text-emerald-400 hover:underline" href={SITE_PHONE_TEL}>
            {SITE_PHONE_DISPLAY}
          </a>
        </li>
        <li>
          WhatsApp:{" "}
          <a className="text-emerald-400 hover:underline" href={SITE_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            Message the desk
          </a>
        </li>
      </ul>
    </main>
  );
}
