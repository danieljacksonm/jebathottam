'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/ui/logo';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo />
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/#about"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/#mission"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Mission
            </Link>
            <Link
              href="/#team"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Team
            </Link>
            <Link
              href="/#blog"
              className="text-primary-600 hover:text-primary-700 transition-colors font-semibold"
            >
              Blog
            </Link>
            <Link
              href="/#testimony"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Testimonies
            </Link>
            <Link
              href="/#events"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Events
            </Link>
            <Link
              href="/gallery"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Gallery
            </Link>
            <Link
              href="/#media"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Media
            </Link>
            <Link
              href="/social-feed"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium flex items-center space-x-1"
            >
              <span>🌐</span>
              <span>Social Feed</span>
            </Link>
            <Link
              href="/notes"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Notes
            </Link>
            <Link
              href="/audio-conference"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Audio Conference
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <Link
                href="/#about"
                className="block text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/#mission"
                className="block text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mission
              </Link>
              <Link
                href="/#team"
                className="block text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Team
              </Link>
              <Link
                href="/#blog"
                className="block text-primary-600 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/#testimony"
                className="block text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonies
              </Link>
              <Link
                href="/#events"
                className="block text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/gallery"
                className="block text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="/#media"
                className="block text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Media
              </Link>
              <Link
                href="/social-feed"
                className="block text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                🌐 Social Feed
              </Link>
              <Link
                href="/notes"
                className="block text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Notes
              </Link>
              <Link
                href="/audio-conference"
                className="block text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Audio Conference
              </Link>
              <Link
                href="/contact"
                className="block text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

