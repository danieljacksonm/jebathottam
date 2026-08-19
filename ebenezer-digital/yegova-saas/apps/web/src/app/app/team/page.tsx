'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { api, getUser } from '@/lib/api';
import { friendlyError, useI18n } from '@/lib/i18n';
import {
  Alert,
  EmptyState,
  MetricCard,
  PageHeader,
  SoftPanel,
} from '@/components/ui';

type Member = {
  id: string;
  role: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
};

export default function TeamPage() {
  const { t } = useI18n();
  const me = getUser();
  const [items, setItems] = useState<Member[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('cashier');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setItems(await api<Member[]>('/team'));
  }

  useEffect(() => {
    load().catch((e) => setError(friendlyError(e, t, 'err_load')));
  }, [t]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setOk('');
    setLoading(true);
    try {
      await api('/team', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });
      setName('');
      setEmail('');
      setPassword('');
      setRole('cashier');
      setOk(t('team_add'));
      await load();
    } catch (err) {
      setError(friendlyError(err, t, 'err_save'));
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(id: string, next: string) {
    setError('');
    try {
      await api(`/team/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role: next }),
      });
      await load();
    } catch (err) {
      setError(friendlyError(err, t, 'err_save'));
    }
  }

  async function remove(id: string) {
    if (!confirm(t('common_confirmDelete'))) return;
    setError('');
    try {
      await api(`/team/${id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(friendlyError(err, t, 'err_save'));
    }
  }

  function roleLabel(r: string) {
    if (r === 'owner') return t('team_owner');
    if (r === 'manager') return t('team_manager');
    return t('team_cashier');
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow={t('nav_setup')}
        title={t('team_title')}
        sub={t('team_sub')}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <MetricCard label={t('team_members')} value={String(items.length)} />
        <MetricCard
          label={t('team_cashier')}
          value={String(items.filter((m) => m.role === 'cashier').length)}
        />
      </div>

      <SoftPanel title={t('team_add')} className="mb-6">
        <p className="mb-4 text-sm text-[var(--muted)]">{t('team_roleHint')}</p>
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="label">{t('team_name')}</label>
            <input
              className="input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="label">{t('team_email')}</label>
            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label">{t('team_password')}</label>
            <input
              className="input"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="label">{t('team_role')}</label>
            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="cashier">{t('team_cashier')}</option>
              <option value="manager">{t('team_manager')}</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? t('common_loading') : t('team_add')}
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-3">
            <Alert>{error}</Alert>
          </div>
        )}
        {ok && (
          <div className="mt-3">
            <Alert tone="ok">{ok}</Alert>
          </div>
        )}
      </SoftPanel>

      <SoftPanel title={t('team_members')}>
        {items.length === 0 ? (
          <EmptyState title={t('team_empty')} hint={t('team_emptyHint')} />
        ) : (
          <div className="table-wrap border-0">
            <table className="data">
              <thead>
                <tr>
                  <th>{t('team_name')}</th>
                  <th>{t('team_email')}</th>
                  <th>{t('team_role')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((m) => {
                  const isMe = m.user.id === me?.id;
                  return (
                    <tr key={m.id}>
                      <td className="font-medium">
                        {m.user.name}
                        {isMe ? (
                          <span className="ml-2 text-xs text-[var(--muted)]">
                            ({t('team_you')})
                          </span>
                        ) : null}
                      </td>
                      <td className="text-[var(--muted)]">{m.user.email}</td>
                      <td>
                        {m.role === 'owner' ? (
                          <span className="badge badge-ok">{roleLabel(m.role)}</span>
                        ) : (
                          <select
                            className="input max-w-[9rem] py-2"
                            value={m.role}
                            onChange={(e) => changeRole(m.id, e.target.value)}
                          >
                            <option value="cashier">{t('team_cashier')}</option>
                            <option value="manager">{t('team_manager')}</option>
                          </select>
                        )}
                      </td>
                      <td>
                        {m.role !== 'owner' && !isMe ? (
                          <button
                            type="button"
                            className="text-sm font-medium text-[var(--danger)]"
                            onClick={() => remove(m.id)}
                          >
                            {t('team_remove')}
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SoftPanel>
    </AppShell>
  );
}
