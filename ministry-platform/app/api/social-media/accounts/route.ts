import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { logActivity } from '@/lib/permissions';

// GET - List all social media accounts
export async function GET(request: NextRequest) {
  const authResult = await requirePermission(request, 'social_media_accounts', 'read');
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');

    let sql = `
      SELECT 
        id, 
        platform, 
        account_name, 
        account_username, 
        page_id,
        account_id,
        status, 
        last_posted_at,
        created_at,
        updated_at
      FROM social_media_accounts
      WHERE 1=1
    `;
    const params: any[] = [];

    if (platform) {
      sql += ' AND platform = ?';
      params.push(platform);
    }

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const accounts = await query(sql, params);

    return NextResponse.json({ accounts });
  } catch (error: any) {
    console.error('Error fetching social media accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

// POST - Add new social media account
export async function POST(request: NextRequest) {
  const authResult = await requirePermission(request, 'social_media_accounts', 'create');
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const data = await request.json();
    const {
      platform,
      account_name,
      account_username,
      access_token,
      refresh_token,
      token_expires_at,
      page_id,
      account_id,
      metadata
    } = data;

    if (!platform || !account_name) {
      return NextResponse.json(
        { error: 'Platform and account name are required' },
        { status: 400 }
      );
    }

    // Check if account already exists
    const existing = await query<any[]>(
      'SELECT id FROM social_media_accounts WHERE platform = ? AND account_id = ?',
      [platform, account_id]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'This account is already connected' },
        { status: 400 }
      );
    }

    const result = await query<any>(
      `INSERT INTO social_media_accounts 
       (platform, account_name, account_username, access_token, refresh_token, 
        token_expires_at, page_id, account_id, metadata, created_by, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        platform,
        account_name,
        account_username || null,
        access_token || null,
        refresh_token || null,
        token_expires_at || null,
        page_id || null,
        account_id || `${platform}_${Date.now()}`,
        metadata ? JSON.stringify(metadata) : null,
        user.id,
      ]
    );

    const accountId = (result as any).insertId;

    // Log activity
    await logActivity(
      user.id,
      'social_media_account_created',
      'social_media_accounts',
      accountId,
      { platform, account_name }
    );

    const newAccount = await query<any[]>(
      'SELECT * FROM social_media_accounts WHERE id = ?',
      [accountId]
    );

    return NextResponse.json(
      { message: 'Account connected successfully', account: newAccount[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating social media account:', error);
    return NextResponse.json(
      { error: 'Failed to connect account' },
      { status: 500 }
    );
  }
}
