'use client';

import { useState } from 'react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { mediaItems } from '@/data/media-content';

export default function AdminMedia() {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'posters' | 'videos'>('posters');

  const posters = mediaItems.filter(item => item.type === 'poster');
  const videos = mediaItems.filter(item => item.type === 'youtube' || item.type === 'youtube-shorts');

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Media Library' },
      ]} />

      <FadeInUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
              Media Library
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage posters, videos, and media content
            </p>
          </div>
          <div className="flex space-x-4">
            <Button variant="secondary" size="lg" onClick={() => setActiveTab('posters')}>
              + New Poster
            </Button>
            <Button size="lg" onClick={() => setActiveTab('videos')}>
              + New Video
            </Button>
          </div>
        </div>
      </FadeInUp>

      {/* Tabs */}
      <FadeInUp delay={0.1}>
        <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('posters')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'posters'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Posters ({posters.length})
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'videos'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Videos ({videos.length})
            </button>
          </nav>
        </div>
      </FadeInUp>

      {/* Posters */}
      {activeTab === 'posters' && (
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posters.map((poster) => (
              <StaggerItem key={poster.id}>
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative h-64 bg-gray-100 dark:bg-gray-800">
                    <img
                      src={poster.image}
                      alt={poster.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{poster.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{poster.message}</p>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="flex-1 dark:text-gray-400 dark:hover:text-white">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      )}

      {/* Videos */}
      {activeTab === 'videos' && (
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <StaggerItem key={video.id}>
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                    {video.thumbnail && (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{video.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">YouTube ID: {video.videoId}</p>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="flex-1 dark:text-gray-400 dark:hover:text-white">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      )}
    </div>
  );
}
