"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--background)] to-[var(--background-secondary)]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[var(--primary)]/20 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-[var(--accent)]/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-20 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm">
              <Zap className="h-4 w-4 text-[var(--warning)]" />
              <span className="text-[var(--foreground-secondary)]">
                Summer Sale: Up to 40% off!
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold leading-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Genuine Mobile
              <span className="block text-[var(--primary)]">Spare Parts</span>
            </h1>

            {/* Description */}
            <p className="max-w-lg text-lg text-[var(--foreground-muted)]">
              Quality screens, batteries, chargers & accessories for all major brands. 
              Expert repair support with 6-month warranty.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href="/shop">
                <Button size="lg" className="gap-2">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/shop?category=screens">
                <Button variant="outline" size="lg">
                  Browse Screens
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-[var(--foreground-tertiary)]">
                <Shield className="h-5 w-5 text-[var(--success)]" />
                <span>6 Month Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--foreground-tertiary)]">
                <Truck className="h-5 w-5 text-[var(--primary)]" />
                <span>Free Shipping ₹999+</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--foreground-tertiary)]">
                <Zap className="h-5 w-5 text-[var(--warning)]" />
                <span>Same Day Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image/Graphic */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 p-8">
              {/* Phone Mockup */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Main Phone */}
                  <div className="h-80 w-48 rounded-[2.5rem] border-8 border-[var(--foreground)] bg-[var(--background)] shadow-2xl">
                    <div className="flex h-full flex-col items-center justify-center p-4">
                      <div className="mb-4 h-32 w-full rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]" />
                      <div className="space-y-2 w-full">
                        <div className="h-4 w-3/4 rounded bg-[var(--background-secondary)]" />
                        <div className="h-4 w-1/2 rounded bg-[var(--background-secondary)]" />
                      </div>
                    </div>
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute -right-16 top-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-lg">
                    <Zap className="h-8 w-8 text-[var(--warning)]" />
                  </div>
                  <div className="absolute -left-12 bottom-16 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-lg">
                    <Shield className="h-8 w-8 text-[var(--success)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
