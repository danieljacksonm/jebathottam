'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { api, downloadCsv } from '@/lib/api';
import { friendlyError, payModeLabel, useI18n } from '@/lib/i18n';
import {
  Alert,
  MetricCard,
  PageHeader,
  SoftPanel,
  money,
} from '@/components/ui';

type Report = {
  from: string;
  to: string;
  summary: {
    invoiceCount: number;
    totalSales: number;
    totalTax: number;
    totalPaid: number;
    totalDiscount?: number;
    outstanding: number;
    totalExpense?: number;
    netCash?: number;
  };
  byPaymentMode?: Array<{ mode: string; amount: number }>;
  byDay: Array<{ date: string; sales: number; bills: number }>;
  topProducts: Array<{ name: string; qty: number; amount: number }>;
  recent: Array<{
    id: string;
    invoiceLabel: string;
    billDate: string;
    customer: string;
    grandTotal: number;
    paidAmount: number;
    status: string;
  }>;
};

type GstReport = {
  rows: Array<{
    gstRate: number;
    taxable: number;
    cgst: number;
    sgst: number;
    tax: number;
  }>;
  totals: { taxable: number; cgst: number; sgst: number; tax: number };
};

type Daybook = {
  date: string;
  summary: {
    invoices: number;
    sales: number;
    collected: number;
    expenses: number;
    net: number;
  };
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function monthStartStr() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

export default function ReportsPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<'sales' | 'gst' | 'day'>('sales');
  const [from, setFrom] = useState(monthStartStr());
  const [to, setTo] = useState(todayStr());
  const [day, setDay] = useState(todayStr());
  const [data, setData] = useState<Report | null>(null);
  const [gst, setGst] = useState<GstReport | null>(null);
  const [daybook, setDaybook] = useState<Daybook | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadSales(nextFrom = from, nextTo = to) {
    setLoading(true);
    setError('');
    try {
      const report = await api<Report>(
        `/reports/sales?from=${encodeURIComponent(nextFrom)}&to=${encodeURIComponent(nextTo)}`,
      );
      setData(report);
    } catch (e) {
      setError(friendlyError(e, t, 'err_report'));
    } finally {
      setLoading(false);
    }
  }

  async function loadGst(nextFrom = from, nextTo = to) {
    setLoading(true);
    try {
      setGst(
        await api<GstReport>(
          `/reports/gst?from=${encodeURIComponent(nextFrom)}&to=${encodeURIComponent(nextTo)}`,
        ),
      );
    } catch (e) {
      setError(friendlyError(e, t, 'err_gst'));
    } finally {
      setLoading(false);
    }
  }

  async function loadDay(d = day) {
    setLoading(true);
    try {
      setDaybook(await api<Daybook>(`/reports/daybook?date=${encodeURIComponent(d)}`));
    } catch (e) {
      setError(friendlyError(e, t, 'err_daybook'));
    } finally {
      setLoading(false);
    }
  }

  async function exportGstCsv() {
    setLoading(true);
    setError('');
    try {
      const data = await api<{
        from: string;
        to: string;
        rows: Array<{
          invoiceNo: string;
          billDate: string;
          customerName: string;
          customerGstin: string;
          itemName: string;
          qty: number;
          rate: number;
          taxable: number;
          gstRate: number;
          cgst: number;
          sgst: number;
          lineTotal: number;
          paymentMode: string;
          status: string;
        }>;
      }>(
        `/reports/gst-invoices?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
      );
      downloadCsv(`ebenezer-gst-${data.from}-to-${data.to}.csv`, [
        [
          'Invoice',
          'Date',
          'Customer',
          'GSTIN',
          'Item',
          'Qty',
          'Rate',
          'Taxable',
          'GST%',
          'CGST',
          'SGST',
          'Line total',
          'Mode',
          'Status',
        ],
        ...data.rows.map((r) => [
          r.invoiceNo,
          r.billDate,
          r.customerName,
          r.customerGstin,
          r.itemName,
          String(r.qty),
          String(r.rate),
          String(r.taxable),
          String(r.gstRate),
          String(r.cgst),
          String(r.sgst),
          String(r.lineTotal),
          r.paymentMode,
          r.status,
        ]),
      ]);
    } catch (e) {
      setError(friendlyError(e, t, 'err_gst'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow={t('nav_ops')}
        title={t('rep_title')}
        sub={t('rep_sub')}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {[
          { id: 'sales' as const, label: t('rep_sales') },
          { id: 'gst' as const, label: t('rep_gst') },
          { id: 'day' as const, label: t('rep_day') },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? 'btn-primary' : 'btn-ghost'}
            onClick={() => {
              setTab(item.id);
              if (item.id === 'sales') loadSales();
              if (item.id === 'gst') loadGst();
              if (item.id === 'day') loadDay();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab !== 'day' && (
        <div className="surface-soft mb-5 flex flex-wrap items-end gap-3 rounded-[28px] p-5">
          <div>
            <label className="label">{t('rep_from')}</label>
            <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="label">{t('rep_to')}</label>
            <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <button
            className="btn-primary"
            disabled={loading}
            onClick={() => (tab === 'gst' ? loadGst(from, to) : loadSales(from, to))}
          >
            {loading ? t('common_loading') : t('rep_run')}
          </button>
          {tab === 'gst' && (
            <button
              type="button"
              className="btn-ghost"
              disabled={loading}
              onClick={exportGstCsv}
              title={t('rep_gstExportHint')}
            >
              {t('rep_gstExport')}
            </button>
          )}
        </div>
      )}

      {tab === 'day' && (
        <div className="surface-soft mb-5 flex flex-wrap items-end gap-3 rounded-[28px] p-5">
          <div>
            <label className="label">{t('common_date')}</label>
            <input className="input" type="date" value={day} onChange={(e) => setDay(e.target.value)} />
          </div>
          <button className="btn-primary" disabled={loading} onClick={() => loadDay(day)}>
            {t('rep_openDay')}
          </button>
        </div>
      )}

      {error && <Alert>{error}</Alert>}

      {tab === 'sales' && data && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label={t('rep_invoices')} value={String(data.summary.invoiceCount)} />
            <MetricCard label={t('rep_salesAmt')} value={money(data.summary.totalSales)} />
            <MetricCard label={t('rep_collected')} value={money(data.summary.totalPaid)} tone="ok" />
            <MetricCard
              label={t('rep_outstanding')}
              value={money(data.summary.outstanding)}
              tone={data.summary.outstanding > 0 ? 'danger' : 'ok'}
            />
            <MetricCard label={t('rep_tax')} value={money(data.summary.totalTax)} />
            <MetricCard label={t('rep_discount')} value={money(data.summary.totalDiscount || 0)} tone="brass" />
            <MetricCard label={t('rep_expenses')} value={money(data.summary.totalExpense || 0)} tone="danger" />
            <MetricCard label={t('rep_net')} value={money(data.summary.netCash || 0)} />
          </div>

          {(data.byPaymentMode?.length || 0) > 0 && (
            <SoftPanel title={t('rep_byMode')} className="mb-6">
              <div className="flex flex-wrap gap-3">
                {data.byPaymentMode!.map((m) => (
                  <div
                    key={m.mode}
                    className="rounded-2xl border border-[var(--line)] bg-[#f7f3eb]/70 px-4 py-3 text-sm"
                  >
                    <div className="text-[var(--muted)]">{payModeLabel(m.mode, t)}</div>
                    <div className="mt-1 font-semibold">{money(m.amount)}</div>
                  </div>
                ))}
              </div>
            </SoftPanel>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <SoftPanel title={t('rep_daily')}>
              <div className="table-wrap border-0">
                <table className="data">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Invoices</th>
                      <th>Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.byDay.map((d) => (
                      <tr key={d.date}>
                        <td>{new Date(d.date).toLocaleDateString('en-IN')}</td>
                        <td>{d.bills}</td>
                        <td>{money(d.sales)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SoftPanel>
            <SoftPanel title={t('rep_top')}>
              <div className="table-wrap border-0">
                <table className="data">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topProducts.map((p) => (
                      <tr key={p.name}>
                        <td className="font-medium">{p.name}</td>
                        <td>{p.qty}</td>
                        <td>{money(p.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SoftPanel>
          </div>
        </>
      )}

      {tab === 'gst' && gst && (
        <SoftPanel title={t('rep_gstTitle')}>
          <div className="table-wrap border-0">
            <table className="data">
              <thead>
                <tr>
                  <th>Rate</th>
                  <th>Taxable</th>
                  <th>CGST</th>
                  <th>SGST</th>
                  <th>Total tax</th>
                </tr>
              </thead>
              <tbody>
                {gst.rows.map((r) => (
                  <tr key={r.gstRate}>
                    <td>{r.gstRate}%</td>
                    <td>{money(r.taxable)}</td>
                    <td>{money(r.cgst)}</td>
                    <td>{money(r.sgst)}</td>
                    <td>{money(r.tax)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="font-semibold">Total</td>
                  <td className="font-semibold">{money(gst.totals.taxable)}</td>
                  <td className="font-semibold">{money(gst.totals.cgst)}</td>
                  <td className="font-semibold">{money(gst.totals.sgst)}</td>
                  <td className="font-semibold">{money(gst.totals.tax)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SoftPanel>
      )}

      {tab === 'day' && daybook && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Invoices" value={String(daybook.summary.invoices)} />
          <MetricCard label="Sales" value={money(daybook.summary.sales)} />
          <MetricCard label="Collected" value={money(daybook.summary.collected)} tone="ok" />
          <MetricCard label="Expenses" value={money(daybook.summary.expenses)} tone="danger" />
          <MetricCard label="Net" value={money(daybook.summary.net)} />
        </div>
      )}

      <div className="mt-6">
        <Link href="/app/ledger" className="text-sm font-medium text-[var(--forest)]">
          {t('rep_openLedger')}
        </Link>
      </div>
    </AppShell>
  );
}
