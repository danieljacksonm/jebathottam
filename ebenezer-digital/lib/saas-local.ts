const KEY = "eben-saas-v1";

export type DocType = "invoice" | "quote" | "credit";

export type SaasState = {
  shop: { name: string; phone: string; address: string; taxName: string; taxPct: number };
  customers: { id: string; name: string; phone: string; city: string }[];
  items: { id: string; name: string; sku: string; price: number; stock: number }[];
  docs: {
    id: string;
    type: DocType;
    number: string;
    date: string;
    customerId: string;
    lines: { name: string; qty: number; price: number }[];
    notes: string;
    status: "draft" | "paid" | "sent";
  }[];
  expenses: { id: string; date: string; label: string; amount: number }[];
};

const empty: SaasState = {
  shop: { name: "My Shop", phone: "", address: "", taxName: "GST", taxPct: 18 },
  customers: [],
  items: [],
  docs: [],
  expenses: [],
};

export function loadSaas(): SaasState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

export function saveSaas(state: SaasState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function nextNumber(docs: SaasState["docs"], type: DocType) {
  const prefix = type === "invoice" ? "INV" : type === "quote" ? "QT" : "CN";
  const n = docs.filter((d) => d.type === type).length + 1;
  return `${prefix}-${String(n).padStart(3, "0")}`;
}

export function docTotal(doc: SaasState["docs"][0], taxPct: number) {
  const sub = doc.lines.reduce((s, l) => s + l.qty * l.price, 0);
  const tax = sub * (taxPct / 100);
  return { sub, tax, total: sub + tax };
}
