import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor']);
    if (authResult instanceof NextResponse) return authResult;

    // Get all stats in parallel
    const [
      blogStats,
      eventStats,
      teamStats,
      prophecyStats,
      sermonStats,
      noteStats,
      followerStats,
      prayerStats,
    ] = await Promise.all([
      query<any[]>('SELECT COUNT(*) as total, SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published FROM blogs'),
      query<any[]>('SELECT COUNT(*) as total, SUM(CASE WHEN date >= CURDATE() THEN 1 ELSE 0 END) as upcoming FROM events'),
      query<any[]>('SELECT COUNT(*) as total FROM team_members'),
      query<any[]>('SELECT COUNT(*) as total FROM prophecies'),
      query<any[]>('SELECT COUNT(*) as total FROM notes WHERE type = "sermon"'),
      query<any[]>('SELECT COUNT(*) as total FROM notes WHERE type = "note"'),
      query<any[]>('SELECT COUNT(*) as total, SUM(CASE WHEN status = "active" THEN 1 ELSE 0 END) as active FROM followers'),
      query<any[]>('SELECT COUNT(*) as total, SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending, SUM(CASE WHEN status = "happened" THEN 1 ELSE 0 END) as happened FROM prayer_points'),
    ]);

    return NextResponse.json({
      data: {
        blogs: blogStats[0] || { total: 0, published: 0 },
        events: eventStats[0] || { total: 0, upcoming: 0 },
        team: teamStats[0] || { total: 0 },
        prophecies: prophecyStats[0] || { total: 0 },
        sermons: sermonStats[0] || { total: 0 },
        notes: noteStats[0] || { total: 0 },
        followers: followerStats[0] || { total: 0, active: 0 },
        prayers: prayerStats[0] || { total: 0, pending: 0, happened: 0 },
      },
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
