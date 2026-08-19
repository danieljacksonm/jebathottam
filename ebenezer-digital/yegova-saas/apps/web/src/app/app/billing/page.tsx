'use client';

import { useI18n } from '@/lib/i18n';
import { AppShell } from '@/components/AppShell';
import { PageHeader, SoftPanel } from '@/components/ui';

export default function BillingPage() {
  const { t } = useI18n();

  return (
    <AppShell>
      <PageHeader
        eyebrow={t('nav_setup')}
        title={t('bill_title')}
        sub={t('bill_sub')}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SoftPanel title={t('land_priceTrial')}>
          <p className="text-sm text-[var(--muted)]">{t('land_priceTrialD')}</p>
          <p className="mt-4 font-semibold text-[var(--forest)]">
            {t('bill_webFree')}
          </p>
        </SoftPanel>

        <SoftPanel title={t('land_priceOnline')}>
          <p className="text-sm text-[var(--muted)]">{t('land_priceOnlineD')}</p>
          <p className="mt-4 text-sm font-medium">{t('bill_pay')}</p>
        </SoftPanel>

        <SoftPanel title={t('land_priceOffline')}>
          <p className="text-sm text-[var(--muted)]">{t('land_priceOfflineD')}</p>
          <p className="mt-3 text-sm text-[var(--muted)]">{t('bill_offlineHint')}</p>
        </SoftPanel>
      </div>
    </AppShell>
  );
}
