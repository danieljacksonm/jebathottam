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
  money,
} from '@/components/ui';

type Party = {
  id: string;
  name: string;
  phone?: string | null;
  invoiceCount: number;
  billed: number;
  paid: number;
  due: number;
  overdueCount: number;
};

type Detail = {
  customer: { name: string; phone?: string | null; gstin?: string | null };
  balance: number;
  entries: Array<{
    date: string;
    type: string;
    ref: string;
    debit: number;
    credit: number;
    balance: number;
    billId: string;
  }>;
};

export default function LedgerPage() {
  const { t } = useI18n();
  const [parties, setParties] = useState<Party[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Party[]>('/reports/ledger')
      .then(setParties)
      .catch((e) => setError(friendlyError(e, t, 'err_load')));
  }, [t]);

  async function openParty(id: string) {
    setSelected(id);
    try {
      setDetail(await api<Detail>(`/reports/ledger/${id}`));
    } catch (e) {
      setError(friendlyError(e, t, 'err_load'));
    }
  }

  const totalDue = parties.reduce((s, p) => s + p.due, 0);
  const overdue = parties.filter((p) => p.overdueCount > 0).length;

  return (
    <AppShell>
      <PageHeader
        eyebrow={t('nav_sales')}
        title={t('led_title')}
        sub={t('led_sub')}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MetricCard label={t('led_parties')} value={String(parties.length)} />
        <MetricCard
          label={t('led_totalDue')}
          value={money(totalDue)}
          tone={totalDue > 0 ? 'danger' : 'ok'}
        />
        <MetricCard
          label={t('led_overdue')}
          value={String(overdue)}
          tone={overdue > 0 ? 'danger' : 'ok'}
        />
      </div>

      {error && <Alert>{error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-2">
        <SoftPanel title={t('led_parties')}>
          {parties.length === 0 ? (
            <EmptyState
              title={t('led_empty')}
              hint={t('led_emptyHint')}
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
                    <th>Customer</th>
                    <th>Billed</th>
                    <th>Due</th>
                  </tr>
                </thead>
                <tbody>
                  {parties.map((p) => (
                    <tr
                      key={p.id}
                      className={
                        selected === p.id
                          ? 'bg-[#f3efe6]'
                          : 'cursor-pointer'
                      }
                      onClick={() => openParty(p.id)}
                    >
                      <td>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-[var(--muted)]">
                          {t('led_invoicesCount', { n: p.invoiceCount })}
                          {p.overdueCount > 0
                            ? ` · ${p.overdueCount} overdue`
                            : ''}
                        </div>
                      </td>
                      <td>{money(p.billed)}</td>
                      <td
                        className={
                          p.due > 0
                            ? 'font-semibold text-[var(--danger)]'
                            : ''
                        }
                      >
                        {money(p.due)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SoftPanel>

        <SoftPanel title={t('led_statement')}>
          {!detail ? (
            <EmptyState
              title={t('led_select')}
              hint={t('led_selectHint')}
            />
          ) : (
            <>
              <div className="mb-4 flex items-end justify-between gap-3 rounded-2xl bg-[#f3efe6] p-4">
                <div>
                  <div className="font-display text-2xl">{detail.customer.name}</div>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {[detail.customer.phone, detail.customer.gstin]
                      .filter(Boolean)
                      .join(' · ') || t('ledger_noContact')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
                    {t('led_balance')}
                  </div>
                  <div className="stat-value text-2xl">{money(detail.balance)}</div>
                </div>
              </div>
              <div className="table-wrap border-0">
                <table className="data">
                  <thead>
                    <tr>
                      <th>{t('common_date')}</th>
                      <th>{t('led_entry')}</th>
                      <th>{t('led_debit')}</th>
                      <th>{t('led_credit')}</th>
                      <th>{t('led_balance')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.entries.map((e, i) => (
                      <tr key={`${e.billId}-${i}`}>
                        <td>{new Date(e.date).toLocaleDateString('en-IN')}</td>
                        <td>
                          <div className="text-sm">{e.type}</div>
                          <Link
                            href={`/app/bills/${e.billId}/print`}
                            className="text-xs text-[var(--forest)]"
                          >
                            {e.ref}
                          </Link>
                        </td>
                        <td>{e.debit ? money(e.debit) : '—'}</td>
                        <td>{e.credit ? money(e.credit) : '—'}</td>
                        <td>{money(e.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </SoftPanel>
      </div>
    </AppShell>
  );
}
