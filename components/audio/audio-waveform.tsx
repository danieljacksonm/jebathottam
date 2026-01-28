'use client';

import { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isActive?: boolean;
  className?: string;
}

export function AudioWaveform({ isActive = false, className = '' }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const bars = 50;
    const barWidth = width / bars;
    let animationFrame: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#6366f1'; // primary-500

      for (let i = 0; i < bars; i++) {
        const barHeight = Math.random() * height * 0.8;
        const x = i * barWidth;
        const y = (height - barHeight) / 2;

        ctx.fillRect(x, y, barWidth - 2, barHeight);
      }

      if (isActive) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={80}
      className={`w-full h-20 ${className}`}
    />
  );
}
