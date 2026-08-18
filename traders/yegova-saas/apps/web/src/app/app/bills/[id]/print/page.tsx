'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ArrowLeft } from 'lucide-react';
import { api, getToken } from '@/lib/api';
import { friendlyError, useI18n } from '@/lib/i18n';
import { InvoiceDocument } from '@/components/InvoiceDocument';
import {
  InvoiceBill,
  PAPER_SIZES,
  PaperSizeId,
} from '@/lib/invoice';

export default function PrintBillPage() {
  const { t } = useI18n();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [bill, setBill] = useState<InvoiceBill | null>(null);
  const [error, setError] = useState('');
  const [paperId, setPaperId] = useState<PaperSizeId>('a4');

  const paper = useMemo(
    () => PAPER_SIZES.find((p) => p.id === paperId) || PAPER_SIZES[0],
    [paperId],
  );

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    const saved = localStorage.getItem('yegova_paper_size') as PaperSizeId | null;
    if (saved && PAPER_SIZES.some((p) => p.id === saved)) {
      setPaperId(saved);
    }
    api<InvoiceBill>(`/bills/${params.id}`)
      .then(setBill)
      .catch((e) => setError(friendlyError(e, t, 'err_load')));
  }, [params.id, router, t]);

  useEffect(() => {
    localStorage.setItem('yegova_paper_size', paperId);
    document.body.dataset.paper = paperId;
    return () => {
      delete document.body.dataset.paper;
    };
  }, [paperId]);

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-[var(--danger)]">{t('print_error')}: {error}</p>
        <Link href="/app/bills" className="mt-4 inline-block text-[var(--forest)]">
          {t('print_back')}
        </Link>
      </div>
    );
  }

  if (!bill) {
    return <div className="min-h-screen p-8 text-[var(--muted)]">{t('print_preparing')}</div>;
  }

  return (
    <div className="min-h-screen bg-[#e8e1d4]">
      <div className="print:hidden sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(255,252,247,0.92)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/app/bills')}
              className="btn-ghost !px-3 !py-2"
            >
              <ArrowLeft size={16} /> {t('print_back')}
            </button>
            <div>
              <div className="text-sm font-semibold">{bill.invoiceLabel}</div>
              <div className="text-xs text-[var(--muted)]">{t('print_choose')}</div>
            </div>
          </div>
          <button onClick={() => window.print()} className="btn-primary !py-2.5">
            <Printer size={16} /> {t('print_print')}
          </button>
        </div>

        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3">
          {PAPER_SIZES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPaperId(p.id)}
              className={`shrink-0 rounded-2xl border px-4 py-2.5 text-left transition ${
                paperId === p.id
                  ? 'border-[var(--forest)] bg-[var(--forest)] text-[#f7f3eb]'
                  : 'border-[var(--line-strong)] bg-white text-[var(--ink)] hover:bg-black/[0.03]'
              }`}
            >
              <div className="text-sm font-semibold">{p.label}</div>
              <div
                className={`text-[11px] ${
                  paperId === p.id ? 'text-white/75' : 'text-[var(--muted)]'
                }`}
              >
                {p.hint}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 print:max-w-none print:p-0">
        <div className="print:hidden mb-4 text-center text-xs text-[var(--muted)]">
          Preview · {paper.label} · Use browser print for PDF
        </div>
        <InvoiceDocument bill={bill} paper={paper} />
      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 8mm;
            size: ${
              paperId === 'a4'
                ? 'A4 portrait'
                : paperId === 'a4-landscape'
                  ? 'A4 landscape'
                  : paperId === 'a5'
                    ? 'A5 portrait'
                    : paperId === 'thermal-80'
                      ? '80mm auto'
                      : '58mm auto'
            };
          }
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .invoice-sheet {
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
