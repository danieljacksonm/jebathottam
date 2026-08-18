'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { api } from '@/lib/api';
import { friendlyError, useI18n } from '@/lib/i18n';
import {
  Alert,
  EmptyState,
  PageHeader,
  SoftPanel,
} from '@/components/ui';

type Log = {
  id: string;
  action: string;
  userName?: string | null;
  detail?: string | null;
  createdAt: string;
};

export default function ActivityPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Log[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Log[]>('/activity')
      .then(setItems)
      .catch((e) => setError(friendlyError(e, t, 'err_load')));
  }, [t]);

  function actionLabel(action: string) {
    const map: Record<string, string> = {
      'bill.create': t('nav_newBill'),
      'quote.create': t('nav_quotes'),
      'credit.create': t('bill_credit'),
      'bill.payment': t('bill_paid'),
      'bill.void': t('status_void'),
      'staff.add': t('team_add'),
      'staff.role': t('team_role'),
      'staff.remove': t('team_remove'),
      'shop.update': t('set_save'),
    };
    return map[action] || action;
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow={t('nav_setup')}
        title={t('act_title')}
        sub={t('act_sub')}
      />

      {error && <Alert>{error}</Alert>}

      <SoftPanel title={t('act_title')}>
        {items.length === 0 ? (
          <EmptyState title={t('act_empty')} hint={t('act_emptyHint')} />
        ) : (
          <div className="table-wrap border-0">
            <table className="data">
              <thead>
                <tr>
                  <th>{t('act_when')}</th>
                  <th>{t('act_who')}</th>
                  <th>{t('act_what')}</th>
                  <th>{t('act_detail')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id}>
                    <td className="whitespace-nowrap text-[var(--muted)]">
                      {new Date(row.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td className="font-medium">{row.userName || '—'}</td>
                    <td>
                      <span className="badge badge-neutral">
                        {actionLabel(row.action)}
                      </span>
                    </td>
                    <td className="text-[var(--muted)]">{row.detail || '—'}</td>
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
