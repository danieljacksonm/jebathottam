'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { api } from '@/lib/api';
import { friendlyError, useI18n } from '@/lib/i18n';
import { Minus, Plus, Search, Trash2 } from 'lucide-react';
import clsx from 'clsx';

type Product = {
  id: string;
  name: string;
  price: number;
  gstRate: number;
  stock: number;
  unit: string;
  barcode?: string | null;
  sku?: string | null;
  category?: string | null;
};

type Customer = { id: string; name: string; phone?: string | null };

type Line = {
  productId: string;
  name: string;
  qty: number;
  price: number;
  gstRate: number;
  unit: string;
};

function isTypingField(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable) return true;
  if (tag !== 'INPUT') return false;
  const type = (el as HTMLInputElement).type;
  return type !== 'button' && type !== 'submit' && type !== 'checkbox';
}

export default function NewBillInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { t } = useI18n();
  const asQuote = search.get('type') === 'quote';
  const asCredit = search.get('type') === 'credit';

  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const [lines, setLines] = useState<Line[]>([]);
  const [paidAmount, setPaidAmount] = useState('');
  const [discount, setDiscount] = useState('0');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const paidRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    Promise.all([api<Product[]>('/products'), api<Customer[]>('/customers')])
      .then(([p, c]) => {
        setProducts(p);
        setCustomers(c);
      })
      .catch((e) => setError(friendlyError(e, t, 'err_load')));
    searchRef.current?.focus();
  }, [t]);

  useEffect(() => {
    if (paymentMode === 'credit') setPaidAmount('0');
  }, [paymentMode]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        (p.barcode || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q),
    );
  }, [products, query]);

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let tax = 0;
    for (const line of lines) {
      const base = line.qty * line.price;
      subtotal += base;
      tax += (base * line.gstRate) / 100;
    }
    const disc = Math.min(Number(discount) || 0, subtotal + tax);
    const beforeRound = Math.max(0, subtotal + tax - disc);
    const grand = Math.round(beforeRound);
    const roundOff = grand - beforeRound;
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      disc,
      roundOff: Math.round(roundOff * 100) / 100,
      grand,
      count: lines.reduce((s, l) => s + l.qty, 0),
    };
  }, [lines, discount]);

  const addProduct = useCallback((product: Product) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id);
      if (existing) {
        return prev.map((l) =>
          l.productId === product.id ? { ...l, qty: l.qty + 1 } : l,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          qty: 1,
          price: product.price,
          gstRate: product.gstRate,
          unit: product.unit || 'NOS',
        },
      ];
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setLines((prev) => prev.filter((l) => l.productId !== productId));
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.productId === productId ? { ...l, qty } : l)),
    );
  }, []);

  const changeLastQty = useCallback((delta: number) => {
    setLines((prev) => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      const nextQty = last.qty + delta;
      if (nextQty <= 0) return prev.slice(0, -1);
      return prev.map((l, i) => (i === prev.length - 1 ? { ...l, qty: nextQty } : l));
    });
  }, []);

  const removeLine = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const saveBill = useCallback(async () => {
    if (!lines.length) {
      setError(t('bill_needItem'));
      searchRef.current?.focus();
      return;
    }
    setLoading(true);
    setError('');
    try {
      const docType = asQuote ? 'quote' : asCredit ? 'credit_note' : 'invoice';
      const paid =
        docType !== 'invoice'
          ? 0
          : paidAmount.trim() === ''
            ? paymentMode === 'credit'
              ? 0
              : totals.grand
            : Number(paidAmount);

      const created = await api<{ id: string }>('/bills', {
        method: 'POST',
        body: JSON.stringify({
          customerId: customerId || undefined,
          notes: notes || undefined,
          paidAmount: paid,
          discount: Number(discount) || 0,
          paymentMode: asQuote || asCredit ? 'credit' : paymentMode,
          dueDate: dueDate || undefined,
          docType,
          items: lines.map((l) => ({
            productId: l.productId,
            name: l.name,
            qty: l.qty,
            price: l.price,
            gstRate: l.gstRate,
          })),
        }),
      });
      router.push(`/app/bills/${created.id}/print`);
    } catch (err) {
      setError(friendlyError(err, t, 'err_save'));
    } finally {
      setLoading(false);
    }
  }, [
    asCredit,
    asQuote,
    customerId,
    discount,
    dueDate,
    lines,
    notes,
    paidAmount,
    paymentMode,
    router,
    t,
    totals.grand,
  ]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'F1') {
        e.preventDefault();
        router.push('/app/help');
        return;
      }
      if (e.key === 'F2') {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }
      if (e.key === 'F8' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's')) {
        e.preventDefault();
        void saveBill();
        return;
      }
      if (e.key === 'F9') {
        e.preventDefault();
        setPaymentMode('cash');
        setPaidAmount(String(totals.grand));
        paidRef.current?.focus();
        return;
      }
      if (e.key === 'Escape') {
        setQuery('');
        searchRef.current?.focus();
        return;
      }

      const typing = isTypingField(e.target);
      const inSearch = e.target === searchRef.current;

      if (inSearch && e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)));
        return;
      }
      if (inSearch && e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
        return;
      }
      if (inSearch && e.key === 'Enter') {
        e.preventDefault();
        const item = filtered[highlight] || filtered[0];
        if (item) {
          addProduct(item);
          setQuery('');
          setHighlight(0);
        }
        return;
      }

      if (inSearch || (typing && !inSearch)) return;

      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        changeLastQty(1);
        return;
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        changeLastQty(-1);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [addProduct, changeLastQty, filtered, highlight, router, saveBill, totals.grand]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await saveBill();
  }

  const title = asQuote ? t('bill_quote') : asCredit ? t('bill_credit') : t('bill_title');
  const payModes = [
    { id: 'cash', label: t('bill_cash') },
    { id: 'upi', label: t('bill_upi') },
    { id: 'card', label: t('bill_card') },
    { id: 'credit', label: t('bill_later') },
  ];

  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-sub">{t('bill_sub')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!asQuote && (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => router.push('/app/bills/new?type=quote')}
            >
              {t('bill_quoteBtn')}
            </button>
          )}
          {!asCredit && (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => router.push('/app/bills/new?type=credit')}
            >
              {t('bill_returnBtn')}
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 hidden flex-wrap gap-2 lg:flex">
        {[
          ['F2', t('bill_keySearch')],
          ['Enter', t('bill_keyAdd')],
          ['+ / −', t('bill_keyQty')],
          ['F8', t('bill_keySave')],
          ['Esc', t('bill_keyClear')],
          ['F1', t('help')],
        ].map(([key, label]) => (
          <div
            key={key}
            className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-xs text-[var(--muted)]"
          >
            <span className="font-semibold text-[var(--forest)]">{key}</span> {label}
          </div>
        ))}
      </div>

      <form ref={formRef} onSubmit={onSubmit} className="grid gap-5 pb-28 xl:grid-cols-12 xl:pb-6">
        <section className="surface rounded-[28px] p-4 md:p-5 xl:col-span-7">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
            <input
              ref={searchRef}
              className="input !py-4 !pl-11 text-base"
              placeholder={t('bill_search')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              inputMode="search"
              aria-label={t('bill_search')}
            />
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">{t('bill_searchHint')}</p>

          <div className="mt-4 grid max-h-[58vh] gap-2 overflow-auto sm:grid-cols-2">
            {filtered.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  addProduct(p);
                  setQuery('');
                  searchRef.current?.focus();
                }}
                className={clsx(
                  'min-h-[88px] rounded-2xl border bg-white p-4 text-left transition',
                  idx === highlight
                    ? 'border-[var(--forest)] shadow-md ring-2 ring-[var(--forest)]/20'
                    : 'border-[var(--line)] hover:border-[var(--forest)] hover:shadow-sm',
                )}
              >
                <div className="font-semibold text-[var(--ink)]">{p.name}</div>
                {p.category && (
                  <div className="mt-1 text-[11px] text-[var(--brass)]">{p.category}</div>
                )}
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--forest)]">
                    Rs {p.price.toFixed(2)}
                  </span>
                  <span className="text-[var(--muted)]">
                    {t('bill_stock')} {p.stock} {p.unit}
                  </span>
                </div>
                <div className="mt-2 text-[11px] font-medium text-[var(--brass)]">
                  {t('bill_tapHint')}
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-[var(--line-strong)] p-8 text-center text-sm text-[var(--muted)]">
                {t('bill_noItems')}
              </div>
            )}
          </div>
        </section>

        <section className="xl:col-span-5">
          <div className="surface rounded-[28px] p-5 xl:sticky xl:top-24">
            <div className="eyebrow">{t('bill_cart')}</div>

            <div className="mt-4">
              <label className="label">{t('bill_customer')}</label>
              <select
                className="input"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">{t('bill_walkin')}</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.phone ? ` · ${c.phone}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 max-h-[30vh] space-y-2 overflow-auto">
              {lines.length === 0 && (
                <div className="rounded-2xl bg-[#f3efe6] px-4 py-6 text-center text-sm text-[var(--muted)]">
                  {t('bill_emptyCart')}
                </div>
              )}
              {lines.map((line) => (
                <div
                  key={line.productId}
                  className="rounded-2xl border border-[var(--line)] bg-white p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold">{line.name}</div>
                      <div className="text-xs text-[var(--muted)]">
                        Rs {line.price.toFixed(2)} · GST {line.gstRate}%
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(line.productId)}
                      className="min-h-10 min-w-10 text-[var(--muted)] hover:text-[var(--danger)]"
                      aria-label={t('bill_remove')}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-strong)] text-lg"
                        onClick={() => setQty(line.productId, line.qty - 1)}
                      >
                        <Minus size={18} />
                      </button>
                      <span className="min-w-10 text-center text-lg font-semibold">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-strong)] text-lg"
                        onClick={() => setQty(line.productId, line.qty + 1)}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="text-base font-semibold">
                      Rs {(line.qty * line.price * (1 + line.gstRate / 100)).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!asQuote && !asCredit && (
              <div className="mt-4">
                <label className="label">{t('bill_payMode')}</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {payModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPaymentMode(mode.id)}
                      className={clsx(
                        'min-h-12 rounded-2xl border px-2 py-2 text-sm font-semibold',
                        paymentMode === mode.id
                          ? 'border-[var(--forest)] bg-[var(--forest)] text-[#f7f3eb]'
                          : 'border-[var(--line-strong)] bg-white',
                      )}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">{t('bill_discount')}</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              {!asQuote && !asCredit && (
                <div>
                  <label className="label">{t('bill_paid')}</label>
                  <div className="flex gap-2">
                    <input
                      ref={paidRef}
                      className="input"
                      type="number"
                      step="0.01"
                      placeholder={`${totals.grand.toFixed(2)}`}
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value)}
                      disabled={paymentMode === 'credit'}
                    />
                    <button
                      type="button"
                      className="btn-ghost !px-3 whitespace-nowrap"
                      onClick={() => {
                        setPaymentMode('cash');
                        setPaidAmount(String(totals.grand));
                      }}
                    >
                      {t('bill_fullPay')}
                    </button>
                  </div>
                </div>
              )}
              <div>
                <label className="label">{t('bill_due')}</label>
                <input
                  className="input"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <label className="label">{t('bill_notes')}</label>
                <input
                  className="input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-5 space-y-1 text-sm">
              <div className="flex justify-between text-[var(--muted)]">
                <span>{t('bill_items')}</span>
                <span>{totals.count}</span>
              </div>
              <div className="flex justify-between text-[var(--muted)]">
                <span>{t('bill_subtotal')}</span>
                <span>Rs {totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[var(--muted)]">
                <span>{t('bill_tax')}</span>
                <span>Rs {totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--line)] pt-2">
                <span className="font-display text-2xl">{t('bill_total')}</span>
                <span className="font-display text-2xl">Rs {totals.grand.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="mt-3 rounded-2xl bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary mt-5 hidden w-full !py-4 text-base xl:inline-flex"
              disabled={loading}
            >
              {loading
                ? t('bill_saving')
                : asQuote
                  ? t('bill_saveQuote')
                  : asCredit
                    ? t('bill_saveCredit')
                    : t('bill_save')}
            </button>
          </div>
        </section>
      </form>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-[var(--paper)]/95 p-3 backdrop-blur xl:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
              {t('bill_total')}
            </div>
            <div className="text-xl font-semibold">Rs {totals.grand.toFixed(2)}</div>
          </div>
          <button
            type="button"
            className="btn-primary min-h-14 flex-1 !py-4 text-base"
            disabled={loading}
            onClick={() => void saveBill()}
          >
            {loading
              ? t('bill_saving')
              : asQuote
                ? t('bill_saveQuote')
                : asCredit
                  ? t('bill_saveCredit')
                  : t('bill_save')}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
