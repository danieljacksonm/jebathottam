import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'About Us - Ministry Platform',
  description: 'Learn about our ministry, our history, and our commitment to preserving God-spoken words.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">About Us</span>
        </nav>

        {/* Page Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Us
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            A trusted ministry dedicated to preserving God-spoken words and
            encouraging believers through digital tools.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Our Story */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
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
          </section>

          {/* Our Values */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
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
              <Card>
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
              <Card>
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
              <Card>
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
          </section>

          {/* What We Do */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
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
              </ul>
              <p className="text-gray-700 leading-relaxed">
                All of our services are designed with security, accessibility, and
                long-term sustainability in mind. We use role-based access control to
                ensure that sensitive content is protected while still being accessible
                to authorized ministry members.
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-primary-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
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
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
