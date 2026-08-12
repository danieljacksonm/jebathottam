import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { getISTDate, normalizeAttendanceName } from '@/lib/attendance-utils';

export const dynamic = 'force-dynamic';

const ADMIN_ROLES = ['super_admin', 'media_team'];

type AttendanceRow = {
  id: number;
  name: string;
  date: string | Date;
  slot_time: string;
  session_name: string | null;
  marked_at: string | Date;
  ip_hash: string | null;
  device_type: string | null;
  duration_mins: number;
  added_by: string;
};

type SlotRow = {
  id: number;
  slot_time: string;
  session_name: string;
  assigned_member: string | null;
  is_empty: number | boolean;
  sort_order: number;
};

function formatDateCell(value: unknown): string {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

export async function GET(request: NextRequest) {
  const authResult = await requireRole(request, ADMIN_ROLES);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource') || 'attendance';

    if (resource === 'slots') {
      const slots = await query<SlotRow[]>(
        `SELECT id, slot_time, session_name, assigned_member, is_empty, sort_order
         FROM carmel_slots
         ORDER BY sort_order ASC, id ASC`
      );
      return NextResponse.json({
        data: (slots || []).map((s) => ({
          ...s,
          is_empty: Number(s.is_empty) ? 1 : 0,
          sort_order: Number(s.sort_order),
        })),
      });
    }

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
      where.push('(name LIKE ? OR slot_time LIKE ? OR session_name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
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
        `SELECT id, name, date, slot_time, session_name, marked_at, ip_hash, device_type, duration_mins, added_by
         FROM carmel_attendance
         WHERE ${whereSql}
         ORDER BY date DESC, marked_at DESC`,
        params
      );

      const header = [
        'ID',
        'Name',
        'Date',
        'Slot Time',
        'Session',
        'Duration Mins',
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
          r.slot_time ?? '',
          `"${String(r.session_name ?? '').replace(/"/g, '""')}"`,
          r.duration_mins ?? 30,
          r.ip_hash ?? '',
          r.device_type ?? '',
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
          'Content-Disposition': `attachment; filename="carmel_attendance_${getISTDate()}.csv"`,
        },
      });
    }

    const countRows = await query<{ c: number }[]>(
      `SELECT COUNT(*) AS c FROM carmel_attendance WHERE ${whereSql}`,
      params
    );
    const total = Number(countRows[0]?.c ?? 0);

    const records = await query<AttendanceRow[]>(
      `SELECT id, name, date, slot_time, session_name, marked_at, ip_hash, device_type, duration_mins, added_by
       FROM carmel_attendance
       WHERE ${whereSql}
       ORDER BY date DESC, marked_at DESC
       LIMIT ${limit} OFFSET ${offset}`,
      params
    );

    return NextResponse.json({
      data: (records || []).map((r) => ({
        ...r,
        date: formatDateCell(r.date),
        duration_mins: Number(r.duration_mins),
      })),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error('Admin carmel GET error:', error);
    return NextResponse.json({ error: 'Failed to load Carmel data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireRole(request, ADMIN_ROLES);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const resource = String(body.resource || 'attendance');

    if (resource === 'slots') {
      const slotTime = String(body.slot_time ?? '').trim();
      const sessionName = String(body.session_name ?? '').trim();
      const assignedRaw = String(body.assigned_member ?? '').trim();
      const assignedMember =
        !assignedRaw || assignedRaw === 'காலியாக உள்ளது' ? null : assignedRaw;
      const isEmpty = assignedMember ? 0 : 1;
      const sortOrder = parseInt(String(body.sort_order ?? 0), 10) || 0;

      if (!slotTime || !sessionName) {
        return NextResponse.json(
          { error: 'slot_time and session_name are required' },
          { status: 400 }
        );
      }

      const result = await query<{ insertId: number }>(
        `INSERT INTO carmel_slots (slot_time, session_name, assigned_member, is_empty, sort_order)
         VALUES (?, ?, ?, ?, ?)`,
        [slotTime, sessionName, assignedMember, isEmpty, sortOrder]
      );
      const id = (result as { insertId: number }).insertId;
      const rows = await query<SlotRow[]>('SELECT * FROM carmel_slots WHERE id = ?', [id]);
      return NextResponse.json({ data: rows[0] }, { status: 201 });
    }

    // Manual attendance add
    const name = normalizeAttendanceName(String(body.name ?? ''));
    const date = String(body.date ?? getISTDate()).slice(0, 10);
    const slotTime = String(body.slot_time ?? '').trim();
    const sessionName = String(body.session_name ?? body.session ?? '').trim();
    const duration = parseInt(String(body.duration_mins ?? 30), 10) || 30;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!slotTime) {
      return NextResponse.json({ error: 'slot_time is required' }, { status: 400 });
    }

    try {
      const result = await query<{ insertId: number }>(
        `INSERT INTO carmel_attendance
         (name, date, slot_time, session_name, ip_hash, device_type, duration_mins, added_by)
         VALUES (?, ?, ?, ?, 'admin_override', 'desktop', ?, 'admin')`,
        [name, date, slotTime, sessionName || null, duration]
      );
      const id = (result as { insertId: number }).insertId;
      const rows = await query<AttendanceRow[]>(
        'SELECT * FROM carmel_attendance WHERE id = ?',
        [id]
      );
      return NextResponse.json(
        {
          data: rows[0]
            ? { ...rows[0], date: formatDateCell(rows[0].date) }
            : { id, name, date, slot_time: slotTime },
        },
        { status: 201 }
      );
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'ER_DUP_ENTRY') {
        return NextResponse.json(
          { error: 'Attendance already exists for this name, date, and slot' },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error('Admin carmel POST error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await requireRole(request, ADMIN_ROLES);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const id = parseInt(String(body.id ?? ''), 10);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const slotTime = String(body.slot_time ?? '').trim();
    const sessionName = String(body.session_name ?? '').trim();
    const assignedRaw = String(body.assigned_member ?? '').trim();
    const assignedMember =
      !assignedRaw || assignedRaw === 'காலியாக உள்ளது' ? null : assignedRaw;
    const isEmpty = assignedMember ? 0 : 1;
    const sortOrder = parseInt(String(body.sort_order ?? 0), 10) || 0;

    if (!slotTime || !sessionName) {
      return NextResponse.json(
        { error: 'slot_time and session_name are required' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE carmel_slots
       SET slot_time = ?, session_name = ?, assigned_member = ?, is_empty = ?, sort_order = ?
       WHERE id = ?`,
      [slotTime, sessionName, assignedMember, isEmpty, sortOrder, id]
    );

    const rows = await query<SlotRow[]>('SELECT * FROM carmel_slots WHERE id = ?', [id]);
    return NextResponse.json({ data: rows[0] });
  } catch (error) {
    console.error('Admin carmel PUT error:', error);
    return NextResponse.json({ error: 'Failed to update slot' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireRole(request, ADMIN_ROLES);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource') || 'attendance';
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

    if (resource === 'slots') {
      await query('DELETE FROM carmel_slots WHERE id = ?', [id]);
    } else {
      await query('DELETE FROM carmel_attendance WHERE id = ?', [id]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin carmel DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
