/**
 * Example/fallback data returned by APIs when DB is empty or fails.
 * Keeps the site working and allows managing content dynamically later.
 */

export const exampleSliderSlides = [
  {
    id: 0,
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
    text: 'For the word of God is living and active.',
    title: 'Welcome to Our Ministry',
    description: 'A community dedicated to preserving God-spoken words',
    order_index: 0,
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: -1,
    image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=600&fit=crop',
    text: 'Join us in prayer and worship.',
    title: 'Join Us in Prayer',
    description: 'Experience the power of corporate prayer',
    order_index: 1,
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: -2,
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=600&fit=crop',
    text: 'Deep in God\'s Word.',
    title: 'Deep in God\'s Word',
    description: 'Growing together through biblical teaching',
    order_index: 2,
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const exampleTestimonies = [
  {
    id: 0,
    name: 'Sarah Johnson',
    content: 'Through this ministry, I found hope and purpose. The teachings have transformed my life and brought me closer to God. I am forever grateful for the prophetic words that guided me through difficult times.',
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    created_at: '2024-01-10T00:00:00.000Z',
    updated_at: '2024-01-10T00:00:00.000Z',
  },
  {
    id: -1,
    name: 'Michael Chen',
    content: "The continuous worship audio has been a blessing in my daily walk. It keeps me connected to God throughout the day, and I've seen incredible breakthroughs in my prayer life.",
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    created_at: '2024-01-05T00:00:00.000Z',
    updated_at: '2024-01-05T00:00:00.000Z',
  },
  {
    id: -2,
    name: 'Emily Rodriguez',
    content: "After submitting a prayer request, I experienced God's faithfulness in ways I never imagined. The ministry team prayed with me, and I witnessed miracles in my family.",
    image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    created_at: '2023-12-28T00:00:00.000Z',
    updated_at: '2023-12-28T00:00:00.000Z',
  },
];
