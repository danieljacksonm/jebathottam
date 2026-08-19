'use client';

import {
  Activity,
  BarChart3,
  ClipboardList,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  Receipt,
  Settings,
  UserPlus,
  Users,
  Wallet,
  Warehouse,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, getShop, getUser } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [shopName, setShopName] = useState('Workspace');
  const [userName, setUserName] = useState('');
  const [planNote, setPlanNote] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('yegova_token');
    if (!token) {
      router.replace('/login');
      return;
    }
    setShopName(getShop()?.name || t('freeWorkspace'));
    setUserName(getUser()?.name || '');
    setPlanNote(t('bill_webFree'));
  }, [router, t]);

  const groups = useMemo(
    () => [
      {
        label: t('nav_workspace'),
        links: [
          { href: '/app', label: t('nav_overview'), icon: LayoutDashboard },
          { href: '/app/bills/new', label: t('nav_newBill'), icon: Plus },
        ],
      },
      {
        label: t('nav_sales'),
        links: [
          { href: '/app/bills', label: t('nav_invoices'), icon: FileText },
          { href: '/app/quotes', label: t('nav_quotes'), icon: ClipboardList },
          { href: '/app/customers', label: t('nav_customers'), icon: Users },
          { href: '/app/ledger', label: t('nav_ledger'), icon: Receipt },
        ],
      },
      {
        label: t('nav_ops'),
        links: [
          { href: '/app/products', label: t('nav_products'), icon: Package },
          { href: '/app/stock', label: t('nav_stock'), icon: Warehouse },
          { href: '/app/expenses', label: t('nav_expenses'), icon: Wallet },
          { href: '/app/reports', label: t('nav_reports'), icon: BarChart3 },
        ],
      },
      {
        label: t('nav_setup'),
        links: [
          { href: '/app/team', label: t('nav_team'), icon: UserPlus },
          { href: '/app/activity', label: t('nav_activity'), icon: Activity },
          { href: '/app/help', label: t('nav_help'), icon: HelpCircle },
          { href: '/app/settings', label: t('nav_settings'), icon: Settings },
          { href: '/app/billing', label: t('bill_title'), icon: Wallet },
        ],
      },
    ],
    [t],
  );

  const flatLinks = groups.flatMap((g) => g.links);

  function logout() {
    clearSession();
    router.replace('/login');
  }

  function isActive(href: string) {
    return pathname === href || (href !== '/app' && pathname.startsWith(href));
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="relative hidden overflow-hidden border-r border-[var(--line)] bg-[var(--paper-deep)] px-4 py-6 lg:flex lg:flex-col">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40"
          style={{
            background:
              'radial-gradient(420px 160px at 20% 0%, rgba(31,77,58,0.12), transparent 70%)',
          }}
        />
        <div className="relative px-2">
          <div className="font-display text-[2rem] tracking-tight text-[var(--forest)]">
            {t('brand')}
          </div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            {shopName}
          </div>
          <div className="mt-3">
            <LanguageSwitcher compact />
          </div>
        </div>

        <nav className="relative mt-6 flex-1 space-y-5 overflow-y-auto pr-1">
          {groups.map((group) => (
            <div key={group.label}>
              <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brass)]">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.links.map((link) => {
                  const active = isActive(link.href);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={clsx(
                        'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition',
                        active
                          ? 'bg-[var(--forest)] text-[#f7f3eb] shadow-[0_10px_24px_rgba(31,77,58,0.22)]'
                          : 'text-[var(--ink)] hover:bg-white/65',
                      )}
                    >
                      <Icon size={16} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <button
          onClick={logout}
          className="relative mt-4 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-[var(--muted)] hover:bg-white/65"
        >
          <LogOut size={16} />
          {t('signOut')}
        </button>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--paper)]/88 px-4 py-3 backdrop-blur-md lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="lg:hidden">
              <div className="font-display text-xl text-[var(--forest)]">{t('brand')}</div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <LanguageSwitcher compact />
              <Link
                href="/app/help"
                className="hidden rounded-full border border-[var(--line-strong)] px-3 py-1.5 text-xs font-semibold text-[var(--forest)] sm:inline-flex"
              >
                {t('help')}
              </Link>
              <div className="hidden text-right sm:block">
                <div className="text-sm font-medium text-[var(--ink)]">{userName}</div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
                  {planNote || t('freeWorkspace')}
                </div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--forest)] text-xs font-semibold text-[#f7f3eb]">
                {(userName || 'Y').slice(0, 1).toUpperCase()}
              </div>
            </div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {flatLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition',
                    active
                      ? 'bg-[var(--forest)] text-[#f7f3eb]'
                      : 'bg-white/60 text-[var(--muted)]',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="px-4 py-6 lg:px-8 lg:py-8"
        >
          {planNote ? (
            <Link
              href="/app/billing"
              className="mb-5 block rounded-2xl border border-[var(--line-strong)] bg-white/70 px-4 py-3 text-sm font-medium text-[var(--forest)]"
            >
              {planNote} →
            </Link>
          ) : null}
          {children}
        </motion.main>
      </div>
    </div>
  );
}
