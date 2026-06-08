"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductImage {
  id: number;
  url: string;
  alt: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Use placeholder if no images provided
  const displayImages = images.length > 0 ? images : [{ id: 1, url: "", alt: productName }];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)]">
        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Image Container */}
        <div
          className={cn(
            "flex h-full items-center justify-center transition-transform duration-300",
            isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
          )}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          {displayImages[selectedImage].url ? (
            <Image
              src={displayImages[selectedImage].url}
              alt={displayImages[selectedImage].alt}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <span className="text-8xl">📱</span>
              <span className="text-sm text-[var(--foreground-muted)]">
                {displayImages[selectedImage].alt}
              </span>
            </div>
          )}
        </div>

        {/* Zoom Indicator */}
        {!isZoomed && (
          <div className="absolute bottom-4 right-4 rounded-full bg-black/50 p-2 text-white">
            <ZoomIn className="h-5 w-5" />
          </div>
        )}

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {selectedImage + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => {
                setSelectedImage(index);
                setIsZoomed(false);
              }}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                selectedImage === index
                  ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
                  : "border-[var(--border)] hover:border-[var(--primary)]/50"
              )}
            >
              {image.url ? (
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[var(--background-secondary)]">
                  <span className="text-2xl">📱</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
