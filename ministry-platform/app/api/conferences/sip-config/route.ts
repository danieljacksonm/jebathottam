import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET - Get SIP configuration
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const config = await query(`SELECT * FROM sip_config WHERE is_active = TRUE`);

    return NextResponse.json({
      success: true,
      data: config[0] || null,
    });
  } catch (error: any) {
    console.error('Error fetching SIP config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SIP config', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update SIP configuration
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      sip_server_url,
      sip_username,
      sip_password,
      dial_in_number,
      country_code = '+91',
      sip_provider,
      max_dial_in_participants = 50,
      recording_enabled = true,
    } = body;

    const config = await query(`SELECT id FROM sip_config LIMIT 1`);

    if (config.length > 0) {
      // Update existing
      const updateSql = `
        UPDATE sip_config SET
          sip_server_url = ?,
          sip_username = ?,
          sip_password = ?,
          dial_in_number = ?,
          country_code = ?,
          sip_provider = ?,
          max_dial_in_participants = ?,
          recording_enabled = ?,
          updated_at = NOW()
        WHERE id = ?
      `;

      await query(updateSql, [
        sip_server_url,
        sip_username,
        sip_password,
        dial_in_number,
        country_code,
        sip_provider,
        max_dial_in_participants,
        recording_enabled ? 1 : 0,
        config[0].id,
      ]);

      return NextResponse.json({
        success: true,
        data: { id: config[0].id, message: 'SIP configuration updated' },
      });
    } else {
      // Insert new
      const insertSql = `
        INSERT INTO sip_config 
        (sip_server_url, sip_username, sip_password, dial_in_number, country_code, sip_provider, max_dial_in_participants, recording_enabled, is_active, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
      `;

      const result = await query(insertSql, [
        sip_server_url,
        sip_username,
        sip_password,
        dial_in_number,
        country_code,
        sip_provider,
        max_dial_in_participants,
        recording_enabled ? 1 : 0,
        user.id,
      ]);

      return NextResponse.json(
        {
          success: true,
          data: { id: result.insertId, message: 'SIP configuration created' },
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error('Error updating SIP config:', error);
    return NextResponse.json(
      { error: 'Failed to update SIP config', details: error.message },
      { status: 500 }
    );
  }
}
