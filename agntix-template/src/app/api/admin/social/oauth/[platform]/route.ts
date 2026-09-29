import { NextResponse } from "next/server";
import { denyUnlessRole } from "@/lib/admin-guard";
import { SITE_URL } from "@/lib/seo";
import {
  OAUTH_APPS,
  OAUTH_STATE_COOKIE,
  isOauthPlatform,
  newOauthState,
  oauthConfigured,
  oauthRedirectUri,
} from "@/lib/social/connect";

type Params = { params: Promise<{ platform: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await denyUnlessRole(["ADMIN", "MARKETING"]);
  if (denied) return denied;
  const { platform } = await params;
  if (!isOauthPlatform(platform) || !oauthConfigured(platform)) {
    return NextResponse.redirect(
      new URL(`/admin/connections?error=${platform}-not-configured`, SITE_URL),
    );
  }
  const state = newOauthState();
  const appId = process.env[OAUTH_APPS[platform].idEnv] ?? "";
  const redirectUri = oauthRedirectUri(platform);
  const authUrl =
    platform === "facebook"
      ? new URL("https://www.facebook.com/v21.0/dialog/oauth")
      : platform === "linkedin"
        ? new URL("https://www.linkedin.com/oauth/v2/authorization")
        : new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", appId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);
  if (platform === "facebook") {
    authUrl.searchParams.set(
      "scope",
      "pages_show_list,pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish",
    );
  } else if (platform === "linkedin") {
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "openid profile w_member_social");
  } else {
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/youtube.readonly");
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
  }
  const response = NextResponse.redirect(authUrl);
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  return response;
}
