"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "CEO, TravelWise Agency",
    content: "Ebenezer Digital transformed our booking process completely. The custom portal they built streamlined our operations and improved customer satisfaction by 40%. Their attention to detail and ongoing support have been exceptional.",
    rating: 5,
    avatar: "SM",
  },
  {
    id: 2,
    name: "James Chen",
    role: "Restaurant Owner",
    content: "The reservation system they developed has been a game-changer for our restaurant. We went from manual booking headaches to a seamless automated system. Our staff loves it, and our customers appreciate the instant confirmations.",
    rating: 5,
    avatar: "JC",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director, GrowthLab",
    content: "Our landing page conversion rate doubled after working with Ebenezer. They understood our goals immediately and delivered a beautiful, fast-loading page that actually converts visitors into leads.",
    rating: 5,
    avatar: "ER",
  },
  {
    id: 4,
    name: "Michael Thompson",
    role: "Partner, Thompson Legal",
    content: "The document conversion project for our law firm was handled with incredible precision. Thousands of documents converted flawlessly, with perfect formatting maintained. Saved us months of manual work.",
    rating: 5,
    avatar: "MT",
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Operations Manager, Global Tours",
    content: "Their ongoing support for our tour operations has been invaluable. From itinerary updates to booking management, they handle it all with professionalism. Our clients consistently praise the smooth booking experience.",
    rating: 5,
    avatar: "LP",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "text-accent-400 fill-accent-400"
              : "text-slate-700"
          }`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-500/10 text-accent-400 text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            What Our Clients Say
          </h2>
          <p className="text-lg text-slate-400">
            Don&apos;t just take our word for it—hear from the businesses we&apos;ve helped succeed.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
                >
                  <div className="h-full p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-brand-500/30 transition-all duration-300 group">
                    {/* Quote Icon */}
                    <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center mb-4">
                      <Quote className="w-5 h-5 text-brand-400" />
                    </div>

                    {/* Rating */}
                    <div className="mb-4">
                      <StarRating rating={testimonial.rating} />
                    </div>

                    {/* Content */}
                    <p className="text-slate-300 leading-relaxed mb-6 text-sm">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-slate-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={scrollPrev}
              className={`p-3 rounded-full border transition-all duration-300 ${
                canScrollPrev
                  ? "border-slate-700 text-white hover:border-brand-500 hover:bg-slate-800"
                  : "border-slate-800 text-slate-600 cursor-not-allowed"
              }`}
              disabled={!canScrollPrev}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className={`p-3 rounded-full border transition-all duration-300 ${
                canScrollNext
                  ? "border-slate-700 text-white hover:border-brand-500 hover:bg-slate-800"
                  : "border-slate-800 text-slate-600 cursor-not-allowed"
              }`}
              disabled={!canScrollNext}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "98%", label: "Client Satisfaction" },
            { value: "150+", label: "Projects Delivered" },
            { value: "50+", label: "Active Clients" },
            { value: "5+", label: "Years Experience" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-slate-950/50 border border-slate-800"
            >
              <div className="text-2xl sm:text-3xl font-bold text-brand-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
