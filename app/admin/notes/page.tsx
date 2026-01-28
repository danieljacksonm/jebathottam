'use client';

import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AdminNotes() {
  return (
    <div>
      <FadeInUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
              Notes & Sermons
            </h1>
            <p className="text-gray-600">
              Manage notes, sermons, and teachings
            </p>
          </div>
          <div className="flex space-x-4">
            <Button variant="secondary" size="lg">
              + New Note
            </Button>
            <Button size="lg">
              + New Sermon
            </Button>
          </div>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Prayer Meeting Notes</h4>
                  <p className="text-sm text-gray-600 mb-2">January 15, 2024</p>
                  <p className="text-gray-700">Key points from today's prayer meeting...</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Bible Study Reflection</h4>
                  <p className="text-sm text-gray-600 mb-2">January 12, 2024</p>
                  <p className="text-gray-700">Insights from Romans study...</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sermons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Walking in Faith</h4>
                  <p className="text-sm text-gray-600 mb-2">January 14, 2024</p>
                  <p className="text-gray-700">Sunday morning sermon on faith...</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">The Power of Prayer</h4>
                  <p className="text-sm text-gray-600 mb-2">January 7, 2024</p>
                  <p className="text-gray-700">Midweek teaching on prayer...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeInUp>
    </div>
  );
}
