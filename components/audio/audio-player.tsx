'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { audioTracks } from '@/data/audio-content';

export function AudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState(audioTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const selectTrack = (track: typeof audioTracks[0]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
              <img
                src={currentTrack.image}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="flex items-end gap-0.5 h-5">
                    <span className="w-1 bg-white rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0ms' }} />
                    <span className="w-1 bg-white rounded-full animate-pulse" style={{ height: '100%', animationDelay: '150ms' }} />
                    <span className="w-1 bg-white rounded-full animate-pulse" style={{ height: '40%', animationDelay: '300ms' }} />
                    <span className="w-1 bg-white rounded-full animate-pulse" style={{ height: '80%', animationDelay: '450ms' }} />
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0 w-full">
              <h3 className="text-lg sm:text-xl font-serif font-semibold text-gray-900 dark:text-white mb-1 truncate">
                {currentTrack.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm">{currentTrack.artist}</p>
              <p className="text-sm text-primary-600 dark:text-primary-400 italic mb-4 line-clamp-1">
                &ldquo;{currentTrack.scripture}&rdquo;
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-4">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-700 dark:hover:bg-primary-400 transition-colors shadow-lg flex-shrink-0"
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <div className="flex-1 max-w-xs min-w-0">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-primary-600 dark:bg-primary-400 h-1.5 rounded-full transition-all"
                      style={{ width: `${(currentTime / 100) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                    <span>{formatTime(currentTime)}</span>
                    <span>{currentTrack.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Playlist</h3>
          {audioTracks.map((track) => (
            <motion.div
              key={track.id}
              whileHover={{ x: 3 }}
              onClick={() => selectTrack(track)}
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                currentTrack.id === track.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 shadow-sm'
                  : 'bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">{track.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{track.artist}</p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{track.duration}</span>
              {currentTrack.id === track.id && isPlaying && (
                <div className="flex items-end gap-px h-4 flex-shrink-0">
                  <span className="w-0.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse" style={{ height: '50%', animationDelay: '0ms' }} />
                  <span className="w-0.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse" style={{ height: '100%', animationDelay: '150ms' }} />
                  <span className="w-0.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse" style={{ height: '30%', animationDelay: '300ms' }} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
