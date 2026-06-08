"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { ProductCard } from "@/components/shop/ProductCard";
import { Pagination } from "@/components/shop/Pagination";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { ActiveFilters } from "@/components/shop/ActiveFilters";
import { cn, formatCurrency } from "@/lib/utils";
import {
  SlidersHorizontal,
  Grid3X3,
  LayoutList,
  Search,
  ChevronDown,
  X,
} from "lucide-react";

// Mock products data - will be replaced with API call
const mockProducts = [
  {
    id: 1,
    name: "iPhone 14 Pro Max OLED Display",
    slug: "iphone-14-pro-max-oled-display",
    category: { name: "Screens", slug: "screens" },
    brand: "Apple",
    price: 15499,
    originalPrice: 18999,
    rating: 4.8,
    reviews: 245,
    image: null,
    inStock: true,
    badge: "Best Seller",
    compatibility: ["iPhone 14 Pro Max"],
  },
  {
    id: 2,
    name: "Samsung Galaxy S23 Ultra Battery",
    slug: "samsung-galaxy-s23-ultra-battery",
    category: { name: "Batteries", slug: "batteries" },
    brand: "Samsung",
    price: 2999,
    originalPrice: 3999,
    rating: 4.6,
    reviews: 189,
    image: null,
    inStock: true,
    badge: "Hot",
    compatibility: ["Galaxy S23 Ultra"],
  },
  {
    id: 3,
    name: "OnePlus 11 65W Warp Charger",
    slug: "oneplus-11-65w-warp-charger",
    category: { name: "Chargers", slug: "chargers" },
    brand: "OnePlus",
    price: 1799,
    originalPrice: 2499,
    rating: 4.9,
    reviews: 312,
    image: null,
    inStock: true,
    badge: "Trending",
    compatibility: ["OnePlus 11", "OnePlus 10 Pro"],
  },
  {
    id: 4,
    name: "Xiaomi Redmi Note 12 Screen",
    slug: "xiaomi-redmi-note-12-screen",
    category: { name: "Screens", slug: "screens" },
    brand: "Xiaomi",
    price: 3499,
    originalPrice: 4499,
    rating: 4.5,
    reviews: 156,
    image: null,
    inStock: true,
    badge: null,
    compatibility: ["Redmi Note 12", "Redmi Note 12 Pro"],
  },
  {
    id: 5,
    name: "Realme GT Neo 3 Battery",
    slug: "realme-gt-neo-3-battery",
    category: { name: "Batteries", slug: "batteries" },
    brand: "Realme",
    price: 1999,
    originalPrice: 2799,
    rating: 4.4,
    reviews: 98,
    image: null,
    inStock: false,
    badge: null,
    compatibility: ["Realme GT Neo 3"],
  },
  {
    id: 6,
    name: "OPPO Find X5 Pro Display",
    slug: "oppo-find-x5-pro-display",
    category: { name: "Screens", slug: "screens" },
    brand: "OPPO",
    price: 12999,
    originalPrice: 15999,
    rating: 4.7,
    reviews: 134,
    image: null,
    inStock: true,
    badge: "Premium",
    compatibility: ["Find X5 Pro"],
  },
  {
    id: 7,
    name: "Vivo V27 Pro Battery",
    slug: "vivo-v27-pro-battery",
    category: { name: "Batteries", slug: "batteries" },
    brand: "Vivo",
    price: 2499,
    originalPrice: 3299,
    rating: 4.3,
    reviews: 87,
    image: null,
    inStock: true,
    badge: null,
    compatibility: ["Vivo V27 Pro"],
  },
  {
    id: 8,
    name: "Nokia G21 Back Cover",
    slug: "nokia-g21-back-cover",
    category: { name: "Back Covers", slug: "covers" },
    brand: "Nokia",
    price: 899,
    originalPrice: 1299,
    rating: 4.2,
    reviews: 56,
    image: null,
    inStock: true,
    badge: "Sale",
    compatibility: ["Nokia G21"],
  },
];

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  // Get filter values from URL
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const inStock = searchParams.get("inStock");
  const query = searchParams.get("q");

  // Apply filters and sorting
  useEffect(() => {
    let result = [...mockProducts];

    // Search filter
    if (query) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.category.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Category filter
    if (category) {
      result = result.filter((p) => p.category.slug === category);
    }

    // Brand filter
    if (brand) {
      result = result.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }

    // Price filter
    if (minPrice) {
      result = result.filter((p) => p.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= parseInt(maxPrice));
    }

    // Stock filter
    if (inStock === "true") {
      result = result.filter((p) => p.inStock);
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [category, brand, minPrice, maxPrice, inStock, sortBy, query]);

  const productsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Breadcrumbs */}
      <div className="border-b border-[var(--border)]">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              {category
                ? `${category.charAt(0).toUpperCase() + category.slice(1)}`
                : query
                ? `Search: "${query}"`
                : "All Products"}
            </h1>
            <p className="text-sm text-[var(--foreground-muted)]">
              {filteredProducts.length} products found
            </p>
          </div>

          {/* Search & Sort Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <form
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                const params = new URLSearchParams(searchParams.toString());
                if (searchQuery) {
                  params.set("q", searchQuery);
                } else {
                  params.delete("q");
                }
                window.history.pushState(null, "", `/shop?${params.toString()}`);
              }}
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-10 sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort by: {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded p-2 transition-colors",
                  viewMode === "grid"
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded p-2 transition-colors",
                  viewMode === "list"
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]"
                )}
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        <ActiveFilters />

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-72 transform overflow-y-auto border-r border-[var(--border)] bg-[var(--background)] p-4 transition-transform lg:static lg:block lg:w-64 lg:border-0 lg:bg-transparent lg:p-0 lg:transform-none",
              isFilterOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex items-center justify-between lg:hidden">
              <h2 className="font-semibold">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="rounded p-2 hover:bg-[var(--background-secondary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ProductFilters />
          </aside>

          {/* Overlay for mobile */}
          {isFilterOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-[var(--background-secondary)] p-4">
                  <Search className="h-8 w-8 text-[var(--foreground-muted)]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
                  No products found
                </h3>
                <p className="text-[var(--foreground-muted)]">
                  Try adjusting your filters or search query
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    window.history.pushState(null, "", "/shop");
                    setSearchQuery("");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "grid gap-4",
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1"
                  )}
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
