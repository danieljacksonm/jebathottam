import nodemailer from "nodemailer";
import { BUSINESS } from "@/lib/contact";

export type EnquiryMailPayload = {
  id: string;
  receivedAt: string;
  name: string;
  email: string;
  phone: string;
  travelers: string | null;
  dates: string | null;
  packageId: string | null;
  message: string | null;
  locale: string;
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number.isNaN(port) ? 587 : port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendEnquiryNotification(
  payload: EnquiryMailPayload,
): Promise<{ sent: boolean; reason?: string }> {
  const transporter = getTransporter();
  const to = process.env.ENQUIRY_NOTIFY_EMAIL || BUSINESS.email;

  if (!transporter) {
    console.warn(
      "SMTP not configured (SMTP_HOST / SMTP_USER / SMTP_PASS). Enquiry saved without email.",
    );
    return { sent: false, reason: "smtp_not_configured" };
  }

  const from =
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    `Canaan Travel Hub <${BUSINESS.email}>`;

  const subject = `[Canaan] New enquiry — ${payload.name}`;
  const text = [
    "New enquiry on canaantravelhub.com",
    "",
    `ID: ${payload.id}`,
    `Received: ${payload.receivedAt}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Travellers: ${payload.travelers || "—"}`,
    `Dates: ${payload.dates || "—"}`,
    `Package: ${payload.packageId || "—"}`,
    `Locale: ${payload.locale}`,
    "",
    payload.message || "(no message)",
  ].join("\n");

  const html = `
    <h2>New Canaan Travel Hub enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
    <p><strong>Travellers:</strong> ${escapeHtml(payload.travelers || "—")}</p>
    <p><strong>Dates:</strong> ${escapeHtml(payload.dates || "—")}</p>
    <p><strong>Package:</strong> ${escapeHtml(payload.packageId || "—")}</p>
    <p><strong>Locale:</strong> ${escapeHtml(payload.locale)}</p>
    <hr />
    <p>${escapeHtml(payload.message || "(no message)").replace(/\n/g, "<br/>")}</p>
    <p style="color:#666;font-size:12px;">ID ${escapeHtml(payload.id)} · ${escapeHtml(payload.receivedAt)}</p>
  `;

  await transporter.sendMail({
    from,
    to,
    replyTo: payload.email,
    subject,
    text,
    html,
  });

  return { sent: true };
}
