import Link from 'next/link';
import type { Metadata } from 'next';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy policy for Jesus is the Way Jebathottam ministry website — how we collect and use contact and prayer information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Privacy Policy</span>
        </nav>

        <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Jesus is the Way Jebathottam · Last updated: August 2026
          </p>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
            <p>
              This website belongs to <strong>Jesus is the Way Jebathottam</strong> ministry.
              We respect your privacy and handle personal information with care.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 pt-2">What we collect</h2>
            <p>We may collect information you choose to share with us, such as:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name, email, and phone number from the contact or prayer forms</li>
              <li>Messages, prayer requests, or ministry inquiries you send us</li>
              <li>Basic technical data (for example browser type) needed to run the site securely</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 pt-2">How we use it</h2>
            <p>We use this information only to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Reply to your messages and prayer requests</li>
              <li>Share ministry updates if you have asked us to</li>
              <li>Improve our website and protect it from spam or abuse</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 pt-2">Sharing</h2>
            <p>
              We do not sell your personal information. We may share details only with trusted
              ministry leaders who need them to respond to you, or if the law requires it.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 pt-2">Cookies &amp; analytics</h2>
            <p>
              The site may use basic cookies or similar tools for login sessions and to understand
              how visitors use public pages. You can control cookies in your browser settings.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 pt-2">Your choices</h2>
            <p>
              To update or remove your information, or to ask a privacy question, please contact us
              through the <Link href="/contact" className="text-primary-600 hover:underline">Contact</Link> page
              or email <a href="mailto:anselmajohn2020@gmail.com" className="text-primary-600 hover:underline">anselmajohn2020@gmail.com</a>.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 pt-2">Changes</h2>
            <p>
              We may update this policy from time to time. The latest version will always be posted on this page.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
