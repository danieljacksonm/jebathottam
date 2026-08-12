'use client';

import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp } from '@/components/animations/page-transition';
import { Card, CardContent } from '@/components/ui/card';
import { teamMembers, ministryInfo } from '@/data/demo-content';

const beliefs = [
  {
    title: 'Faith in Jesus Christ',
    text: 'We profess Christ as the only way to the Father, resting on His sacrifice, resurrection, and grace.',
  },
  {
    title: 'The Power of Intercession',
    text: 'We emphasize corporate prayers, fasting intercessions, and daily morning prayer lines to stand in the gap.',
  },
  {
    title: 'Spiritual Revival',
    text: 'We labor with a passion to witness a great revival among youth, raising a generation that prays and seeks God diligently.',
  },
];

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

        <FadeInUp delay={0.1}>
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
              Jebathottam Keelamudiman History
            </h1>
            <p className="text-xl text-primary-600 font-medium leading-relaxed">
              Established in Keelamudiman with a vision for local and national revival.
            </p>
          </div>
        </FadeInUp>

        <div className="max-w-6xl mx-auto mb-16 grid md:grid-cols-2 gap-12">
          <FadeInUp delay={0.2}>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Christian Prayer Ministry Tuticorin
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {ministryInfo.name} was founded with a deep desire to see individuals, families,
              and communities transformed by the gospel of Jesus Christ. Located in the quiet
              town of Keelamudiman, Ottapidaram, Tuticorin, our heart is dedicated to bringing
              people into a deeper relationship with God. Under the spiritual direction of
              Pastor Bro. John Barnabas and Sis. Anselma John, we conduct physical fasting
              prayers, weekly Sunday services, and daily conference calls.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Through our physical meetings in Tuticorin and Chennai, as well as our
              wide-reaching daily online prayer calls, we strive to establish a robust prayer
              network. We believe that prayer changes things and that seeking God early in the
              morning is a crucial part of a walking faith. Our mission is to raise prayer
              altars that intercede for family restoration, youth guidance, and national
              spiritual revival.
            </p>
          </FadeInUp>

          <FadeInUp delay={0.3}>
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              Our Fundamental Beliefs
            </h3>
            <ul className="space-y-5">
              {beliefs.map((b) => (
                <li key={b.title} className="flex gap-3">
                  <span className="text-primary-600 text-xl font-serif" aria-hidden>
                    †
                  </span>
                  <div>
                    <strong className="text-gray-900">{b.title}</strong>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">{b.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </FadeInUp>
        </div>

        <FadeInUp delay={0.4}>
          <div className="max-w-3xl mx-auto mb-16 text-center bg-primary-50 rounded-lg p-8 md:p-12">
            <span className="text-primary-600 font-bold uppercase tracking-wider text-sm">
              Our Vision
            </span>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mt-3 mb-4">
              A House of Prayer for All Nations
            </h2>
            <p className="text-lg font-serif italic text-gray-800 mb-4">
              &ldquo;Those who seek me diligently find me.&rdquo; — Proverbs 8:17
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our focus remains steadfast: maintaining multiple daily intercessions (morning,
              noon, evening, and night) so that no matter the hour, there is an altar of prayer
              standing on behalf of those in need. We seek to mentor the next generation through
              our dedicated youth morning prayers, cultivating early seeking habits that yield
              lifelong fruit.
            </p>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.5}>
          <div className="max-w-6xl mx-auto mb-8 text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Ministry Shepherds</h2>
            <p className="text-gray-600 mb-10">
              Leaders devoted to pastoral care and intercessory prayer.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {teamMembers.map((m) => (
                <Card key={m.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex gap-4 items-start">
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary-400 flex-shrink-0"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        <Link href="/team" className="hover:text-primary-600">
                          {m.name}
                        </Link>
                      </h4>
                      <span className="text-xs font-bold uppercase tracking-wide text-primary-600">
                        {m.role}
                      </span>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
                        {m.bio}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/team"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                View Full Team
              </Link>
            </div>
          </div>
        </FadeInUp>
      </main>

      <Footer />
    </div>
  );
}
