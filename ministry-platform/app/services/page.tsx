'use client';

import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp } from '@/components/animations/page-transition';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const physicalServices = [
  {
    title: 'Sunday Service',
    timing: 'Every Sunday at 5:00 PM (Keelamudiman)',
    description:
      'Our weekly Sunday prayer service is a cornerstone gathering in Keelamudiman, Ottapidaram, Tuticorin. Believers assemble physically for deep praise, scripture analysis, and intercessory prayers led by Pastor Bro. John Barnabas. It is a family-friendly fellowship seeking local revival.',
  },
  {
    title: 'Fasting Prayer',
    timing: 'Second Sat 10AM (Chennai) & Last Sat 10AM (Keelamudiman)',
    description:
      "A dedicated monthly fasting service held in Chennai and Keelamudiman, Thoothukudi. We seek God's presence, fasting and praying for family restoration, healings, and local revival. Led by pastors Bro. John Barnabas and Sis. Anselma John.",
    href: '/single-service',
  },
  {
    title: 'Gospel Prayer',
    timing: 'Last Sunday at 6:00 PM (Keelamudiman)',
    description:
      'Every last Sunday evening, we conduct Gospel Prayers at our Keelamudiman church in Ottapidaram Taluk, Tuticorin. These gatherings are outreach-focused, preaching salvation through Christ, sharing encouraging testimonies, and praying for city-wide revival.',
  },
];

export default function ServicesPage() {
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
            <span className="text-gray-900">Prayers & Services</span>
          </nav>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div className="max-w-4xl mx-auto mb-14 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Prayers & Services
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Physical assemblies in Tuticorin & Chennai, plus daily online prayer altars.
            </p>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <div className="max-w-6xl mx-auto mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Physical Assemblies</h2>
              <p className="text-gray-600">
                We gather regularly in our physical chapels for worship, testimonies, and fasting prayers.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {physicalServices.map((s) => (
                <Card key={s.title} className="h-full flex flex-col border-primary-100">
                  <CardContent className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-primary-700 font-medium mb-3">
                      <strong>Timings:</strong> {s.timing}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed flex-1">{s.description}</p>
                    {s.href && (
                      <Link
                        href={s.href}
                        className="mt-4 text-sm font-bold text-primary-600 hover:text-primary-700"
                      >
                        View Details →
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <div className="max-w-6xl mx-auto bg-gray-50 rounded-xl p-8 md:p-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Online Daily Altars</h2>
              <p className="text-gray-600">
                Continuous daily online conference prayer. Dial in from your home.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                    anselmajohn919 Daily Calls
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Virtual daily prayer calls on Free Conference Call room{' '}
                    <strong>anselmajohn919</strong>, coordinated by Pastor Sis. Anselma John —
                    morning, noon, and late-night scripture / Getsmanae prayers.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 mb-6">
                    <li>
                      <strong>Daily Morning Call:</strong> 4:30 AM – 5:30 AM IST
                    </li>
                    <li>
                      <strong>Daily Noon Altar:</strong> 12:00 PM – 1:00 PM IST
                    </li>
                    <li>
                      <strong>Daily Night Altar:</strong> 9:45 PM – 11:00 PM IST
                    </li>
                  </ul>
                  <a
                    href="https://join.freeconferencecall.com/anselmajohn919"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full">Join anselmajohn919 Room</Button>
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                    Youth Morning Call
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Daily youth prayer on Free Conference Call room{' '}
                    <strong>jesusisthewayjebathottam</strong> — spiritual discipline, early
                    scripture, and mutual prayer support for young believers.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 mb-6">
                    <li>
                      <strong>Timings:</strong> Daily 5:30 AM – 6:00 AM IST
                    </li>
                    <li>
                      <strong>Dial-in Room:</strong> jesusisthewayjebathottam
                    </li>
                  </ul>
                  <a
                    href="https://join.freeconferencecall.com/jesusisthewayjebathottam"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full">Join jesusisthewayjebathottam Room</Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </FadeInUp>
      </main>

      <Footer />
    </div>
  );
}
