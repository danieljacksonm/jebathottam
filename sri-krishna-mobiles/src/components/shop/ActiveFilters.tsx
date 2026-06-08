"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";

export function ActiveFilters() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const inStock = searchParams.get("inStock");
  const rating = searchParams.get("rating");
  const query = searchParams.get("q");

  const activeFilters: { label: string; key: string; value: string | null }[] = [];

  if (query) {
    activeFilters.push({ label: `Search: "${query}"`, key: "q", value: null });
  }

  if (category) {
    activeFilters.push({
      label: `Category: ${category.charAt(0).toUpperCase() + category.slice(1)}`,
      key: "category",
      value: null,
    });
  }

  if (brand) {
    activeFilters.push({
      label: `Brand: ${brand.charAt(0).toUpperCase() + brand.slice(1)}`,
      key: "brand",
      value: null,
    });
  }

  if (minPrice || maxPrice) {
    const priceLabel = minPrice && maxPrice
      ? `Price: ₹${minPrice} - ₹${maxPrice}`
      : minPrice
      ? `Price: Above ₹${minPrice}`
      : `Price: Below ₹${maxPrice}`;
    activeFilters.push({
      label: priceLabel,
      key: "price",
      value: null,
    });
  }

  if (inStock === "true") {
    activeFilters.push({ label: "In Stock", key: "inStock", value: null });
  }

  if (rating) {
    activeFilters.push({
      label: `Rating: ${rating}★ & above`,
      key: "rating",
      value: null,
    });
  }

  if (activeFilters.length === 0) return null;

  const buildRemoveFilterUrl = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "price") {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      params.delete(key);
    }
    const queryString = params.toString();
    return `/shop${queryString ? `?${queryString}` : ""}`;
  };

  const clearAllUrl = "/shop";

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-sm text-[var(--foreground-muted)]">Active filters:</span>
      {activeFilters.map((filter) => (
        <Link key={filter.label} href={buildRemoveFilterUrl(filter.key)}>
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--background-secondary)] px-3 py-1 text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--border)]">
            {filter.label}
            <X className="h-3 w-3" />
          </span>
        </Link>
      ))}
      <Link href={clearAllUrl}>
        <span className="text-sm text-[var(--primary)] hover:text-[var(--primary-dark)] hover:underline">
          Clear all
        </span>
      </Link>
    </div>
  );
}
