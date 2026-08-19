'use client';

import { InvoiceBill, PaperSize, money } from '@/lib/invoice';
import { payModeLabel, useI18n } from '@/lib/i18n';

export function InvoiceDocument({
  bill,
  paper,
}: {
  bill: InvoiceBill;
  paper: PaperSize;
}) {
  const { t } = useI18n();
  const shop = bill.shop;
  const customer = bill.customer;
  const compact = paper.compact;
  const docTitle =
    bill.docType === 'quote'
      ? t('bill_quote')
      : bill.docType === 'credit_note'
        ? t('bill_credit')
        : t('print_taxInvoice');
  const partyName = customer?.name || t('print_walkin');
  const shopName = shop?.name || t('print_shop');

  if (compact) {
    return (
      <div
        className="invoice-sheet mx-auto bg-white text-black"
        style={{ width: paper.previewWidth, maxWidth: '100%' }}
      >
        <div className="px-2 py-3 font-mono text-[11px] leading-snug">
          <div className="text-center">
            <div className="text-sm font-bold uppercase">{shopName}</div>
            {shop?.address && <div className="mt-1 opacity-80">{shop.address}</div>}
            {shop?.phone && (
              <div>
                {t('common_phone')}: {shop.phone}
              </div>
            )}
            {shop?.gstin && (
              <div>
                {t('common_gstin')}: {shop.gstin}
              </div>
            )}
            <div className="my-2 border-t border-dashed border-black/40" />
            <div className="font-bold">{bill.invoiceLabel}</div>
            <div>{new Date(bill.billDate).toLocaleString('en-IN')}</div>
          </div>

          <div className="mt-2">
            <div>
              {t('print_to')}: {partyName}
            </div>
            {customer?.phone && (
              <div>
                {t('common_phone')}: {customer.phone}
              </div>
            )}
          </div>

          <div className="my-2 border-t border-dashed border-black/40" />
          {bill.items.map((item, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-semibold">{item.name}</div>
              <div className="flex justify-between opacity-90">
                <span>
                  {item.qty} x {money(item.price)}
                  {item.gstRate > 0 ? ` +${item.gstRate}%` : ''}
                </span>
                <span>{money(item.lineTotal)}</span>
              </div>
            </div>
          ))}

          <div className="border-t border-dashed border-black/40 pt-2">
            <div className="flex justify-between">
              <span>{t('bill_subtotal')}</span>
              <span>{money(bill.subtotal)}</span>
            </div>
            {(bill.discount || 0) > 0 && (
              <div className="flex justify-between">
                <span>{t('bill_discount')}</span>
                <span>-{money(bill.discount || 0)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{t('bill_tax')}</span>
              <span>{money(bill.taxTotal)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm font-bold">
              <span>{t('bill_total')}</span>
              <span>{money(bill.grandTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('bill_paid')}</span>
              <span>{money(bill.paidAmount)}</span>
            </div>
            {bill.paymentMode && (
              <div className="flex justify-between">
                <span>{t('print_mode')}</span>
                <span>{payModeLabel(bill.paymentMode, t)}</span>
              </div>
            )}
          </div>

          {(shop?.gpayPhone || shop?.bankAccount) && (
            <div className="mt-3 border-t border-dashed border-black/40 pt-2 text-center">
              {shop?.gpayPhone && <div>UPI/GPay: {shop.gpayPhone}</div>}
              {shop?.bankAccount && (
                <div>
                  {t('print_account')}: {shop.bankAccount}
                </div>
              )}
              {shop?.bankIfsc && <div>IFSC: {shop.bankIfsc}</div>}
            </div>
          )}

          <div className="mt-3 text-center opacity-70">{t('print_thanks')}</div>
        </div>
      </div>
    );
  }

  const wide = paper.id === 'a4-landscape';

  return (
    <div
      className="invoice-sheet mx-auto bg-white text-[#171a17]"
      style={{ width: paper.previewWidth, maxWidth: '100%' }}
    >
      <div className={`p-8 ${wide ? 'md:p-10' : ''}`}>
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-black/10 pb-5">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a7840]">
              {docTitle}
            </div>
            <h1 className="mt-1 font-[Georgia,serif] text-3xl tracking-tight">
              {shopName}
            </h1>
            {shop?.address && (
              <p className="mt-2 max-w-sm text-sm text-black/65">{shop.address}</p>
            )}
            <div className="mt-2 space-y-0.5 text-sm text-black/70">
              {shop?.phone && (
                <div>
                  {t('common_phone')}: {shop.phone}
                </div>
              )}
              {shop?.gstin && (
                <div>
                  {t('common_gstin')}: {shop.gstin}
                </div>
              )}
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="text-xl font-semibold">{bill.invoiceLabel}</div>
            <div className="mt-1 text-black/70">
              {t('common_date')}: {new Date(bill.billDate).toLocaleDateString('en-IN')}
            </div>
            <div className="mt-1 text-black/70">
              {t('common_status')}:{' '}
              {bill.status === 'paid'
                ? t('status_paid')
                : bill.status === 'unpaid'
                  ? t('status_unpaid')
                  : bill.status === 'partial'
                    ? t('status_partial')
                    : bill.status === 'void'
                      ? t('status_void')
                      : bill.status === 'draft'
                        ? t('status_draft')
                        : bill.status === 'converted'
                          ? t('status_converted')
                          : bill.status}
            </div>
          </div>
        </div>

        <div className={`mt-6 grid gap-6 ${wide ? 'md:grid-cols-2' : ''}`}>
          <div className="rounded-2xl bg-[#f7f3eb] p-4 text-sm">
            <div className="text-[10px] font-semibold tracking-[0.08em] text-black/45">
              {t('print_to')}
            </div>
            <div className="mt-1 text-base font-semibold">{partyName}</div>
            {customer?.phone && (
              <div className="text-black/70">
                {t('common_phone')}: {customer.phone}
              </div>
            )}
            {customer?.gstin && (
              <div className="text-black/70">
                {t('common_gstin')}: {customer.gstin}
              </div>
            )}
            {customer?.address && (
              <div className="text-black/70">{customer.address}</div>
            )}
          </div>
        </div>

        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-black/15 text-left text-[10px] tracking-[0.06em] text-black/45">
              <th className="py-3 pr-2">{t('bill_items')}</th>
              <th className="py-3 text-right">{t('bill_qty')}</th>
              <th className="py-3 text-right">{t('prod_price')}</th>
              <th className="py-3 text-right">{t('prod_gst')}</th>
              <th className="py-3 text-right">{t('common_amount')}</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, idx) => (
              <tr key={idx} className="border-b border-black/8">
                <td className="py-3 pr-2 font-medium">{item.name}</td>
                <td className="py-3 text-right">{item.qty}</td>
                <td className="py-3 text-right">{money(item.price)}</td>
                <td className="py-3 text-right">{item.gstRate}%</td>
                <td className="py-3 text-right font-medium">{money(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex flex-wrap justify-between gap-6">
          <div className="max-w-xs text-sm text-black/65">
            {(shop?.bankAccount || shop?.gpayPhone) && (
              <>
                <div className="font-semibold text-black">{t('print_payDetails')}</div>
                {shop?.gpayPhone && <div>GPay / UPI: {shop.gpayPhone}</div>}
                {shop?.bankAccount && (
                  <div>
                    {t('print_account')}: {shop.bankAccount}
                  </div>
                )}
                {shop?.bankIfsc && <div>IFSC: {shop.bankIfsc}</div>}
              </>
            )}
            {bill.notes && (
              <div className="mt-3">
                {t('bill_notes')}: {bill.notes}
              </div>
            )}
          </div>

          <div className="min-w-[220px] space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-black/60">{t('bill_subtotal')}</span>
              <span>{money(bill.subtotal)}</span>
            </div>
            {(bill.discount || 0) > 0 && (
              <div className="flex justify-between">
                <span className="text-black/60">{t('bill_discount')}</span>
                <span>-{money(bill.discount || 0)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-black/60">{t('bill_tax')}</span>
              <span>{money(bill.taxTotal)}</span>
            </div>
            {Math.abs(bill.roundOff || 0) > 0.001 && (
              <div className="flex justify-between">
                <span className="text-black/60">{t('print_round')}</span>
                <span>{money(bill.roundOff || 0)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-black/15 pt-2 text-base font-semibold">
              <span>{t('bill_total')}</span>
              <span>{money(bill.grandTotal)}</span>
            </div>
            <div className="flex justify-between text-black/70">
              <span>
                {t('bill_paid')} ({payModeLabel(bill.paymentMode || 'cash', t)})
              </span>
              <span>{money(bill.paidAmount)}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-[11px] tracking-wide text-black/40">
          {t('print_footer')}
        </div>
      </div>
    </div>
  );
}
