'use client';

import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp } from '@/components/animations/page-transition';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function AboutPage() {
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
            <span className="text-gray-900">About Us</span>
          </nav>
        </FadeInUp>

        {/* Page Header */}
        <FadeInUp delay={0.1}>
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
              About Us
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              A trusted ministry dedicated to preserving God-spoken words and
              encouraging believers through digital tools.
            </p>
          </div>
        </FadeInUp>

        {/* Main Content - Left Image, Right Content */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeInUp delay={0.2}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-96 rounded-lg overflow-hidden shadow-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
                  alt="Our ministry"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </FadeInUp>
            <FadeInUp delay={0.3}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our ministry was founded with a clear vision: to preserve the sacred
                    words that God speaks to His people. We recognized that prophecies,
                    revelations, and teachings are precious gifts that should be carefully
                    documented and made accessible to future generations.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Over the years, we have seen how digital tools can serve the Kingdom
                    of God when used with wisdom and reverence. Our platform is built on
                    principles of longevity, security, and respect for the sacred nature
                    of the content we preserve.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We believe that every word spoken by God has eternal value and should
                    be treated with the utmost care. Our commitment is to maintain a
                    platform that honors this sacred trust while serving our community
                    and future generations.
                  </p>
                </div>
              </motion.div>
            </FadeInUp>
          </div>
        </div>

        {/* Our Values */}
        <FadeInUp delay={0.4}>
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Reverence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    We approach every prophecy and revelation with deep respect and
                    reverence, recognizing the sacred nature of God-spoken words.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Integrity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    We maintain the highest standards of accuracy and authenticity
                    in preserving and presenting ministry content.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Longevity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    We build for the long term, prioritizing stability and data
                    preservation over temporary trends or quick fixes.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    We foster a supportive community where believers can grow together
                    and encourage one another in faith.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </FadeInUp>

        {/* What We Do */}
        <FadeInUp delay={0.5}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6 text-center">
              What We Do
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Our ministry platform provides several key services to our community:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Secure storage and preservation of prophecies and revelations</li>
                <li>Archive of sermons and teachings for easy reference</li>
                <li>Personal note-taking system for ministry members</li>
                <li>Event management and community engagement tools</li>
                <li>Blog platform for sharing insights and reflections</li>
                <li>24-hour continuous worship and prayer audio</li>
                <li>Media library with inspirational posters and videos</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                All of our services are designed with security, accessibility, and
                long-term sustainability in mind. We use role-based access control to
                ensure that sensitive content is protected while still being accessible
                to authorized ministry members.
              </p>
            </div>
          </div>
        </FadeInUp>

        {/* Call to Action */}
        <FadeInUp delay={0.6}>
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-primary-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
                Join Our Ministry
              </h2>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                If you feel called to be part of our ministry community, we would love
                to hear from you. Visit our contact page to get in touch.
              </p>
              <Link href="/contact">
                <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </FadeInUp>
      </main>

      <Footer />
    </div>
  );
}
