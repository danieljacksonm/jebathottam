'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { api } from '@/lib/api';
import { expenseCategoryLabel, friendlyError, payModeLabel, useI18n } from '@/lib/i18n';
import {
  Alert,
  EmptyState,
  MetricCard,
  PageHeader,
  SoftPanel,
  money,
} from '@/components/ui';

type Expense = {
  id: string;
  title: string;
  category: string;
  amount: number;
  paymentMode: string;
  expenseDate: string;
  notes?: string | null;
};

export default function ExpensesPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Expense[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [error, setError] = useState('');

  async function load() {
    setItems(await api<Expense[]>('/expenses'));
  }

  useEffect(() => {
    load().catch((e) => setError(friendlyError(e, t, 'err_load')));
  }, [t]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api('/expenses', {
        method: 'POST',
        body: JSON.stringify({
          title,
          category,
          amount: Number(amount),
          paymentMode,
        }),
      });
      setTitle('');
      setAmount('');
      await load();
    } catch (err) {
      setError(friendlyError(err, t, 'err_save'));
    }
  }

  async function remove(id: string) {
    if (!confirm(t('common_confirmDelete'))) return;
    await api(`/expenses/${id}`, { method: 'DELETE' });
    await load();
  }

  const total = items.reduce((s, e) => s + e.amount, 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow={t('nav_ops')}
        title={t('exp_title')}
        sub={t('exp_sub')}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MetricCard label={t('exp_entries')} value={String(items.length)} />
        <MetricCard label={t('exp_spend')} value={money(total)} tone="danger" />
        <MetricCard
          label={t('exp_latest')}
          value={items[0] ? money(items[0].amount) : '—'}
          hint={items[0]?.title}
        />
      </div>

      <SoftPanel title={t('exp_add')} className="mb-6">
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-5">
          <div className="md:col-span-2">
            <label className="label">{t('exp_titleField')}</label>
            <input
              className="input"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('exp_phTitle')}
            />
          </div>
          <div>
            <label className="label">{t('exp_cat')}</label>
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="General">{t('exp_catGeneral')}</option>
              <option value="Rent">{t('exp_catRent')}</option>
              <option value="Salary">{t('exp_catSalary')}</option>
              <option value="Transport">{t('exp_catTransport')}</option>
              <option value="Utilities">{t('exp_catUtilities')}</option>
              <option value="Purchase">{t('exp_catPurchase')}</option>
              <option value="Marketing">{t('exp_catMarketing')}</option>
            </select>
          </div>
          <div>
            <label className="label">{t('exp_amount')}</label>
            <input
              className="input"
              required
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2">
            <select
              className="input"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="cash">{t('bill_cash')}</option>
              <option value="upi">{t('bill_upi')}</option>
              <option value="card">{t('bill_card')}</option>
              <option value="bank">{t('bill_bank')}</option>
            </select>
            <button className="btn-primary">{t('common_add')}</button>
          </div>
        </form>
        {error && (
          <div className="mt-3">
            <Alert>{error}</Alert>
          </div>
        )}
      </SoftPanel>

      <SoftPanel title={t('exp_book')}>
        {items.length === 0 ? (
          <EmptyState title={t('exp_empty')} hint={t('exp_emptyHint')} />
        ) : (
          <div className="table-wrap border-0">
            <table className="data">
              <thead>
                <tr>
                  <th>{t('common_date')}</th>
                  <th>{t('exp_titleField')}</th>
                  <th>{t('exp_cat')}</th>
                  <th>{t('bill_payMode')}</th>
                  <th>{t('common_amount')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((e) => (
                  <tr key={e.id}>
                    <td>{new Date(e.expenseDate).toLocaleDateString('en-IN')}</td>
                    <td className="font-medium">{e.title}</td>
                    <td>
                      <span className="badge badge-neutral">
                        {expenseCategoryLabel(e.category, t)}
                      </span>
                    </td>
                    <td className="text-[var(--muted)]">
                      {payModeLabel(e.paymentMode, t)}
                    </td>
                    <td className="font-medium">{money(e.amount)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => remove(e.id)}
                        className="text-sm font-medium text-[var(--danger)]"
                      >
                        {t('common_delete')}
                      </button>
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
