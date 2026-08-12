'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/image-utils';
import Image from 'next/image';
import { teamMembers as demoTeam } from '@/data/demo-content';

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  email: string | null;
  phone?: string | null;
};

const FALLBACK_TEAM: TeamMember[] = demoTeam.map((m) => ({
  id: m.id,
  name: m.name,
  role: m.role,
  bio: m.bio,
  image_url: m.image,
  email: m.email,
  phone: m.phone,
}));

export function TeamContent() {
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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {members.map((member) => {
        const imgSrc = getOptimizedImageUrl(member.image_url, 400) || member.image_url || '';
        return (
          <Card key={member.id} className="text-center overflow-hidden">
            <CardContent className="pt-8 pb-6">
              <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gray-200 overflow-hidden relative border-4 border-primary-400">
                <Image
                  src={imgSrc}
                  alt={`Photo of ${member.name}, ${member.role}`}
                  fill
                  className="object-cover"
                  sizes="160px"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160"%3E%3Crect fill="%23e5e7eb" width="160" height="160"/%3E%3C/svg%3E';
                  }}
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-primary-600 font-medium uppercase tracking-wide text-sm mb-4">
                {member.role}
              </p>
              {member.bio && (
                <p className="text-gray-600 leading-relaxed mb-4 text-sm px-2">{member.bio}</p>
              )}
              <div className="space-y-1 text-sm font-medium">
                {member.phone && (
                  <div>
                    <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="text-primary-600 hover:text-primary-700">
                      {member.phone}
                    </a>
                  </div>
                )}
                {member.email && (
                  <div>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {member.email}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
