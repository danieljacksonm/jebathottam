export type PaperSizeId =
  | 'a4'
  | 'a4-landscape'
  | 'a5'
  | 'thermal-80'
  | 'thermal-58';

export type PaperSize = {
  id: PaperSizeId;
  label: string;
  hint: string;
  /** CSS width for on-screen preview */
  previewWidth: string;
  /** @page size value */
  pageSize: string;
  compact: boolean;
};

export const PAPER_SIZES: PaperSize[] = [
  {
    id: 'a4',
    label: 'A4',
    hint: 'Full tax invoice',
    previewWidth: '210mm',
    pageSize: 'A4 portrait',
    compact: false,
  },
  {
    id: 'a4-landscape',
    label: 'A4 Landscape',
    hint: 'Wide invoice',
    previewWidth: '297mm',
    pageSize: 'A4 landscape',
    compact: false,
  },
  {
    id: 'a5',
    label: 'A5',
    hint: 'Half page',
    previewWidth: '148mm',
    pageSize: 'A5 portrait',
    compact: false,
  },
  {
    id: 'thermal-80',
    label: 'Thermal 80mm',
    hint: 'Shop printer',
    previewWidth: '80mm',
    pageSize: '80mm',
    compact: true,
  },
  {
    id: 'thermal-58',
    label: 'Thermal 58mm',
    hint: 'Small roll',
    previewWidth: '58mm',
    pageSize: '58mm',
    compact: true,
  },
];

export function money(n: number) {
  return `₹${Number(n || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export type InvoiceBill = {
  id: string;
  invoiceLabel: string;
  billDate: string;
  docType?: string;
  subtotal: number;
  discount?: number;
  taxTotal: number;
  roundOff?: number;
  grandTotal: number;
  paidAmount: number;
  paymentMode?: string;
  status: string;
  notes?: string | null;
  dueDate?: string | null;
  customer?: {
    name: string;
    phone?: string | null;
    gstin?: string | null;
    address?: string | null;
  } | null;
  shop?: {
    name: string;
    gstin?: string | null;
    phone?: string | null;
    address?: string | null;
    bankAccount?: string | null;
    bankIfsc?: string | null;
    gpayPhone?: string | null;
  } | null;
  items: Array<{
    name: string;
    qty: number;
    price: number;
    gstRate: number;
    lineTotal: number;
    discount?: number;
  }>;
};
