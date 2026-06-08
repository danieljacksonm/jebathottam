"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Database,
  FileText,
  Globe,
  Plane,
  Code,
  Smartphone,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";

const serviceCategories = [
  {
    id: "digital",
    title: "Digital & Admin",
    icon: Database,
    description: "Streamline your operations with our comprehensive digital and administrative services.",
    services: [
      {
        icon: FileText,
        title: "Data Entry",
        description: "Accurate, timely data entry from forms, spreadsheets, or documents into your preferred format.",
      },
      {
        icon: FileText,
        title: "Document Conversion",
        description: "Convert between PDF, Word, Excel, images—with care for layout and content integrity.",
      },
      {
        icon: Globe,
        title: "Online Form Handling",
        description: "Fill forms, submit applications, and manage form-based workflows on your behalf.",
      },
      {
        icon: Users,
        title: "Virtual Assistance",
        description: "Email management, scheduling, research, and other administrative tasks handled remotely.",
      },
    ],
  },
  {
    id: "travel",
    title: "Travel & Booking",
    icon: Plane,
    description: "End-to-end travel assistance for business and personal trips worldwide.",
    services: [
      {
        icon: Plane,
        title: "Flight & Transport Booking",
        description: "Assistance searching and booking flights, buses, and trains to your preferences.",
      },
      {
        icon: Globe,
        title: "Tour Planning",
        description: "Help with itinerary ideas, tour options, and activity bookings for your trips.",
      },
      {
        icon: Database,
        title: "Reservation Management",
        description: "Hotel and reservation support, changes, and follow-up to keep plans organized.",
      },
    ],
  },
  {
    id: "web",
    title: "Web & Technical",
    icon: Code,
    description: "Custom web solutions and technical support to power your digital presence.",
    services: [
      {
        icon: Globe,
        title: "Website Development",
        description: "Custom websites from simple business sites to complex solutions using modern technologies.",
      },
      {
        icon: Zap,
        title: "Landing Pages",
        description: "Conversion-focused landing pages for campaigns, products, or lead generation.",
      },
      {
        icon: Code,
        title: "PHP & Laravel",
        description: "Backend applications, APIs, and web apps built with PHP and Laravel framework.",
      },
      {
        icon: Smartphone,
        title: "Fixes & Optimization",
        description: "Bug fixes, speed improvements, and updates to keep your site running smoothly.",
      },
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 sm:py-32 bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[120px]" />
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

        {/* Service Categories */}
        <div className="space-y-20">
          {serviceCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              id={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20">
                  <category.icon className="w-6 h-6 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {category.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">{category.description}</p>
                </div>
              </div>

              {/* Service Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.services.map((service, serviceIndex) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: serviceIndex * 0.1 }}
                    className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/5"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 group-hover:bg-brand-500/10 transition-colors mb-4">
                      <service.icon className="w-5 h-5 text-slate-400 group-hover:text-brand-400 transition-colors" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-400 transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-brand-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-semibold rounded-full border border-slate-700 hover:border-brand-500 hover:bg-slate-800 transition-all duration-300"
          >
            View All Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
