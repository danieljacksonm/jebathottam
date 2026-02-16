'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

type TestimonyItem = {
  id: number;
  name: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

const placeholderImg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23e5e7eb" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="10"%3E?%3C/text%3E%3C/svg%3E';

export default function TestimonyPage() {
  const [testimonies, setTestimonies] = useState<TestimonyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonies')
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        setTestimonies(Array.isArray(data?.data) ? data.data : []);
      })
      .catch(() => setTestimonies([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        <FadeInUp>
          <nav className="mb-6 sm:mb-8 text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Testimonies</span>
          </nav>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div className="mb-8 sm:mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Testimonies
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Stories of God&apos;s faithfulness and transformation in the lives of believers
            </p>
          </div>
        </FadeInUp>

        {loading ? (
          <div className="flex justify-center py-12 sm:py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : testimonies.length === 0 ? (
          <FadeInUp>
            <div className="text-center py-12 sm:py-16 text-gray-600">
              <p className="text-lg">No testimonies yet. Check back later.</p>
            </div>
          </FadeInUp>
        ) : (
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
              {testimonies.map((testimony) => (
                <StaggerItem key={testimony.id}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <Link href={`/testimony/${testimony.id}`} className="block h-full">
                      <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer border-gray-200 dark:border-gray-800">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-primary-100 dark:ring-primary-900/30 flex-shrink-0">
                              <img
                                src={testimony.image_url || placeholderImg}
                                alt={testimony.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = placeholderImg;
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {testimony.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                {new Date(testimony.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-4 line-clamp-4 leading-relaxed">
                            &ldquo;{testimony.content}&rdquo;
                          </p>
                          <span className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                            Read more →
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        )}
      </main>

      <Footer />
    </div>
  );
}
