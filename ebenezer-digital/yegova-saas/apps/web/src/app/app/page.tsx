'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { api } from '@/lib/api';
import { friendlyError, useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';

type Stats = {
  todaySales: number;
  todayBills: number;
  totalBills: number;
  products: number;
  customers: number;
  lowStockCount: number;
  lowStock: Array<{ id: string; name: string; stock: number; unit: string }>;
  onboarding?: Array<{ id: string; done: boolean; href: string }>;
  onboardingDone?: number;
  onboardingTotal?: number;
  recent: Array<{
    id: string;
    invoiceLabel: string;
    grandTotal: number;
    status: string;
    customer?: { name: string } | null;
  }>;
};

function money(n: number) {
  return `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export default function DashboardPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Stats>('/dashboard/stats')
      .then(setStats)
      .catch((e) => setError(friendlyError(e, t, 'err_load')));
  }, [t]);

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="page-title">{t('home_title')}</h1>
            <p className="page-sub">{t('home_sub')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/app/quotes" className="btn-ghost">
              {t('nav_quotes')}
            </Link>
            <Link href="/app/ledger" className="btn-ghost">
              {t('nav_ledger')}
            </Link>
            <Link href="/app/reports" className="btn-ghost">
              {t('nav_reports')}
            </Link>
            <Link href="/app/bills/new" className="btn-primary">
              {t('nav_newBill')}
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {stats?.onboarding &&
          (stats.onboardingDone || 0) < (stats.onboardingTotal || 0) && (
            <div className="mt-6 surface rounded-[28px] p-5 md:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl">{t('onb_title')}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{t('onb_sub')}</p>
                </div>
                <div className="text-sm font-medium text-[var(--forest)]">
                  {t('onb_progress', {
                    done: stats.onboardingDone || 0,
                    total: stats.onboardingTotal || 5,
                  })}
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {stats.onboarding.map((step) => {
                  const labels: Record<string, string> = {
                    products: t('onb_products'),
                    customers: t('onb_customers'),
                    bill: t('onb_bill'),
                    gstin: t('onb_gstin'),
                    team: t('onb_team'),
                  };
                  return (
                    <Link
                      key={step.id}
                      href={step.href}
                      className={
                        step.done
                          ? 'rounded-2xl border border-[rgba(31,122,77,0.25)] bg-[rgba(31,122,77,0.08)] px-4 py-4'
                          : 'rounded-2xl border border-[var(--line-strong)] bg-white px-4 py-4 transition hover:border-[var(--forest)]'
                      }
                    >
                      <div className="text-xs font-medium text-[var(--muted)]">
                        {step.done ? t('onb_done') : '•'}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-[var(--ink)]">
                        {labels[step.id] || step.id}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        <div className="mt-8 surface overflow-hidden rounded-[28px] p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brass)]">
            {t('home_today')}
          </div>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div className="stat-value">{money(stats?.todaySales || 0)}</div>
            <div className="pb-1 text-sm text-[var(--muted)]">
              {t('home_fromBills', { n: stats?.todayBills || 0 })}
            </div>
          </div>
          <div className="mt-8 grid gap-4 border-t border-[var(--line)] pt-6 sm:grid-cols-3">
            <div>
              <div className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                {t('home_catalogue')}
              </div>
              <div className="mt-1 text-2xl font-semibold">{stats?.products || 0}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                {t('home_customers')}
              </div>
              <div className="mt-1 text-2xl font-semibold">{stats?.customers || 0}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                {t('home_lowStock')}
              </div>
              <div className="mt-1 text-2xl font-semibold text-[var(--danger)]">
                {stats?.lowStockCount || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <div className="surface rounded-[28px] p-5 lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl">{t('home_recent')}</h2>
              <Link href="/app/bills" className="text-sm font-medium text-[var(--forest)]">
                {t('common_viewAll')}
              </Link>
            </div>
            <div className="table-wrap border-0 shadow-none">
              <table className="data">
                <thead>
                  <tr>
                    <th>{t('bills_invoice')}</th>
                    <th>{t('bills_customer')}</th>
                    <th>{t('common_amount')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recent || []).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-[var(--muted)]">
                        {t('home_noBills')}
                      </td>
                    </tr>
                  ) : (
                    stats?.recent.map((b) => (
                      <tr key={b.id}>
                        <td className="font-medium">{b.invoiceLabel}</td>
                        <td>{b.customer?.name || t('walkin')}</td>
                        <td>{money(b.grandTotal)}</td>
                        <td>
                          <Link
                            href={`/app/bills/${b.id}/print`}
                            className="text-sm font-medium text-[var(--forest)]"
                          >
                            {t('common_print')}
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="surface rounded-[28px] p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl">{t('home_stockWatch')}</h2>
              <Link href="/app/products" className="text-sm font-medium text-[var(--forest)]">
                {t('home_catalogue')}
              </Link>
            </div>
            <div className="space-y-3">
              {(stats?.lowStock || []).length === 0 ? (
                <p className="text-sm text-[var(--muted)]">{t('home_stockOk')}</p>
              ) : (
                stats?.lowStock.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
                  >
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="text-sm font-semibold text-[var(--danger)]">
                      {p.stock} {p.unit}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}
