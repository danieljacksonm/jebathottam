"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Deliverable = { id: string; title: string; detail: string };

const uid = () => Math.random().toString(36).slice(2, 9);

export function ProposalClient() {
  const [freelancer, setFreelancer] = useState("Alex Rivera · Freelance Designer");
  const [client, setClient] = useState("Acme Co.");
  const [project, setProject] = useState("Website redesign");
  const [summary, setSummary] = useState(
    "I will redesign your marketing website for clarity, mobile speed, and clearer enquiry calls-to-action."
  );
  const [timeline, setTimeline] = useState("3 weeks");
  const [price, setPrice] = useState("45000");
  const [currency, setCurrency] = useState("₹");
  const [terms, setTerms] = useState("50% advance to start. Balance on delivery. 2 revision rounds included.");
  const [items, setItems] = useState<Deliverable[]>([
    { id: uid(), title: "Discovery + sitemap", detail: "1 workshop call and page list" },
    { id: uid(), title: "Design + build", detail: "Up to 5 key pages, mobile-ready" },
    { id: uid(), title: "Handover", detail: "Source files + short training call" },
  ]);

  const money = useMemo(() => `${currency}${Number(price || 0).toLocaleString("en-IN")}`, [currency, price]);

  const printProposal = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Proposal – ${project}</title>
<style>
body{font-family:Georgia,serif;max-width:760px;margin:2rem auto;padding:0 1.25rem;color:#1a1a1a;line-height:1.5}
h1{font-size:1.8rem;margin:0 0 .35rem} .meta{color:#555;margin-bottom:1.5rem}
h2{font-size:1.05rem;margin:1.5rem 0 .5rem;border-bottom:1px solid #ddd;padding-bottom:.25rem}
ul{padding-left:1.1rem} .price{font-size:1.4rem;font-weight:700;margin:.75rem 0}
@media print{body{margin:0}}
</style></head><body>
<p>Project proposal</p>
<h1>${project}</h1>
<p class="meta">Prepared for <strong>${client}</strong><br>By ${freelancer}</p>
<h2>Summary</h2>
<p>${summary}</p>
<h2>Deliverables</h2>
<ul>${items.map((i) => `<li><strong>${i.title}</strong> — ${i.detail}</li>`).join("")}</ul>
<h2>Timeline</h2>
<p>${timeline}</p>
<h2>Investment</h2>
<p class="price">${money}</p>
<h2>Terms</h2>
<p>${terms}</p>
<script>window.onload=()=>window.print()</script>
</body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-sky-700">Free tool · Ebenezer Store</p>
          <h1 className="text-3xl font-bold text-slate-900">Freelance Proposal Generator</h1>
          <p className="mt-1 text-slate-600">Fill the form, print a clean client proposal. Not a tips PDF.</p>
        </div>
        <Link href="/products/proposal-generator" className="text-sm font-medium text-sky-800 hover:underline">
          ← Product page
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={(e) => e.preventDefault()}>
          <label className="block text-sm">
            Your name / studio
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={freelancer} onChange={(e) => setFreelancer(e.target.value)} />
          </label>
          <label className="block text-sm">
            Client
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={client} onChange={(e) => setClient(e.target.value)} />
          </label>
          <label className="block text-sm">
            Project title
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={project} onChange={(e) => setProject(e.target.value)} />
          </label>
          <label className="block text-sm">
            Summary
            <textarea className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />
          </label>
          <label className="block text-sm">
            Timeline
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={timeline} onChange={(e) => setTimeline(e.target.value)} />
          </label>
          <div className="grid grid-cols-[1fr_4fr] gap-2">
            <label className="block text-sm">
              Currency
              <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </label>
            <label className="block text-sm">
              Price
              <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Deliverables</p>
            {items.map((item, i) => (
              <div key={item.id} className="grid gap-2 sm:grid-cols-2">
                <input
                  className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                  value={item.title}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...item, title: e.target.value };
                    setItems(next);
                  }}
                />
                <input
                  className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                  value={item.detail}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...item, detail: e.target.value };
                    setItems(next);
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="text-sm font-medium text-sky-800"
              onClick={() => setItems((list) => [...list, { id: uid(), title: "New deliverable", detail: "" }])}
            >
              + Add deliverable
            </button>
          </div>
          <label className="block text-sm">
            Terms
            <textarea className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" rows={2} value={terms} onChange={(e) => setTerms(e.target.value)} />
          </label>
          <button type="button" onClick={printProposal} className="rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white">
            Print / Save PDF
          </button>
        </form>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Live preview</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{project}</h2>
          <p className="mt-1 text-sm text-slate-600">
            For <strong>{client}</strong> · by {freelancer}
          </p>
          <p className="mt-4 text-slate-700">{summary}</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {items.map((i) => (
              <li key={i.id}>
                <strong>{i.title}</strong> — {i.detail}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            Timeline: <strong>{timeline}</strong>
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{money}</p>
          <p className="mt-3 text-sm text-slate-600">{terms}</p>
        </article>
      </div>
    </div>
  );
}
