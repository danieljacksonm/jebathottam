"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowRight,
  Twitter,
  Linkedin,
  Github,
  Instagram,
} from "lucide-react";

const footerLinks = {
  services: [
    { label: "Web Development", href: "/services#web" },
    { label: "Data Entry", href: "/services#digital" },
    { label: "Travel Booking", href: "/services#travel" },
    { label: "Virtual Assistance", href: "/services#digital" },
  ],
  company: [
    { label: "About Us", href: "/why" },
    { label: "Our Work", href: "/work" },
    { label: "Process", href: "/process" },
    { label: "Testimonials", href: "/testimonials" },
  ],
  support: [
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Stay in the loop
              </h3>
              <p className="text-slate-400">
                Get the latest updates on our services and digital tips.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="w-full lg:w-auto flex flex-col sm:flex-row gap-3"
            >
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full sm:w-80 px-12 py-4 rounded-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-500 text-slate-950 font-semibold rounded-full hover:bg-brand-400 transition-all duration-300"
              >
                {isSubscribed ? "Subscribed!" : "Subscribe"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-white">
                Ebenezer<span className="text-brand-500">.</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Reliable digital work for businesses everywhere. We deliver excellence in every project.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500 hover:bg-slate-800 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Ebenezer Digital Services. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
