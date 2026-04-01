import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// POST: seed example slider images and testimonies into DB (only if tables are empty). super_admin only.
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) return authResult;

    const sliderRows = await query<any[]>('SELECT COUNT(*) AS c FROM slider_images');
    const sliderCount = Number((sliderRows as any[])[0]?.c ?? 0);
    if (sliderCount === 0) {
      await query(
        `INSERT INTO slider_images (image_url, text, title, description, order_index, status) VALUES
         (?, ?, ?, ?, 0, 'active'),
         (?, ?, ?, ?, 1, 'active'),
         (?, ?, ?, ?, 2, 'active')`,
        [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
          'For the word of God is living and active.',
          'Welcome to Our Ministry',
          'A community dedicated to preserving God-spoken words',
          'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=600&fit=crop',
          'Join us in prayer and worship.',
          'Join Us in Prayer',
          'Experience the power of corporate prayer',
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=600&fit=crop',
          "Deep in God's Word.",
          "Deep in God's Word",
          'Growing together through biblical teaching',
        ]
      );
    }

    const testimonyRows = await query<any[]>('SELECT COUNT(*) AS c FROM testimonies');
    const testimonyCount = Number((testimonyRows as any[])[0]?.c ?? 0);
    if (testimonyCount === 0) {
      await query(
        `INSERT INTO testimonies (name, content, image_url) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)`,
        [
          'Sarah Johnson',
          'Through this ministry, I found hope and purpose. The teachings have transformed my life and brought me closer to God. I am forever grateful for the prophetic words that guided me through difficult times.',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
          'Michael Chen',
          "The continuous worship audio has been a blessing in my daily walk. It keeps me connected to God throughout the day, and I've seen incredible breakthroughs in my prayer life.",
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
          'Emily Rodriguez',
          "After submitting a prayer request, I experienced God's faithfulness in ways I never imagined. The ministry team prayed with me, and I witnessed miracles in my family.",
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        ]
      );
    }

    return NextResponse.json({
      message: 'Seed completed',
      slider_inserted: sliderCount === 0,
      testimonies_inserted: testimonyCount === 0,
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: error.message || 'Seed failed' },
      { status: 500 }
    );
  }
}
