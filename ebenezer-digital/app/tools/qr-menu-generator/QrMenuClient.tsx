"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type MenuItem = { id: string; name: string; price: string; note: string };
type Category = { id: string; title: string; items: MenuItem[] };

const uid = () => Math.random().toString(36).slice(2, 9);

const defaultCats: Category[] = [
  {
    id: uid(),
    title: "Starters",
    items: [
      { id: uid(), name: "Soup of the day", price: "120", note: "" },
      { id: uid(), name: "Garden salad", price: "150", note: "Veg" },
    ],
  },
  {
    id: uid(),
    title: "Mains",
    items: [
      { id: uid(), name: "Grilled chicken", price: "280", note: "" },
      { id: uid(), name: "Veg thali", price: "220", note: "" },
    ],
  },
];

function encodeMenu(payload: { shop: string; phone: string; cats: Category[] }): string {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  } catch {
    return "";
  }
}

function decodeMenu(raw: string): { shop: string; phone: string; cats: Category[] } | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(raw)))) as {
      shop: string;
      phone: string;
      cats: Category[];
    };
  } catch {
    return null;
  }
}

export function QrMenuClient() {
  const [shop, setShop] = useState("Sunrise Cafe");
  const [phone, setPhone] = useState("");
  const [cats, setCats] = useState<Category[]>(defaultCats);
  const [currency, setCurrency] = useState("₹");
  const [viewOnly, setViewOnly] = useState<{ shop: string; phone: string; cats: Category[] } | null>(null);

  useEffect(() => {
    const view = new URLSearchParams(window.location.search).get("view");
    if (!view) return;
    const decoded = decodeMenu(view);
    if (decoded) setViewOnly(decoded);
  }, []);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const data = encodeMenu({ shop, phone, cats });
    return `${window.location.origin}/tools/qr-menu-generator?view=${data}`;
  }, [shop, phone, cats]);

  const qrSrc = shareUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}`
    : "";

  if (viewOnly) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">{viewOnly.shop}</h1>
        {viewOnly.phone ? <p className="mt-1 text-slate-600">{viewOnly.phone}</p> : null}
        <div className="mt-8 space-y-6">
          {viewOnly.cats.map((cat) => (
            <div key={cat.id}>
              <h2 className="border-b-2 border-slate-900 pb-1 text-lg font-semibold">{cat.title}</h2>
              <ul className="mt-2 space-y-2">
                {cat.items.map((it) => (
                  <li key={it.id} className="flex justify-between gap-3 border-b border-dotted border-slate-200 py-2">
                    <div>
                      <p className="font-medium">{it.name}</p>
                      {it.note ? <p className="text-sm text-slate-500">{it.note}</p> : null}
                    </div>
                    <p className="font-semibold">₹{it.price}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link href="/tools/qr-menu-generator" className="mt-8 inline-block text-sm text-amber-800 hover:underline">
          Create your own menu →
        </Link>
      </div>
    );
  }

  const addCategory = () =>
    setCats((c) => [...c, { id: uid(), title: "New category", items: [{ id: uid(), name: "Item", price: "0", note: "" }] }]);

  const printMenu = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${shop} Menu</title>
<style>
body{font-family:system-ui,sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem;color:#1a1a1a}
h1{margin:0 0 .25rem;font-size:1.75rem} .sub{color:#666;margin-bottom:1.5rem}
h2{border-bottom:2px solid #111;padding-bottom:.35rem;margin:1.5rem 0 .75rem;font-size:1.1rem}
.row{display:flex;justify-content:space-between;gap:1rem;padding:.35rem 0;border-bottom:1px dotted #ddd}
.note{color:#666;font-size:.85rem}
@media print{body{margin:0}}
</style></head><body>
<h1>${shop}</h1>
<p class="sub">${phone ? `Call / WhatsApp: ${phone}` : "Digital menu"}</p>
${cats
  .map(
    (cat) =>
      `<h2>${cat.title}</h2>` +
      cat.items
        .map(
          (it) =>
            `<div class="row"><div><strong>${it.name}</strong>${it.note ? `<div class="note">${it.note}</div>` : ""}</div><div>${currency}${it.price}</div></div>`
        )
        .join("")
  )
  .join("")}
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
          <p className="text-sm font-semibold text-amber-700">Free tool · Ebenezer Store</p>
          <h1 className="text-3xl font-bold text-slate-900">QR Menu Generator</h1>
          <p className="mt-1 text-slate-600">Build a digital menu, print it, and show a QR guests can scan.</p>
        </div>
        <Link href="/products/qr-menu-generator" className="text-sm font-medium text-amber-800 hover:underline">
          ← Product page
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm sm:col-span-2">
              Shop name
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={shop}
                onChange={(e) => setShop(e.target.value)}
              />
            </label>
            <label className="text-sm">
              Currency
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </label>
            <label className="text-sm sm:col-span-3">
              Phone / WhatsApp
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional"
              />
            </label>
          </div>

          {cats.map((cat, ci) => (
            <div key={cat.id} className="rounded-xl border border-slate-200 p-4">
              <input
                className="mb-3 w-full border-b border-slate-200 pb-1 text-lg font-semibold outline-none"
                value={cat.title}
                onChange={(e) => {
                  const next = [...cats];
                  next[ci] = { ...cat, title: e.target.value };
                  setCats(next);
                }}
              />
              <div className="space-y-2">
                {cat.items.map((item, ii) => (
                  <div key={item.id} className="grid gap-2 sm:grid-cols-[1.4fr_0.5fr_1fr]">
                    <input
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                      value={item.name}
                      onChange={(e) => {
                        const next = [...cats];
                        const items = [...cat.items];
                        items[ii] = { ...item, name: e.target.value };
                        next[ci] = { ...cat, items };
                        setCats(next);
                      }}
                      placeholder="Item name"
                    />
                    <input
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                      value={item.price}
                      onChange={(e) => {
                        const next = [...cats];
                        const items = [...cat.items];
                        items[ii] = { ...item, price: e.target.value };
                        next[ci] = { ...cat, items };
                        setCats(next);
                      }}
                      placeholder="Price"
                    />
                    <input
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                      value={item.note}
                      onChange={(e) => {
                        const next = [...cats];
                        const items = [...cat.items];
                        items[ii] = { ...item, note: e.target.value };
                        next[ci] = { ...cat, items };
                        setCats(next);
                      }}
                      placeholder="Note (veg, spicy…)"
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-3 text-sm font-medium text-amber-800"
                onClick={() => {
                  const next = [...cats];
                  next[ci] = {
                    ...cat,
                    items: [...cat.items, { id: uid(), name: "New item", price: "0", note: "" }],
                  };
                  setCats(next);
                }}
              >
                + Add item
              </button>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={addCategory} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium">
              + Category
            </button>
            <button
              type="button"
              onClick={printMenu}
              className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Print / Save PDF
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="font-semibold text-slate-900">QR for tables</h2>
          <p className="mt-1 text-sm text-slate-600">
            Guests scan this code to open your menu link. Print the QR and stick it on tables.
          </p>
          {qrSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrSrc} alt="Menu QR code" className="mx-auto mt-4 rounded-lg bg-white p-3" width={220} height={220} />
          ) : null}
          <p className="mt-3 break-all text-xs text-slate-500">{shareUrl || "Generating…"}</p>
          <button
            type="button"
            className="mt-3 text-sm font-medium text-amber-800"
            onClick={() => shareUrl && navigator.clipboard?.writeText(shareUrl)}
          >
            Copy menu link
          </button>
          <p className="mt-4 text-xs text-slate-500">
            Tip: very large menus make a long URL. Keep categories short, or host your HTML website template and point the QR there.
          </p>
        </div>
      </div>
    </div>
  );
}
