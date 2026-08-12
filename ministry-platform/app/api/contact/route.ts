import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendContactEmail } from '@/lib/mail';

let tableCreated = false;

async function ensureTable() {
  if (tableCreated) return;
  await query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      subject VARCHAR(255),
      message TEXT NOT NULL,
      status ENUM('new', 'read', 'replied') DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_status (status),
      INDEX idx_created_at (created_at)
    )
  `);
  tableCreated = true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, subject, message, website } = body;

    // Honeypot: bots fill "website"; humans leave it empty → fake success
    if (typeof website === 'string' && website.trim() !== '') {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    await ensureTable();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'First name, last name, email, and message are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const result = await query<any>(
      `INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, phone || null, subject || 'General Inquiry', message]
    );

    try {
      await sendContactEmail({
        firstName,
        lastName,
        email,
        phone,
        subject,
        message,
      });
    } catch (mailErr) {
      console.error('Contact email send failed:', mailErr);
      // Message is saved; still return success so user is not blocked
    }

    return NextResponse.json(
      { success: true, id: (result as { insertId: number }).insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
