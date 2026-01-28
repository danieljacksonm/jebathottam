'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { EnhancedImageSlider } from '@/components/ui/enhanced-image-slider';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { motion } from 'framer-motion';
import { ministryInfo, sliderImages, blogPosts, teamMembers, events, missionVision } from '@/data/demo-content';
import { galleryImages } from '@/data/gallery-content';
import { testimonies } from '@/data/testimonies-content';
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

export default function Home() {
  const featuredBlog = blogPosts.find(post => post.featured) || blogPosts[0];
  const regularBlogs = blogPosts.filter(post => !post.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      {/* 1. HERO IMAGE SLIDER */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <EnhancedImageSlider images={sliderImages} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10" />
        <div className="absolute inset-0 z-20 container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl">
            <FadeInUp>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight">
                {ministryInfo.name}
              </h1>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <p className="text-xl md:text-2xl lg:text-3xl mb-4 font-light opacity-90">
                {ministryInfo.tagline}
              </p>
            </FadeInUp>
            <FadeInUp delay={0.4}>
              <p className="text-lg md:text-xl mb-8 font-serif italic opacity-90 max-w-3xl mx-auto">
                "{ministryInfo.scripture}"
              </p>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* 2. BLOG SECTION - MOST IMPORTANT */}
      <section id="blog" className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-12 text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
                Latest Blog Posts
              </h2>
              <p className="text-xl md:text-2xl opacity-90">
                Insights, teachings, and reflections from our ministry
              </p>
            </div>
          </FadeInUp>

          {/* Featured Blog */}
          <FadeInUp delay={0.2}>
            <div className="max-w-5xl mx-auto mb-12">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-64 md:h-full min-h-[300px]">
                    <img
                      src={featuredBlog.image}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm uppercase tracking-wide opacity-80">
                        {featuredBlog.category} • Featured
                      </div>
                      <div className="flex items-center text-xs opacity-70">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {calculateReadingTime(featuredBlog.content)} min read
                      </div>
                    </div>
                    <CardTitle className="text-3xl md:text-4xl font-serif mb-4 text-white">
                      {featuredBlog.title}
                    </CardTitle>
                    <CardDescription className="text-white/80 mb-4 text-lg">
                      {featuredBlog.excerpt}
                    </CardDescription>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/20">
                      <p className="text-sm text-white/90 italic">
                        "For the word of God is living and active, sharper than any two-edged sword."
                      </p>
                      <p className="text-xs text-white/70 mt-1">- Hebrews 4:12</p>
                    </div>
                    <div className="text-sm text-white/70 mb-6">
                      {new Date(featuredBlog.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })} • {featuredBlog.author}
                    </div>
                    <Link href={`/blog/${featuredBlog.id}`}>
                      <Button className="bg-white text-primary-700 hover:bg-gray-100 w-full md:w-auto text-lg py-6">
                        Continue Reading →
                      </Button>
                    </Link>
                  </CardContent>
                </div>
              </Card>
            </div>
          </FadeInUp>

          {/* Regular Blog Posts */}
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
              {regularBlogs.map((post) => (
                <StaggerItem key={post.id}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all h-full">
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
                            Read More →
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

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
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <FadeInUp>
                <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
                    alt="About our ministry"
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeInUp>
              <FadeInUp delay={0.2}>
                <div>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                    About Us
                  </h2>
                  <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                    We are a Christian ministry dedicated to preserving God-spoken words and
                    encouraging believers through digital tools. Our mission is to create a
                    trustworthy platform that serves our community and future generations.
                  </p>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
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
      <section id="mission" className="py-20 bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-12 text-center">
              Mission & Vision
            </h2>
          </FadeInUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <StaggerContainer>
              <StaggerItem>
                <Card className="h-full border-2 border-primary-200 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="text-5xl mb-4">{missionVision.mission.icon}</div>
                    <CardTitle className="text-2xl font-serif">{missionVision.mission.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {missionVision.mission.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
              <StaggerItem>
                <Card className="h-full border-2 border-primary-200 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="text-5xl mb-4">{missionVision.vision.icon}</div>
                    <CardTitle className="text-2xl font-serif">{missionVision.vision.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {missionVision.vision.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            </StaggerContainer>
          </div>
          <FadeInUp delay={0.6}>
            <div className="text-center mt-12">
              <Link href="/mission">
                <Button variant="secondary" size="lg">
                  Read Full Mission Statement
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 5. TESTIMONIES */}
      <section id="testimony" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-12 text-center">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                Testimonies
              </h2>
              <p className="text-xl text-gray-600">
                Stories of God's faithfulness and transformation
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
              {testimonies.slice(0, 3).map((testimony) => (
                <StaggerItem key={testimony.id}>
                  <Link href={`/testimony/${testimony.id}`}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary-100">
                              <img
                                src={testimony.image}
                                alt={testimony.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{testimony.name}</h3>
                              <p className="text-sm text-gray-600">{testimony.location}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4 line-clamp-4 leading-relaxed">
                            "{testimony.testimony}"
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                              {testimony.category}
                            </span>
                            <span className="text-xs text-primary-600 font-medium">Read More →</span>
                          </div>
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
                <Button variant="secondary" size="lg">
                  View All Testimonies
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 6. EVENTS */}
      <section id="events" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-12 text-center">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                Upcoming Events
              </h2>
              <p className="text-xl text-gray-600">
                Join us for worship, fellowship, and spiritual growth
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="max-w-4xl mx-auto space-y-6 mb-12">
              {events.map((event) => (
                <StaggerItem key={event.id}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                          <div className="flex-shrink-0">
                            <div className="bg-primary-600 text-white rounded-lg p-6 text-center min-w-[120px]">
                              <div className="text-3xl font-bold">
                                {new Date(event.date).getDate()}
                              </div>
                              <div className="text-sm uppercase tracking-wide">
                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2 font-serif">
                              {event.title}
                            </h3>
                            <p className="text-gray-600 mb-4">{event.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {event.time}
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <Button variant="secondary" size="lg">
                  View All Events
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 7. GALLERY */}
      <section id="gallery" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-12 text-center">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                Gallery
              </h2>
              <p className="text-xl text-gray-600">
                Moments from our ministry gatherings and events
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto mb-12">
              {galleryImages.slice(0, 8).map((image) => (
                <StaggerItem key={image.id}>
                  <Link href={`/gallery/${image.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="group relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl cursor-pointer"
                    >
                      <img
                        src={image.image}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="text-sm font-semibold mb-1">{image.title}</h3>
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
                <Button variant="secondary" size="lg">
                  View Full Gallery
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 8. 24 HOURS AUDIO */}
      <section id="audio" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AudioPlayer />
        </div>
      </section>

      {/* 9. MEDIA SECTION */}
      <section id="media" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-12 text-center">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                Media
              </h2>
              <p className="text-xl text-gray-600">
                Inspirational posters, videos, and messages
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
              {mediaItems.slice(0, 4).map((item) => (
                <StaggerItem key={item.id}>
                  <Link href={`/media/${item.id}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl cursor-pointer"
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
                        <div className="aspect-video bg-gray-100 relative">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
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
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        {item.type === 'poster' && (
                          <p className="text-sm text-primary-600">{item.scripture}</p>
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
                <Button variant="secondary" size="lg">
                  View All Media
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 10. PRAYER POINT FORM */}
      <section id="prayer" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PrayerForm />
        </div>
      </section>

      <Footer />
      
      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
