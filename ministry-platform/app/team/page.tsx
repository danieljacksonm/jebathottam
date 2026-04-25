'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/image-utils';

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  email: string | null;
};

const FALLBACK_TEAM: TeamMember[] = [
  { id: 1, name: 'Pastor John Smith', role: 'Senior Pastor', bio: 'Pastor John has been serving in ministry for over 20 years.', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', email: 'john@ministryplatform.org' },
  { id: 2, name: 'Pastor Sarah Johnson', role: 'Associate Pastor', bio: 'Pastor Sarah brings passion for community building and discipleship.', image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', email: 'sarah@ministryplatform.org' },
  { id: 3, name: 'Michael Chen', role: 'Worship Leader', bio: 'Michael leads our worship team with excellence.', image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', email: 'michael@ministryplatform.org' },
  { id: 4, name: 'Emily Rodriguez', role: 'Youth Ministry Director', bio: 'Emily is passionate about mentoring the next generation.', image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', email: 'emily@ministryplatform.org' },
  { id: 5, name: 'David Thompson', role: 'Administrator', bio: 'David ensures the smooth operation of our ministry platform.', image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', email: 'david@ministryplatform.org' },
  { id: 6, name: 'Lisa Williams', role: 'Prayer Coordinator', bio: 'Lisa leads our prayer ministry and supports members through prayer requests.', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', email: 'lisa@ministryplatform.org' },
];

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/team')
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        setTeamMembers(list.length > 0 ? list : FALLBACK_TEAM);
      })
      .catch(() => setTeamMembers(FALLBACK_TEAM))
      .finally(() => setLoading(false));
  }, []);

  const members = teamMembers.length > 0 ? teamMembers : FALLBACK_TEAM;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Our Team</span>
        </nav>

        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Team
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Meet the dedicated leaders and members who serve our ministry community
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {members.map((member) => {
              const imgSrc = getOptimizedImageUrl(member.image_url, 400) || member.image_url || '';
              return (
                <Card key={member.id} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160"%3E%3Crect fill="%23e5e7eb" width="160" height="160"/%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-primary-600 font-medium mb-4">{member.role}</p>
                    {member.bio && (
                      <p className="text-gray-600 leading-relaxed mb-4">{member.bio}</p>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Contact
                      </a>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-primary-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Join Our Team
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              If you feel called to serve in ministry, we would love to hear from you.
              Contact us to learn more about opportunities to serve.
            </p>
            <Link href="/contact">
              <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
                Get in Touch
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
