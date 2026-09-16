import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ministryPillars, ministryInfo } from '@/data/demo-content';

export const metadata = {
  title: 'Mission & Vision - Jesus is the Way Jebathottam',
  description:
    'Our three pillars — Prayer Life, Our Mission, and Bible Meditation — guiding revival prayer in Keelamudiman, Tuticorin.',
};

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Mission & Vision</span>
        </nav>

        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Three Pillars
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We ground our ministry in three key callings which help lead believers into a
            deeper walk with our Savior Jesus Christ.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {ministryPillars.map((pillar) => (
            <Card key={pillar.title} className="border-2 border-primary-200 bg-white">
              <CardHeader>
                <div className="text-4xl mb-2" aria-hidden>
                  {pillar.icon}
                </div>
                <CardTitle className="text-2xl text-gray-900">{pillar.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{pillar.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <Card className="border-2 border-primary-200 bg-primary-50">
              <CardHeader>
                <CardTitle className="text-3xl text-gray-900">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800 leading-relaxed text-lg mb-4">
                  Our mission is to establish prayer altars that intercede for family
                  restoration, youth guidance, and national spiritual revival.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {ministryInfo.name} in Keelamudiman, Tuticorin is a Christian fellowship
                  and prayer ministry dedicated to leading individuals into a deeper
                  relationship with God through physical fasting prayers, weekly Sunday
                  services, and daily conference calls.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="border-2 border-primary-200 bg-primary-50">
              <CardHeader>
                <CardTitle className="text-3xl text-gray-900">
                  A House of Prayer for All Nations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-serif italic text-gray-800 mb-4">
                  &ldquo;Those who seek me diligently find me.&rdquo; — Proverbs 8:17
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our focus remains steadfast: maintaining multiple daily intercessions
                  (morning, noon, evening, and night) so that no matter the hour, there is
                  an altar of prayer standing on behalf of those in need. We seek to mentor
                  the next generation through our dedicated youth morning prayers.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">How we gather</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily online prayer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Morning 4:30–5:30 AM, Noon 12:00–1:00 PM, and Night 9:45–11:00 PM via
                    Free Conference Call line anselmajohn919.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Youth morning prayer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Daily 5:30–6:00 AM via jesusisthewayjebathottam — mark attendance online
                    and grow early seeking habits.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sunday & Gospel prayer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Sunday service every Sunday at 5:00 PM in Keelamudiman. Gospel prayer
                    every last Sunday at 6:00 PM.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Monthly fasting prayer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Second Saturday 10:00 AM at Getsamanae Jebasthalam, Chennai. Last
                    Saturday 10:00 AM at Keelamudiman, Tuticorin.
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
