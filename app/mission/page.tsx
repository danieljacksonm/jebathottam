import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Mission & Vision - Ministry Platform',
  description: 'Our mission and vision for preserving God-spoken words and serving our community.',
};

export default function MissionPage() {
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
          <span className="text-gray-900">Mission & Vision</span>
        </nav>

        {/* Page Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mission & Vision
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our commitment to preserving God-spoken words and serving future generations
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Mission Statement */}
          <section>
            <Card className="border-2 border-primary-200 bg-primary-50">
              <CardHeader>
                <CardTitle className="text-3xl text-gray-900">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-800 leading-relaxed text-lg mb-4">
                    To preserve God-spoken words (prophecies, revelations) for future
                    generations and encourage believers using digital tools that honor
                    the sacred nature of these messages.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We are committed to creating a trustworthy platform that serves as
                    a repository of spiritual wisdom, ensuring that the words God speaks
                    to His people are carefully documented, securely stored, and made
                    accessible to those who need them, both now and in the future.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Vision Statement */}
          <section>
            <Card className="border-2 border-primary-200 bg-primary-50">
              <CardHeader>
                <CardTitle className="text-3xl text-gray-900">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-800 leading-relaxed text-lg mb-4">
                    To be a trusted, long-lasting digital ministry platform that serves
                    as a repository of spiritual wisdom and a source of encouragement
                    for believers worldwide.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We envision a platform that stands the test of time, built on
                    principles of data longevity, security, and reverence. Our vision
                    extends beyond our immediate community to serve future generations
                    who will benefit from the preserved words and teachings we document
                    today.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Core Principles */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Core Principles
            </h2>
            <div className="space-y-6">
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Data Longevity and Safety
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We prioritize the long-term preservation of data over following
                  temporary trends. Our platform is built with technologies and
                  practices that ensure data safety and accessibility for decades
                  to come.
                </p>
              </div>
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Clarity Over Visual Noise
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We believe that the message is more important than flashy design.
                  Our interface is clean, calm, and focused on content, allowing
                  God's words to speak clearly without distraction.
                </p>
              </div>
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Security and Role-Based Access
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We implement strict security measures and role-based access control
                  to protect sensitive content while ensuring authorized ministry
                  members have appropriate access to the resources they need.
                </p>
              </div>
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Build Simple First, Scale Later
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We start with simple, stable solutions and scale thoughtfully as
                  needs grow. This approach ensures reliability and maintainability
                  over the long term.
                </p>
              </div>
            </div>
          </section>

          {/* How We Achieve Our Mission */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              How We Achieve Our Mission
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Secure Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    We use enterprise-grade security measures to protect all stored
                    content, ensuring that prophecies and revelations are preserved
                    safely for future generations.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Organized Archives</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Our content is carefully organized and categorized, making it
                    easy to find and reference specific prophecies, sermons, or
                    teachings when needed.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Accessible Platform</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    We maintain a clean, accessible interface that works well on
                    all devices, ensuring that ministry resources are available
                    whenever and wherever they're needed.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Community Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    We foster a supportive community where believers can share
                    insights, pray together, and encourage one another in faith.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
