"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";

interface Review {
  id: number;
  user: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
}

const mockReviews: Review[] = [
  {
    id: 1,
    user: "Rahul S.",
    rating: 5,
    date: "2 weeks ago",
    title: "Excellent quality display",
    content: "The screen quality is amazing, just like the original. Installation was smooth and the colors are perfect. Highly recommend!",
    helpful: 12,
    verified: true,
  },
  {
    id: 2,
    user: "Priya M.",
    rating: 4,
    date: "1 month ago",
    title: "Good replacement",
    content: "Works well, touch response is good. Only minor issue was the brightness calibration took some time to adjust.",
    helpful: 8,
    verified: true,
  },
  {
    id: 3,
    user: "Arun K.",
    rating: 5,
    date: "2 months ago",
    title: "Perfect fit for my iPhone",
    content: "Exact match for my iPhone 14 Pro Max. The True Tone feature works perfectly. Very satisfied with the purchase.",
    helpful: 15,
    verified: true,
  },
];

interface ProductTabsProps {
  description: string;
  specifications: { label: string; value: string }[];
  compatibility: string[];
  rating: number;
  reviews: number;
}

export function ProductTabs({
  description,
  specifications,
  compatibility,
  rating,
  reviews,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">(
    "description"
  );

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specs", label: "Specifications" },
    { id: "reviews", label: `Reviews (${reviews})` },
  ];

  return (
    <div>
      {/* Tab Headers */}
      <div className="border-b border-[var(--border)]">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "relative py-4 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "text-[var(--primary)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="prose max-w-none text-[var(--foreground-secondary)]">
            <p className="leading-relaxed">{description}</p>
            <h3 className="mt-6 text-lg font-semibold text-[var(--foreground)]">
              Key Features
            </h3>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Genuine OEM quality replacement part</li>
              <li>Perfect color accuracy and touch response</li>
              <li>Pre-installed front camera and sensors</li>
              <li>Compatible with all original features</li>
              <li>6-month warranty included</li>
            </ul>
            <h3 className="mt-6 text-lg font-semibold text-[var(--foreground)]">
              What's in the Box
            </h3>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>1x Display Assembly</li>
              <li>1x Screen Protector (Pre-applied)</li>
              <li>1x Installation Tool Kit</li>
              <li>1x Warranty Card</li>
            </ul>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === "specs" && (
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full">
              <tbody>
                {specifications.map((spec, index) => (
                  <tr
                    key={spec.label}
                    className={cn(
                      "border-b border-[var(--border)] last:border-0",
                      index % 2 === 0 ? "bg-[var(--background)]" : "bg-[var(--background-secondary)]"
                    )}
                  >
                    <td className="w-1/3 px-6 py-4 text-sm font-medium text-[var(--foreground)]">
                      {spec.label}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--foreground-secondary)]">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-8">
            {/* Rating Summary */}
            <div className="flex flex-col gap-6 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-6 sm:flex-row sm:items-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--foreground)]">
                  {rating}
                </div>
                <div className="mt-1 flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < Math.floor(rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-[var(--border)]"
                      )}
                    />
                  ))}
                </div>
                <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                  {reviews} reviews
                </p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="w-8 text-sm text-[var(--foreground-muted)]">
                      {stars}★
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-[var(--background)]">
                      <div
                        className="h-full rounded-full bg-yellow-400"
                        style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 10}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm text-[var(--foreground-muted)]">
                      {stars === 5 ? "70%" : stars === 4 ? "20%" : "10%"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-6">
              {mockReviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-[var(--border)] pb-6 last:border-0"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-[var(--border)]"
                              )}
                            />
                          ))}
                        </div>
                        {review.verified && (
                          <span className="rounded-full bg-[var(--success)]/10 px-2 py-0.5 text-xs text-[var(--success)]">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <h4 className="mt-2 font-semibold text-[var(--foreground)]">
                        {review.title}
                      </h4>
                    </div>
                    <span className="text-sm text-[var(--foreground-muted)]">
                      {review.date}
                    </span>
                  </div>
                  <p className="mt-2 text-[var(--foreground-secondary)]">
                    {review.content}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-sm text-[var(--foreground-muted)]">
                      By {review.user}
                    </span>
                    <button className="flex items-center gap-1 text-sm text-[var(--foreground-muted)] hover:text-[var(--primary)]">
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Write Review Button */}
            <button className="flex items-center gap-2 text-[var(--primary)] hover:underline">
              <MessageCircle className="h-4 w-4" />
              Write a Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
