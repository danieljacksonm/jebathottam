'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';

interface SocialPost {
  id: number;
  title: string;
  content: string;
  media_type: string;
  media_urls: string[];
  hashtags: string;
  published_at: string;
  creator_name: string;
  published_count: number;
}

const platformIcons: Record<string, string> = {
  facebook: '📘',
  instagram: '📷',
  twitter: '🐦',
  linkedin: '💼',
  youtube: '📹',
  tiktok: '🎵',
  telegram: '✈️',
  whatsapp: '💬',
};

export default function SocialFeedPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/social-media/posts?status=published&limit=50');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const parseMediaUrls = (urls: any): string[] => {
    try {
      if (typeof urls === 'string') {
        return JSON.parse(urls);
      }
      return Array.isArray(urls) ? urls : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <div className="bg-primary-600 dark:bg-primary-900 text-white py-16">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-6xl mb-4 block">🌐</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Social Media Feed
              </h1>
              <p className="text-lg md:text-xl text-primary-100">
                Stay connected with our latest updates, events, and inspirational content across all platforms
              </p>
            </div>
          </FadeInUp>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📱</span>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check back soon for updates!
              </p>
            </div>
          ) : (
            <StaggerContainer>
              <div className="space-y-8">
                {posts.map((post) => {
                  const mediaUrls = parseMediaUrls(post.media_urls);
                  
                  return (
                    <StaggerItem key={post.id}>
                      <article className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-shadow">
                        {/* Post Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                          <div className="flex items-start justify-between">
                            <div>
                              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                                {post.title || 'Update'}
                              </h2>
                              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                                <span>📅 {formatDate(post.published_at)}</span>
                                <span>•</span>
                                <span>🌐 Published on {post.published_count} platform{post.published_count !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="p-6">
                          <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {post.content}
                            </p>
                          </div>

                          {post.hashtags && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {post.hashtags.split(' ').map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Media */}
                        {mediaUrls.length > 0 && (
                          <div className="px-6 pb-6">
                            <div className={`grid gap-4 ${
                              mediaUrls.length === 1 ? 'grid-cols-1' :
                              mediaUrls.length === 2 ? 'grid-cols-2' :
                              'grid-cols-2 md:grid-cols-3'
                            }`}>
                              {mediaUrls.map((url, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                  {post.media_type === 'video' ? (
                                    <video
                                      src={url}
                                      controls
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <img
                                      src={url}
                                      alt={`Media ${index + 1}`}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Post Footer - Platform indicators */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Find us on all major platforms
                            </p>
                            <div className="flex items-center space-x-2">
                              {Object.values(platformIcons).slice(0, 5).map((icon, index) => (
                                <span key={index} className="text-xl opacity-50">
                                  {icon}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </article>
                    </StaggerItem>
                  );
                })}
              </div>
            </StaggerContainer>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-12">
        <FadeInUp>
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Connected
            </h2>
            <p className="text-lg md:text-xl text-primary-100 mb-6">
              Follow us on your favorite social media platforms to never miss an update
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {Object.entries(platformIcons).map(([platform, icon]) => (
                <button
                  key={platform}
                  className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
                >
                  {icon} {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
