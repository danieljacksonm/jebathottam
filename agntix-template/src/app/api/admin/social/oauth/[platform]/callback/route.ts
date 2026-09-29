import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { denyUnlessRole } from "@/lib/admin-guard";
import { SITE_URL } from "@/lib/seo";
import {
  OAUTH_APPS,
  OAUTH_STATE_COOKIE,
  isOauthPlatform,
  oauthConfigured,
  oauthRedirectUri,
  saveConnectedAccount,
  statesMatch,
} from "@/lib/social/connect";

type Params = { params: Promise<{ platform: string }> };

function finish(path: string) {
  const response = NextResponse.redirect(new URL(path, SITE_URL));
  response.cookies.set(OAUTH_STATE_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}

async function facebookPages(code: string) {
  const redirectUri = oauthRedirectUri("facebook");
  const tokenUrl = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
  tokenUrl.searchParams.set("client_id", process.env.FACEBOOK_APP_ID ?? "");
  tokenUrl.searchParams.set("client_secret", process.env.FACEBOOK_APP_SECRET ?? "");
  tokenUrl.searchParams.set("redirect_uri", redirectUri);
  tokenUrl.searchParams.set("code", code);
  const tokenResponse = await fetch(tokenUrl);
  const tokenPayload = (await tokenResponse.json().catch(() => ({}))) as {
    access_token?: string;
    error?: { message?: string };
  };
  if (!tokenResponse.ok || !tokenPayload.access_token) {
    throw new Error(tokenPayload.error?.message || "Facebook did not return a token.");
  }
  const pagesUrl = new URL("https://graph.facebook.com/v21.0/me/accounts");
  pagesUrl.searchParams.set("access_token", tokenPayload.access_token);
  const pagesResponse = await fetch(pagesUrl);
  const pagesPayload = (await pagesResponse.json().catch(() => ({}))) as {
    data?: { id?: string; name?: string; access_token?: string }[];
    error?: { message?: string };
  };
  const pages = (pagesPayload.data ?? []).filter(
    (page) => page.id && page.name && page.access_token,
  );
  if (!pagesResponse.ok || pages.length === 0) {
    throw new Error(
      pagesPayload.error?.message ||
        "Facebook returned no Page. The login can manage a Page before it is connected.",
    );
  }
  for (const page of pages) {
    await saveConnectedAccount({
      platform: "facebook",
      accountName: page.name || "Facebook Page",
      externalId: page.id || "",
      token: page.access_token || "",
      permissions: "pages_manage_posts",
    });
    const igUrl = new URL(`https://graph.facebook.com/v21.0/${page.id}`);
    igUrl.searchParams.set("fields", "instagram_business_account{id,username}");
    igUrl.searchParams.set("access_token", page.access_token || "");
    const igResponse = await fetch(igUrl);
    const igPayload = (await igResponse.json().catch(() => ({}))) as {
      instagram_business_account?: { id?: string; username?: string };
    };
    const instagram = igPayload.instagram_business_account;
    if (igResponse.ok && instagram?.id) {
      await saveConnectedAccount({
        platform: "instagram",
        accountName: instagram.username || "Instagram",
        externalId: instagram.id,
        token: page.access_token || "",
        permissions: "instagram_content_publish",
      });
    }
  }
}

async function youTubeChannel(code: string) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: oauthRedirectUri("youtube"),
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  });
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const tokenPayload = (await tokenResponse.json().catch(() => ({}))) as {
    access_token?: string;
    error_description?: string;
  };
  if (!tokenResponse.ok || !tokenPayload.access_token) {
    throw new Error(tokenPayload.error_description || "Google did not return a token.");
  }
  const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
  channelUrl.searchParams.set("part", "snippet");
  channelUrl.searchParams.set("mine", "true");
  const channelResponse = await fetch(channelUrl, {
    headers: { Authorization: `Bearer ${tokenPayload.access_token}` },
  });
  const channelPayload = (await channelResponse.json().catch(() => ({}))) as {
    items?: { id?: string; snippet?: { title?: string } }[];
    error?: { message?: string };
  };
  const channel = channelPayload.items?.[0];
  if (!channelResponse.ok || !channel?.id) {
    throw new Error(channelPayload.error?.message || "YouTube did not return a channel.");
  }
  await saveConnectedAccount({
    platform: "youtube",
    accountName: channel.snippet?.title || "YouTube channel",
    externalId: channel.id,
    token: tokenPayload.access_token,
    permissions: "youtube.readonly",
  });
}

async function linkedInMember(code: string) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: oauthRedirectUri("linkedin"),
    client_id: process.env.LINKEDIN_CLIENT_ID ?? "",
    client_secret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
  });
  const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const tokenPayload = (await tokenResponse.json().catch(() => ({}))) as {
    access_token?: string;
    error_description?: string;
  };
  if (!tokenResponse.ok || !tokenPayload.access_token) {
    throw new Error(tokenPayload.error_description || "LinkedIn did not return a token.");
  }
  const profileResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenPayload.access_token}` },
  });
  const profile = (await profileResponse.json().catch(() => ({}))) as {
    sub?: string;
    name?: string;
    message?: string;
  };
  if (!profileResponse.ok || !profile.sub) {
    throw new Error(profile.message || "LinkedIn did not return a member id.");
  }
  await saveConnectedAccount({
    platform: "linkedin",
    accountName: profile.name || "LinkedIn member",
    externalId: `urn:li:person:${profile.sub}`,
    token: tokenPayload.access_token,
    permissions: "w_member_social",
  });
}

export async function GET(request: Request, { params }: Params) {
  const denied = await denyUnlessRole(["ADMIN", "MARKETING"]);
  if (denied) return denied;
  const { platform } = await params;
  if (!isOauthPlatform(platform) || !oauthConfigured(platform)) {
    return finish("/admin/connections?error=not-configured");
  }
  const url = new URL(request.url);
  const code = url.searchParams.get("code") ?? "";
  const state = url.searchParams.get("state") ?? "";
  const jar = await cookies();
  const cookie = jar.get(OAUTH_STATE_COOKIE)?.value ?? "";
  if (!code || !statesMatch(state, cookie)) {
    return finish("/admin/connections?error=state-mismatch");
  }
  if (!process.env[OAUTH_APPS[platform].secretEnv]) {
    return finish("/admin/connections?error=not-configured");
  }
  try {
    if (platform === "facebook") await facebookPages(code);
    else if (platform === "linkedin") await linkedInMember(code);
    else await youTubeChannel(code);
  } catch (error) {
    const message = error instanceof Error ? error.message : "OAuth failed";
    return finish(`/admin/connections?error=${encodeURIComponent(message.slice(0, 180))}`);
  }
  return finish(`/admin/connections?connected=${platform}`);
}
