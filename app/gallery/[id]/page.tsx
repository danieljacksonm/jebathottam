'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { ViewCounter } from '@/components/ui/view-counter';
import { galleryImages } from '@/data/gallery-content';

export default function GalleryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const currentId = parseInt(params.id);
  const image = galleryImages.find(img => img.id === currentId) || galleryImages[0];
  const currentIndex = galleryImages.findIndex(img => img.id === currentId);
  const nextImage = galleryImages[currentIndex + 1] || galleryImages[0];
  const prevImage = galleryImages[currentIndex - 1] || galleryImages[galleryImages.length - 1];
  const relatedImages = galleryImages.filter(img => img.id !== currentId && img.category === image.category).slice(0, 3);

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
          {/* Main Image */}
          <FadeInUp delay={0.1}>
            <div className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
              <div className="aspect-video bg-gray-100 relative">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={image.image}
                  alt={image.title}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </div>
          </FadeInUp>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            <div className="lg:col-span-2">
              <FadeInUp delay={0.2}>
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium uppercase tracking-wide">
                      {image.category}
                    </span>
                    <time className="text-sm text-gray-600">
                      {new Date(image.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                    {image.title}
                  </h1>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-xl text-gray-700 leading-relaxed">
                      {image.description}
                    </p>
                  </div>
                </div>
              </FadeInUp>

              {/* Scripture */}
              <FadeInUp delay={0.3}>
                <div className="bg-gradient-to-r from-primary-50 via-primary-100/50 to-primary-50 border-l-4 border-primary-600 p-8 rounded-xl shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl flex-shrink-0">📖</div>
                    <div>
                      <p className="text-xl md:text-2xl font-serif italic text-gray-800 leading-relaxed mb-2">
                        "{image.scripture}"
                      </p>
                      <p className="text-sm text-gray-600 font-medium">Scripture Reference</p>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <FadeInUp delay={0.4}>
                <div className="bg-gray-50 rounded-2xl p-6 lg:sticky lg:top-24 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Image Details</h3>
                  <div className="space-y-4 text-sm">
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
                    <div>
                      <span className="text-gray-600 block mb-1">Category</span>
                      <span className="text-gray-900 font-medium">{image.category}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <ViewCounter count={Math.floor(Math.random() * 3000) + 200} />
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-gray-600 text-xs leading-relaxed">
                        This image captures a moment from our ministry journey, reflecting God's presence and work in our community.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>

          {/* Navigation */}
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

          {/* Related Images */}
          {relatedImages.length > 0 && (
            <FadeInUp delay={0.6}>
              <div className="mt-16 pt-12 border-t border-gray-200">
                <h3 className="text-3xl font-serif font-semibold text-gray-900 mb-8">
                  More from {image.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedImages.map((relatedImage) => (
                    <Link key={relatedImage.id} href={`/gallery/${relatedImage.id}`}>
                      <div className="group cursor-pointer">
                        <div className="relative h-64 mb-4 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                          <img
                            src={relatedImage.image}
                            alt={relatedImage.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                          {relatedImage.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedImage.description}
                        </p>
                      </div>
                    </Link>
                  ))}
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
