import type { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { TeamContent } from './team-content';

export const metadata: Metadata = {
  title: 'Ministry Pastors & Leadership - Jesus is the Way Jebathottam',
  description:
    'Meet Bro. John Barnabas and Sis. Anselma John, pastors of Jesus is the Way Jebathottam in Keelamudiman, Tuticorin.',
};

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/about" className="hover:text-primary-600">
            About
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Leadership Team</span>
        </nav>

        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ministry Pastors & Leadership
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Jebathottam Keelamudiman leadership — shepherds who labor in word and prayer to care
            for the congregation and guide youth cells.
          </p>
        </div>

        <TeamContent />

        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-primary-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join Us in Prayer</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              If you feel called to serve or join our daily prayer lines, we would love to hear
              from you.
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
