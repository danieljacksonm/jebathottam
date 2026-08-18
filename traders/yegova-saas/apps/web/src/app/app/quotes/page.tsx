'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { api } from '@/lib/api';
import { friendlyError, useI18n } from '@/lib/i18n';
import {
  Alert,
  EmptyState,
  MetricCard,
  PageHeader,
  SoftPanel,
  StatusBadge,
  money,
} from '@/components/ui';

type Quote = {
  id: string;
  invoiceLabel: string;
  grandTotal: number;
  status: string;
  billDate: string;
  customer?: { name: string } | null;
};

export default function QuotesPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Quote[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  async function load() {
    setItems(await api<Quote[]>('/bills?docType=quote'));
  }

  useEffect(() => {
    load().catch((e) => setError(friendlyError(e, t, 'err_load')));
  }, [t]);

  async function convert(id: string) {
    if (!confirm(t('quotes_convertConfirm'))) return;
    setBusy(id);
    try {
      const inv = await api<{ id: string }>(`/bills/${id}/convert`, {
        method: 'POST',
      });
      window.location.href = `/app/bills/${inv.id}/print`;
    } catch (e) {
      setError(friendlyError(e, t, 'err_convert'));
    } finally {
      setBusy('');
    }
  }

  async function voidQuote(id: string) {
    if (!confirm(t('quotes_voidConfirm'))) return;
    setBusy(id);
    try {
      await api(`/bills/${id}/void`, { method: 'POST' });
      await load();
    } catch (e) {
      setError(friendlyError(e, t, 'err_void'));
    } finally {
      setBusy('');
    }
  }

  const draftCount = items.filter((q) => q.status === 'draft').length;
  const totalValue = items
    .filter((q) => q.status !== 'void')
    .reduce((s, q) => s + q.grandTotal, 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow={t('nav_sales')}
        title={t('quotes_title')}
        sub={t('quotes_sub')}
        actions={
          <Link href="/app/bills/new?type=quote" className="btn-primary">
            {t('quotes_new')}
          </Link>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MetricCard label={t('quotes_count')} value={String(items.length)} />
        <MetricCard label={t('quotes_drafts')} value={String(draftCount)} tone="brass" />
        <MetricCard label={t('quotes_pipeline')} value={money(totalValue)} />
      </div>

      {error && <Alert>{error}</Alert>}

      <SoftPanel title={t('quotes_all')}>
        {items.length === 0 ? (
          <EmptyState
            title={t('quotes_empty')}
            hint={t('quotes_emptyHint')}
            action={
              <Link href="/app/bills/new?type=quote" className="btn-primary">
                {t('quotes_new')}
              </Link>
            }
          />
        ) : (
          <div className="table-wrap border-0">
            <table className="data">
              <thead>
                <tr>
                  <th>{t('quotes_quote')}</th>
                  <th>{t('common_date')}</th>
                  <th>{t('bills_customer')}</th>
                  <th>{t('common_amount')}</th>
                  <th>{t('common_status')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((q) => (
                  <tr key={q.id}>
                    <td className="font-medium">{q.invoiceLabel}</td>
                    <td>{new Date(q.billDate).toLocaleDateString('en-IN')}</td>
                    <td>{q.customer?.name || t('walkin')}</td>
                    <td>{money(q.grandTotal)}</td>
                    <td>
                      <StatusBadge status={q.status} />
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <Link
                          href={`/app/bills/${q.id}/print`}
                          className="font-medium text-[var(--forest)]"
                        >
                          {t('common_print')}
                        </Link>
                        {q.status === 'draft' && (
                          <button
                            type="button"
                            disabled={busy === q.id}
                            onClick={() => convert(q.id)}
                            className="font-medium text-[var(--ok)]"
                          >
                            {t('quotes_convert')}
                          </button>
                        )}
                        {q.status !== 'void' && q.status !== 'converted' && (
                          <button
                            type="button"
                            disabled={busy === q.id}
                            onClick={() => voidQuote(q.id)}
                            className="font-medium text-[var(--danger)]"
                          >
                            {t('quotes_void')}
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
