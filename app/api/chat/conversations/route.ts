import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['super_admin', 'admin']);
    if (authResult instanceof NextResponse) return authResult;

    const conversations = await query<any[]>(`
      SELECT 
        cm.chat_id,
        cm.text AS last_message,
        cm.sender AS last_sender,
        cm.created_at AS last_message_at,
        counts.total_messages,
        COALESCE(counts.user_messages, 0) AS user_messages
      FROM chat_messages cm
      INNER JOIN (
        SELECT chat_id, MAX(id) AS max_id,
          COUNT(*) AS total_messages,
          SUM(CASE WHEN sender = 'user' THEN 1 ELSE 0 END) AS user_messages
        FROM chat_messages
        GROUP BY chat_id
      ) counts ON cm.chat_id = counts.chat_id AND cm.id = counts.max_id
      ORDER BY cm.created_at DESC
    `);

    return NextResponse.json({ data: conversations });
  } catch (error: any) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
