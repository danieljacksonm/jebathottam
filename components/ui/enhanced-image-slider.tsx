'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageSliderProps {
  images: Array<{
    src: string;
    alt: string;
    title?: string;
    description?: string;
  }>;
  autoRotateInterval?: number;
}

export function EnhancedImageSlider({ images, autoRotateInterval = 5000 }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [images.length, autoRotateInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-[500px] md:h-[600px] bg-gradient-to-br from-primary-100 via-primary-200 to-primary-300 rounded-lg flex items-center justify-center">
        <p className="text-gray-600 text-lg">Ministry images coming soon</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-lg shadow-2xl">
      <AnimatePresence mode="wait">
        {images.map((image, index) => (
          index === currentIndex && (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"%3E%3Crect fill="%23e0e7ff" width="1200" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="%236366f1"%3EMinistry Image%3C/text%3E%3C/svg%3E';
                }}
              />
              {(image.title || image.description) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                  <div className="w-full p-8 md:p-12 text-white">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      {image.title && (
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-3">
                          {image.title}
                        </h3>
                      )}
                      {image.description && (
                        <p className="text-lg md:text-xl max-w-3xl opacity-90">
                          {image.description}
                        </p>
                      )}
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all z-10"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all z-10"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 w-2 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
