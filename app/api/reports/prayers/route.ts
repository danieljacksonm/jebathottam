import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET prayer reports and statistics
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['master_admin', 'pastor', 'member']);
    if (authResult instanceof NextResponse) return authResult;

    // Get all prayer statistics
    const stats = await query<any[]>(`
      SELECT 
        COUNT(*) as total_prayers,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'happened' THEN 1 ELSE 0 END) as happened_count,
        SUM(CASE WHEN status = 'not-happened' THEN 1 ELSE 0 END) as not_happened_count
      FROM prayer_points
    `);

    // Get pending prayers with follower info
    const pendingPrayers = await query<any[]>(`
      SELECT pp.*, f.name as follower_name, f.email as follower_email
      FROM prayer_points pp
      JOIN followers f ON pp.follower_id = f.id
      WHERE pp.status = 'pending'
      ORDER BY pp.date ASC, pp.created_at ASC
    `);

    // Get answered prayers (happened)
    const answeredPrayers = await query<any[]>(`
      SELECT pp.*, f.name as follower_name, f.email as follower_email
      FROM prayer_points pp
      JOIN followers f ON pp.follower_id = f.id
      WHERE pp.status = 'happened'
      ORDER BY pp.date DESC
      LIMIT 50
    `);

    // Calculate answer rate
    const total = stats[0].total_prayers || 0;
    const happened = stats[0].happened_count || 0;
    const answerRate = total > 0 ? Math.round((happened / total) * 100) : 0;

    return NextResponse.json({
      data: {
        statistics: {
          total: stats[0].total_prayers || 0,
          pending: stats[0].pending_count || 0,
          happened: stats[0].happened_count || 0,
          notHappened: stats[0].not_happened_count || 0,
          answerRate,
        },
        pendingPrayers,
        answeredPrayers,
      },
    });
  } catch (error: any) {
    console.error('Get prayer reports error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
