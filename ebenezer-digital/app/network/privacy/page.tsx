import type { Metadata } from "next";
import { NETWORK_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for Ebenezer Digital Network free tools.",
  alternates: { canonical: `${NETWORK_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="nx-page py-10 max-w-2xl space-y-4 text-[var(--nx-ink-2)] leading-relaxed">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--nx-ink)]">Privacy</h1>
      <p>
        Most tools on Ebenezer Digital Network run in your browser. Text, JSON, images, and calculators are processed
        locally whenever possible. We do not require an account to use simple tools.
      </p>
      <p>
        Anonymous usage events (such as which tool was opened) may be stored locally in your browser for product
        improvement. We do not sell personal data.
      </p>
      <p>If a future tool requires a server upload, we will state that clearly on the tool page before you proceed.</p>
    </div>
  );
}
