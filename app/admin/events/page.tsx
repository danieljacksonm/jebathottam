'use client';

import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { events } from '@/data/demo-content';

export default function AdminEvents() {
  return (
    <div>
      <FadeInUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
              Manage Events
            </h1>
            <p className="text-gray-600">
              Create and manage ministry events and meetings
            </p>
          </div>
          <Button size="lg">
            + New Event
          </Button>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.2}>
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="bg-primary-600 text-white rounded-lg p-4 text-center min-w-[80px]">
                      <div className="text-2xl font-bold">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs uppercase">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-gray-600 mb-2">{event.description}</p>
                      <div className="flex space-x-4 text-sm text-gray-500">
                        <span>{event.time}</span>
                        <span>•</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeInUp>
    </div>
  );
}
