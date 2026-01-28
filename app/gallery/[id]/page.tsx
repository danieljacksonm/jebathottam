'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { galleryImages } from '@/data/gallery-content';

export default function GalleryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const currentId = parseInt(params.id);
  const image = galleryImages.find(img => img.id === currentId) || galleryImages[0];
  const currentIndex = galleryImages.findIndex(img => img.id === currentId);
  const nextImage = galleryImages[currentIndex + 1] || galleryImages[0];
  const prevImage = galleryImages[currentIndex - 1] || galleryImages[galleryImages.length - 1];

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
            <Link href="/gallery" className="hover:text-primary-600">
              Gallery
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{image.title}</span>
          </nav>
        </FadeInUp>

        <div className="max-w-6xl mx-auto">
          {/* Main Image */}
          <FadeInUp delay={0.1}>
            <div className="relative mb-8 rounded-lg overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gray-100">
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </FadeInUp>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FadeInUp delay={0.2}>
                <div className="mb-6">
                  <div className="text-sm text-primary-600 font-medium mb-3 uppercase tracking-wide">
                    {image.category}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                    {image.title}
                  </h1>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {image.description}
                  </p>
                </div>
              </FadeInUp>

              <FadeInUp delay={0.3}>
                <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">📖</div>
                    <div>
                      <p className="text-lg font-serif italic text-gray-800 leading-relaxed">
                        "{image.scripture}"
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </div>

            <div className="lg:col-span-1">
              <FadeInUp delay={0.4}>
                <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                  <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 text-gray-900 font-medium">
                        {new Date(image.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <span className="ml-2 text-gray-900 font-medium">{image.category}</span>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>

          {/* Navigation */}
          <FadeInUp delay={0.5}>
            <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => router.push(`/gallery/${prevImage.id}`)}
                className="flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </Button>
              <Link href="/gallery">
                <Button variant="ghost">Back to Gallery</Button>
              </Link>
              <Button
                variant="secondary"
                onClick={() => router.push(`/gallery/${nextImage.id}`)}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </FadeInUp>
        </div>
      </main>

      <Footer />
    </div>
  );
}
