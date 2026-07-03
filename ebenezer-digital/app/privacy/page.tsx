import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Ebenezer Digital Services',
  description: 'Privacy policy for Ebenezer Digital Services.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <Link href="/" className="text-slate-400 hover:text-white text-sm no-underline">← Back to home</Link>
        <h1 className="mt-6">Privacy Policy</h1>
        <p>We respect your privacy. Information submitted through our contact forms is used only to respond to your inquiry and improve our services.</p>
        <p>We do not sell your personal data. You may request deletion of your contact information by emailing us.</p>
        <p className="text-slate-400 text-sm">Last updated: July 2026</p>
      </div>
    </main>
  );
}
