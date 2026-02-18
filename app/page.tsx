'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { EnhancedImageSlider } from '@/components/ui/enhanced-image-slider';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { motion } from 'framer-motion';
import { ministryInfo, blogPosts, teamMembers, events, missionVision } from '@/data/demo-content';
import { galleryImages } from '@/data/gallery-content';
import { AudioPlayer } from '@/components/audio/audio-player';
import { mediaItems } from '@/data/media-content';
import { PrayerForm } from '@/components/prayer/prayer-form';
import { ChatWidget } from '@/components/chat/chat-widget';

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

type SliderImage = { src: string; alt: string; title?: string; description?: string };

export default function Home() {
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [homeTestimonies, setHomeTestimonies] = useState<Array<{ id: number; name: string; content: string; image_url: string | null; created_at: string }>>([]);

  useEffect(() => {
    fetch('/api/slider')
      .then((res) => res.ok ? res.json() : { data: [] })
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        setSliderImages(
          list
            .filter((s: { image_url?: string }) => s?.image_url && String(s.image_url).trim())
            .map((s: { image_url: string; title?: string; text?: string; description?: string }) => ({
              src: s.image_url.startsWith('/') || s.image_url.startsWith('http') ? s.image_url : `/${s.image_url.replace(/^\//, '')}`,
              alt: s.title || s.text || 'Ministry',
              title: s.title || undefined,
              description: s.description || undefined,
            }))
        );
      })
      .catch(() => setSliderImages([]));
  }, []);

  useEffect(() => {
    fetch('/api/testimonies')
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        setHomeTestimonies(list.slice(0, 3));
      })
      .catch(() => setHomeTestimonies([]));
  }, []);

  const featuredBlog = blogPosts.find(post => post.featured) || blogPosts[0];
  const regularBlogs = blogPosts.filter(post => !post.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Navigation />

      {/* 1. HERO IMAGE SLIDER */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        <EnhancedImageSlider images={sliderImages} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10" />
        <div className="absolute inset-0 z-20 container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl">
            <FadeInUp>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-4 sm:mb-6 leading-tight">
                {ministryInfo.name}
              </h1>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 font-light opacity-90">
                {ministryInfo.tagline}
              </p>
            </FadeInUp>
            <FadeInUp delay={0.4}>
              <p className="text-base sm:text-lg md:text-xl mb-8 font-serif italic opacity-90 max-w-3xl mx-auto">
                &ldquo;{ministryInfo.scripture}&rdquo;
              </p>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* 2. BLOG SECTION */}
      <section id="blog" className="py-16 sm:py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-10 sm:mb-12 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
                Latest Blog Posts
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
                Insights, teachings, and reflections from our ministry
              </p>
            </div>
          </FadeInUp>

          {/* Featured Blog */}
          <FadeInUp delay={0.2}>
            <div className="max-w-5xl mx-auto mb-10 sm:mb-12">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all" hover={false}>
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-full min-h-[280px] sm:min-h-[300px]">
                    <img
                      src={featuredBlog.image}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                    />
                  </div>
                  <CardContent className="p-5 sm:p-6 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm uppercase tracking-wide opacity-80">
                        {featuredBlog.category} &bull; Featured
                      </div>
                      <div className="flex items-center text-xs opacity-70">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {calculateReadingTime(featuredBlog.content)} min read
                      </div>
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-serif mb-3 sm:mb-4 text-white">
                      {featuredBlog.title}
                    </CardTitle>
                    <CardDescription className="text-white/80 mb-4 text-base sm:text-lg">
                      {featuredBlog.excerpt}
                    </CardDescription>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 mb-4 border border-white/20">
                      <p className="text-sm text-white/90 italic">
                        &ldquo;For the word of God is living and active, sharper than any two-edged sword.&rdquo;
                      </p>
                      <p className="text-xs text-white/70 mt-1">- Hebrews 4:12</p>
                    </div>
                    <div className="text-sm text-white/70 mb-4 sm:mb-6">
                      {new Date(featuredBlog.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })} &bull; {featuredBlog.author}
                    </div>
                    <Link href={`/blog/${featuredBlog.id}`}>
                      <Button className="bg-white text-primary-700 hover:bg-gray-100 w-full md:w-auto text-base sm:text-lg py-3 sm:py-4">
                        Continue Reading &rarr;
                      </Button>
                    </Link>
                  </CardContent>
                </div>
              </Card>
            </div>
          </FadeInUp>

          {/* Regular Blog Posts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-10 sm:mb-12">
            <StaggerContainer>
              {regularBlogs.map((post) => (
                <StaggerItem key={post.id}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all h-full" hover={false}>
                      <div className="relative h-48 mb-4">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs uppercase tracking-wide opacity-80">
                            {post.category}
                          </div>
                          <div className="flex items-center text-xs opacity-70">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {calculateReadingTime(post.content)} min
                          </div>
                        </div>
                        <CardTitle className="text-xl font-serif text-white">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-white/70 text-sm">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/80 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <Link href={`/blog/${post.id}`}>
                          <Button variant="ghost" className="text-white hover:bg-white/20 w-full">
                            Read More &rarr;
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <FadeInUp delay={0.6}>
            <div className="text-center">
              <Link href="/blog">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100">
                  View All Blog Posts
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 3. ABOUT US */}
      <section id="about" className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <FadeInUp>
                <div className="relative h-72 sm:h-96 rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
                    alt="About our ministry"
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeInUp>
              <FadeInUp delay={0.2}>
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    About Us
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                    We are a Christian ministry dedicated to preserving God-spoken words and
                    encouraging believers through digital tools. Our mission is to create a
                    trustworthy platform that serves our community and future generations.
                  </p>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                    With reverence and care, we document prophecies, teachings, and revelations
                    that God speaks to His people, ensuring these precious words are preserved
                    for future generations.
                  </p>
                  <Link href="/about">
                    <Button size="lg">
                      Read More About Us
                    </Button>
                  </Link>
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MISSION & VISION */}
      <section id="mission" className="py-16 sm:py-20 bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-900 dark:to-primary-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-10 sm:mb-12 text-center">
              Mission &amp; Vision
            </h2>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
              <StaggerItem>
                <Card className="h-full border-2 border-primary-200 dark:border-primary-800 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="text-5xl mb-4">{missionVision.mission.icon}</div>
                    <CardTitle className="text-2xl font-serif">{missionVision.mission.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
                      {missionVision.mission.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
              <StaggerItem>
                <Card className="h-full border-2 border-primary-200 dark:border-primary-800 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="text-5xl mb-4">{missionVision.vision.icon}</div>
                    <CardTitle className="text-2xl font-serif">{missionVision.vision.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
                      {missionVision.vision.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            </div>
          </StaggerContainer>
          <FadeInUp delay={0.6}>
            <div className="text-center mt-10 sm:mt-12">
              <Link href="/mission">
                <Button variant="outline" size="lg">
                  Read Full Mission Statement
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 5. TESTIMONIES */}
      <section id="testimony" className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-10 sm:mb-12 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                Testimonies
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Stories of God&apos;s faithfulness and transformation
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto mb-10 sm:mb-12">
              {homeTestimonies.map((testimony) => (
                <StaggerItem key={testimony.id}>
                  <Link href={`/testimony/${testimony.id}`}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-primary-100 flex-shrink-0">
                              <img
                                src={testimony.image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23e5e7eb" width="64" height="64"/%3E%3C/svg%3E'}
                                alt={testimony.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">{testimony.name}</h3>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                {new Date(testimony.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-4 line-clamp-4 leading-relaxed">
                            &ldquo;{testimony.content}&rdquo;
                          </p>
                          <span className="text-xs sm:text-sm text-primary-600 font-medium">Read More &rarr;</span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
          <FadeInUp delay={0.4}>
            <div className="text-center">
              <Link href="/testimony">
                <Button variant="outline" size="lg">
                  View All Testimonies
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 6. EVENTS */}
      <section id="events" className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-10 sm:mb-12 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                Upcoming Events
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Join us for worship, fellowship, and spiritual growth
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 mb-10 sm:mb-12">
              {events.map((event) => (
                <StaggerItem key={event.id}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                          <div className="flex-shrink-0 self-start">
                            <div className="bg-primary-600 text-white rounded-lg p-4 sm:p-6 text-center min-w-[100px] sm:min-w-[120px]">
                              <div className="text-2xl sm:text-3xl font-bold">
                                {new Date(event.date).getDate()}
                              </div>
                              <div className="text-xs sm:text-sm uppercase tracking-wide">
                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2 font-serif">
                              {event.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">{event.description}</p>
                            <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {event.time}
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {event.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
          <FadeInUp delay={0.4}>
            <div className="text-center">
              <Link href="/events">
                <Button variant="outline" size="lg">
                  View All Events
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 7. GALLERY */}
      <section id="gallery" className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-10 sm:mb-12 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                Gallery
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Moments from our ministry gatherings and events
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto mb-10 sm:mb-12">
              {galleryImages.slice(0, 8).map((image) => (
                <StaggerItem key={image.id}>
                  <Link href={`/gallery/${image.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                      className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl cursor-pointer"
                    >
                      <img
                        src={image.image}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                          <h3 className="text-xs sm:text-sm font-semibold mb-0.5">{image.title}</h3>
                          <p className="text-xs opacity-90">{image.category}</p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
          <FadeInUp delay={0.4}>
            <div className="text-center">
              <Link href="/gallery">
                <Button variant="outline" size="lg">
                  View Full Gallery
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 8. 24 HOURS AUDIO */}
      <section id="audio" className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AudioPlayer />
        </div>
      </section>

      {/* 9. MEDIA SECTION */}
      <section id="media" className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-10 sm:mb-12 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                Media
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Inspirational posters, videos, and messages
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mb-10 sm:mb-12">
              {mediaItems.slice(0, 4).map((item) => (
                <StaggerItem key={item.id}>
                  <Link href={`/media/${item.id}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl cursor-pointer border border-gray-100 dark:border-gray-700"
                    >
                      {item.type === 'poster' ? (
                        <div className="aspect-[2/3] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-6 h-6 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          {item.type === 'youtube-shorts' && (
                            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                              SHORTS
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-3 sm:p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">{item.title}</h3>
                        {item.type === 'poster' && (
                          <p className="text-xs sm:text-sm text-primary-600">{item.scripture}</p>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
          <FadeInUp delay={0.4}>
            <div className="text-center">
              <Link href="/media">
                <Button variant="outline" size="lg">
                  View All Media
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 10. PRAYER POINT FORM */}
      <section id="prayer" className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PrayerForm />
        </div>
      </section>

      <Footer />

      <ChatWidget />
    </div>
  );
}
