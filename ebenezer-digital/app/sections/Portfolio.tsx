"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const categories = [
  { id: "all", label: "All Projects" },
  { id: "web", label: "Web Development" },
  { id: "data", label: "Data & Admin" },
  { id: "travel", label: "Travel & Booking" },
];

const projects = [
  {
    id: 1,
    title: "E-Commerce Product Data Migration",
    description: "Migrated 2,000+ product listings from an old platform to a new store with clean categories and images.",
    category: "data",
    tags: ["Data Entry", "Migration"],
    image: "/images/work-1.jpg",
    stats: { items: "2,000+", time: "3 weeks" },
  },
  {
    id: 2,
    title: "Travel Agency Booking Portal",
    description: "Custom portal for a small travel agency to manage flight and hotel bookings with client dashboards.",
    category: "web",
    tags: ["Web Development", "Dashboard"],
    image: "/images/work-2.jpg",
    stats: { users: "500+", bookings: "2k/month" },
  },
  {
    id: 3,
    title: "Restaurant Reservation System",
    description: "PHP-based reservation and table management system with email confirmations.",
    category: "web",
    tags: ["PHP", "Laravel", "Booking"],
    image: "/images/work-3.jpg",
    stats: { tables: "50+", daily: "200+" },
  },
  {
    id: 4,
    title: "Lead Generation Landing Page",
    description: "Single-page site for a consulting firm with form capture and thank-you flow; fast load and mobile.",
    category: "web",
    tags: ["Landing Page", "Conversion"],
    image: "/images/work-4.jpg",
    stats: { conversion: "12%", leads: "500+" },
  },
  {
    id: 5,
    title: "Document Conversion for Law Firm",
    description: "Bulk conversion of scanned legal documents to searchable PDF and Word with consistent formatting.",
    category: "data",
    tags: ["Document", "OCR"],
    image: "/images/work-5.jpg",
    stats: { documents: "10,000+", accuracy: "99.5%" },
  },
  {
    id: 6,
    title: "Tour Itinerary & Booking Support",
    description: "Ongoing support for a tour operator: itinerary updates, booking confirmations, and client communication.",
    category: "travel",
    tags: ["Travel", "Support"],
    image: "/images/work-6.jpg",
    stats: { tours: "50+", clients: "1,000+" },
  },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="py-24 sm:py-32 bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-400 text-sm font-medium mb-4">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Our Recent Work
          </h2>
          <p className="text-lg text-slate-400">
            A selection of projects we have delivered. Each built or completed to the client&apos;s requirements and timeline.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/25"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-brand-500/30 transition-all duration-500">
                  {/* Image Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-medium text-brand-400 bg-brand-500/10 rounded-md border border-brand-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                      {Object.entries(project.stats).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-1">
                          <span className="text-lg font-bold text-brand-400">
                            {value}
                          </span>
                          <span className="text-xs text-slate-500 capitalize">
                            {key}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hover Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 text-slate-950" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-semibold rounded-full border border-slate-700 hover:border-brand-500 hover:bg-slate-800 transition-all duration-300"
          >
            View All Projects
            <ExternalLink className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
