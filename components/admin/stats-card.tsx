import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatsCard({ title, value, change, icon, trend = 'neutral' }: StatsCardProps) {
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
          <div className="text-4xl opacity-20">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
