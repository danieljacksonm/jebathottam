import { SITE_URL } from "@/lib/seo";

export const SOCIAL_PLATFORMS = [
  "facebook",
  "instagram",
  "linkedin",
  "youtube",
  "threads",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export type PublishInput = {
  platform: SocialPlatform;
  accountName: string;
  accountStatus: string;
  externalId: string;
  accessToken: string;
  caption: string;
  linkUrl: string;
  mediaPath: string;
};

export type PublishResult =
  | { ok: true; externalId: string }
  | { ok: false; error: string };

export async function publishToPlatform(input: PublishInput): Promise<PublishResult> {
  if (input.accountStatus !== "CONNECTED" || !input.accessToken) {
    return {
      ok: false,
      error: `${label(input.platform)} is not connected. This post was not published.`,
    };
  }
  if (input.platform === "youtube") {
    return {
      ok: false,
      error: "YouTube publishing needs a video file. Export the title and description and upload in YouTube Studio. This post was not published.",
    };
  }
  try {
    if (input.platform === "facebook") return publishFacebook(input);
    if (input.platform === "instagram") return publishInstagram(input);
    if (input.platform === "linkedin") return publishLinkedIn(input);
    if (input.platform === "threads") return publishThreads(input);
    return {
      ok: false,
      error: `${label(input.platform)} did not return a publish confirmation. The post was not marked published.`,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "The network request failed. The post was not published.",
    };
  }
}

function graphError(payload: { error?: { message?: string } }, fallback: string) {
  return payload.error?.message || fallback;
}

async function publishFacebook(input: PublishInput): Promise<PublishResult> {
  if (!input.externalId) {
    return { ok: false, error: "Facebook Page ID is missing. This post was not published." };
  }
  const body = new URLSearchParams({
    message: input.caption,
    access_token: input.accessToken,
  });
  if (input.linkUrl) body.set("link", input.linkUrl);
  const response = await fetch(
    `https://graph.facebook.com/v21.0/${encodeURIComponent(input.externalId)}/feed`,
    { method: "POST", body },
  );
  const payload = (await response.json().catch(() => ({}))) as {
    id?: string;
    error?: { message?: string };
  };
  if (!response.ok || !payload.id) {
    return { ok: false, error: graphError(payload, "Facebook did not confirm the post.") };
  }
  return { ok: true, externalId: payload.id };
}

function publicMediaUrl(input: PublishInput) {
  if (input.mediaPath.startsWith("http://") || input.mediaPath.startsWith("https://")) {
    return input.mediaPath;
  }
  if (input.mediaPath.startsWith("/")) return `${SITE_URL}${input.mediaPath}`;
  return "";
}

async function publishInstagram(input: PublishInput): Promise<PublishResult> {
  if (!input.externalId) {
    return { ok: false, error: "Instagram account ID is missing. This post was not published." };
  }
  const imageUrl = publicMediaUrl(input);
  if (!imageUrl.startsWith("https://")) {
    return {
      ok: false,
      error: "Instagram needs a public https image. This post was not published.",
    };
  }
  const createBody = new URLSearchParams({
    image_url: imageUrl,
    caption: input.caption,
    access_token: input.accessToken,
  });
  const created = await fetch(
    `https://graph.facebook.com/v21.0/${encodeURIComponent(input.externalId)}/media`,
    { method: "POST", body: createBody },
  );
  const createdPayload = (await created.json().catch(() => ({}))) as {
    id?: string;
    error?: { message?: string };
  };
  if (!created.ok || !createdPayload.id) {
    return { ok: false, error: graphError(createdPayload, "Instagram did not accept the image.") };
  }
  const publishBody = new URLSearchParams({
    creation_id: createdPayload.id,
    access_token: input.accessToken,
  });
  const published = await fetch(
    `https://graph.facebook.com/v21.0/${encodeURIComponent(input.externalId)}/media_publish`,
    { method: "POST", body: publishBody },
  );
  const publishedPayload = (await published.json().catch(() => ({}))) as {
    id?: string;
    error?: { message?: string };
  };
  if (!published.ok || !publishedPayload.id) {
    return { ok: false, error: graphError(publishedPayload, "Instagram did not confirm the post.") };
  }
  return { ok: true, externalId: publishedPayload.id };
}

async function publishLinkedIn(input: PublishInput): Promise<PublishResult> {
  const author = input.externalId.startsWith("urn:li:")
    ? input.externalId
    : input.externalId
      ? `urn:li:person:${input.externalId}`
      : "";
  if (!author) {
    return { ok: false, error: "LinkedIn member ID is missing. This post was not published." };
  }
  const response = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202401",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author,
      commentary: input.caption,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });
  const payload = (await response.json().catch(() => ({}))) as {
    message?: string;
    error?: { message?: string };
  };
  const postId = response.headers.get("x-restli-id") || "";
  if (!response.ok || !postId) {
    return {
      ok: false,
      error: payload.message || payload.error?.message || "LinkedIn did not confirm the post.",
    };
  }
  return { ok: true, externalId: postId };
}

async function publishThreads(input: PublishInput): Promise<PublishResult> {
  if (!input.externalId) {
    return { ok: false, error: "Threads user ID is missing. This post was not published." };
  }
  const createBody = new URLSearchParams({
    media_type: "TEXT",
    text: input.caption,
    access_token: input.accessToken,
  });
  const created = await fetch(
    `https://graph.threads.net/v1.0/${encodeURIComponent(input.externalId)}/threads`,
    { method: "POST", body: createBody },
  );
  const createdPayload = (await created.json().catch(() => ({}))) as {
    id?: string;
    error?: { message?: string };
  };
  if (!created.ok || !createdPayload.id) {
    return { ok: false, error: graphError(createdPayload, "Threads did not accept the text.") };
  }
  const publishBody = new URLSearchParams({
    creation_id: createdPayload.id,
    access_token: input.accessToken,
  });
  const published = await fetch(
    `https://graph.threads.net/v1.0/${encodeURIComponent(input.externalId)}/threads_publish`,
    { method: "POST", body: publishBody },
  );
  const publishedPayload = (await published.json().catch(() => ({}))) as {
    id?: string;
    error?: { message?: string };
  };
  if (!published.ok || !publishedPayload.id) {
    return { ok: false, error: graphError(publishedPayload, "Threads did not confirm the post.") };
  }
  return { ok: true, externalId: publishedPayload.id };
}

export function label(platform: string) {
  if (platform === "youtube") return "YouTube";
  if (platform === "linkedin") return "LinkedIn";
  return platform.slice(0, 1).toUpperCase() + platform.slice(1);
}

export function adaptCaption(platform: string, master: string, link: string) {
  const text = master.trim();
  const url = link.trim();
  if (platform === "instagram") {
    return [text, url].filter(Boolean).join("\n\n");
  }
  if (platform === "linkedin") {
    return [
      text,
      url ? `Read more: ${url}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  }
  if (platform === "youtube") {
    return [text, url ? `Link: ${url}` : ""].filter(Boolean).join("\n\n");
  }
  if (platform === "facebook") {
    return [text, url].filter(Boolean).join("\n\n");
  }
  return [text, url].filter(Boolean).join("\n\n");
}
