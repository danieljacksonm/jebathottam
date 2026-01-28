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
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
            24 Hours Audio
          </h2>
          <p className="text-gray-600">
            Continuous worship and prayer audio for your daily walk
          </p>
        </div>

        {/* Current Track Display */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={currentTrack.image}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-1">
                {currentTrack.title}
              </h3>
              <p className="text-gray-600 mb-3">{currentTrack.artist}</p>
              <p className="text-sm text-primary-600 italic mb-4">
                "{currentTrack.scripture}"
              </p>
              
              {/* Player Controls */}
              <div className="flex items-center justify-center md:justify-start gap-4">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors shadow-lg"
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <div className="flex-1 max-w-xs">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${(currentTime / 100) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{currentTrack.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Playlist */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Playlist</h3>
          {audioTracks.map((track) => (
            <motion.div
              key={track.id}
              whileHover={{ x: 4 }}
              onClick={() => selectTrack(track)}
              className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
                currentTrack.id === track.id
                  ? 'bg-white shadow-md border-2 border-primary-500'
                  : 'bg-white/70 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{track.title}</h4>
                <p className="text-sm text-gray-600">{track.artist}</p>
                <p className="text-xs text-primary-600 mt-1">{track.duration}</p>
              </div>
              {currentTrack.id === track.id && isPlaying && (
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
