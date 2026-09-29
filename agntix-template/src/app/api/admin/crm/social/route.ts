import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyUnlessRole } from "@/lib/admin-guard";
import { SOCIAL_PLATFORMS, adaptCaption } from "@/lib/social/providers";
import { localImageSize } from "@/lib/image-size";

export async function POST(request: Request) {
  const denied = await denyUnlessRole(["ADMIN", "MARKETING"]);
  if (denied) return denied;
  const body = (await request.json()) as Record<string, unknown>;
  const title = String(body.title || "").trim();
  if (!title) {
    return NextResponse.json({ ok: false, error: "Title is required" }, { status: 400 });
  }
  const platforms = Array.isArray(body.platforms)
    ? body.platforms.map(String).filter((item) =>
        SOCIAL_PLATFORMS.includes(item as (typeof SOCIAL_PLATFORMS)[number]),
      )
    : ["facebook"];
  const mediaPath = String(body.mediaPath || "");
  if (mediaPath.startsWith("/")) {
    try {
      const size = await localImageSize(mediaPath);
      if (size && (size.width < 600 || size.height < 600)) {
        return NextResponse.json(
          {
            ok: false,
            error: `Image is ${size.width}×${size.height}. Social posts need at least 600×600 so the crop is not stretched from a weak file.`,
          },
          { status: 400 },
        );
      }
    } catch {
      return NextResponse.json(
        { ok: false, error: "Selected image could not be read from the site media folder." },
        { status: 400 },
      );
    }
  }

  const master = String(body.masterCaption || "");
  const linkUrl = String(body.linkUrl || "").slice(0, 400);
  let campaignId: string | null = null;
  const campaignName = String(body.campaignName || "").trim();
  if (campaignName) {
    const campaign = await prisma.socialCampaign.create({
      data: { name: campaignName.slice(0, 120) },
    });
    campaignId = campaign.id;
  } else if (body.campaignId) {
    campaignId = String(body.campaignId);
  }

  const post = await prisma.socialPost.create({
    data: {
      title: title.slice(0, 160),
      masterCaption: master.slice(0, 4000),
      language: String(body.language || "en").slice(0, 8),
      linkUrl,
      location: String(body.location || "").slice(0, 120),
      callToAction: String(body.callToAction || "").slice(0, 120),
      mediaPath: mediaPath.slice(0, 300),
      relatedType: String(body.relatedType || "").slice(0, 40),
      relatedSlug: String(body.relatedSlug || "").slice(0, 160),
      scheduledFor: String(body.scheduledFor || "").slice(0, 40),
      status: body.scheduledFor ? "SCHEDULED" : "DRAFT",
      campaignId,
      variants: {
        create: platforms.map((platform) => ({
          platform,
          caption: adaptCaption(platform, master, linkUrl).slice(0, 4000),
          hashtags: String(body.hashtags || "").slice(0, 400),
          status: "DRAFT",
        })),
      },
    },
  });
  return NextResponse.json({ ok: true, id: post.id });
}
