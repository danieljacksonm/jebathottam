'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function HomePage() {
  const { t } = useI18n();
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 600px at 15% -10%, rgba(31,77,58,0.16), transparent 55%), radial-gradient(900px 500px at 85% 10%, rgba(154,120,64,0.18), transparent 50%), linear-gradient(165deg, #0d1a14 0%, #152820 40%, #1a2e24 100%)',
        }}
      />
      <motion.div
        className="pointer-events-none absolute -left-20 top-32 h-80 w-80 rounded-full blur-3xl"
        style={{ background: 'rgba(196,163,106,0.2)' }}
        animate={{ y: [0, 28, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full blur-3xl"
        style={{ background: 'rgba(47,107,82,0.25)' }}
        animate={{ x: [0, -24, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <div className="font-display text-4xl text-[#f7f3eb] md:text-5xl">{t('brand')}</div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher compact />
          <Link
            href="/login"
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-[#f7f3eb]"
          >
            {t('login_btn')}
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#c4a36a] px-5 py-2.5 text-sm font-semibold text-[#1a1408]"
          >
            {t('login_register')}
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl flex-col justify-center px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#c4a36a]">
            {t('land_kicker')}
          </p>
          <h1 className="font-display text-5xl leading-[1.02] text-[#f7f3eb] md:text-7xl">
            {t('land_h1')}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#d7e4dc] md:text-lg">
            {t('land_p')}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-full bg-[#c4a36a] px-6 py-3.5 text-sm font-semibold text-[#1a1408]"
            >
              {t('land_open')}
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-[#f7f3eb]"
            >
              {t('land_signinShop')}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="mt-16 hidden overflow-hidden rounded-[28px] border border-white/10 p-1 backdrop-blur md:block"
          style={{ background: 'rgba(255,252,247,0.06)' }}
        >
          <div
            className="rounded-[24px] p-6 text-[#171a17]"
            style={{
              background: 'linear-gradient(135deg, #fffcf7, #efe8dc)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-[#9a7840]">
                  {t('land_preview')}
                </div>
                <div className="font-display mt-1 text-3xl">{t('home_today')} {'\u20B9'}48,260</div>
              </div>
              <div className="rounded-full bg-[#1f4d3a] px-4 py-2 text-xs font-semibold text-[#f7f3eb]">
                {t('land_newInv')}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[t('land_bills', { n: 12 }), t('land_products', { n: 86 }), t('land_customers', { n: 41 })].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-black/5 bg-white/70 px-4 py-5 text-sm font-medium"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              price: t('land_priceTrial'),
              text: t('land_priceTrialD'),
              href: '/register',
              cta: t('land_open'),
            },
            {
              price: t('land_priceOnline'),
              text: t('land_priceOnlineD'),
              href: '/register',
              cta: t('land_priceOnline'),
            },
            {
              price: t('land_priceOffline'),
              text: t('land_priceOfflineD'),
              href: '/register',
              cta: t('land_priceOffline'),
            },
          ].map((card) => (
            <div
              key={card.price}
              className="rounded-[24px] border border-white/15 p-5 text-[#f7f3eb]"
              style={{ background: 'rgba(255,252,247,0.06)' }}
            >
              <div className="font-display text-3xl">{card.price}</div>
              <p className="mt-3 text-sm leading-relaxed text-[#d7e4dc]">{card.text}</p>
              <Link
                href={card.href}
                className="mt-5 inline-flex rounded-full bg-[#c4a36a] px-4 py-2 text-xs font-semibold text-[#1a1408]"
              >
                {card.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-sm text-[#d7e4dc]">{t('land_priceNote')}</p>
      </main>
    </div>
  );
}
