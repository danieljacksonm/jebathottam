"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  LogOut,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=screens", label: "Screens" },
  { href: "/shop?category=batteries", label: "Batteries" },
  { href: "/shop?category=accessories", label: "Accessories" },
];

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
      {/* Top Bar */}
      <div className="bg-[var(--primary)] py-2 text-center text-xs font-medium text-white">
        Free shipping on orders over ₹999 | Cash on Delivery available
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[var(--foreground)]">
              Sri Krishna<span className="text-[var(--primary)]">Mobiles</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden max-w-md flex-1 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <Input
                type="search"
                placeholder="Search products, brands, models..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Link href="/account/wishlist">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
                  0
                </span>
              </Button>
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative group">
                <Button variant="ghost" className="hidden items-center gap-2 sm:flex">
                  <User className="h-5 w-5" />
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-lg border border-[var(--border)] bg-[var(--card)] p-1 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/account">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </Button>
                  </Link>
                  <Link href="/account/orders">
                    <Button variant="ghost" className="w-full justify-start">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      My Orders
                    </Button>
                  </Link>
                  <hr className="my-1 border-[var(--border)]" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-[var(--error)]"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 border-t border-[var(--border)] py-3 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[var(--foreground-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/offers"
            className="flex items-center gap-1 rounded-full bg-[var(--error)] px-3 py-1 text-xs font-bold text-white"
          >
            SALE
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "absolute left-0 right-0 top-full border-b border-[var(--border)] bg-[var(--background)] p-4 shadow-lg md:hidden",
          isMobileMenuOpen ? "block" : "hidden"
        )}
      >
        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Mobile Nav Links */}
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-3 text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--background-secondary)] hover:text-[var(--primary)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2 border-[var(--border)]" />
          {isAuthenticated ? (
            <>
              <Link
                href="/account"
                className="rounded-lg px-4 py-3 text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]"
              >
                My Account
              </Link>
              <button
                onClick={() => logout()}
                className="rounded-lg px-4 py-3 text-left text-[var(--error)] hover:bg-[var(--error-light)]"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-lg bg-[var(--primary)] px-4 py-3 text-center font-medium text-white"
            >
              Login / Register
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
