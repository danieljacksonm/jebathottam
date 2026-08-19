'use client';

import { LANG_OPTIONS, useI18n, type Lang } from '@/lib/i18n';
import clsx from 'clsx';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      className={clsx(
        'inline-flex rounded-full border border-[var(--line-strong)] bg-white/80 p-0.5',
        compact ? 'text-[11px]' : 'text-xs',
      )}
      role="group"
      aria-label={t('language')}
    >
      {LANG_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setLang(opt.id as Lang)}
          className={clsx(
            'rounded-full px-2.5 py-1 font-semibold transition',
            lang === opt.id
              ? 'bg-[var(--forest)] text-[#f7f3eb]'
              : 'text-[var(--muted)] hover:text-[var(--ink)]',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
