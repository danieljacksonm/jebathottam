"use client";

import { useMemo, useState } from "react";
import { trackNetworkEvent } from "@/lib/network/analytics";
import {
  CopyButton,
  ErrorMsg,
  Field,
  GhostBtn,
  Panel,
  PrimaryBtn,
  Result,
  Toolbar,
  fmtNum,
} from "./tool-ui";

function parseNum(v: string): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function PercentageCalculator({ slug }: { slug: string }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [mode, setMode] = useState<"of" | "what" | "change">("of");
  const [out, setOut] = useState("");
  const [error, setError] = useState("");

  const calc = () => {
    const x = parseNum(a);
    const y = parseNum(b);
    if (x == null || y == null) {
      setError("Enter valid numbers.");
      setOut("");
      return;
    }
    setError("");
    let r = 0;
    if (mode === "of") r = (x / 100) * y;
    else if (mode === "what") {
      if (y === 0) {
        setError("Cannot divide by zero.");
        return;
      }
      r = (x / y) * 100;
    } else {
      if (x === 0) {
        setError("Base cannot be zero.");
        return;
      }
      r = ((y - x) / x) * 100;
    }
    setOut(fmtNum(r, 4));
    trackNetworkEvent("tool_complete", { tool: slug, action: mode });
  };

  return (
    <Panel>
      <Field label="Mode">
        <select className="nx-select" value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
          <option value="of">What is X% of Y</option>
          <option value="what">X is what % of Y</option>
          <option value="change">% change from X to Y</option>
        </select>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <Field label={mode === "of" ? "Percent (X)" : "Value X"}>
          <input className="nx-input" value={a} onChange={(e) => setA(e.target.value)} />
        </Field>
        <Field label={mode === "of" ? "Of (Y)" : "Value Y"}>
          <input className="nx-input" value={b} onChange={(e) => setB(e.target.value)} />
        </Field>
      </div>
      <Toolbar>
        <PrimaryBtn onClick={calc}>Calculate</PrimaryBtn>
        <CopyButton text={out} slug={slug} />
      </Toolbar>
      <ErrorMsg>{error}</ErrorMsg>
      {out ? <Result>{mode === "what" || mode === "change" ? `${out}%` : out}</Result> : null}
    </Panel>
  );
}

const GST_RATES = [0, 5, 12, 18, 28] as const;

export function GstCalculator({ slug }: { slug: string }) {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState<number>(18);
  const [inclusive, setInclusive] = useState(false);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const amt = parseNum(amount);
    if (amt == null || amt < 0) return null;
    const r = rate / 100;
    let base: number;
    let gst: number;
    if (inclusive) {
      base = amt / (1 + r);
      gst = amt - base;
    } else {
      base = amt;
      gst = amt * r;
    }
    const cgst = gst / 2;
    const sgst = gst / 2;
    const total = inclusive ? amt : base + gst;
    return { base, gst, cgst, sgst, total };
  }, [amount, rate, inclusive]);

  return (
    <Panel>
      <Field label="Amount (₹)">
        <input className="nx-input" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Field>
      <Field label="GST rate">
        <select className="nx-select" value={rate} onChange={(e) => setRate(Number(e.target.value))}>
          {GST_RATES.map((r) => (
            <option key={r} value={r}>
              {r}%
            </option>
          ))}
        </select>
      </Field>
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, fontSize: "0.9rem" }}>
        <input type="checkbox" checked={inclusive} onChange={(e) => setInclusive(e.target.checked)} />
        Amount includes GST
      </label>
      <Toolbar>
        <PrimaryBtn
          onClick={() => {
            if (!result) {
              setError("Enter a valid amount.");
              return;
            }
            setError("");
            trackNetworkEvent("tool_complete", { tool: slug, action: "calculate" });
          }}
        >
          Calculate
        </PrimaryBtn>
        <CopyButton
          text={
            result
              ? `Base: ${fmtNum(result.base)} | GST: ${fmtNum(result.gst)} | CGST: ${fmtNum(result.cgst)} | SGST: ${fmtNum(result.sgst)} | Total: ${fmtNum(result.total)}`
              : ""
          }
          slug={slug}
        />
      </Toolbar>
      <ErrorMsg>{error}</ErrorMsg>
      {result ? (
        <Result>
          Taxable: ₹{fmtNum(result.base)} · GST ({rate}%): ₹{fmtNum(result.gst)} · CGST: ₹{fmtNum(result.cgst)} ·
          SGST: ₹{fmtNum(result.sgst)} · Total: ₹{fmtNum(result.total)}
        </Result>
      ) : null}
    </Panel>
  );
}

function emiFormula(P: number, annualRate: number, months: number): number {
  if (months <= 0) return NaN;
  if (annualRate === 0) return P / months;
  const r = annualRate / 12 / 100;
  const pow = Math.pow(1 + r, months);
  return (P * r * pow) / (pow - 1);
}

export function EmiCalculator({ slug }: { slug: string }) {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("10");
  const [months, setMonths] = useState("12");
  const [error, setError] = useState("");
  const [emi, setEmi] = useState<number | null>(null);

  const calc = () => {
    const P = parseNum(principal);
    const R = parseNum(rate);
    const N = parseNum(months);
    if (P == null || R == null || N == null || P < 0 || R < 0 || N <= 0) {
      setError("Enter valid principal, rate, and tenure (months).");
      setEmi(null);
      return;
    }
    const e = emiFormula(P, R, N);
    if (!Number.isFinite(e)) {
      setError("Could not calculate EMI.");
      setEmi(null);
      return;
    }
    setEmi(e);
    setError("");
    trackNetworkEvent("tool_complete", { tool: slug, action: "calculate" });
  };

  const total = emi != null && parseNum(months) != null ? emi * (parseNum(months) as number) : null;
  const interest =
    total != null && parseNum(principal) != null ? total - (parseNum(principal) as number) : null;

  return (
    <Panel>
      <Field label="Principal (₹)">
        <input className="nx-input" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
      </Field>
      <Field label="Annual interest rate (%)">
        <input className="nx-input" value={rate} onChange={(e) => setRate(e.target.value)} />
      </Field>
      <Field label="Tenure (months)">
        <input className="nx-input" value={months} onChange={(e) => setMonths(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={calc}>Calculate</PrimaryBtn>
        <CopyButton text={emi != null ? fmtNum(emi) : ""} slug={slug} />
      </Toolbar>
      <ErrorMsg>{error}</ErrorMsg>
      {emi != null ? (
        <Result>
          EMI: ₹{fmtNum(emi)} · Total payable: ₹{fmtNum(total!)} · Interest: ₹{fmtNum(interest!)}
        </Result>
      ) : null}
    </Panel>
  );
}

export function DiscountCalculator({ slug }: { slug: string }) {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [error, setError] = useState("");

  const P = parseNum(price);
  const D = parseNum(discount);
  const valid = P != null && D != null && P >= 0 && D >= 0;
  const saved = valid ? (P! * D!) / 100 : null;
  const final = valid && saved != null ? P! - saved : null;

  return (
    <Panel>
      <Field label="Original price">
        <input className="nx-input" value={price} onChange={(e) => setPrice(e.target.value)} />
      </Field>
      <Field label="Discount %">
        <input className="nx-input" value={discount} onChange={(e) => setDiscount(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn
          onClick={() => {
            if (!valid) {
              setError("Enter valid price and discount.");
              return;
            }
            setError("");
            trackNetworkEvent("tool_complete", { tool: slug, action: "calculate" });
          }}
        >
          Calculate
        </PrimaryBtn>
        <CopyButton text={final != null ? fmtNum(final) : ""} slug={slug} />
      </Toolbar>
      <ErrorMsg>{error}</ErrorMsg>
      {final != null && saved != null ? (
        <Result>
          You save: {fmtNum(saved)} · Final price: {fmtNum(final)}
        </Result>
      ) : null}
    </Panel>
  );
}

export function AgeCalculator({ slug }: { slug: string }) {
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  const calc = () => {
    if (!dob) {
      setError("Pick a date of birth.");
      return;
    }
    const birth = new Date(dob);
    const now = new Date();
    if (Number.isNaN(birth.getTime()) || birth > now) {
      setError("Enter a valid past date.");
      setResult("");
      return;
    }
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) {
      months -= 1;
      const prev = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prev.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
    setResult(`${years} years, ${months} months, ${days} days (${totalDays} days total)`);
    setError("");
    trackNetworkEvent("tool_complete", { tool: slug, action: "calculate" });
  };

  return (
    <Panel>
      <Field label="Date of birth">
        <input className="nx-input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={calc}>Calculate</PrimaryBtn>
        <CopyButton text={result} slug={slug} />
      </Toolbar>
      <ErrorMsg>{error}</ErrorMsg>
      {result ? <Result>{result}</Result> : null}
    </Panel>
  );
}

export function LoanCalculator({ slug }: { slug: string }) {
  return <EmiCalculator slug={slug} />;
}

export function TimeCalculator({ slug }: { slug: string }) {
  const [h1, setH1] = useState("0");
  const [m1, setM1] = useState("0");
  const [s1, setS1] = useState("0");
  const [h2, setH2] = useState("0");
  const [m2, setM2] = useState("0");
  const [s2, setS2] = useState("0");
  const [op, setOp] = useState<"add" | "sub">("add");
  const [out, setOut] = useState("");
  const [error, setError] = useState("");

  const toSec = (h: string, m: string, s: string) => {
    const hh = parseNum(h);
    const mm = parseNum(m);
    const ss = parseNum(s);
    if (hh == null || mm == null || ss == null) return null;
    return hh * 3600 + mm * 60 + ss;
  };

  const calc = () => {
    const a = toSec(h1, m1, s1);
    const b = toSec(h2, m2, s2);
    if (a == null || b == null) {
      setError("Enter valid numbers.");
      return;
    }
    let t = op === "add" ? a + b : a - b;
    if (t < 0) {
      setError("Result would be negative.");
      setOut("");
      return;
    }
    const hh = Math.floor(t / 3600);
    t %= 3600;
    const mm = Math.floor(t / 60);
    const ss = t % 60;
    setOut(`${hh}h ${mm}m ${ss}s`);
    setError("");
    trackNetworkEvent("tool_complete", { tool: slug, action: op });
  };

  return (
    <Panel>
      <Field label="Time A (h / m / s)">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <input className="nx-input" value={h1} onChange={(e) => setH1(e.target.value)} />
          <input className="nx-input" value={m1} onChange={(e) => setM1(e.target.value)} />
          <input className="nx-input" value={s1} onChange={(e) => setS1(e.target.value)} />
        </div>
      </Field>
      <Field label="Operation">
        <select className="nx-select" value={op} onChange={(e) => setOp(e.target.value as typeof op)}>
          <option value="add">Add</option>
          <option value="sub">Subtract</option>
        </select>
      </Field>
      <Field label="Time B (h / m / s)">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <input className="nx-input" value={h2} onChange={(e) => setH2(e.target.value)} />
          <input className="nx-input" value={m2} onChange={(e) => setM2(e.target.value)} />
          <input className="nx-input" value={s2} onChange={(e) => setS2(e.target.value)} />
        </div>
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={calc}>Calculate</PrimaryBtn>
        <CopyButton text={out} slug={slug} />
      </Toolbar>
      <ErrorMsg>{error}</ErrorMsg>
      {out ? <Result>{out}</Result> : null}
    </Panel>
  );
}

const LENGTH: Record<string, number> = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.344,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,
};
const WEIGHT: Record<string, number> = {
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  lb: 0.45359237,
  oz: 0.028349523125,
};
const TEMP = ["C", "F", "K"] as const;

export function UnitConverter({ slug }: { slug: string }) {
  const [kind, setKind] = useState<"length" | "weight" | "temp">("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const [val, setVal] = useState("1");
  const [out, setOut] = useState("");
  const [error, setError] = useState("");

  const units =
    kind === "length" ? Object.keys(LENGTH) : kind === "weight" ? Object.keys(WEIGHT) : [...TEMP];

  const convert = () => {
    const n = parseNum(val);
    if (n == null) {
      setError("Enter a number.");
      setOut("");
      return;
    }
    setError("");
    if (kind === "temp") {
      let c = n;
      if (from === "F") c = ((n - 32) * 5) / 9;
      if (from === "K") c = n - 273.15;
      let r = c;
      if (to === "F") r = (c * 9) / 5 + 32;
      if (to === "K") r = c + 273.15;
      setOut(fmtNum(r, 6));
    } else {
      const table = kind === "length" ? LENGTH : WEIGHT;
      const meters = n * table[from];
      setOut(fmtNum(meters / table[to], 8));
    }
    trackNetworkEvent("tool_complete", { tool: slug, action: kind });
  };

  return (
    <Panel>
      <Field label="Type">
        <select
          className="nx-select"
          value={kind}
          onChange={(e) => {
            const k = e.target.value as typeof kind;
            setKind(k);
            if (k === "length") {
              setFrom("m");
              setTo("ft");
            } else if (k === "weight") {
              setFrom("kg");
              setTo("lb");
            } else {
              setFrom("C");
              setTo("F");
            }
          }}
        >
          <option value="length">Length</option>
          <option value="weight">Weight</option>
          <option value="temp">Temperature</option>
        </select>
      </Field>
      <Field label="Value">
        <input className="nx-input" value={val} onChange={(e) => setVal(e.target.value)} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <Field label="From">
          <select className="nx-select" value={from} onChange={(e) => setFrom(e.target.value)}>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
        <Field label="To">
          <select className="nx-select" value={to} onChange={(e) => setTo(e.target.value)}>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Toolbar>
        <PrimaryBtn onClick={convert}>Convert</PrimaryBtn>
        <CopyButton text={out} slug={slug} />
      </Toolbar>
      <ErrorMsg>{error}</ErrorMsg>
      {out ? (
        <Result>
          {val} {from} = {out} {to}
        </Result>
      ) : null}
    </Panel>
  );
}

export function InvoiceCalculator({ slug }: { slug: string }) {
  const [rows, setRows] = useState([{ desc: "Item 1", qty: "1", price: "100" }]);
  const [tax, setTax] = useState("18");

  const lines = rows.map((r) => {
    const q = parseNum(r.qty) ?? 0;
    const p = parseNum(r.price) ?? 0;
    return { ...r, line: q * p };
  });
  const sub = lines.reduce((s, l) => s + l.line, 0);
  const taxRate = parseNum(tax) ?? 0;
  const taxAmt = (sub * taxRate) / 100;
  const total = sub + taxAmt;

  return (
    <Panel>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
          <input
            className="nx-input"
            placeholder="Description"
            value={r.desc}
            onChange={(e) => {
              const next = [...rows];
              next[i] = { ...r, desc: e.target.value };
              setRows(next);
            }}
          />
          <input
            className="nx-input"
            placeholder="Qty"
            value={r.qty}
            onChange={(e) => {
              const next = [...rows];
              next[i] = { ...r, qty: e.target.value };
              setRows(next);
            }}
          />
          <input
            className="nx-input"
            placeholder="Price"
            value={r.price}
            onChange={(e) => {
              const next = [...rows];
              next[i] = { ...r, price: e.target.value };
              setRows(next);
            }}
          />
        </div>
      ))}
      <Toolbar>
        <GhostBtn onClick={() => setRows([...rows, { desc: `Item ${rows.length + 1}`, qty: "1", price: "0" }])}>
          Add line
        </GhostBtn>
        <PrimaryBtn onClick={() => trackNetworkEvent("tool_complete", { tool: slug, action: "calculate" })}>
          Calculate
        </PrimaryBtn>
        <CopyButton
          text={`Subtotal: ${fmtNum(sub)} | Tax: ${fmtNum(taxAmt)} | Total: ${fmtNum(total)}`}
          slug={slug}
        />
      </Toolbar>
      <Field label="Tax %">
        <input className="nx-input" value={tax} onChange={(e) => setTax(e.target.value)} />
      </Field>
      <Result>
        Subtotal: {fmtNum(sub)} · Tax: {fmtNum(taxAmt)} · Total: {fmtNum(total)}
      </Result>
    </Panel>
  );
}

export function ProfitMarginCalculator({ slug }: { slug: string }) {
  const [cost, setCost] = useState("");
  const [sell, setSell] = useState("");
  const [error, setError] = useState("");

  const c = parseNum(cost);
  const s = parseNum(sell);
  const profit = c != null && s != null ? s - c : null;
  const margin = profit != null && s != null && s !== 0 ? (profit / s) * 100 : null;
  const markup = profit != null && c != null && c !== 0 ? (profit / c) * 100 : null;

  return (
    <Panel>
      <Field label="Cost">
        <input className="nx-input" value={cost} onChange={(e) => setCost(e.target.value)} />
      </Field>
      <Field label="Selling price">
        <input className="nx-input" value={sell} onChange={(e) => setSell(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn
          onClick={() => {
            if (c == null || s == null) {
              setError("Enter valid cost and selling price.");
              return;
            }
            setError("");
            trackNetworkEvent("tool_complete", { tool: slug, action: "calculate" });
          }}
        >
          Calculate
        </PrimaryBtn>
        <CopyButton
          text={
            profit != null && margin != null && markup != null
              ? `Profit: ${fmtNum(profit)} | Margin: ${fmtNum(margin)}% | Markup: ${fmtNum(markup)}%`
              : ""
          }
          slug={slug}
        />
      </Toolbar>
      <ErrorMsg>{error}</ErrorMsg>
      {profit != null && margin != null && markup != null ? (
        <Result>
          Profit: {fmtNum(profit)} · Margin: {fmtNum(margin)}% · Markup: {fmtNum(markup)}%
        </Result>
      ) : null}
    </Panel>
  );
}
