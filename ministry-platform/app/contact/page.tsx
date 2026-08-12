'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ministryInfo } from '@/data/demo-content';

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('submitting');

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      website: formData.get('website'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setFormState('success');
      e.currentTarget.reset();
      setTimeout(() => setFormState('idle'), 5000);
    } catch {
      setFormState('error');
      setErrorMessage(
        `Failed to send message. Please try again or email us at ${ministryInfo.email}.`
      );
    }
  };

  const phones = [
    { label: 'Bro. John Barnabas', tel: '9380662377', display: '+91 9380662377' },
    { label: 'Sis. Anselma John', tel: '9884239002', display: '+91 9884239002' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Contact Us</span>
        </nav>

        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Reach out with questions, prayer requests, or to learn more about{' '}
            {ministryInfo.name} in Keelamudiman, Tuticorin.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="relative space-y-6" onSubmit={handleSubmit}>
                  <div
                    className="absolute -left-[9999px] opacity-0 h-0 w-0 overflow-hidden"
                    aria-hidden="true"
                  >
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  {formState === 'success' && (
                    <div
                      className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800"
                      role="alert"
                    >
                      <p className="font-medium">Message sent successfully!</p>
                      <p className="text-sm">We&apos;ll get back to you soon.</p>
                    </div>
                  )}
                  {formState === 'error' && (
                    <div
                      className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
                      role="alert"
                    >
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{errorMessage}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        required
                        disabled={formState === 'submitting'}
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Barnabas"
                        required
                        disabled={formState === 'submitting'}
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      disabled={formState === 'submitting'}
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 9XXXXXXXXX"
                      disabled={formState === 'submitting'}
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      disabled={formState === 'submitting'}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Prayer Request">Prayer Request</option>
                      <option value="Ministry Question">Ministry Question</option>
                      <option value="Event Information">Event Information</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all min-h-[150px]"
                      placeholder="Your message here..."
                      required
                      disabled={formState === 'submitting'}
                      aria-required="true"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={formState === 'submitting'}
                  >
                    {formState === 'submitting' ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Email</h3>
                  <a
                    href={`mailto:${ministryInfo.email}`}
                    className="text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {ministryInfo.email}
                  </a>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Phone</h3>
                  <ul className="space-y-2">
                    {phones.map((p) => (
                      <li key={p.tel} className="text-sm">
                        <span className="text-gray-500 block text-xs">{p.label}</span>
                        <a href={`tel:${p.tel}`} className="text-primary-600 hover:text-primary-700">
                          {p.display}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Address</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{ministryInfo.address}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prayer Timings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between gap-4">
                    <span>Morning prayer</span>
                    <span className="text-right">4:30 – 5:30 AM</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Youth prayer</span>
                    <span className="text-right">5:30 – 6:00 AM</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Sunday service</span>
                    <span className="text-right">5:00 PM</span>
                  </div>
                  <div className="pt-2">
                    <Link href="/services" className="text-primary-600 hover:underline text-sm">
                      Full prayer schedule →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <a
                    href={ministryInfo.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-primary-600 hover:text-primary-700 text-sm transition-colors"
                  >
                    YouTube
                  </a>
                  <a
                    href={ministryInfo.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-primary-600 hover:text-primary-700 text-sm transition-colors"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={ministryInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-primary-600 hover:text-primary-700 text-sm transition-colors"
                  >
                    Website
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
