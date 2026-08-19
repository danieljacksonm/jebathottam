'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { api } from '@/lib/api';
import { friendlyError, useI18n } from '@/lib/i18n';
import { Download } from 'lucide-react';
import {
  Alert,
  EmptyState,
  MetricCard,
  PageHeader,
  SoftPanel,
  money,
} from '@/components/ui';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  gstRate: number;
  sku?: string | null;
  barcode?: string | null;
  hsn?: string | null;
  category?: string | null;
};

const emptyForm = {
  name: '',
  price: '',
  stock: '0',
  gstRate: '0',
  unit: 'NOS',
  sku: '',
  barcode: '',
  hsn: '',
  category: '',
};

export default function ProductsPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setItems(await api<Product[]>('/products'));
  }

  useEffect(() => {
    load().catch((e) => setError(friendlyError(e, t, 'err_load')));
  }, [t]);

  function startEdit(p: Product) {
    setEditId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      stock: String(p.stock),
      gstRate: String(p.gstRate),
      unit: p.unit || 'NOS',
      sku: p.sku || '',
      barcode: p.barcode || '',
      hsn: p.hsn || '',
      category: p.category || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const body = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      gstRate: Number(form.gstRate),
      unit: form.unit || 'NOS',
      sku: form.sku || undefined,
      barcode: form.barcode || undefined,
      hsn: form.hsn || undefined,
      category: form.category || undefined,
    };
    try {
      if (editId) {
        await api(`/products/${editId}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
      } else {
        await api('/products', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
      cancelEdit();
      await load();
    } catch (err) {
      setError(friendlyError(err, t, 'err_save'));
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(t('common_confirmDelete'))) return;
    await api(`/products/${id}`, { method: 'DELETE' });
    if (editId === id) cancelEdit();
    await load();
  }

  function exportCsv() {
    const rows = [
      ['Name', 'SKU', 'HSN', 'Price', 'Stock', 'Unit', 'GST %'],
      ...filtered.map((p) => [
        p.name,
        p.sku || '',
        p.hsn || '',
        String(p.price),
        String(p.stock),
        p.unit,
        String(p.gstRate),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ebenezer-products-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = items.filter((p) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return (
      p.name.toLowerCase().includes(s) ||
      (p.sku || '').toLowerCase().includes(s) ||
      (p.barcode || '').toLowerCase().includes(s) ||
      (p.hsn || '').toLowerCase().includes(s) ||
      (p.category || '').toLowerCase().includes(s)
    );
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow={t('nav_ops')}
        title={t('prod_title')}
        sub={t('prod_sub')}
        actions={
          <button type="button" className="btn-ghost" onClick={exportCsv}>
            <Download size={16} /> {t('common_export')}
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MetricCard label={t('prod_count')} value={String(items.length)} />
        <MetricCard
          label={t('prod_low')}
          value={String(items.filter((p) => p.stock <= 10).length)}
          tone={items.some((p) => p.stock <= 10) ? 'danger' : 'ok'}
        />
        <MetricCard
          label={t('prod_barcode')}
          value={String(items.filter((p) => p.barcode).length)}
        />
      </div>

      <SoftPanel
        title={editId ? t('prod_edit') : t('prod_add')}
        className="mb-6"
      >
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-6">
          <div className="md:col-span-2">
            <label className="label">{t('prod_name')}</label>
            <input
              className="input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('prod_phName')}
            />
          </div>
          <div>
            <label className="label">{t('prod_price')}</label>
            <input
              className="input"
              required
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="label">{t('prod_stock')}</label>
            <input
              className="input"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>
          <div>
            <label className="label">{t('prod_gst')}</label>
            <input
              className="input"
              type="number"
              value={form.gstRate}
              onChange={(e) => setForm({ ...form, gstRate: e.target.value })}
            />
          </div>
          <div className="flex items-end gap-2">
            <button className="btn-primary w-full" disabled={loading}>
              {loading
                ? t('common_loading')
                : editId
                  ? t('common_update')
                  : t('common_add')}
            </button>
            {editId && (
              <button type="button" className="btn-ghost" onClick={cancelEdit}>
                {t('common_cancel')}
              </button>
            )}
          </div>
          <div>
            <label className="label">{t('prod_sku')}</label>
            <input
              className="input"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder={t('prod_phOptional')}
            />
          </div>
          <div>
            <label className="label">{t('prod_barcode')}</label>
            <input
              className="input"
              value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value })}
              placeholder={t('prod_phBarcode')}
            />
          </div>
          <div>
            <label className="label">{t('prod_category')}</label>
            <input
              className="input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder={t('prod_phCategory')}
            />
          </div>
          <div>
            <label className="label">{t('prod_hsn')}</label>
            <input
              className="input"
              value={form.hsn}
              onChange={(e) => setForm({ ...form, hsn: e.target.value })}
              placeholder={t('prod_phOptional')}
            />
          </div>
          <div>
            <label className="label">{t('prod_unit')}</label>
            <input
              className="input"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
          </div>
        </form>
        {error && (
          <div className="mt-3">
            <Alert>{error}</Alert>
          </div>
        )}
      </SoftPanel>

      <div className="mb-5">
        <input
          className="input max-w-md"
          placeholder={t('prod_search')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <SoftPanel title={t('prod_book')}>
        {filtered.length === 0 ? (
          <EmptyState
            title={t('prod_empty')}
            hint={t('prod_emptyHint')}
          />
        ) : (
          <div className="table-wrap border-0">
            <table className="data">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>GST</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="font-medium">{p.name}</div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {p.category && (
                          <span className="badge badge-neutral">{p.category}</span>
                        )}
                        {(p.sku || p.barcode || p.hsn) && (
                          <span className="text-xs text-[var(--muted)]">
                            {[
                              p.sku && `SKU ${p.sku}`,
                              p.barcode && `BC ${p.barcode}`,
                              p.hsn && `HSN ${p.hsn}`,
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{money(p.price)}</td>
                    <td
                      className={
                        p.stock <= 10 ? 'font-semibold text-[var(--danger)]' : ''
                      }
                    >
                      {p.stock} {p.unit}
                    </td>
                    <td>{p.gstRate}%</td>
                    <td>
                      <div className="flex gap-3 text-sm">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="font-medium text-[var(--forest)]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(p.id)}
                          className="font-medium text-[var(--danger)]"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
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
