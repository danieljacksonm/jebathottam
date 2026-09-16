import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    // Architecture ready for ESP integration (Mailchimp, Resend, etc.)
    // Do not pretend the email was synced to an external provider.
    return Response.json({
      message: "Thanks — your email was accepted. Connect an email provider to sync subscribers.",
      email: parsed.data.email,
    });
  } catch {
    return Response.json({ error: "Signup failed" }, { status: 500 });
  }
}
