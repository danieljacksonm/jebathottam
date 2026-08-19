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

type Customer = {
  id: string;
  name: string;
  phone?: string | null;
  gstin?: string | null;
  address?: string | null;
};

export default function CustomersPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Customer[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setItems(await api<Customer[]>('/customers'));
  }

  useEffect(() => {
    load().catch((e) => setError(friendlyError(e, t, 'err_load')));
  }, [t]);

  function startEdit(c: Customer) {
    setEditId(c.id);
    setName(c.name);
    setPhone(c.phone || '');
    setGstin(c.gstin || '');
    setAddress(c.address || '');
  }

  function cancelEdit() {
    setEditId(null);
    setName('');
    setPhone('');
    setGstin('');
    setAddress('');
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const body = { name, phone, gstin, address };
    try {
      if (editId) {
        await api(`/customers/${editId}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
      } else {
        await api('/customers', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
      cancelEdit();
      await load();
    } catch (err) {
      setError(friendlyError(err, t, 'err_save'));
    }
  }

  async function remove(id: string) {
    if (!confirm(t('common_confirmDelete'))) return;
    await api(`/customers/${id}`, { method: 'DELETE' });
    if (editId === id) cancelEdit();
    await load();
  }

  const filtered = items.filter((c) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return (
      c.name.toLowerCase().includes(s) ||
      (c.phone || '').toLowerCase().includes(s) ||
      (c.gstin || '').toLowerCase().includes(s) ||
      (c.address || '').toLowerCase().includes(s)
    );
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow={t('nav_sales')}
        title={t('cust_title')}
        sub={t('cust_sub')}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <MetricCard label={t('cust_count')} value={String(items.length)} />
        <MetricCard
          label={t('cust_withGstin')}
          value={String(items.filter((c) => c.gstin).length)}
        />
      </div>

      <SoftPanel
        title={editId ? t('cust_edit') : t('cust_add')}
        className="mb-6"
      >
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="label">{t('common_name')}</label>
            <input
              className="input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="label">{t('common_phone')}</label>
            <input
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="label">{t('common_gstin')}</label>
            <input
              className="input"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
            />
          </div>
          <div>
            <label className="label">{t('common_address')}</label>
            <input
              className="input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2">
            <button className="btn-primary w-full">
              {editId ? t('common_update') : t('cust_add')}
            </button>
            {editId && (
              <button type="button" className="btn-ghost" onClick={cancelEdit}>
                {t('common_cancel')}
              </button>
            )}
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
          placeholder={t('cust_search')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <SoftPanel title={t('cust_book')}>
        {filtered.length === 0 ? (
          <EmptyState
            title={t('cust_empty')}
            hint={t('cust_emptyHint')}
          />
        ) : (
          <div className="table-wrap border-0">
            <table className="data">
              <thead>
                <tr>
                  <th>{t('common_name')}</th>
                  <th>{t('common_phone')}</th>
                  <th>{t('common_gstin')}</th>
                  <th>{t('common_address')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--forest)]/10 text-xs font-semibold text-[var(--forest)]">
                          {c.name.slice(0, 1).toUpperCase()}
                        </div>
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td>{c.phone || '—'}</td>
                    <td>{c.gstin || '—'}</td>
                    <td className="max-w-[14rem] truncate text-[var(--muted)]">
                      {c.address || '—'}
                    </td>
                    <td>
                      <div className="flex gap-3 text-sm">
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          className="font-medium text-[var(--forest)]"
                        >
                          {t('common_edit')}
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(c.id)}
                          className="font-medium text-[var(--danger)]"
                        >
                          {t('common_delete')}
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
