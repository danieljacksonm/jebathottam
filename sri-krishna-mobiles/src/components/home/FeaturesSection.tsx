"use client";

import { Truck, Shield, RotateCcw, Headphones, CreditCard, Award } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over ₹999",
  },
  {
    icon: Shield,
    title: "6 Month Warranty",
    description: "On all products",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Expert assistance",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: Award,
    title: "Genuine Products",
    description: "Quality guaranteed",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--background-secondary)] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/10">
                <feature.icon className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                {feature.title}
              </h3>
              <p className="text-xs text-[var(--foreground-muted)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
