'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { audioTracks } from '@/data/audio-content';

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoPlayNext, setAutoPlayNext] = useState(true);

  const currentTrack = audioTracks[currentTrackIndex];

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      setError(null);
      await audio.play();
    } catch (e) {
      if (e instanceof Error && e.name !== 'AbortError') {
        setError('Failed to play audio. Please try again.');
        setIsPlaying(false);
      }
    }
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      playAudio();
    }
  }, [isPlaying, playAudio]);

  const selectTrack = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    setIsLoading(true);
  }, []);

  const playNext = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % audioTracks.length;
    selectTrack(nextIndex);
  }, [currentTrackIndex, selectTrack]);

  const playPrevious = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const prevIndex = (currentTrackIndex - 1 + audioTracks.length) % audioTracks.length;
    selectTrack(prevIndex);
  }, [currentTrackIndex, selectTrack]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressBarRef.current;
    if (!audio || !bar || !isFinite(audio.duration)) return;
    const rect = bar.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = fraction * audio.duration;
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.muted = false;
      audio.volume = volume > 0 ? volume : 0.5;
      setIsMuted(false);
      if (volume === 0) setVolume(0.5);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.url;
    audio.volume = volume;
    audio.muted = isMuted;
    audio.load();

    const shouldAutoPlay = isPlaying || currentTrackIndex > 0;

    const onCanPlay = () => {
      setIsLoading(false);
      if (shouldAutoPlay) {
        playAudio();
      }
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onEnded = () => {
      setIsPlaying(false);
      if (autoPlayNext) {
        playNext();
      }
    };
    const onError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setError('Could not load this track. Check your connection or try another.');
    };

    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div>
      <audio ref={audioRef} preload="metadata" />

      <div className="max-w-4xl mx-auto">
        {/* Now Playing */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            {/* Album Art */}
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
              {isLoading && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Track Info & Controls */}
            <div className="flex-1 text-center sm:text-left min-w-0 w-full">
              <h3 className="text-lg sm:text-xl font-serif font-semibold text-gray-900 dark:text-white mb-1 truncate">
                {currentTrack.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm">{currentTrack.artist}</p>
              <p className="text-sm text-primary-600 dark:text-primary-400 italic mb-4 line-clamp-1">
                &ldquo;{currentTrack.scripture}&rdquo;
              </p>

              {error && (
                <div className="mb-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              {/* Playback Controls */}
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <button
                  onClick={playPrevious}
                  className="w-9 h-9 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                  aria-label="Previous track"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>

                <button
                  onClick={togglePlay}
                  disabled={isLoading && !isPlaying}
                  className="w-12 h-12 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-700 dark:hover:bg-primary-400 transition-colors shadow-lg flex-shrink-0 disabled:opacity-60"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isLoading && !isPlaying ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : isPlaying ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={playNext}
                  className="w-9 h-9 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                  aria-label="Next track"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 w-full">
                <div
                  ref={progressBarRef}
                  onClick={handleSeek}
                  className="group w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 cursor-pointer relative hover:h-2.5 transition-all"
                  role="slider"
                  aria-label="Seek"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                >
                  <div
                    className="bg-primary-600 dark:bg-primary-400 h-full rounded-full transition-[width] relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-gray-200 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity border border-gray-300 dark:border-gray-500" />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                  <span>{formatTime(currentTime)}</span>
                  <span>{duration > 0 ? formatTime(duration) : currentTrack.duration}</span>
                </div>
              </div>

              {/* Volume & Auto-play */}
              <div className="mt-3 flex items-center justify-center sm:justify-start gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted || volume === 0 ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : volume < 0.5 ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary-600 dark:accent-primary-400
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 dark:[&::-webkit-slider-thumb]:bg-primary-400
                      [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-600 dark:[&::-moz-range-thumb]:bg-primary-400 [&::-moz-range-thumb]:border-0"
                    aria-label="Volume"
                  />
                </div>

                <label className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoPlayNext}
                    onChange={(e) => setAutoPlayNext(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700"
                  />
                  Auto-play next
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Playlist */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Playlist</h3>
          {audioTracks.map((track, index) => (
            <motion.div
              key={track.id}
              whileHover={{ x: 3 }}
              onClick={() => selectTrack(index)}
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                currentTrackIndex === index
                  ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 shadow-sm'
                  : 'bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                {currentTrackIndex === index && isPlaying && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  </div>
                )}
                {currentTrackIndex !== index && (
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium truncate text-sm ${
                  currentTrackIndex === index
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {track.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{track.artist}</p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{track.duration}</span>
              {currentTrackIndex === index && isPlaying && (
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
