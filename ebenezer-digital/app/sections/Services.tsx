"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Database,
  FileText,
  Globe,
  Plane,
  Code,
  Users,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "digital" | "travel" | "web" | "other";
  features: string[];
};

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Globe,
  Database,
  Plane,
  Users,
  Code,
};

const categoryMeta: Record<
  string,
  { title: string; description: string; icon: LucideIcon }
> = {
  digital: {
    title: "Digital & Admin",
    description: "Streamline your operations with our comprehensive digital and administrative services.",
    icon: Database,
  },
  travel: {
    title: "Travel & Booking",
    description: "End-to-end travel assistance for business and personal trips worldwide.",
    icon: Plane,
  },
  web: {
    title: "Web & Technical",
    description: "Custom web solutions and technical support to power your digital presence.",
    icon: Code,
  },
  other: {
    title: "Other Services",
    description: "Additional digital support tailored to your needs.",
    icon: Globe,
  },
};

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setServices(data.services || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const order = ["digital", "travel", "web", "other"];
    return order
      .map((id) => {
        const items = services.filter((s) => s.category === id);
        if (!items.length) return null;
        const meta = categoryMeta[id] || categoryMeta.other;
        return {
          id,
          title: meta.title,
          description: meta.description,
          icon: meta.icon,
          services: items,
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      title: string;
      description: string;
      icon: LucideIcon;
      services: ServiceItem[];
    }>;
  }, [services]);

  return (
    <section id="services" className="py-24 sm:py-32 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-400 text-sm font-medium mb-4">
            What We Do
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Comprehensive Digital Solutions
          </h2>
          <p className="text-lg text-slate-400">
            From admin tasks to web development and travel support—a range of digital services tailored to your needs.
          </p>
        </motion.div>

        {loading ? (
          <p className="text-center text-slate-500">Loading services...</p>
        ) : (
          <div className="space-y-16">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{cat.title}</h3>
                    <p className="text-sm text-slate-400">{cat.description}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cat.services.map((service) => {
                    const Icon = iconMap[service.icon] || FileText;
                    return (
                      <div
                        key={service.id}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 hover:border-brand-500/40 transition-colors"
                      >
                        <Icon className="w-5 h-5 text-brand-400 mb-3" />
                        <h4 className="font-medium text-white mb-2">{service.title}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{service.description}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 font-medium"
          >
            View all services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
