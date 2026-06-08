"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronDown, X, RotateCcw } from "lucide-react";

const categories = [
  { id: "screens", name: "Screens", count: 150 },
  { id: "batteries", name: "Batteries", count: 200 },
  { id: "chargers", name: "Chargers", count: 80 },
  { id: "covers", name: "Back Covers", count: 120 },
  { id: "accessories", name: "Accessories", count: 300 },
  { id: "cables", name: "Cables", count: 60 },
];

const brands = [
  { id: "apple", name: "Apple", count: 45 },
  { id: "samsung", name: "Samsung", count: 120 },
  { id: "xiaomi", name: "Xiaomi", count: 85 },
  { id: "realme", name: "Realme", count: 60 },
  { id: "oppo", name: "OPPO", count: 50 },
  { id: "vivo", name: "Vivo", count: 55 },
  { id: "oneplus", name: "OnePlus", count: 30 },
  { id: "nokia", name: "Nokia", count: 25 },
];

const priceRanges = [
  { min: 0, max: 500, label: "Under ₹500" },
  { min: 500, max: 1000, label: "₹500 - ₹1,000" },
  { min: 1000, max: 2000, label: "₹1,000 - ₹2,000" },
  { min: 2000, max: 5000, label: "₹2,000 - ₹5,000" },
  { min: 5000, max: 10000, label: "₹5,000 - ₹10,000" },
  { min: 10000, max: Infinity, label: "Above ₹10,000" },
];

const ratings = [
  { value: 4, label: "4★ & above" },
  { value: 3, label: "3★ & above" },
  { value: 2, label: "2★ & above" },
];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--border)] py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-sm font-semibold text-[var(--foreground)]"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

interface FilterCheckboxProps {
  id: string;
  name: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}

function FilterCheckbox({ id, name, count, checked, onChange }: FilterCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
      />
      <span className="flex-1 text-sm text-[var(--foreground)]">{name}</span>
      {count !== undefined && (
        <span className="text-xs text-[var(--foreground-muted)]">({count})</span>
      )}
    </label>
  );
}

export function ProductFilters() {
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState<{ min: number; max: number | null } | null>(null);
  const [customMinPrice, setCustomMinPrice] = useState("");
  const [customMaxPrice, setCustomMaxPrice] = useState("");

  const currentCategory = searchParams.get("category");
  const currentBrand = searchParams.get("brand");
  const currentMinPrice = searchParams.get("minPrice");
  const currentMaxPrice = searchParams.get("maxPrice");
  const currentInStock = searchParams.get("inStock") === "true";
  const currentRating = searchParams.get("rating");

  const hasFilters = currentCategory || currentBrand || currentMinPrice || currentInStock || currentRating;

  const buildFilterUrl = (params: Record<string, string | null>) => {
    const urlParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        urlParams.delete(key);
      } else {
        urlParams.set(key, value);
      }
    });
    const queryString = urlParams.toString();
    return `/shop${queryString ? `?${queryString}` : ""}`;
  };

  const clearAllFilters = () => {
    window.history.pushState(null, "", "/shop");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Filters
        </h2>
        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-sm text-[var(--primary)] hover:text-[var(--primary-dark)]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Categories">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={buildFilterUrl({
              category: currentCategory === category.id ? null : category.id,
            })}
          >
            <div
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                currentCategory === category.id
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
              )}
            >
              <span>{category.name}</span>
              <span className="text-xs text-[var(--foreground-muted)]">
                ({category.count})
              </span>
            </div>
          </Link>
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        {priceRanges.map((range) => (
          <Link
            key={range.label}
            href={buildFilterUrl({
              minPrice: currentMinPrice === range.min.toString() && currentMaxPrice === (range.max === Infinity ? "" : range.max.toString())
                ? null
                : range.min.toString(),
              maxPrice: range.max === Infinity ? null : range.max.toString(),
            })}
          >
            <div
              className={cn(
                "flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm transition-colors",
                currentMinPrice === range.min.toString() &&
                  (range.max === Infinity
                    ? !currentMaxPrice
                    : currentMaxPrice === range.max.toString())
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
              )}
            >
              {range.label}
            </div>
          </Link>
        ))}

        {/* Custom Price Range */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={customMinPrice}
              onChange={(e) => setCustomMinPrice(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <span className="text-[var(--foreground-muted)]">-</span>
            <input
              type="number"
              placeholder="Max"
              value={customMaxPrice}
              onChange={(e) => setCustomMaxPrice(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <Link
            href={buildFilterUrl({
              minPrice: customMinPrice || null,
              maxPrice: customMaxPrice || null,
            })}
          >
            <button className="w-full rounded-lg bg-[var(--primary)] py-2 text-sm font-medium text-white hover:bg-[var(--primary-dark)]">
              Apply
            </button>
          </Link>
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brands">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={buildFilterUrl({
              brand: currentBrand?.toLowerCase() === brand.id ? null : brand.id,
            })}
          >
            <FilterCheckbox
              id={brand.id}
              name={brand.name}
              count={brand.count}
              checked={currentBrand?.toLowerCase() === brand.id}
              onChange={() => {}}
            />
          </Link>
        ))}
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Rating">
        {ratings.map((rating) => (
          <Link
            key={rating.value}
            href={buildFilterUrl({
              rating: currentRating === rating.value.toString() ? null : rating.value.toString(),
            })}
          >
            <FilterCheckbox
              id={`rating-${rating.value}`}
              name={rating.label}
              checked={currentRating === rating.value.toString()}
              onChange={() => {}}
            />
          </Link>
        ))}
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <Link
          href={buildFilterUrl({
            inStock: currentInStock ? null : "true",
          })}
        >
          <FilterCheckbox
            id="in-stock"
            name="In Stock"
            checked={currentInStock}
            onChange={() => {}}
          />
        </Link>
      </FilterSection>
    </div>
  );
}
