import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

const TABLE_CREATED_KEY = '__chat_table_created';
let tableCreated = false;

async function ensureTable() {
  if (tableCreated) return;
  await query(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      chat_id VARCHAR(64) NOT NULL,
      text TEXT NOT NULL,
      sender ENUM('user','admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_chat_id (chat_id)
    )
  `);
  tableCreated = true;
}

export async function GET(request: NextRequest) {
  try {
    await ensureTable();

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');

    if (!chatId) {
      return NextResponse.json(
        { error: 'chatId is required' },
        { status: 400 }
      );
    }

    const messages = await query<any[]>(
      'SELECT id, chat_id, text, sender, created_at FROM chat_messages WHERE chat_id = ? ORDER BY created_at ASC LIMIT 50',
      [chatId]
    );

    return NextResponse.json({ data: messages });
  } catch (error: any) {
    console.error('Get chat messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTable();

    const { chatId, text } = await request.json();

    if (!chatId || !text) {
      return NextResponse.json(
        { error: 'chatId and text are required' },
        { status: 400 }
      );
    }

    const user = await getUserFromRequest(request);
    const isAdmin = user?.role === 'super_admin' || user?.role === 'media_team';
    const validSender = isAdmin ? 'admin' : 'user';

    const result = await query<any>(
      'INSERT INTO chat_messages (chat_id, text, sender) VALUES (?, ?, ?)',
      [chatId, text, validSender]
    );

    const insertId = result.insertId;
    const rows = await query<any[]>(
      'SELECT id, chat_id, text, sender, created_at FROM chat_messages WHERE id = ?',
      [insertId]
    );

    return NextResponse.json({ data: rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create chat message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
