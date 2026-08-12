'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp } from '@/components/animations/page-transition';
import { ministryInfo } from '@/data/demo-content';

type YoutubeVideo = {
  video_id: string;
  title: string;
  description: string | null;
  published_at: string;
  thumbnail_url: string | null;
};

export default function VideosPage() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/videos')
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setVideos(Array.isArray(data?.data) ? data.data : []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const closePlayer = () => setActiveId(null);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <FadeInUp>
            <nav className="mb-8 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary-600">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Videos</span>
            </nav>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <div className="max-w-4xl mx-auto mb-10 text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                Video Sermons & Songs
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Stay connected with our latest prayer recordings, spiritual songs, and word of
                God sermons from {ministryInfo.name}.
              </p>
            </div>
          </FadeInUp>
        </div>

        <section className="bg-gray-950 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-3xl font-serif font-bold mb-2">Watch & Praise</h2>
              <p className="text-gray-400">
                Videos are loaded from our synced channel archive. Sync runs on a schedule — not
                on every page visit.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : videos.length === 0 ? (
              <div className="max-w-lg mx-auto text-center py-16 px-6 rounded-2xl border border-dashed border-white/15 bg-white/5">
                <h3 className="text-xl font-semibold mb-2">No videos synced yet</h3>
                <p className="text-gray-400 text-sm mb-6">
                  An admin can sync the YouTube channel, or set up a cron job to call{' '}
                  <code className="text-primary-300">POST /api/videos/sync</code>.
                </p>
                <a
                  href={ministryInfo.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                >
                  Visit YouTube Channel
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {videos.map((video) => (
                  <button
                    key={video.video_id}
                    type="button"
                    onClick={() => setActiveId(video.video_id)}
                    className="text-left group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-primary-500/60 hover:bg-white/10 transition-all hover:-translate-y-1"
                  >
                    <div className="relative aspect-video bg-black overflow-hidden">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No thumbnail
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center text-gray-950 text-xl font-bold">
                          ▶
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-primary-400 mb-2">{formatDate(video.published_at)}</p>
                      <h3 className="font-semibold text-white line-clamp-2 mb-2 min-h-[2.75rem]">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-sm text-gray-400 line-clamp-3 mb-4">{video.description}</p>
                      )}
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-white border border-white/20 rounded-full px-4 py-2 group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:text-gray-950 transition-colors">
                        ▶ Watch Now
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {activeId && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closePlayer}
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
        >
          <div
            className="relative w-full max-w-4xl bg-gray-900 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePlayer}
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 text-white text-2xl leading-none hover:bg-primary-500 hover:text-gray-950"
              aria-label="Close video"
            >
              ×
            </button>
            <div className="relative aspect-video">
              <iframe
                title="YouTube video player"
                src={`https://www.youtube.com/embed/${activeId}?autoplay=1&rel=0`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
