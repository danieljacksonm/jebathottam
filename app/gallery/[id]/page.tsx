'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { ViewCounter } from '@/components/ui/view-counter';
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
  scripture?: string;
};

export default function GalleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: idParam } = use(params);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        if (list.length > 0) {
          setGalleryImages(list.map((g: { id: number; title: string; description: string | null; image_url: string; created_at?: string }) => ({
            id: g.id,
            title: g.title,
            description: g.description || null,
            image_url: g.image_url,
            image: g.image_url,
            category: 'Ministry',
            date: g.created_at,
            scripture: '',
          })));
        } else {
          setGalleryImages(fallbackGallery.map((g) => ({ ...g, image_url: g.image })));
        }
      })
      .catch(() => setGalleryImages(fallbackGallery.map((g) => ({ ...g, image_url: g.image }))))
      .finally(() => setLoading(false));
  }, []);

  const currentId = parseInt(idParam, 10) || 0;
  const image = galleryImages.find((img) => img.id === currentId) || galleryImages[0];
  const currentIndex = galleryImages.findIndex((img) => img.id === currentId);
  const nextImage = galleryImages[currentIndex + 1] || galleryImages[0];
  const prevImage = galleryImages[currentIndex - 1] || galleryImages[galleryImages.length - 1];
  const relatedImages = galleryImages.filter((img) => img.id !== currentId && (img.category === image?.category)).slice(0, 3);

  const imageSrc = getImageSrc(image);
  const mainOptimized = getOptimizedImageUrl(imageSrc, 1200);

  if (loading || !image) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <FadeInUp>
          <nav className="mb-8 text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/gallery" className="hover:text-primary-600 transition-colors">
              Gallery
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{image.title}</span>
          </nav>
        </FadeInUp>

        <div className="max-w-7xl mx-auto">
          <FadeInUp delay={0.1}>
            <div className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={mainOptimized || imageSrc}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </FadeInUp>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            <div className="lg:col-span-2">
              <FadeInUp delay={0.2}>
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium uppercase tracking-wide">
                      {image.category || 'Ministry'}
                    </span>
                    {image.date && (
                      <time className="text-sm text-gray-600">
                        {new Date(image.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                    {image.title}
                  </h1>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-xl text-gray-700 leading-relaxed">
                      {image.description || ''}
                    </p>
                  </div>
                </div>
              </FadeInUp>

              {image.scripture && (
                <FadeInUp delay={0.3}>
                  <div className="bg-gradient-to-r from-primary-50 via-primary-100/50 to-primary-50 border-l-4 border-primary-600 p-8 rounded-xl shadow-sm">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl flex-shrink-0">📖</div>
                      <div>
                        <p className="text-xl md:text-2xl font-serif italic text-gray-800 leading-relaxed mb-2">
                          &ldquo;{image.scripture}&rdquo;
                        </p>
                        <p className="text-sm text-gray-600 font-medium">Scripture Reference</p>
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              )}
            </div>

            <div className="lg:col-span-1">
              <FadeInUp delay={0.4}>
                <div className="bg-gray-50 rounded-2xl p-6 lg:sticky lg:top-24 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Image Details</h3>
                  <div className="space-y-4 text-sm">
                    {image.date && (
                      <div>
                        <span className="text-gray-600 block mb-1">Date Captured</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(image.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600 block mb-1">Category</span>
                      <span className="text-gray-900 font-medium">{image.category || 'Ministry'}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <ViewCounter count={Math.floor(Math.random() * 3000) + 200} />
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>

          <FadeInUp delay={0.5}>
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/gallery/${prevImage.id}`)}
                  className="flex items-center space-x-2 w-full sm:w-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous Image</span>
                </Button>
                <Link href="/gallery">
                  <Button variant="ghost" className="w-full sm:w-auto">
                    Back to Gallery
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/gallery/${nextImage.id}`)}
                  className="flex items-center space-x-2 w-full sm:w-auto"
                >
                  <span>Next Image</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          </FadeInUp>

          {relatedImages.length > 0 && (
            <FadeInUp delay={0.6}>
              <div className="mt-16 pt-12 border-t border-gray-200">
                <h3 className="text-3xl font-serif font-semibold text-gray-900 mb-8">
                  More from {image.category || 'Ministry'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedImages.map((relatedImage) => {
                    const relatedSrc = getImageSrc(relatedImage);
                    const relatedOpt = getOptimizedImageUrl(relatedSrc, 400);
                    return (
                      <Link key={relatedImage.id} href={`/gallery/${relatedImage.id}`}>
                        <div className="group cursor-pointer">
                          <div className="relative h-64 mb-4 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                            <img
                              src={relatedOpt || relatedSrc}
                              alt={relatedImage.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                            {relatedImage.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {relatedImage.description || ''}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </FadeInUp>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
