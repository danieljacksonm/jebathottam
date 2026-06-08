"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Mobile Repair Shop Owner",
    content: "Sri Krishna Mobiles has been my go-to supplier for 3 years now. The quality of screens and batteries is consistently excellent. Their bulk pricing helps my business stay competitive.",
    rating: 5,
    avatar: "RS",
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Individual Customer",
    content: "I replaced my iPhone screen myself using their DIY kit. The video tutorials on their website were super helpful. Saved me ₹8000 compared to the Apple service center!",
    rating: 5,
    avatar: "PP",
  },
  {
    id: 3,
    name: "Arun Kumar",
    role: "Technician",
    content: "Fast delivery and genuine parts. The 6-month warranty gives my customers peace of mind. Customer support is very responsive for any compatibility questions.",
    rating: 5,
    avatar: "AK",
  },
  {
    id: 4,
    name: "Divya Nair",
    role: "Regular Customer",
    content: "Ordered a battery for my old Samsung phone. The compatibility checker on their website ensured I got the right part. Phone works like new now!",
    rating: 4,
    avatar: "DN",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-[var(--background-secondary)]">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-[var(--foreground)]">
            What Our Customers Say
          </h2>
          <p className="mt-2 text-[var(--foreground-muted)]">
            Trusted by thousands of customers and repair professionals
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:shadow-lg"
            >
              {/* Quote Icon */}
              <Quote className="absolute right-4 top-4 h-8 w-8 text-[var(--primary)]/20" />

              {/* Rating */}
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-[var(--border)]"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="mb-6 text-sm text-[var(--foreground-secondary)] leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10 text-sm font-semibold text-[var(--primary)]">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid gap-8 rounded-2xl bg-[var(--primary)]/5 p-8 text-center sm:grid-cols-4">
          {[
            { value: "50,000+", label: "Happy Customers" },
            { value: "1,000+", label: "Products" },
            { value: "4.8/5", label: "Average Rating" },
            { value: "6 Months", label: "Warranty" },
          ].map((stat, index) => (
            <div key={index}>
              <p className="text-3xl font-bold text-[var(--primary)]">{stat.value}</p>
              <p className="text-sm text-[var(--foreground-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
