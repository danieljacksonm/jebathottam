'use client';

import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useI18n } from '@/lib/i18n';
import {
  BookOpen,
  Keyboard,
  Languages,
  MousePointerClick,
  Printer,
  Smartphone,
  Wallet,
  Warehouse,
} from 'lucide-react';

export default function HelpPage() {
  const { t } = useI18n();

  const steps = [
    { title: t('help_step1_t'), text: t('help_step1_d') },
    { title: t('help_step2_t'), text: t('help_step2_d') },
    { title: t('help_step3_t'), text: t('help_step3_d') },
    { title: t('help_step4_t'), text: t('help_step4_d') },
  ];

  const extra = [
    { icon: Keyboard, title: t('help_kb_t'), text: t('help_kb_d') },
    { icon: Smartphone, title: t('help_phone_t'), text: t('help_phone_d') },
    { icon: MousePointerClick, title: t('help_mouse_t'), text: t('help_mouse_d') },
    { icon: Languages, title: t('help_lang_t'), text: t('help_lang_d') },
    { icon: Wallet, title: t('help_money_t'), text: t('help_money_d') },
    { icon: Warehouse, title: t('help_stock_t'), text: t('help_stock_d') },
  ];

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow mb-2">
            <BookOpen size={14} className="mr-1 inline" />
            {t('help')}
          </div>
          <h1 className="page-title">{t('help_title')}</h1>
          <p className="page-sub">{t('help_sub')}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <LanguageSwitcher />
          <p className="max-w-xs text-right text-xs text-[var(--muted)]">
            {t('help_langHint')}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((step, i) => (
          <div key={step.title} className="surface rounded-[28px] p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--forest)] text-sm font-bold text-[#f7f3eb]">
              {i + 1}
            </div>
            <h2 className="text-lg font-semibold">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {extra.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="surface rounded-[24px] p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--forest)]/10 text-[var(--forest)]">
                <Icon size={18} />
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.text}</p>
            </div>
          );
        })}
      </div>

      <div className="surface mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[28px] p-5">
        <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
          <Printer size={18} className="text-[var(--forest)]" />
          F1 = {t('help')} · F2 = {t('bill_keySearch')} · F8 = {t('bill_keySave')}
        </div>
        <Link href="/app/bills/new" className="btn-primary">
          {t('help_goBill')}
        </Link>
      </div>
    </AppShell>
  );
}
