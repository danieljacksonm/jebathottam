'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { api } from '@/lib/api';
import { friendlyError, useI18n } from '@/lib/i18n';
import { Download, Search } from 'lucide-react';
import {
  Alert,
  EmptyState,
  MetricCard,
  PageHeader,
  SoftPanel,
  StatusBadge,
  money,
} from '@/components/ui';

type Bill = {
  id: string;
  invoiceLabel: string;
  grandTotal: number;
  paidAmount: number;
  status: string;
  billDate: string;
  customer?: { name: string } | null;
};

export default function BillsPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Bill[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  async function load(nextQ = q, nextStatus = status) {
    const params = new URLSearchParams();
    if (nextQ.trim()) params.set('q', nextQ.trim());
    if (nextStatus) params.set('status', nextStatus);
    const qs = params.toString();
    setItems(await api<Bill[]>(`/bills${qs ? `?${qs}` : ''}`));
  }

  useEffect(() => {
    load().catch((e) => setError(friendlyError(e, t, 'err_load')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const outstanding = useMemo(
    () =>
      items
        .filter((b) => b.status !== 'void' && b.status !== 'paid')
        .reduce((s, b) => s + (b.grandTotal - b.paidAmount), 0),
    [items],
  );

  const paidCount = items.filter((b) => b.status === 'paid').length;

  async function markPaid(bill: Bill) {
    if (bill.status === 'void') return;
    setBusyId(bill.id);
    try {
      await api(`/bills/${bill.id}/payment`, {
        method: 'PATCH',
        body: JSON.stringify({ paidAmount: bill.grandTotal }),
      });
      await load();
    } catch (e) {
      setError(friendlyError(e, t, 'err_pay'));
    } finally {
      setBusyId('');
    }
  }

  async function voidBill(bill: Bill) {
    if (!confirm(`${t('bills_voidConfirm')} (${bill.invoiceLabel})`)) return;
    setBusyId(bill.id);
    try {
      await api(`/bills/${bill.id}/void`, { method: 'POST' });
      await load();
    } catch (e) {
      setError(friendlyError(e, t, 'err_void'));
    } finally {
      setBusyId('');
    }
  }

  async function duplicate(bill: Bill) {
    setBusyId(bill.id);
    try {
      const copy = await api<{ id: string }>(`/bills/${bill.id}/duplicate`, {
        method: 'POST',
      });
      window.location.href = `/app/bills/${copy.id}/print`;
    } catch (e) {
      setError(friendlyError(e, t, 'err_duplicate'));
    } finally {
      setBusyId('');
    }
  }

  function exportCsv() {
    const rows = [
      ['Invoice', 'Date', 'Customer', 'Total', 'Paid', 'Status'],
      ...items.map((b) => [
        b.invoiceLabel,
        new Date(b.billDate).toLocaleDateString('en-IN'),
        b.customer?.name || t('walkin'),
        String(b.grandTotal),
        String(b.paidAmount),
        b.status,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ebenezer-invoices-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow={t('nav_sales')}
        title={t('bills_title')}
        sub={t('bills_sub')}
        actions={
          <>
            <button type="button" className="btn-ghost" onClick={exportCsv}>
              <Download size={16} /> {t('common_export')}
            </button>
            <Link href="/app/bills/new" className="btn-primary">
              {t('bills_new')}
            </Link>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MetricCard label={t('bills_listed')} value={String(items.length)} />
        <MetricCard label={t('bills_paidCount')} value={String(paidCount)} tone="ok" />
        <MetricCard
          label={t('bills_outstanding')}
          value={money(outstanding)}
          tone={outstanding > 0 ? 'danger' : 'ok'}
        />
      </div>

      <div className="surface-soft mb-5 flex flex-wrap gap-3 rounded-[24px] p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />
          <input
            className="input !pl-9"
            placeholder={t('bills_searchPh')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                load(q, status).catch((err) =>
                  setError(friendlyError(err, t, 'err_load')),
                );
            }}
          />
        </div>
        <select
          className="input max-w-[160px]"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            load(q, e.target.value).catch((err) =>
              setError(friendlyError(err, t, 'err_load')),
            );
          }}
        >
          <option value="">{t('status_all')}</option>
          <option value="paid">{t('status_paid')}</option>
          <option value="partial">{t('status_partial')}</option>
          <option value="unpaid">{t('status_unpaid')}</option>
          <option value="void">{t('status_void')}</option>
        </select>
        <button
          className="btn-primary"
          type="button"
          onClick={() =>
            load(q, status).catch((err) =>
              setError(friendlyError(err, t, 'err_load')),
            )
          }
        >
          {t('common_search')}
        </button>
      </div>

      {error && <Alert>{error}</Alert>}

      <SoftPanel title={t('bills_book')}>
        {items.length === 0 ? (
          <EmptyState
            title={t('bills_empty')}
            hint={t('bills_emptyHint')}
            action={
              <Link href="/app/bills/new" className="btn-primary">
                {t('nav_newBill')}
              </Link>
            }
          />
        ) : (
          <div className="table-wrap border-0">
            <table className="data">
              <thead>
                <tr>
                  <th>{t('bills_invoice')}</th>
                  <th>{t('common_date')}</th>
                  <th>{t('bills_customer')}</th>
                  <th>{t('common_amount')}</th>
                  <th>{t('common_status')}</th>
                  <th>{t('common_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((b) => (
                  <tr
                    key={b.id}
                    className={b.status === 'void' ? 'opacity-50' : ''}
                  >
                    <td className="font-medium">{b.invoiceLabel}</td>
                    <td>{new Date(b.billDate).toLocaleDateString('en-IN')}</td>
                    <td>{b.customer?.name || t('walkin')}</td>
                    <td>
                      <div>{money(b.grandTotal)}</div>
                      {b.status !== 'paid' && b.status !== 'void' && (
                        <div className="text-xs text-[var(--danger)]">
                          {t('bills_dueAmt')} {money(b.grandTotal - b.paidAmount)}
                        </div>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <Link
                          href={`/app/bills/${b.id}/print`}
                          className="font-medium text-[var(--forest)]"
                        >
                          {t('common_print')}
                        </Link>
                        <button
                          type="button"
                          disabled={busyId === b.id}
                          onClick={() => duplicate(b)}
                          className="font-medium text-[var(--muted)]"
                        >
                          {t('bills_copy')}
                        </button>
                        {b.status !== 'paid' && b.status !== 'void' && (
                          <button
                            type="button"
                            disabled={busyId === b.id}
                            onClick={() => markPaid(b)}
                            className="font-medium text-[var(--ok)]"
                          >
                            {t('bills_markPaid')}
                          </button>
                        )}
                        {b.status !== 'void' && (
                          <button
                            type="button"
                            disabled={busyId === b.id}
                            onClick={() => voidBill(b)}
                            className="font-medium text-[var(--danger)]"
                          >
                            {t('bills_void')}
                          </button>
                        )}
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
