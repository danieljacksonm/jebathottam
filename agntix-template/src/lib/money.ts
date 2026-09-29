export function minor(amount: number) {
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount * 100);
}

export function major(amountMinor: number) {
  return amountMinor / 100;
}

export function formatMoney(amountMinor: number, currency = "INR") {
  const value = major(amountMinor);
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export type LineInput = {
  description: string;
  quantity: number;
  unitMinor: number;
  discountMinor: number;
  taxMinor: number;
};

export function lineTotal(line: LineInput) {
  const gross = Math.max(0, line.quantity) * Math.max(0, line.unitMinor);
  const discount = Math.min(gross, Math.max(0, line.discountMinor));
  const tax = Math.max(0, line.taxMinor);
  return gross - discount + tax;
}

export function summarize(
  lines: LineInput[],
  headerDiscountMinor: number,
) {
  const subtotalMinor = lines.reduce((sum, line) => {
    const gross = Math.max(0, line.quantity) * Math.max(0, line.unitMinor);
    const discount = Math.min(gross, Math.max(0, line.discountMinor));
    return sum + (gross - discount);
  }, 0);
  const taxMinor = lines.reduce(
    (sum, line) => sum + Math.max(0, line.taxMinor),
    0,
  );
  const discountMinor = Math.max(0, headerDiscountMinor);
  const totalMinor = Math.max(0, subtotalMinor - discountMinor + taxMinor);
  return { subtotalMinor, taxMinor, discountMinor, totalMinor };
}
