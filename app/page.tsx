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
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col antialiased">
      <Navigation />

      {/* ──────────────────────────────────────────────────────────────────
          1. HERO
      ────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <EnhancedImageSlider images={sliderImages} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />

        <div className="absolute inset-0 z-20 container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl">
            <FadeInUp>
              <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-white/70 border border-white/20 rounded-full px-5 py-2 mb-6 backdrop-blur-sm bg-white/5">
                {ministryInfo.subtitle}
              </span>
            </FadeInUp>

            <FadeInUp delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold mb-5 leading-[1.05] tracking-tight">
                {ministryInfo.name}
              </h1>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <p className="text-base sm:text-lg md:text-xl text-white/85 mb-5 max-w-xl mx-auto leading-relaxed font-light">
                {ministryInfo.tagline}
              </p>
            </FadeInUp>

            <FadeInUp delay={0.3}>
              <div className="w-12 h-px bg-white/30 mx-auto mb-5" />
              <p className="text-sm sm:text-base font-serif italic text-white/60 mb-10 max-w-lg mx-auto">
                &ldquo;{ministryInfo.scripture}&rdquo;
              </p>
            </FadeInUp>

            <FadeInUp delay={0.4}>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/#blog">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg rounded-full px-8 font-medium text-sm tracking-wide">
                    Read &amp; reflect
                  </Button>
                </Link>
                <Link href="/audio-conference/join">
                  <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-full px-8 font-medium text-sm tracking-wide backdrop-blur-sm">
                    Join a call
                  </Button>
                </Link>
              </div>
            </FadeInUp>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-gray-900/80 to-transparent z-20 pointer-events-none" />
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          2. BLOG
      ────────────────────────────────────────────────────────────────── */}
      <section id="blog" className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
                From the blog
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight">
                Latest reflections
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                Teachings, testimonies, and insights from our ministry
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <Link href={`/blog/${featuredBlog.id}`} className="block group mb-16">
              <article className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-800">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[380px] overflow-hidden">
                    <img
                      src={featuredBlog.image}
                      alt={featuredBlog.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent md:bg-none" />
                  </div>
                  <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500 mb-4">
                      <span className="font-semibold text-primary-600 dark:text-primary-400 text-xs uppercase tracking-wider">{featuredBlog.category}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <span className="text-xs">{calculateReadingTime(featuredBlog.content)} min read</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 leading-tight tracking-tight">
                      {featuredBlog.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 line-clamp-3 leading-relaxed">
                      {featuredBlog.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:gap-3 transition-all duration-300">
                      Continue reading
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </FadeInUp>

          <StaggerContainer>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-14">
              {regularBlogs.map((post) => (
                <StaggerItem key={post.id}>
                  <Link href={`/blog/${post.id}`} className="block group h-full">
                    <motion.article
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-800 h-full flex flex-col"
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>
                      <div className="p-6 lg:p-7 flex-1 flex flex-col">
                        <span className="text-[10px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.15em]">
                          {post.category}
                        </span>
                        <h3 className="text-lg lg:text-xl font-serif font-bold text-gray-900 dark:text-white mt-2.5 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 flex-1 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2.5 transition-all duration-300">
                          Read more
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                      </div>
                    </motion.article>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          <FadeInUp delay={0.3}>
            <div className="text-center">
              <Link href="/blog">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-sm font-medium tracking-wide">
                  View all posts
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          3. ABOUT US
      ────────────────────────────────────────────────────────────────── */}
      <section id="about" className="py-20 lg:py-28 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <FadeInUp>
                <div className="relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
                      alt="About our ministry"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-600/10 dark:bg-primary-400/10 rounded-2xl -z-10" />
                  <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary-600/5 dark:bg-primary-400/5 rounded-full -z-10" />
                </div>
              </FadeInUp>

              <FadeInUp delay={0.15}>
                <div>
                  <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
                    Who we are
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-6 tracking-tight">
                    About Us
                  </h2>
                  <div className="w-12 h-0.5 bg-primary-600 dark:bg-primary-400 mb-8" />
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-5 leading-relaxed">
                    We are a Christian ministry dedicated to preserving God-spoken words and
                    encouraging believers through digital tools. Our mission is to create a
                    trustworthy platform that serves our community and future generations.
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
                    With reverence and care, we document prophecies, teachings, and revelations
                    that God speaks to His people, ensuring these precious words are preserved
                    for future generations.
                  </p>
                  <Link href="/about">
                    <Button size="lg" className="rounded-full px-8 text-sm font-medium tracking-wide">
                      Our story
                    </Button>
                  </Link>
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          4. MISSION & VISION
      ────────────────────────────────────────────────────────────────── */}
      <section id="mission" className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
                Purpose
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight">
                Mission &amp; Vision
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                The calling that drives everything we do
              </p>
            </div>
          </FadeInUp>

          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl">
              <StaggerItem>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-10 lg:p-12 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-500 h-full relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-5xl mb-6">{missionVision.mission.icon}</div>
                  <h3 className="text-xl lg:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                    {missionVision.mission.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    {missionVision.mission.description}
                  </p>
                </motion.div>
              </StaggerItem>

              <StaggerItem>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-10 lg:p-12 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-500 h-full relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-5xl mb-6">{missionVision.vision.icon}</div>
                  <h3 className="text-xl lg:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                    {missionVision.vision.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    {missionVision.vision.description}
                  </p>
                </motion.div>
              </StaggerItem>
            </div>
          </StaggerContainer>

          <FadeInUp delay={0.3}>
            <div className="mt-14">
              <Link href="/mission">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-sm font-medium tracking-wide">
                  Full mission statement
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          5. TESTIMONIES
      ────────────────────────────────────────────────────────────────── */}
      <section id="testimony" className="py-20 lg:py-28 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
                Stories of faith
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight">
                Testimonies
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                God&apos;s faithfulness witnessed through transformed lives
              </p>
            </div>
          </FadeInUp>

          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mb-14">
              {homeTestimonies.map((testimony) => (
                <StaggerItem key={testimony.id}>
                  <Link href={`/testimony/${testimony.id}`} className="block h-full">
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="h-full"
                    >
                      <div className="bg-white dark:bg-gray-900 rounded-2xl p-7 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <svg className="w-8 h-8 text-primary-200 dark:text-primary-900 mb-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>

                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-6 flex-1 line-clamp-4 leading-relaxed italic">
                          &ldquo;{testimony.content}&rdquo;
                        </p>

                        <div className="flex items-center gap-3.5 pt-5 border-t border-gray-100 dark:border-gray-800">
                          <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-primary-100 dark:ring-primary-900/30 flex-shrink-0">
                            <img
                              src={testimony.image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23e5e7eb" width="64" height="64"/%3E%3C/svg%3E'}
                              alt={testimony.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{testimony.name}</h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {new Date(testimony.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <span className="text-xs text-primary-600 dark:text-primary-400 font-medium flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-300">
                            Read &rarr;
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          <FadeInUp delay={0.4}>
            <div>
              <Link href="/testimony">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-sm font-medium tracking-wide">
                  View all testimonies
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          6. EVENTS
      ────────────────────────────────────────────────────────────────── */}
      <section id="events" className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
                Join us
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight">
                Upcoming events
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                Worship, fellowship, and spiritual growth
              </p>
            </div>
          </FadeInUp>

          <StaggerContainer>
            <div className="max-w-4xl space-y-5 mb-14">
              {events.map((event, index) => (
                <StaggerItem key={event.id}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 sm:w-28 lg:w-32">
                          <div className="bg-gradient-to-br from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 text-white p-5 sm:p-0 sm:h-full flex sm:flex-col items-center sm:justify-center gap-2 sm:gap-0 text-center">
                            <span className="text-3xl sm:text-4xl font-bold leading-none">
                              {new Date(event.date).getDate()}
                            </span>
                            <span className="text-xs sm:text-sm uppercase tracking-wider font-medium text-white/80">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 p-6 sm:p-7 lg:p-8">
                          <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                            {event.title}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm sm:text-base leading-relaxed">{event.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400 dark:text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          <FadeInUp delay={0.4}>
            <div>
              <Link href="/events">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-sm font-medium tracking-wide">
                  View all events
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          7. GALLERY
      ────────────────────────────────────────────────────────────────── */}
      <section id="gallery" className="py-20 lg:py-28 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
                Moments
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight">
                Gallery
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                Glimpses from our ministry gatherings and events
              </p>
            </div>
          </FadeInUp>

          <StaggerContainer>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mb-14">
              {galleryImages.slice(0, 8).map((image) => (
                <StaggerItem key={image.id}>
                  <Link href={`/gallery/${image.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm hover:shadow-xl cursor-pointer"
                    >
                      <img
                        src={image.image}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                          <h3 className="text-sm sm:text-base font-semibold mb-0.5 leading-tight">{image.title}</h3>
                          <p className="text-xs text-white/75">{image.category}</p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          <FadeInUp delay={0.4}>
            <div>
              <Link href="/gallery">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-sm font-medium tracking-wide">
                  View full gallery
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          8. 24 HOURS AUDIO
      ────────────────────────────────────────────────────────────────── */}
      <section id="audio" className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
                Always on
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight">
                24-Hour Audio
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                Continuous worship, prayer, and the Word — any time, day or night
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.15}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 sm:p-8 lg:p-10">
              <AudioPlayer />
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          9. MEDIA
      ────────────────────────────────────────────────────────────────── */}
      <section id="media" className="py-20 lg:py-28 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
                Watch &amp; listen
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight">
                Media
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                Posters, videos, and messages from the ministry
              </p>
            </div>
          </FadeInUp>

          <StaggerContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-7xl mb-14">
              {mediaItems.slice(0, 4).map((item) => (
                <StaggerItem key={item.id}>
                  <Link href={`/media/${item.id}`}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100 dark:border-gray-800 group"
                    >
                      {item.type === 'poster' ? (
                        <div className="aspect-[2/3] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                            <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          {item.type === 'youtube-shorts' && (
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                              Shorts
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-4 sm:p-5">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                          {item.title}
                        </h3>
                        {item.type === 'poster' && (
                          <p className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 mt-1.5 font-medium">{item.scripture}</p>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          <FadeInUp delay={0.4}>
            <div>
              <Link href="/media">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-sm font-medium tracking-wide">
                  View all media
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────
          10. PRAYER FORM
      ────────────────────────────────────────────────────────────────── */}
      <section id="prayer" className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] sm:text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
                We stand with you
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mt-3 mb-4 tracking-tight">
                Prayer Request
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                Share your heart with us — our team commits to pray over every request
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.15}>
            <div className="max-w-2xl">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 sm:p-8 lg:p-10">
                <PrayerForm />
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      <Footer />

      <ChatWidget />
    </div>
  );
}
