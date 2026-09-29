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
  hasCredential: boolean;
  caption: string;
  linkUrl: string;
  mediaPath: string;
};

export type PublishResult =
  | { ok: true; externalId: string }
  | { ok: false; error: string };

const LIVE_API: Record<SocialPlatform, boolean> = {
  facebook: false,
  instagram: false,
  linkedin: false,
  youtube: false,
  threads: false,
};

export function publishToPlatform(input: PublishInput): PublishResult {
  if (input.accountStatus !== "CONNECTED" || !input.hasCredential) {
    return {
      ok: false,
      error: `${label(input.platform)} is not connected. Use Connect account when API credentials are available. This post was not published.`,
    };
  }
  if (!LIVE_API[input.platform]) {
    return {
      ok: false,
      error: `${label(input.platform)} credentials are stored, but a live publishing API is not configured. The post was not published.`,
    };
  }
  return {
    ok: false,
    error: "Publishing adapter returned no confirmation.",
  };
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
