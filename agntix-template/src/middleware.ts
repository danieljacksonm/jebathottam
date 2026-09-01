import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { BUSINESS } from "@/lib/contact";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const canonicalHost = BUSINESS.domain;

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";

  if (host === `www.${canonicalHost}` || host === "canaan.yegova.store") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = canonicalHost;
    return NextResponse.redirect(url, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|ta|hi)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
