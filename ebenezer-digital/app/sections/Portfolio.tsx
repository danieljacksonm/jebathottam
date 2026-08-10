"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const categories = [
  { id: "all", label: "All Projects" },
  { id: "ongoing", label: "Ongoing" },
  { id: "completed", label: "Completed" },
  { id: "web", label: "Web Development" },
  { id: "travel", label: "Travel & Booking" },
];

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  coverImage: string;
  liveUrl?: string;
  projectPhase?: "ongoing" | "completed";
  clientName?: string;
};

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.portfolio || []).map((p: {
          id: string;
          title: string;
          description: string;
          category: string[];
          techStack: string[];
          coverImage?: string;
          liveUrl?: string;
          projectPhase?: "ongoing" | "completed";
          clientName?: string;
        }) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          category: (p.category && p.category[0]) || "web",
          tags: p.techStack || [],
          coverImage: p.coverImage || "/images/portfolio/canaan-cover.png",
          liveUrl: p.liveUrl,
          projectPhase: p.projectPhase || "completed",
          clientName: p.clientName,
        }));
        setProjects(list);
      })
      .catch(() => setProjects([]));
  }, []);

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : activeCategory === "ongoing" || activeCategory === "completed"
        ? projects.filter((p) => p.projectPhase === activeCategory)
        : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="py-24 sm:py-32 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Real client projects — ongoing builds and completed deliveries across web, travel, and business systems.
          </p>
        </motion.div>

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

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-brand-500/30 transition-all duration-500">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/10" />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
                        project.projectPhase === "ongoing"
                          ? "bg-amber-400 text-slate-950"
                          : "bg-emerald-400/90 text-slate-950"
                      }`}
                    >
                      {project.projectPhase === "ongoing" ? "Ongoing" : "Completed"}
                    </span>
                  </div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex flex-wrap gap-2 mb-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-medium text-brand-400 bg-brand-500/10 rounded-md border border-brand-500/20 backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.clientName && (
                      <p className="text-xs text-brand-300/90 mb-1">{project.clientName}</p>
                    )}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-300 mb-4 line-clamp-2">{project.description}</p>
                  </div>
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300"
                      aria-label={`Open ${project.title}`}
                    >
                      <ArrowUpRight className="w-5 h-5 text-slate-950" />
                    </a>
                  ) : (
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5 text-slate-950" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

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
