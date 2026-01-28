'use client';

import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { blogPosts } from '@/data/demo-content';

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export default function BlogPage() {
    {
      id: 1,
      title: 'The Power of Prophetic Words',
      excerpt: 'Understanding how God-spoken words can transform lives and guide us in our spiritual journey. This article explores the biblical foundation of prophecy and its role in the modern church.',
      date: '2024-01-15',
      author: 'Pastor John',
      category: 'Teaching',
    },
    {
      id: 2,
      title: 'Walking in Faith: A Journey of Trust',
      excerpt: 'Exploring what it means to walk by faith and trust in God\'s perfect timing and plan. Learn practical ways to strengthen your faith and overcome doubt.',
      date: '2024-01-10',
      author: 'Pastor Sarah',
      category: 'Reflection',
    },
    {
      id: 3,
      title: 'Building Community Through Love',
      excerpt: 'How authentic Christian community strengthens our faith and supports one another. Discover the importance of fellowship and practical ways to build deeper relationships.',
      date: '2024-01-05',
      author: 'Pastor Michael',
      category: 'Community',
    },
    {
      id: 4,
      title: 'The Importance of Preserving God\'s Word',
      excerpt: 'Why we are committed to preserving prophecies and revelations for future generations. Learn about our mission and the value of documenting God\'s spoken words.',
      date: '2023-12-28',
      author: 'Pastor John',
      category: 'Mission',
    },
    {
      id: 5,
      title: 'Prayer: The Foundation of Ministry',
      excerpt: 'Exploring the vital role of prayer in effective ministry and personal spiritual growth. Practical guidance for developing a consistent prayer life.',
      date: '2023-12-20',
      author: 'Lisa Williams',
      category: 'Prayer',
    },
    {
      id: 6,
      title: 'Discerning God\'s Voice in Daily Life',
      excerpt: 'Practical wisdom for recognizing when God is speaking to you and how to respond in obedience. Biblical principles for spiritual discernment.',
      date: '2023-12-15',
      author: 'Pastor Sarah',
      category: 'Teaching',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* Breadcrumb */}
        <FadeInUp>
          <nav className="mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Blog</span>
          </nav>
        </FadeInUp>

        {/* Page Header */}
        <FadeInUp delay={0.1}>
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4">
              Blog
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Insights, teachings, and reflections from our ministry
            </p>
          </div>
        </FadeInUp>

        {/* Blog Posts Grid */}
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {blogPosts.map((post) => (
              <StaggerItem key={post.id}>
                <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-primary-600 font-medium uppercase tracking-wide">
                    {post.category}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {calculateReadingTime(post.content)} min
                  </div>
                </div>
                <CardTitle className="text-xl font-serif">{post.title}</CardTitle>
                <CardDescription>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })} • {post.author}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-gray-600 mb-4 leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <Link href={`/blog/${post.id}`}>
                  <button className="w-full px-4 py-2 text-primary-600 hover:text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors text-left">
                    Read More →
                  </button>
                </Link>
                </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* Pagination Placeholder */}
        <div className="max-w-7xl mx-auto mt-12 text-center">
          <p className="text-gray-600">Showing 1-6 of 12 posts</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
