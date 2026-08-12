import nodemailer from 'nodemailer';

const CONTACT_TO = process.env.CONTACT_TO || 'anselmajohn2020@gmail.com';

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number.isNaN(port) ? 587 : port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export type ContactMailPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
};

export async function sendContactEmail(payload: ContactMailPayload): Promise<{ sent: boolean; reason?: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('SMTP not configured (SMTP_HOST / SMTP_USER / SMTP_PASS). Skipping email send.');
    return { sent: false, reason: 'smtp_not_configured' };
  }

  const subjectLine = payload.subject?.trim() || 'General Inquiry';
  const to = CONTACT_TO;

  await transporter.sendMail({
    from: process.env.CONTACT_FROM || process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    replyTo: payload.email,
    subject: `[Contact] ${subjectLine} — ${payload.firstName} ${payload.lastName}`,
    text: [
      `Name: ${payload.firstName} ${payload.lastName}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone || '—'}`,
      `Subject: ${subjectLine}`,
      '',
      payload.message,
    ].join('\n'),
    html: `
      <h2>New contact message</h2>
      <p><strong>Name:</strong> ${escapeHtml(payload.firstName)} ${escapeHtml(payload.lastName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(payload.phone || '—')}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subjectLine)}</p>
      <hr />
      <p>${escapeHtml(payload.message).replace(/\n/g, '<br/>')}</p>
    `,
  });

  return { sent: true };
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
