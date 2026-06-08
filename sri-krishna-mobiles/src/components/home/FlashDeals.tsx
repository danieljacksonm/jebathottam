"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Clock, Zap, ShoppingCart } from "lucide-react";

// Mock flash deals data
const flashDeals = [
  {
    id: 1,
    name: "iPhone 14 Pro OLED Display",
    originalPrice: 12999,
    dealPrice: 8999,
    discount: 31,
    image: "/products/screen-1.jpg",
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    sold: 45,
    total: 100,
  },
  {
    id: 2,
    name: "Samsung S23 Ultra Battery",
    originalPrice: 3499,
    dealPrice: 2499,
    discount: 29,
    image: "/products/battery-1.jpg",
    endTime: new Date(Date.now() + 18 * 60 * 60 * 1000),
    sold: 78,
    total: 150,
  },
  {
    id: 3,
    name: "OnePlus 11 Warp Charger",
    originalPrice: 1999,
    dealPrice: 1299,
    discount: 35,
    image: "/products/charger-1.jpg",
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
    sold: 92,
    total: 200,
  },
  {
    id: 4,
    name: "Pixel 7 Pro Back Glass",
    originalPrice: 2499,
    dealPrice: 1799,
    discount: 28,
    image: "/products/cover-1.jpg",
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    sold: 34,
    total: 80,
  },
];

function CountdownTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-1 text-sm font-semibold text-[var(--error)]">
      <Clock className="h-4 w-4" />
      <span>{formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}</span>
    </div>
  );
}

export function FlashDeals() {
  return (
    <section className="bg-gradient-to-r from-[var(--error)] to-rose-600 py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Flash Deals</h2>
              <p className="text-white/80">Limited time offers - Grab them before they&apos;re gone!</p>
            </div>
          </div>
          <Link href="/shop?sort=discount">
            <Button variant="secondary" className="bg-white text-[var(--error)] hover:bg-white/90">
              View All Deals
            </Button>
          </Link>
        </div>

        {/* Deals Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {flashDeals.map((deal) => (
            <Card key={deal.id} className="group overflow-hidden border-0 bg-white">
              {/* Image */}
              <div className="relative aspect-square bg-[var(--background-secondary)]">
                <div className="absolute left-3 top-3 rounded-full bg-[var(--error)] px-2 py-1 text-xs font-bold text-white">
                  -{deal.discount}%
                </div>
                {/* Placeholder for product image */}
                <div className="flex h-full items-center justify-center">
                  <span className="text-4xl">📱</span>
                </div>
                <CountdownTimer endTime={deal.endTime} />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-[var(--foreground)]">
                  {deal.name}
                </h3>

                {/* Price */}
                <div className="mb-3 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[var(--error)]">
                    {formatCurrency(deal.dealPrice)}
                  </span>
                  <span className="text-sm text-[var(--foreground-muted)] line-through">
                    {formatCurrency(deal.originalPrice)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-[var(--foreground-muted)]">
                      {Math.round((deal.sold / deal.total) * 100)}% Sold
                    </span>
                    <span className="text-[var(--foreground-muted)]">
                      {deal.total - deal.sold} left
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--background-secondary)]">
                    <div
                      className="h-full rounded-full bg-[var(--error)] transition-all"
                      style={{ width: `${(deal.sold / deal.total) * 100}%` }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <Button className="w-full gap-2 bg-[var(--error)] hover:bg-red-700">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
