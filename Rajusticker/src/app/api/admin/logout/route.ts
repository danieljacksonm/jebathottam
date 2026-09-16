import { STAFF_COOKIE } from "@/lib/admin-auth";

export async function POST() {
  const response = Response.json({ ok: true });
  response.headers.set("Set-Cookie", `${STAFF_COOKIE}=; Path=/; HttpOnly; Max-Age=0`);
  return response;
}
