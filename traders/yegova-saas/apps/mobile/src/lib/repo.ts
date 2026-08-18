import { api } from './api';
import { assertCanUseApp } from './license';
import {
  enqueue,
  isLocalId,
  isOnline,
  loadCache,
  localId,
  pendingCount,
  saveCache,
  syncAll,
} from './offline';

async function requirePaidOrTrial() {
  await assertCanUseApp();
}

function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getCache() {
  return loadCache();
}

export async function getPending() {
  return pendingCount();
}

export async function refreshFromServer() {
  return syncAll();
}

export function computeStats(cache: Awaited<ReturnType<typeof loadCache>>) {
  const start = todayStart();
  const todayBills = cache.bills.filter(
    (b) =>
      b.docType !== 'quote' &&
      b.status !== 'void' &&
      new Date(b.billDate || b.createdAt) >= start,
  );
  const todaySales = todayBills.reduce(
    (s, b) => s + Number(b.grandTotal || 0),
    0,
  );
  const lowAt = cache.shop?.lowStockAt ?? 10;
  const lowStock = cache.products.filter(
    (p) => p.active !== false && Number(p.stock || 0) <= lowAt,
  );
  return {
    todaySales,
    todayBills: todayBills.length,
    totalBills: cache.bills.filter((b) => b.status !== 'void').length,
    products: cache.products.filter((p) => p.active !== false).length,
    customers: cache.customers.length,
    lowStockCount: lowStock.length,
    lowStock: lowStock.slice(0, 8),
    recent: [...cache.bills]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.billDate).getTime() -
          new Date(a.createdAt || a.billDate).getTime(),
      )
      .slice(0, 8),
    shopName: cache.shop?.name,
    plan: cache.shop?.plan || 'free',
  };
}

export function computeReports(
  cache: Awaited<ReturnType<typeof loadCache>>,
  from: string,
  to: string,
) {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(23, 59, 59, 999);
  const bills = cache.bills.filter((b) => {
    const d = new Date(b.billDate || b.createdAt);
    return (
      b.status !== 'void' &&
      b.docType !== 'quote' &&
      d >= start &&
      d <= end
    );
  });
  const expenses = cache.expenses.filter((e) => {
    const d = new Date(e.expenseDate || e.createdAt);
    return d >= start && d <= end;
  });
  const totalSales = bills.reduce((s, b) => s + Number(b.grandTotal || 0), 0);
  const totalTax = bills.reduce((s, b) => s + Number(b.taxTotal || 0), 0);
  const totalPaid = bills.reduce((s, b) => s + Number(b.paidAmount || 0), 0);
  const outstanding = bills
    .filter((b) => b.status !== 'paid')
    .reduce(
      (s, b) => s + (Number(b.grandTotal || 0) - Number(b.paidAmount || 0)),
      0,
    );
  const totalExpense = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const byRate = new Map<number, { taxable: number; tax: number }>();
  for (const b of bills) {
    for (const item of b.items || []) {
      const base = Math.max(
        0,
        Number(item.qty) * Number(item.price) - Number(item.discount || 0),
      );
      const tax = (base * Number(item.gstRate || 0)) / 100;
      const row = byRate.get(Number(item.gstRate || 0)) || {
        taxable: 0,
        tax: 0,
      };
      row.taxable += base;
      row.tax += tax;
      byRate.set(Number(item.gstRate || 0), row);
    }
  }
  const gstRows = Array.from(byRate.entries())
    .map(([gstRate, r]) => ({
      gstRate,
      taxable: Math.round(r.taxable * 100) / 100,
      cgst: Math.round((r.tax / 2) * 100) / 100,
      sgst: Math.round((r.tax / 2) * 100) / 100,
      tax: Math.round(r.tax * 100) / 100,
    }))
    .sort((a, b) => a.gstRate - b.gstRate);
  return {
    summary: {
      invoiceCount: bills.length,
      totalSales: Math.round(totalSales * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      outstanding: Math.round(outstanding * 100) / 100,
      totalExpense: Math.round(totalExpense * 100) / 100,
      netCash: Math.round((totalPaid - totalExpense) * 100) / 100,
    },
    gstRows,
    bills,
    expenses,
  };
}

export function computeLedger(cache: Awaited<ReturnType<typeof loadCache>>) {
  return cache.customers
    .map((c) => {
      const bills = cache.bills.filter(
        (b) => b.customerId === c.id && b.status !== 'void',
      );
      const billed = bills.reduce((s, b) => s + Number(b.grandTotal || 0), 0);
      const paid = bills.reduce((s, b) => s + Number(b.paidAmount || 0), 0);
      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        gstin: c.gstin,
        invoiceCount: bills.length,
        billed,
        paid,
        due: Math.round((billed - paid) * 100) / 100,
      };
    })
    .filter((c) => c.invoiceCount > 0)
    .sort((a, b) => b.due - a.due);
}

async function tryOnline<T>(fn: () => Promise<T>): Promise<T | null> {
  if (!(await isOnline())) return null;
  try {
    return await fn();
  } catch {
    return null;
  }
}

export async function listProducts() {
  const cache = await loadCache();
  const live = await tryOnline(() => api<any[]>('/products'));
  if (live) {
    cache.products = live;
    await saveCache(cache);
    return live;
  }
  return cache.products;
}

export async function listCustomers() {
  const cache = await loadCache();
  const live = await tryOnline(() => api<any[]>('/customers'));
  if (live) {
    cache.customers = live;
    await saveCache(cache);
    return live;
  }
  return cache.customers;
}

export async function listBills(docType = 'invoice') {
  const cache = await loadCache();
  if (docType === 'quote') {
    const live = await tryOnline(() => api<any[]>('/bills?docType=quote'));
    if (live) {
      cache.quotes = live;
      await saveCache(cache);
      return live;
    }
    return cache.quotes;
  }
  const liveInv = await tryOnline(() => api<any[]>('/bills'));
  const liveCn = await tryOnline(() =>
    api<any[]>('/bills?docType=credit_note'),
  );
  if (liveInv) {
    cache.bills = [...liveInv, ...(liveCn || [])];
    await saveCache(cache);
    return cache.bills.filter((b) => (b.docType || 'invoice') !== 'quote');
  }
  return cache.bills.filter((b) => (b.docType || 'invoice') !== 'quote');
}

export async function listExpenses() {
  const cache = await loadCache();
  const live = await tryOnline(() => api<any[]>('/expenses'));
  if (live) {
    cache.expenses = live;
    await saveCache(cache);
    return live;
  }
  return cache.expenses;
}

export async function listStock() {
  const cache = await loadCache();
  const live = await tryOnline(() => api<any[]>('/stock/history'));
  if (live) {
    cache.stockMoves = live;
    await saveCache(cache);
    return live;
  }
  return cache.stockMoves;
}

export async function getShop() {
  const cache = await loadCache();
  const live = await tryOnline(() => api<any>('/shop'));
  if (live) {
    cache.shop = live;
    await saveCache(cache);
    return live;
  }
  return cache.shop;
}

export async function listTeam() {
  const cache = await loadCache();
  const live = await tryOnline(() => api<any[]>('/team'));
  if (live) {
    cache.team = live;
    await saveCache(cache);
    return live;
  }
  return cache.team;
}

export async function listActivity() {
  const cache = await loadCache();
  const live = await tryOnline(() => api<any[]>('/activity'));
  if (live) {
    cache.activity = live;
    await saveCache(cache);
    return live;
  }
  return cache.activity;
}

export async function saveProduct(body: any, editId?: string | null) {
  await requirePaidOrTrial();
  const cache = await loadCache();
  const online = await isOnline();
  if (editId) {
    const next = { ...cache.products.find((p) => p.id === editId), ...body };
    cache.products = cache.products.map((p) => (p.id === editId ? next : p));
    await saveCache(cache);
    if (online && !isLocalId(editId)) {
      return api(`/products/${editId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
    }
    await enqueue({
      method: 'PATCH',
      path: `/products/${editId}`,
      body,
    });
    return next;
  }
  const id = localId('prod');
  const row = {
    id,
    unit: 'NOS',
    stock: 0,
    gstRate: 0,
    active: true,
    ...body,
    createdAt: new Date().toISOString(),
  };
  cache.products = [row, ...cache.products];
  await saveCache(cache);
  if (online) {
    const saved = await api<any>('/products', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    cache.products = cache.products.map((p) => (p.id === id ? saved : p));
    await saveCache(cache);
    return saved;
  }
  await enqueue({ method: 'POST', path: '/products', body, localId: id });
  return row;
}

export async function removeProduct(id: string) {
  await requirePaidOrTrial();
  const cache = await loadCache();
  cache.products = cache.products.filter((p) => p.id !== id);
  await saveCache(cache);
  if ((await isOnline()) && !isLocalId(id)) {
    return api(`/products/${id}`, { method: 'DELETE' });
  }
  if (!isLocalId(id)) {
    await enqueue({ method: 'DELETE', path: `/products/${id}` });
  }
}

export async function saveCustomer(body: any, editId?: string | null) {
  await requirePaidOrTrial();
  const cache = await loadCache();
  if (editId) {
    const next = { ...cache.customers.find((c) => c.id === editId), ...body };
    cache.customers = cache.customers.map((c) => (c.id === editId ? next : c));
    await saveCache(cache);
    if ((await isOnline()) && !isLocalId(editId)) {
      return api(`/customers/${editId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
    }
    await enqueue({ method: 'PATCH', path: `/customers/${editId}`, body });
    return next;
  }
  const id = localId('cust');
  const row = { id, ...body, createdAt: new Date().toISOString() };
  cache.customers = [row, ...cache.customers];
  await saveCache(cache);
  if (await isOnline()) {
    const saved = await api<any>('/customers', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    cache.customers = cache.customers.map((c) => (c.id === id ? saved : c));
    await saveCache(cache);
    return saved;
  }
  await enqueue({ method: 'POST', path: '/customers', body, localId: id });
  return row;
}

export async function removeCustomer(id: string) {
  await requirePaidOrTrial();
  const cache = await loadCache();
  cache.customers = cache.customers.filter((c) => c.id !== id);
  await saveCache(cache);
  if ((await isOnline()) && !isLocalId(id)) {
    return api(`/customers/${id}`, { method: 'DELETE' });
  }
  if (!isLocalId(id)) {
    await enqueue({ method: 'DELETE', path: `/customers/${id}` });
  }
}

function calcBill(items: any[], discount = 0, docType = 'invoice', paymentMode = 'cash', paidAmount?: number) {
  let subtotal = 0;
  let taxTotal = 0;
  const lines = items.map((item) => {
    const base = Math.max(0, item.qty * item.price - (item.discount || 0));
    const tax = (base * (item.gstRate || 0)) / 100;
    subtotal += base;
    taxTotal += tax;
    return { ...item, lineTotal: Math.round((base + tax) * 100) / 100 };
  });
  const before = Math.max(0, subtotal + taxTotal - (discount || 0));
  const grandTotal = Math.round(before);
  let paid = paidAmount;
  if (docType === 'quote' || docType === 'credit_note' || paymentMode === 'credit') {
    paid = paid ?? 0;
  } else {
    paid = paid ?? grandTotal;
  }
  const status =
    docType === 'quote'
      ? 'draft'
      : paid <= 0
        ? 'unpaid'
        : paid + 0.001 >= grandTotal
          ? 'paid'
          : 'partial';
  return {
    items: lines,
    subtotal: Math.round(subtotal * 100) / 100,
    taxTotal: Math.round(taxTotal * 100) / 100,
    discount: discount || 0,
    grandTotal,
    paidAmount: Math.min(paid || 0, grandTotal),
    status,
  };
}

export async function createBill(body: any, opts?: { skipQueue?: boolean }) {
  await requirePaidOrTrial();
  const cache = await loadCache();
  const docType = body.docType || 'invoice';
  const calc = calcBill(
    body.items,
    body.discount,
    docType,
    body.paymentMode,
    body.paidAmount,
  );
  const id = localId('bill');
  const prefix =
    docType === 'quote' ? 'QT' : docType === 'credit_note' ? 'CN' : 'INV';
  const row = {
    id,
    invoiceLabel: `${prefix}-OFF-${Date.now().toString().slice(-6)}`,
    invoiceNo: Date.now(),
    billDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    customerId: body.customerId || null,
    customer: cache.customers.find((c) => c.id === body.customerId) || null,
    paymentMode: body.paymentMode || 'cash',
    notes: body.notes || null,
    docType,
    ...calc,
    pendingSync: true,
  };
  if (docType === 'quote') cache.quotes = [row, ...cache.quotes];
  else cache.bills = [row, ...cache.bills];

  if (docType === 'invoice') {
    for (const line of calc.items) {
      if (!line.productId) continue;
      cache.products = cache.products.map((p) =>
        p.id === line.productId
          ? { ...p, stock: Number(p.stock || 0) - Number(line.qty) }
          : p,
      );
    }
  }
  if (docType === 'credit_note') {
    for (const line of calc.items) {
      if (!line.productId) continue;
      cache.products = cache.products.map((p) =>
        p.id === line.productId
          ? { ...p, stock: Number(p.stock || 0) + Number(line.qty) }
          : p,
      );
    }
  }
  await saveCache(cache);

  if (await isOnline()) {
    const saved = await api<any>('/bills', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (docType === 'quote') {
      cache.quotes = cache.quotes.map((b) => (b.id === id ? saved : b));
    } else {
      cache.bills = cache.bills.map((b) => (b.id === id ? saved : b));
    }
    await saveCache(cache);
    return saved;
  }
  if (!opts?.skipQueue) {
    await enqueue({ method: 'POST', path: '/bills', body, localId: id });
  }
  return row;
}

export async function markBillPaid(bill: any) {
  await requirePaidOrTrial();
  const cache = await loadCache();
  const next = {
    ...bill,
    paidAmount: bill.grandTotal,
    status: 'paid',
    paymentMode: bill.paymentMode || 'cash',
  };
  cache.bills = cache.bills.map((b) => (b.id === bill.id ? next : b));
  await saveCache(cache);
  const body = { paidAmount: bill.grandTotal };
  if ((await isOnline()) && !isLocalId(bill.id)) {
    return api(`/bills/${bill.id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }
  await enqueue({
    method: 'PATCH',
    path: `/bills/${bill.id}/payment`,
    body,
  });
  return next;
}

export async function voidBill(bill: any) {
  await requirePaidOrTrial();
  const cache = await loadCache();
  const next = { ...bill, status: 'void', paidAmount: 0 };
  if (bill.docType === 'quote') {
    cache.quotes = cache.quotes.map((b) => (b.id === bill.id ? next : b));
  } else {
    cache.bills = cache.bills.map((b) => (b.id === bill.id ? next : b));
    if (bill.docType !== 'quote') {
      for (const item of bill.items || []) {
        if (!item.productId) continue;
        cache.products = cache.products.map((p) =>
          p.id === item.productId
            ? { ...p, stock: Number(p.stock || 0) + Number(item.qty) }
            : p,
        );
      }
    }
  }
  await saveCache(cache);
  if ((await isOnline()) && !isLocalId(bill.id)) {
    return api(`/bills/${bill.id}/void`, { method: 'POST' });
  }
  await enqueue({ method: 'POST', path: `/bills/${bill.id}/void` });
  return next;
}

export async function duplicateBill(bill: any) {
  await requirePaidOrTrial();
  return createBill({
    customerId: bill.customerId || undefined,
    notes: bill.notes || undefined,
    discount: bill.discount || 0,
    paymentMode: bill.paymentMode || 'cash',
    paidAmount: 0,
    docType: bill.docType === 'quote' ? 'quote' : 'invoice',
    items: (bill.items || []).map((i: any) => ({
      productId: i.productId,
      name: i.name,
      qty: i.qty,
      price: i.price,
      gstRate: i.gstRate,
    })),
  });
}

export async function convertQuote(quote: any) {
  await requirePaidOrTrial();
  if ((await isOnline()) && !isLocalId(quote.id)) {
    const saved = await api<any>(`/bills/${quote.id}/convert`, {
      method: 'POST',
    });
    const cache = await loadCache();
    cache.quotes = cache.quotes.map((q) =>
      q.id === quote.id ? { ...q, status: 'converted' } : q,
    );
    if (saved?.id) cache.bills = [saved, ...cache.bills];
    await saveCache(cache);
    return saved;
  }
  const invoice = await createBill(
    {
      customerId: quote.customerId || undefined,
      notes: quote.notes || undefined,
      discount: quote.discount || 0,
      paymentMode: 'credit',
      paidAmount: 0,
      docType: 'invoice',
      items: (quote.items || []).map((i: any) => ({
        productId: i.productId,
        name: i.name,
        qty: i.qty,
        price: i.price,
        gstRate: i.gstRate,
      })),
    },
    { skipQueue: !isLocalId(quote.id) },
  );
  const cache = await loadCache();
  cache.quotes = cache.quotes.map((q) =>
    q.id === quote.id ? { ...q, status: 'converted' } : q,
  );
  await saveCache(cache);
  if (!isLocalId(quote.id)) {
    await enqueue({ method: 'POST', path: `/bills/${quote.id}/convert` });
  }
  return invoice;
}

export async function saveExpense(body: any) {
  await requirePaidOrTrial();
  const cache = await loadCache();
  const id = localId('exp');
  const row = {
    id,
    category: 'General',
    paymentMode: 'cash',
    expenseDate: new Date().toISOString(),
    ...body,
    createdAt: new Date().toISOString(),
  };
  cache.expenses = [row, ...cache.expenses];
  await saveCache(cache);
  if (await isOnline()) {
    const saved = await api<any>('/expenses', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    cache.expenses = cache.expenses.map((e) => (e.id === id ? saved : e));
    await saveCache(cache);
    return saved;
  }
  await enqueue({ method: 'POST', path: '/expenses', body, localId: id });
  return row;
}

export async function removeExpense(id: string) {
  await requirePaidOrTrial();
  const cache = await loadCache();
  cache.expenses = cache.expenses.filter((e) => e.id !== id);
  await saveCache(cache);
  if ((await isOnline()) && !isLocalId(id)) {
    return api(`/expenses/${id}`, { method: 'DELETE' });
  }
  if (!isLocalId(id)) {
    await enqueue({ method: 'DELETE', path: `/expenses/${id}` });
  }
}

export async function stockIn(body: any) {
  await requirePaidOrTrial();
  const cache = await loadCache();
  cache.products = cache.products.map((p) =>
    p.id === body.productId
      ? { ...p, stock: Number(p.stock || 0) + Number(body.qty) }
      : p,
  );
  cache.stockMoves = [
    {
      id: localId('stk'),
      qty: body.qty,
      type: 'in',
      note: body.note,
      createdAt: new Date().toISOString(),
      product: cache.products.find((p) => p.id === body.productId),
    },
    ...cache.stockMoves,
  ];
  await saveCache(cache);
  if (await isOnline()) {
    return api('/stock/in', { method: 'POST', body: JSON.stringify(body) });
  }
  await enqueue({ method: 'POST', path: '/stock/in', body });
}

export async function stockAdjust(body: any) {
  await requirePaidOrTrial();
  const cache = await loadCache();
  cache.products = cache.products.map((p) =>
    p.id === body.productId ? { ...p, stock: Number(body.stock) } : p,
  );
  cache.stockMoves = [
    {
      id: localId('stk'),
      qty: body.stock,
      type: 'adjust',
      note: body.note,
      createdAt: new Date().toISOString(),
      product: cache.products.find((p) => p.id === body.productId),
    },
    ...cache.stockMoves,
  ];
  await saveCache(cache);
  if (await isOnline()) {
    return api('/stock/adjust', { method: 'POST', body: JSON.stringify(body) });
  }
  await enqueue({ method: 'POST', path: '/stock/adjust', body });
}

export async function saveShop(body: any) {
  await requirePaidOrTrial();
  const cache = await loadCache();
  cache.shop = { ...(cache.shop || {}), ...body };
  await saveCache(cache);
  if (await isOnline()) {
    return api('/shop', { method: 'PATCH', body: JSON.stringify(body) });
  }
  await enqueue({ method: 'PATCH', path: '/shop', body });
  return cache.shop;
}

export async function addStaff(body: any) {
  await requirePaidOrTrial();
  if (await isOnline()) {
    const saved = await api('/team', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const cache = await loadCache();
    cache.team = [saved, ...cache.team];
    await saveCache(cache);
    return saved;
  }
  throw new Error('Team add needs internet. Go online and try again.');
}

export async function updateStaffRole(id: string, role: string) {
  await requirePaidOrTrial();
  if (!(await isOnline()) || isLocalId(id)) {
    throw new Error('Role change needs internet.');
  }
  const saved = await api(`/team/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
  const cache = await loadCache();
  cache.team = cache.team.map((m) => (m.id === id ? { ...m, role } : m));
  await saveCache(cache);
  return saved;
}

export async function removeStaff(id: string) {
  await requirePaidOrTrial();
  if (!(await isOnline()) || isLocalId(id)) {
    throw new Error('Remove staff needs internet.');
  }
  await api(`/team/${id}`, { method: 'DELETE' });
  const cache = await loadCache();
  cache.team = cache.team.filter((m) => m.id !== id);
  await saveCache(cache);
}

export async function getBill(id: string) {
  const cache = await loadCache();
  const found =
    cache.bills.find((b) => b.id === id) ||
    cache.quotes.find((b) => b.id === id);
  if (found) return found;
  if (await isOnline()) return api<any>(`/bills/${id}`);
  throw new Error('Bill not on this phone yet');
}
