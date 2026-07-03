import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Ebenezer Digital Services',
  description: 'Terms of service for Ebenezer Digital Services.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <Link href="/" className="text-slate-400 hover:text-white text-sm no-underline">← Back to home</Link>
        <h1 className="mt-6">Terms of Service</h1>
        <p>By using this website and our services, you agree to communicate respectfully and provide accurate information in inquiries and project requests.</p>
        <p>Service timelines and deliverables are agreed in writing before work begins. Payment terms are defined per project.</p>
        <p className="text-slate-400 text-sm">Last updated: July 2026</p>
      </div>
    </main>
  );
}
