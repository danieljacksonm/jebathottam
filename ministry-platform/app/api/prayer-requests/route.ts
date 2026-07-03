import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, prayerPoint } = await request.json();

    if (!name || !email || !prayerPoint) {
      return NextResponse.json(
        { error: 'Name, email, and prayer point are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];

    let followers = await query<{ id: number }[]>(
      'SELECT id FROM followers WHERE email = ? LIMIT 1',
      [email]
    );

    let followerId: number;

    if (followers.length > 0) {
      followerId = followers[0].id;
      await query(
        'UPDATE followers SET name = ?, phone = ? WHERE id = ?',
        [name, phone || null, followerId]
      );
    } else {
      const result = await query<{ insertId: number }>(
        'INSERT INTO followers (name, email, phone, status) VALUES (?, ?, ?, ?)',
        [name, email, phone || null, 'active']
      );
      followerId = result.insertId;
    }

    const prayerResult = await query<{ insertId: number }>(
      'INSERT INTO prayer_points (follower_id, text, date, status) VALUES (?, ?, ?, ?)',
      [followerId, prayerPoint, today, 'pending']
    );

    return NextResponse.json(
      { success: true, id: prayerResult.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Prayer request error:', error);
    return NextResponse.json({ error: 'Failed to submit prayer request' }, { status: 500 });
  }
}
