'use client';

import clsx from 'clsx';
import { ReactNode } from 'react';
import { useI18n } from '@/lib/i18n';

export function money(n: number) {
  return `Rs ${Number(n || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`;
}

export function PageHeader({
  eyebrow,
  title,
  sub,
  actions,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h1 className="page-title">{title}</h1>
        {sub && <p className="page-sub">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n();
  const key = status.toLowerCase();
  const cls =
    key === 'paid' || key === 'converted' || key === 'ok'
      ? 'badge-paid'
      : key === 'void' || key === 'unpaid' || key === 'danger'
        ? 'badge-unpaid'
        : key === 'partial' || key === 'draft'
          ? 'badge-partial'
          : 'badge-neutral';
  const labels: Record<string, string> = {
    paid: t('status_paid'),
    unpaid: t('status_unpaid'),
    partial: t('status_partial'),
    void: t('status_void'),
    draft: t('status_draft'),
    converted: t('status_converted'),
  };
  return <span className={clsx('badge', cls)}>{labels[key] || status}</span>;
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="font-display text-2xl text-[var(--ink)]">{title}</div>
      {hint && <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--muted)]">{hint}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function SoftPanel({
  children,
  className,
  title,
  aside,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  aside?: ReactNode;
}) {
  return (
    <section className={clsx('surface rounded-[28px] p-5 md:p-6', className)}>
      {(title || aside) && (
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          {title && <h2 className="panel-title">{title}</h2>}
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'danger' | 'ok' | 'brass';
}) {
  const valueColor =
    tone === 'danger'
      ? 'text-[var(--danger)]'
      : tone === 'ok'
        ? 'text-[var(--ok)]'
        : tone === 'brass'
          ? 'text-[var(--brass)]'
          : '';
  return (
    <div className="surface rounded-[24px] p-5">
      <div className="text-[11px] font-medium tracking-[0.02em] text-[var(--muted)]">
        {label}
      </div>
      <div className={clsx('stat-value mt-2 text-[1.7rem]', valueColor)}>{value}</div>
      {hint && <div className="mt-2 text-xs text-[var(--muted)]">{hint}</div>}
    </div>
  );
}

export function Alert({
  children,
  tone = 'danger',
}: {
  children: ReactNode;
  tone?: 'danger' | 'ok';
}) {
  return (
    <div
      role="status"
      className={clsx(
        'mb-4 flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm leading-relaxed',
        tone === 'danger'
          ? 'border-[rgba(180,35,24,0.18)] bg-[rgba(180,35,24,0.06)] text-[var(--danger)]'
          : 'border-[rgba(31,122,77,0.2)] bg-[rgba(31,122,77,0.07)] text-[var(--ok)]',
      )}
    >
      <span
        aria-hidden
        className={clsx(
          'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
          tone === 'danger'
            ? 'bg-[rgba(180,35,24,0.12)]'
            : 'bg-[rgba(31,122,77,0.14)]',
        )}
      >
        {tone === 'danger' ? '!' : '✓'}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
