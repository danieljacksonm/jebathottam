'use client';

import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { motion } from 'framer-motion';
import { mediaItems } from '@/data/media-content';

export default function MediaPage() {
  const posters = mediaItems.filter(m => m.type === 'poster');
  const videos = mediaItems.filter(m => m.type === 'youtube' || m.type === 'youtube-shorts');

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
            <span className="text-gray-900">Media</span>
          </nav>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4">
              Media
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Inspirational posters, videos, and messages from our ministry
            </p>
          </div>
        </FadeInUp>

        {/* Posters Section */}
        {posters.length > 0 && (
          <FadeInUp delay={0.2}>
            <div className="mb-16">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Posters</h2>
              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posters.map((poster) => (
                    <StaggerItem key={poster.id}>
                      <Link href={`/media/${poster.id}`}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                        >
                          <div className="aspect-[2/3] overflow-hidden">
                            <img
                              src={poster.image}
                              alt={poster.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">{poster.title}</h3>
                            <p className="text-sm text-primary-600">{poster.scripture}</p>
                          </div>
                        </motion.div>
                      </Link>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </div>
          </FadeInUp>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <FadeInUp delay={0.3}>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Videos</h2>
              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.map((video) => (
                    <StaggerItem key={video.id}>
                      <Link href={`/media/${video.id}`}>
                        <motion.div
                          whileHover={{ y: -4 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                        >
                          <div className="aspect-video bg-gray-100 relative">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                            {video.type === 'youtube-shorts' && (
                              <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                                SHORTS
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                            <p className="text-sm text-gray-600">{video.description}</p>
                          </div>
                        </motion.div>
                      </Link>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </div>
          </FadeInUp>
        )}
      </main>

      <Footer />
    </div>
  );
}
