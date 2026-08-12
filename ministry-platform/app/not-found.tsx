import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-600 mb-3">404</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Page not found
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            This page may have moved, or the link is incorrect. You can go back to the home page
            or browse our latest teachings.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
            >
              Go home
            </Link>
            <Link
              href="/blog"
              className="inline-flex px-6 py-3 rounded-lg border border-gray-300 text-gray-800 font-medium hover:bg-gray-100 transition-colors"
            >
              Visit blog
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
