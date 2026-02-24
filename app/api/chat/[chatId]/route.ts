import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;

    if (!chatId) {
      return NextResponse.json(
        { error: 'chatId is required' },
        { status: 400 }
      );
    }

    const messages = await query<any[]>(
      'SELECT id, chat_id, text, sender, created_at FROM chat_messages WHERE chat_id = ? ORDER BY created_at ASC',
      [chatId]
    );

    return NextResponse.json({ data: messages });
  } catch (error: any) {
    console.error('Get chat messages by id error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
