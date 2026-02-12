import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { logActivity } from '@/lib/permissions';

// GET - Get single account
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requirePermission(request, 'social_media_accounts', 'read');
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const accounts = await query<any[]>(
      'SELECT * FROM social_media_accounts WHERE id = ?',
      [params.id]
    );

    if (accounts.length === 0) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ account: accounts[0] });
  } catch (error: any) {
    console.error('Error fetching account:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account' },
      { status: 500 }
    );
  }
}

// PUT - Update account
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requirePermission(request, 'social_media_accounts', 'update');
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const data = await request.json();
    const {
      account_name,
      account_username,
      access_token,
      refresh_token,
      token_expires_at,
      page_id,
      status,
      metadata
    } = data;

    const updates: string[] = [];
    const values: any[] = [];

    if (account_name !== undefined) {
      updates.push('account_name = ?');
      values.push(account_name);
    }
    if (account_username !== undefined) {
      updates.push('account_username = ?');
      values.push(account_username);
    }
    if (access_token !== undefined) {
      updates.push('access_token = ?');
      values.push(access_token);
    }
    if (refresh_token !== undefined) {
      updates.push('refresh_token = ?');
      values.push(refresh_token);
    }
    if (token_expires_at !== undefined) {
      updates.push('token_expires_at = ?');
      values.push(token_expires_at);
    }
    if (page_id !== undefined) {
      updates.push('page_id = ?');
      values.push(page_id);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (metadata !== undefined) {
      updates.push('metadata = ?');
      values.push(JSON.stringify(metadata));
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(params.id);

    await query(
      `UPDATE social_media_accounts SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Log activity
    await logActivity(
      user.id,
      'social_media_account_updated',
      'social_media_accounts',
      parseInt(params.id),
      { updated_fields: Object.keys(data) }
    );

    const updated = await query<any[]>(
      'SELECT * FROM social_media_accounts WHERE id = ?',
      [params.id]
    );

    return NextResponse.json({
      message: 'Account updated successfully',
      account: updated[0],
    });
  } catch (error: any) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { error: 'Failed to update account' },
      { status: 500 }
    );
  }
}

// DELETE - Delete account
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requirePermission(request, 'social_media_accounts', 'delete');
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const accounts = await query<any[]>(
      'SELECT * FROM social_media_accounts WHERE id = ?',
      [params.id]
    );

    if (accounts.length === 0) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    await query('DELETE FROM social_media_accounts WHERE id = ?', [params.id]);

    // Log activity
    await logActivity(
      user.id,
      'social_media_account_deleted',
      'social_media_accounts',
      parseInt(params.id),
      { account_name: accounts[0].account_name, platform: accounts[0].platform }
    );

    return NextResponse.json({
      message: 'Account disconnected successfully',
    });
  } catch (error: any) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    );
  }
}
