"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap, Users, Clock, Award } from "lucide-react";

const stats = [
  { icon: Zap, value: 150, suffix: "+", label: "Projects Completed" },
  { icon: Users, value: 98, suffix: "%", label: "Client Satisfaction" },
  { icon: Clock, value: 24, suffix: "/7", label: "Support Available" },
  { icon: Award, value: 5, suffix: "+", label: "Years Experience" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={countRef}>
      {count}
      {suffix}
    </span>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950"
    >
      {/* Animated Background */}
      <motion.div style={{ y }} className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-40 right-20 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 left-1/3 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-brand-400/50 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: "100%",
                opacity: 0,
              }}
              animate={{
                y: "-10%",
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-medium text-brand-400">
              Trusted by 150+ businesses worldwide
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            <span className="block">Transform Your</span>
            <span className="block bg-gradient-to-r from-brand-400 via-brand-500 to-accent-400 bg-clip-text text-transparent">
              Digital Presence
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            We craft exceptional digital experiences that drive growth, engage audiences, and deliver measurable results for your business.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-brand-500 text-slate-950 font-semibold rounded-full hover:bg-brand-400 transition-all duration-300 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-1"
            >
              Get Free Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-700 text-white font-semibold rounded-full hover:border-brand-500 hover:text-brand-400 transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              View Our Work
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-brand-500/30 transition-colors"
              >
                <stat.icon className="w-6 h-6 text-brand-400 mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-slate-700 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-brand-400 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
