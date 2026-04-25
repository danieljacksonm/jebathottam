'use client';

import { useEffect, useState } from 'react';

interface ViewCounterProps {
  count: number;
  label?: string;
  className?: string;
}

export function ViewCounter({ count, label = 'views', className = '' }: ViewCounterProps) {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    // Animate count up
    const duration = 1000;
    const steps = 30;
    const increment = count / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= count) {
        setDisplayCount(count);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [count]);

  const formatCount = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className={`flex items-center space-x-2 text-gray-600 dark:text-gray-400 ${className}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <span className="text-sm font-medium">
        {formatCount(displayCount)} {label}
      </span>
    </div>
  );
}
