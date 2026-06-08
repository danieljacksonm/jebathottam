/**
 * Utility Functions
 * cn() for Tailwind class merging
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency (Indian Rupees)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Generate slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generate random string
 */
export function generateId(length: number = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
    .toUpperCase();
}

/**
 * Calculate GST breakdown
 */
export function calculateGSTBreakdown(amount: number, rate: number = 18): {
  taxable: number;
  cgst: number;
  sgst: number;
  total: number;
} {
  const taxable = amount / (1 + rate / 100);
  const taxAmount = amount - taxable;
  const cgst = taxAmount / 2;
  const sgst = taxAmount / 2;

  return {
    taxable: Math.round(taxable * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    total: amount,
  };
}

/**
 * Calculate GST tax amount only (returns just the tax value)
 */
export function calculateGST(amount: number, rate: number = 18): number {
  const taxable = amount / (1 + rate / 100);
  const taxAmount = amount - taxable;
  return Math.round(taxAmount * 100) / 100;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
