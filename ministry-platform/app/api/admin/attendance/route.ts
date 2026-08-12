import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import {
  getISTDate,
  getISTTime,
  normalizeAttendanceName,
} from '@/lib/attendance-utils';

export const dynamic = 'force-dynamic';

const ADMIN_ROLES = ['super_admin', 'media_team'];

type AttendanceRow = {
  id: number;
  name: string;
  date: string;
  time: string | null;
  streak: number;
  ip_hash: string | null;
  device: string | null;
  marked_at: string;
  added_by: string;
};

function formatDateCell(value: unknown): string {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const s = String(value);
  return s.slice(0, 10);
}

export async function GET(request: NextRequest) {
  const authResult = await requireRole(request, ADMIN_ROLES);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const exportCsv = searchParams.get('export') === 'csv';
    const search = (searchParams.get('search') || '').trim();
    const dateFrom = (searchParams.get('date_from') || '').trim();
    const dateTo = (searchParams.get('date_to') || '').trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));
    const offset = (page - 1) * limit;

    const where: string[] = ['1=1'];
    const params: (string | number)[] = [];

    if (search) {
      where.push('name LIKE ?');
      params.push(`%${search}%`);
    }
    if (dateFrom) {
      where.push('date >= ?');
      params.push(dateFrom);
    }
    if (dateTo) {
      where.push('date <= ?');
      params.push(dateTo);
    }

    const whereSql = where.join(' AND ');

    if (exportCsv) {
      const rows = await query<AttendanceRow[]>(
        `SELECT id, name, date, time, streak, ip_hash, device, marked_at, added_by
         FROM youth_attendance
         WHERE ${whereSql}
         ORDER BY date DESC, marked_at DESC`,
        params
      );

      const header = [
        'ID',
        'Name',
        'Date',
        'Time',
        'Streak',
        'IP Hash',
        'Device',
        'Marked At',
        'Added By',
      ];
      const lines = [header.join(',')];
      for (const r of rows || []) {
        const cells = [
          r.id,
          `"${String(r.name).replace(/"/g, '""')}"`,
          formatDateCell(r.date),
          r.time ?? '',
          r.streak,
          r.ip_hash ?? '',
          r.device ?? '',
          r.marked_at ? String(r.marked_at) : '',
          r.added_by ?? '',
        ];
        lines.push(cells.join(','));
      }

      const csv = '\uFEFF' + lines.join('\n');
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="youth_attendance_${getISTDate()}.csv"`,
        },
      });
    }

    const countRows = await query<{ c: number }[]>(
      `SELECT COUNT(*) AS c FROM youth_attendance WHERE ${whereSql}`,
      params
    );
    const total = Number(countRows[0]?.c ?? 0);

    const records = await query<AttendanceRow[]>(
      `SELECT id, name, date, time, streak, ip_hash, device, marked_at, added_by
       FROM youth_attendance
       WHERE ${whereSql}
       ORDER BY date DESC, marked_at DESC
       LIMIT ${limit} OFFSET ${offset}`,
      params
    );

    return NextResponse.json({
      data: (records || []).map((r) => ({
        ...r,
        date: formatDateCell(r.date),
        streak: Number(r.streak),
      })),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error('Admin attendance GET error:', error);
    return NextResponse.json({ error: 'Failed to load attendance' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireRole(request, ADMIN_ROLES);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const name = normalizeAttendanceName(String(body.name ?? ''));
    const date = String(body.date ?? getISTDate()).slice(0, 10);

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Streak relative to the attendance date being added
    const prevDate = (() => {
      const [y, m, d] = date.split('-').map(Number);
      const dt = new Date(Date.UTC(y, m - 1, d, 12));
      dt.setUTCDate(dt.getUTCDate() - 1);
      return dt.toISOString().slice(0, 10);
    })();

    const streakRows = await query<{ streak: number }[]>(
      'SELECT streak FROM youth_attendance WHERE name = ? AND date = ? LIMIT 1',
      [name, prevDate]
    );
    const streak = streakRows[0]?.streak ? Number(streakRows[0].streak) + 1 : 1;
    const time = getISTTime();

    try {
      const result = await query<{ insertId: number }>(
        `INSERT INTO youth_attendance (name, date, time, ip_hash, device, streak, added_by)
         VALUES (?, ?, ?, 'admin_override', 'desktop', ?, 'admin')`,
        [name, date, time, streak]
      );

      try {
        await query(
          `INSERT IGNORE INTO youth_members (name, joined_date, is_active) VALUES (?, ?, 1)`,
          [name, date]
        );
      } catch {
        // optional
      }

      const id = (result as { insertId: number }).insertId;
      const rows = await query<AttendanceRow[]>(
        'SELECT * FROM youth_attendance WHERE id = ?',
        [id]
      );

      return NextResponse.json(
        {
          data: rows[0]
            ? { ...rows[0], date: formatDateCell(rows[0].date), streak: Number(rows[0].streak) }
            : { id, name, date, streak },
        },
        { status: 201 }
      );
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'ER_DUP_ENTRY') {
        return NextResponse.json(
          { error: 'Attendance already exists for this name and date' },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error('Admin attendance POST error:', error);
    return NextResponse.json({ error: 'Failed to add attendance' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireRole(request, ADMIN_ROLES);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    let id = parseInt(searchParams.get('id') || '', 10);

    if (!id || Number.isNaN(id)) {
      try {
        const body = await request.json();
        id = parseInt(String(body.id ?? ''), 10);
      } catch {
        // ignore
      }
    }

    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    await query('DELETE FROM youth_attendance WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin attendance DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete attendance' }, { status: 500 });
  }
}
