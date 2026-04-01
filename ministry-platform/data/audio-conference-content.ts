export interface AudioConference {
  id: number;
  title: string;
  description: string;
  speaker: {
    name: string;
    role: string;
    image: string;
  };
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  status: 'upcoming' | 'live' | 'ended';
  participants: number;
  maxParticipants: number;
  category: string;
}

export const audioConferences: AudioConference[] = [
  {
    id: 1,
    title: 'Prayer & Intercession Session',
    description: 'Join us for a powerful time of prayer and intercession. We will be praying for our nation, families, and personal breakthroughs.',
    speaker: {
      name: 'Pastor John Smith',
      role: 'Senior Pastor',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
    scheduledDate: '2024-01-20',
    scheduledTime: '19:00',
    duration: 60,
    status: 'upcoming',
    participants: 0,
    maxParticipants: 100,
    category: 'Prayer',
  },
  {
    id: 2,
    title: 'Bible Study: Book of Romans',
    description: 'Deep dive into the Book of Romans. We will explore Paul\'s letter and its relevance to our lives today.',
    speaker: {
      name: 'Pastor Sarah Johnson',
      role: 'Teaching Pastor',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    },
    scheduledDate: '2024-01-22',
    scheduledTime: '18:30',
    duration: 90,
    status: 'upcoming',
    participants: 0,
    maxParticipants: 50,
    category: 'Teaching',
  },
  {
    id: 3,
    title: 'Worship & Testimony Night',
    description: 'An evening of worship, testimonies, and fellowship. Share what God has done in your life!',
    speaker: {
      name: 'Michael Chen',
      role: 'Worship Leader',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    },
    scheduledDate: '2024-01-18',
    scheduledTime: '20:00',
    duration: 120,
    status: 'live',
    participants: 45,
    maxParticipants: 200,
    category: 'Worship',
  },
  {
    id: 4,
    title: 'Youth Fellowship Discussion',
    description: 'Open discussion for young adults on faith, purpose, and navigating life with Christ.',
    speaker: {
      name: 'Emily Rodriguez',
      role: 'Youth Pastor',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    },
    scheduledDate: '2024-01-15',
    scheduledTime: '19:30',
    duration: 75,
    status: 'ended',
    participants: 32,
    maxParticipants: 50,
    category: 'Fellowship',
  },
];
