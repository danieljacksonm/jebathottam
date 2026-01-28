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
import { ChatWidget } from '@/components/chat/chat-widget';

export default function Home() {
  const featuredBlog = blogPosts.find(post => post.featured) || blogPosts[0];
  const regularBlogs = blogPosts.filter(post => !post.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop"
            alt="Ministry hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
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
            <p className="text-lg md:text-xl mb-8 font-serif italic opacity-80 max-w-3xl mx-auto">
              "{ministryInfo.scripture}"
            </p>
          </FadeInUp>
          <FadeInUp delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100">
                  Learn More
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 2. IMAGE SLIDER */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <EnhancedImageSlider images={sliderImages} />
          </FadeInUp>
        </div>
      </section>

      {/* 3. ABOUT US SECTION */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeInUp>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 text-center">
                About Us
              </h2>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <p className="text-xl text-gray-700 text-center mb-8 leading-relaxed">
                We are a Christian ministry dedicated to preserving God-spoken words and
                encouraging believers through digital tools. Our mission is to create a
                trustworthy platform that serves our community and future generations.
              </p>
            </FadeInUp>
            <FadeInUp delay={0.4}>
              <div className="text-center">
                <Link href="/about">
                  <Button size="lg">
                    Read More About Us
                  </Button>
                </Link>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* 4. MISSION & VISION SECTION */}
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

      {/* 5. TEAM MEMBERS SECTION */}
      <section id="team" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-12 text-center">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                Our Team
              </h2>
              <p className="text-xl text-gray-600">
                Meet the dedicated leaders serving our ministry
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
              {teamMembers.map((member) => (
                <StaggerItem key={member.id}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="text-center h-full hover:shadow-xl transition-shadow">
                      <CardContent className="pt-6">
                        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-200 overflow-hidden ring-4 ring-primary-100">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 font-serif">
                          {member.name}
                        </h3>
                        <p className="text-primary-600 font-medium mb-4">{member.role}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
          <FadeInUp delay={0.4}>
            <div className="text-center">
              <Link href="/team">
                <Button variant="secondary" size="lg">
                  View All Team Members
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 6. BLOG SECTION - MOST IMPORTANT */}
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
                    <div className="text-sm uppercase tracking-wide mb-2 opacity-80">
                      {featuredBlog.category} • Featured
                    </div>
                    <CardTitle className="text-3xl md:text-4xl font-serif mb-4 text-white">
                      {featuredBlog.title}
                    </CardTitle>
                    <CardDescription className="text-white/80 mb-4 text-lg">
                      {featuredBlog.excerpt}
                    </CardDescription>
                    <div className="text-sm text-white/70 mb-6">
                      {new Date(featuredBlog.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })} • {featuredBlog.author}
                    </div>
                    <Link href={`/blog/${featuredBlog.id}`}>
                      <Button className="bg-white text-primary-700 hover:bg-gray-100 w-full md:w-auto">
                        Read Full Article →
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
                        <div className="text-xs uppercase tracking-wide mb-2 opacity-80">
                          {post.category}
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

      {/* 7. EVENTS SECTION */}
      <section id="events" className="py-20 bg-white">
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

      {/* 8. CONTACT US SECTION */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <FadeInUp>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                We'd love to hear from you. Reach out to us with questions, prayer
                requests, or to learn more about our ministry.
              </p>
            </FadeInUp>
            <FadeInUp delay={0.4}>
              <Link href="/contact">
                <Button size="lg">
                  Contact Us
                </Button>
              </Link>
            </FadeInUp>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
