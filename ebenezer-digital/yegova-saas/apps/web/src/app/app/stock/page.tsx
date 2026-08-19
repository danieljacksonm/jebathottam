'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { api } from '@/lib/api';
import { friendlyError, useI18n } from '@/lib/i18n';
import {
  Alert,
  EmptyState,
  MetricCard,
  PageHeader,
  SoftPanel,
} from '@/components/ui';

type Product = { id: string; name: string; stock: number; unit: string };

type Move = {
  id: string;
  qty: number;
  type: string;
  note?: string | null;
  createdAt: string;
  product: { name: string; unit: string };
};

export default function StockPage() {
  const { t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<Move[]>([]);
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState('1');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [note, setNote] = useState('');
  const [adjustStock, setAdjustStock] = useState('');
  const [mode, setMode] = useState<'in' | 'adjust'>('in');
  const [error, setError] = useState('');

  async function load() {
    const [p, h] = await Promise.all([
      api<Product[]>('/products'),
      api<Move[]>('/stock/history'),
    ]);
    setProducts(p);
    setHistory(h);
    if (!productId && p[0]) setProductId(p[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(friendlyError(e, t, 'err_load')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'in') {
        await api('/stock/in', {
          method: 'POST',
          body: JSON.stringify({
            productId,
            qty: Number(qty),
            purchasePrice: purchasePrice ? Number(purchasePrice) : undefined,
            note: note || undefined,
          }),
        });
      } else {
        await api('/stock/adjust', {
          method: 'POST',
          body: JSON.stringify({
            productId,
            stock: Number(adjustStock),
            note: note || undefined,
          }),
        });
      }
      setQty('1');
      setAdjustStock('');
      setNote('');
      setPurchasePrice('');
      await load();
    } catch (err) {
      setError(friendlyError(err, t, 'err_save'));
    }
  }

  const low = products.filter((p) => p.stock <= 10).length;

  return (
    <AppShell>
      <PageHeader
        eyebrow={t('nav_ops')}
        title={t('stock_title')}
        sub={t('stock_sub')}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MetricCard label={t('stock_products')} value={String(products.length)} />
        <MetricCard label={t('stock_moves')} value={String(history.length)} />
        <MetricCard
          label={t('stock_low')}
          value={String(low)}
          tone={low > 0 ? 'danger' : 'ok'}
        />
      </div>

      <SoftPanel title={t('stock_action')} className="mb-6">
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-6">
          <div className="md:col-span-2">
            <label className="label">{t('stock_product')}</label>
            <select
              className="input"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.stock} {p.unit})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t('common_actions')}</label>
            <select
              className="input"
              value={mode}
              onChange={(e) => setMode(e.target.value as 'in' | 'adjust')}
            >
              <option value="in">{t('stock_in')}</option>
              <option value="adjust">{t('stock_set')}</option>
            </select>
          </div>
          {mode === 'in' ? (
            <>
              <div>
                <label className="label">{t('stock_qtyIn')}</label>
                <input
                  className="input"
                  type="number"
                  step="0.001"
                  required
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </div>
              <div>
                <label className="label">{t('stock_buyPrice')}</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="md:col-span-2">
              <label className="label">{t('stock_newQty')}</label>
              <input
                className="input"
                type="number"
                step="0.001"
                required
                value={adjustStock}
                onChange={(e) => setAdjustStock(e.target.value)}
              />
            </div>
          )}
          <div className="flex items-end">
            <button className="btn-primary w-full">{t('common_save')}</button>
          </div>
          <div className="md:col-span-6">
            <label className="label">{t('stock_note')}</label>
            <input
              className="input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('stock_phNote')}
            />
          </div>
        </form>
        {error && (
          <div className="mt-3">
            <Alert>{error}</Alert>
          </div>
        )}
      </SoftPanel>

      <SoftPanel title={t('stock_history')}>
        {history.length === 0 ? (
          <EmptyState
            title={t('stock_empty')}
            hint={t('stock_emptyHint')}
          />
        ) : (
          <div className="table-wrap border-0">
            <table className="data">
              <thead>
                <tr>
                  <th>{t('stock_when')}</th>
                  <th>{t('stock_product')}</th>
                  <th>{t('stock_type')}</th>
                  <th>{t('bill_qty')}</th>
                  <th>{t('stock_note')}</th>
                </tr>
              </thead>
              <tbody>
                {history.map((m) => (
                  <tr key={m.id}>
                    <td>{new Date(m.createdAt).toLocaleString('en-IN')}</td>
                    <td className="font-medium">{m.product.name}</td>
                    <td>
                      <span
                        className={
                          m.type === 'in'
                            ? 'badge badge-ok'
                            : m.type === 'out'
                              ? 'badge badge-warn'
                              : 'badge badge-neutral'
                        }
                      >
                        {m.type}
                      </span>
                    </td>
                    <td>
                      {m.qty > 0 ? '+' : ''}
                      {m.qty} {m.product.unit}
                    </td>
                    <td className="text-[var(--muted)]">{m.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SoftPanel>
    </AppShell>
  );
}
