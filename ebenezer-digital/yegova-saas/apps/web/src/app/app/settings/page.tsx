'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { api, downloadJson, getUser, getToken, saveSession } from '@/lib/api';
import { Alert, PageHeader, SoftPanel } from '@/components/ui';
import { friendlyError, useI18n } from '@/lib/i18n';

type Shop = {
  id: string;
  name: string;
  gstin?: string | null;
  phone?: string | null;
  address?: string | null;
  bankAccount?: string | null;
  bankIfsc?: string | null;
  gpayPhone?: string | null;
  invoicePrefix?: string | null;
  quotePrefix?: string | null;
  lowStockAt?: number;
  plan: string;
};

export default function SettingsPage() {
  const { t } = useI18n();
  const [shop, setShop] = useState<Shop | null>(null);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);

  const [backupBusy, setBackupBusy] = useState(false);

  useEffect(() => {
    api<Shop>('/shop')
      .then(setShop)
      .catch((e) => setError(friendlyError(e, t, 'err_load')));
  }, [t]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!shop) return;
    setLoading(true);
    setError('');
    setOk('');
    try {
      const updated = await api<Shop>('/shop', {
        method: 'PATCH',
        body: JSON.stringify({
          name: shop.name,
          gstin: shop.gstin || '',
          phone: shop.phone || '',
          address: shop.address || '',
          bankAccount: shop.bankAccount || '',
          bankIfsc: shop.bankIfsc || '',
          gpayPhone: shop.gpayPhone || '',
          invoicePrefix: shop.invoicePrefix || 'INV',
          quotePrefix: shop.quotePrefix || 'QT',
          lowStockAt: Number(shop.lowStockAt ?? 10),
        }),
      });
      setShop(updated);
      const token = getToken();
      const user = getUser();
      if (token && user) {
        saveSession({
          accessToken: token,
          user,
          shop: {
            id: updated.id,
            name: updated.name,
            plan: updated.plan || 'free',
          },
        });
      }
      setOk(t('set_saved'));
    } catch (err) {
      setError(friendlyError(err, t, 'err_save'));
    } finally {
      setLoading(false);
    }
  }

  function setField<K extends keyof Shop>(key: K, value: Shop[K]) {
    setShop((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function downloadBackup() {
    setBackupBusy(true);
    setError('');
    setOk('');
    try {
      const data = await api<Record<string, unknown>>('/shop/backup');
      const name = `ebenezer-backup-${new Date().toISOString().slice(0, 10)}.json`;
      downloadJson(name, data);
      setOk(t('set_backupOk'));
    } catch (err) {
      setError(friendlyError(err, t, 'err_load'));
    } finally {
      setBackupBusy(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow={t('nav_setup')}
        title={t('set_title')}
        sub={t('set_sub')}
      />

      {!shop ? (
        <SoftPanel>
          <div className="text-sm text-[var(--muted)]">{error || t('set_loading')}</div>
        </SoftPanel>
      ) : (
        <SoftPanel title={t('set_profile')}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="inline-flex rounded-full border border-[var(--line-strong)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brass)]">
              {t('set_plan')}: {shop.plan === 'offline' ? 'offline' : t('land_priceTrial')}
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              <a className="font-semibold text-[var(--forest)]" href="/app/billing">
                {t('bill_title')} →
              </a>
            </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">{t('set_shopName')}</label>
              <input
                className="input"
                required
                value={shop.name}
                onChange={(e) => setField('name', e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t('set_gstin')}</label>
              <input
                className="input"
                value={shop.gstin || ''}
                onChange={(e) => setField('gstin', e.target.value)}
                placeholder="33AAAAA0000A1Z5"
              />
            </div>
            <div>
              <label className="label">{t('set_phone')}</label>
              <input
                className="input"
                value={shop.phone || ''}
                onChange={(e) => setField('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t('set_gpay')}</label>
              <input
                className="input"
                value={shop.gpayPhone || ''}
                onChange={(e) => setField('gpayPhone', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">{t('set_address')}</label>
              <input
                className="input"
                value={shop.address || ''}
                onChange={(e) => setField('address', e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t('set_bank')}</label>
              <input
                className="input"
                value={shop.bankAccount || ''}
                onChange={(e) => setField('bankAccount', e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t('set_ifsc')}</label>
              <input
                className="input"
                value={shop.bankIfsc || ''}
                onChange={(e) => setField('bankIfsc', e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t('set_invPrefix')}</label>
              <input
                className="input"
                value={shop.invoicePrefix || 'INV'}
                onChange={(e) => setField('invoicePrefix', e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t('set_quotePrefix')}</label>
              <input
                className="input"
                value={shop.quotePrefix || 'QT'}
                onChange={(e) => setField('quotePrefix', e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t('set_lowStock')}</label>
              <input
                className="input"
                type="number"
                min={0}
                value={shop.lowStockAt ?? 10}
                onChange={(e) => setField('lowStockAt', Number(e.target.value))}
              />
            </div>
          </div>

          {error && <Alert>{error}</Alert>}
          {ok && <Alert tone="ok">{ok}</Alert>}

          <button className="btn-primary" disabled={loading}>
            {loading ? t('bill_saving') : t('set_save')}
          </button>
        </form>
        </SoftPanel>
      )}

      <SoftPanel title={t('set_backup')} className="mt-6">
        <p className="mb-4 text-sm text-[var(--muted)]">{t('set_backupHint')}</p>
        <button
          type="button"
          className="btn-ghost"
          disabled={backupBusy}
          onClick={downloadBackup}
        >
          {backupBusy ? t('common_loading') : t('set_backup')}
        </button>
      </SoftPanel>
    </AppShell>
  );
}
