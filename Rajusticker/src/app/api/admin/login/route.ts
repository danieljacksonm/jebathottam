import { passwordMatches, staffCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  if (!body?.password || !passwordMatches(body.password)) {
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }
  const cookie = staffCookie();
  const response = Response.json({ ok: true });
  response.headers.set(
    "Set-Cookie",
    `${cookie.name}=${cookie.value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${cookie.options.maxAge}${
      cookie.options.secure ? "; Secure" : ""
    }`,
  );
  return response;
}
