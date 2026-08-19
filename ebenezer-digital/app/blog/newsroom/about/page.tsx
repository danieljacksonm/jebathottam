import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "About E> Newsroom | Ebenezer World News",
  description:
    "About the E> Newsroom team, reporting scope, and how Ebenezer World News publishes global and India stories.",
  path: "/blog/newsroom/about",
});

export default function NewsroomAboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-emerald-400">E&gt; Newsroom</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">About our newsroom</h1>
      <p className="mt-6 text-base leading-8 text-neutral-300">
        E&gt; Newsroom is the world and India news desk from Ebenezer Digital. We publish clear,
        useful summaries for readers who want fast understanding without noisy headlines.
      </p>
      <div className="mt-8 space-y-4 text-neutral-300">
        <p>
          Coverage areas: world affairs, India, business, technology, climate, science, and sports.
        </p>
        <p>
          We use editorial checks for date, location, source clarity, and plain-language writing before
          publication.
        </p>
        <p>
          Contact: <a className="text-emerald-400 hover:underline" href="mailto:info@ebenezerdigital.com">info@ebenezerdigital.com</a>
        </p>
      </div>
    </main>
  );
}
