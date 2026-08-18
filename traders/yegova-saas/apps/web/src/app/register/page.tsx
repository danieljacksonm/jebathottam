'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, saveSession, AuthSession } from '@/lib/api';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { friendlyError, useI18n } from '@/lib/i18n';

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const session = await api<AuthSession>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, shopName, email, password }),
      });
      saveSession(session);
      router.push('/app');
    } catch (err) {
      setError(friendlyError(err, t, 'err_register'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="surface w-full max-w-md rounded-[28px] p-8">
        <div className="flex items-start justify-between gap-3">
          <div className="font-display text-4xl text-[var(--ink)]">{t('brand')}</div>
          <LanguageSwitcher compact />
        </div>
        <h1 className="mt-3 text-xl font-semibold">{t('reg_title')}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{t('reg_sub')}</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="label">{t('reg_yourName')}</label>
            <input
              className="input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('ph_nameExample')}
            />
          </div>
          <div>
            <label className="label">{t('reg_shopName')}</label>
            <input
              className="input"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder={t('ph_shopExample')}
            />
          </div>
          <div>
            <label className="label">{t('login_email')}</label>
            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('ph_email')}
            />
          </div>
          <div>
            <label className="label">{t('login_password')}</label>
            <input
              className="input"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('ph_passwordMin')}
            />
          </div>
          {error && (
            <div className="rounded-2xl border border-[rgba(180,35,24,0.18)] bg-[rgba(180,35,24,0.06)] px-4 py-3 text-sm text-[var(--danger)]">
              {error}
            </div>
          )}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? t('reg_creating') : t('reg_create')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          {t('reg_haveAccount')}{' '}
          <Link href="/login" className="font-semibold text-[var(--forest)]">
            {t('login_btn')}
          </Link>
        </p>
      </div>
    </div>
  );
}
