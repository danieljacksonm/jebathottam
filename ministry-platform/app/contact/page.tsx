import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Contact Us - Ministry Platform',
  description: 'Get in touch with our ministry. We\'d love to hear from you.',
};

export default function ContactPage() {
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
          <span className="text-gray-900">Contact Us</span>
        </nav>

        {/* Page Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We'd love to hear from you. Reach out with questions, prayer requests, or to learn more about our ministry.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      type="text"
                      placeholder="John"
                      required
                    />
                    <Input
                      label="Last Name"
                      type="text"
                      placeholder="Doe"
                      required
                    />
                  </div>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="(555) 123-4567"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                      <option>General Inquiry</option>
                      <option>Prayer Request</option>
                      <option>Ministry Question</option>
                      <option>Event Information</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all min-h-[150px]"
                      placeholder="Your message here..."
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Email
                  </h3>
                  <a
                    href="mailto:info@ministryplatform.org"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    info@ministryplatform.org
                  </a>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </h3>
                  <a
                    href="tel:+15551234567"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    (555) 123-4567
                  </a>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Address
                  </h3>
                  <p className="text-gray-600">
                    123 Ministry Street<br />
                    City, State 12345<br />
                    United States
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Office Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
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
                    href="#"
                    className="block text-primary-600 hover:text-primary-700 text-sm"
                  >
                    Facebook
                  </a>
                  <a
                    href="#"
                    className="block text-primary-600 hover:text-primary-700 text-sm"
                  >
                    Twitter
                  </a>
                  <a
                    href="#"
                    className="block text-primary-600 hover:text-primary-700 text-sm"
                  >
                    Instagram
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
