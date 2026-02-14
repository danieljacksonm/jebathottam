import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon | React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

function isReactComponent(val: unknown): val is React.ComponentType {
  return typeof val === 'function' || (typeof val === 'object' && val !== null && '$$typeof' in val);
}

export function StatsCard({ title, value, change, icon: Icon, trend = 'neutral' }: StatsCardProps) {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  return (
    <Card className="hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            {change && (
              <p className={`text-xs mt-2 ${trendColors[trend]}`}>
                {change}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
            {isReactComponent(Icon) ? React.createElement(Icon as React.ComponentType<{ className?: string; strokeWidth?: number }>, { className: 'w-6 h-6', strokeWidth: 1.5 }) : React.isValidElement(Icon) ? Icon : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
