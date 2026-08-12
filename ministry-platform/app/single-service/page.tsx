'use client';

import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp } from '@/components/animations/page-transition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ministryInfo } from '@/data/demo-content';

const expectItems = [
  { title: 'Devotional Praise', text: "Heartfelt worship leading the congregation into God's presence." },
  { title: 'Sermon Expositions', text: 'Spiritual insights drawing from the word of God.' },
  { title: 'Intercessory Sessions', text: 'Specific prayers targeted for families, youth, and global missions.' },
  { title: 'Individual Counseling', text: 'Pastoral laying on of hands and individual prayer at the end.' },
];

export default function SingleServicePage() {
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
            <Link href="/services" className="hover:text-primary-600">
              Prayers
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Fasting Prayer</span>
          </nav>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Monthly Fasting Prayer
            </h1>
            <p className="text-xl text-primary-600 font-medium">
              Seeking God&apos;s presence with broken hearts and dedicated fasting in Tamil Nadu.
            </p>
          </div>
        </FadeInUp>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <FadeInUp delay={0.2}>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Fasting Prayer Tuticorin
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our monthly Fasting Prayers are the cornerstone of the {ministryInfo.name}{' '}
              fellowship. Gathering in unity, we set aside physical distractions and spend
              designated hours in fasting, praise, scripture meditation, and intercessory
              prayers. We believe fasting accelerates spiritual breakthroughs. Many have
              testified to physical healing, family blessings, and spiritual restoration during
              these monthly services.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Prayers are directed toward national revival, youth guidance, and specific
              counseling requests. Our fellowship welcomes families for prayer and a peaceful
              walk with God.
            </p>

            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">What to Expect</h3>
            <ul className="space-y-3 mb-10 text-gray-700">
              {expectItems.map((item) => (
                <li key={item.title}>
                  <strong>• {item.title}:</strong> {item.text}
                </li>
              ))}
            </ul>

            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Locations & Timings</h3>
            <div className="space-y-6">
              <div className="border-l-4 border-primary-500 pl-4">
                <h4 className="font-semibold text-gray-900">1. Chennai Gathering (Second Saturday)</h4>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Time:</strong> Monthly Second Saturday starting at 10:00 AM.
                  <br />
                  <strong>Venue:</strong> Getsamanae Jebasthalam, Chennai, Tamil Nadu, India.
                </p>
              </div>
              <div className="border-l-4 border-primary-500 pl-4">
                <h4 className="font-semibold text-gray-900">
                  2. Keelamudiman Gathering (Last Saturday)
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Time:</strong> Monthly Last Saturday starting at 10:00 AM.
                  <br />
                  <strong>Venue:</strong> {ministryInfo.name}, {ministryInfo.address}
                </p>
              </div>
            </div>
            </FadeInUp>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <FadeInUp delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle>Prayer Coordinators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <strong className="text-gray-900">Bro. John Barnabas</strong>
                  <p className="text-gray-600">
                    Phone:{' '}
                    <a href="tel:9380662377" className="text-primary-600 font-semibold">
                      9380662377
                    </a>
                  </p>
                </div>
                <div>
                  <strong className="text-gray-900">Sis. Anselma John</strong>
                  <p className="text-gray-600">
                    Phone:{' '}
                    <a href="tel:9884239002" className="text-primary-600 font-semibold">
                      9884239002
                    </a>
                  </p>
                </div>
                <div>
                  <strong className="text-gray-900">Email</strong>
                  <p className="text-gray-600">
                    <a href={`mailto:${ministryInfo.email}`} className="text-primary-600">
                      {ministryInfo.email}
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary-50 border-primary-100 mt-6">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Join Online Daily</h4>
                <p className="text-sm text-gray-600 mb-4">
                  If you cannot attend our monthly physical prayers, dial in to our daily
                  conference calls.
                </p>
                <a
                  href="https://join.freeconferencecall.com/anselmajohn919"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full" variant="secondary">
                    Open Conference Call
                  </Button>
                </a>
                <Link href="/services" className="block mt-3 text-center text-sm text-primary-600 hover:underline">
                  ← Back to all prayers
                </Link>
              </CardContent>
            </Card>
            </FadeInUp>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
