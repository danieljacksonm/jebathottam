'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { motion } from 'framer-motion';
import { galleryImages as fallbackGallery } from '@/data/gallery-content';
import { getOptimizedImageUrl, getImageSrc } from '@/lib/image-utils';

type GalleryItem = {
  id: number;
  title: string;
  description: string | null;
  image_url?: string;
  image?: string;
  category?: string;
  date?: string;
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        if (list.length > 0) {
          setItems(list.map((g: { id: number; title: string; description: string | null; image_url: string }) => ({
            id: g.id,
            title: g.title,
            description: g.description || null,
            image_url: g.image_url,
            image: g.image_url,
            category: 'Ministry',
            date: (g as { created_at?: string }).created_at,
          })));
        } else {
          setItems(fallbackGallery.map((g) => ({ ...g, image_url: g.image })));
        }
      })
      .catch(() => setItems(fallbackGallery.map((g) => ({ ...g, image_url: g.image }))))
      .finally(() => setLoading(false));
  }, []);

  const galleryImages = items.length > 0 ? items : fallbackGallery.map((g) => ({ ...g, image_url: g.image }));

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <FadeInUp>
          <nav className="mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Gallery</span>
          </nav>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4">
              Gallery
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Moments from our ministry gatherings, worship services, and community events
            </p>
          </div>
        </FadeInUp>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image) => {
                const src = getImageSrc(image);
                const optimizedSrc = getOptimizedImageUrl(src, 600);
                return (
                  <StaggerItem key={image.id}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link href={`/gallery/${image.id}`}>
                        <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={optimizedSrc || src}
                              alt={image.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                              <div className="text-xs uppercase tracking-wide mb-2 opacity-90">
                                {image.category || 'Ministry'}
                              </div>
                              <h3 className="text-xl font-serif font-semibold mb-2">
                                {image.title}
                              </h3>
                              <p className="text-sm opacity-90 line-clamp-2">
                                {image.description || ''}
                              </p>
                            </div>
                          </div>
                          <div className="absolute top-4 right-4">
                            <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </div>
          </StaggerContainer>
        )}
      </main>

      <Footer />
    </div>
  );
}
