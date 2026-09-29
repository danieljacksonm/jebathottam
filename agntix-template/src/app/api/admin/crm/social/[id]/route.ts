import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyUnlessAdmin } from "@/lib/admin-guard";
import { publishToPlatform, type SocialPlatform } from "@/lib/social/providers";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = (await request.json()) as {
    action?: string;
    scheduledFor?: string;
    title?: string;
    masterCaption?: string;
    variants?: { platform: string; caption: string; hashtags: string }[];
  };
  const post = await prisma.socialPost.findUnique({
    where: { id },
    include: { variants: true },
  });
  if (!post) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  if (body.action === "cancel") {
    await prisma.socialPost.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
    return NextResponse.json({ ok: true, status: "CANCELLED" });
  }

  if (body.variants) {
    for (const variant of body.variants) {
      await prisma.socialPostVariant.updateMany({
        where: { postId: id, platform: variant.platform },
        data: {
          caption: variant.caption.slice(0, 4000),
          hashtags: variant.hashtags.slice(0, 400),
        },
      });
    }
  }

  if (body.title || body.masterCaption || body.scheduledFor !== undefined) {
    await prisma.socialPost.update({
      where: { id },
      data: {
        title: body.title?.slice(0, 160) || post.title,
        masterCaption: body.masterCaption?.slice(0, 4000) ?? post.masterCaption,
        scheduledFor: body.scheduledFor?.slice(0, 40) ?? post.scheduledFor,
        status:
          body.scheduledFor && post.status === "DRAFT" ? "SCHEDULED" : post.status,
      },
    });
  }

  if (body.action !== "publish") {
    return NextResponse.json({ ok: true });
  }

  await prisma.socialPost.update({
    where: { id },
    data: { status: "PUBLISHING", lastError: "" },
  });

  const accounts = await prisma.socialAccount.findMany();
  const errors: string[] = [];
  for (const variant of post.variants) {
    const account = accounts.find((item) => item.platform === variant.platform);
    const result = publishToPlatform({
      platform: variant.platform as SocialPlatform,
      accountName: account?.accountName || variant.platform,
      accountStatus: account?.status || "NOT_CONNECTED",
      hasCredential: Boolean(account?.tokenCipher),
      caption: variant.caption,
      linkUrl: post.linkUrl,
      mediaPath: post.mediaPath,
    });
    if (!result.ok) {
      errors.push(result.error);
      await prisma.socialPostVariant.update({
        where: { id: variant.id },
        data: { status: "FAILED", lastError: result.error },
      });
    }
  }

  const failed = errors.length > 0;
  await prisma.socialPost.update({
    where: { id },
    data: {
      status: failed ? "FAILED" : "PUBLISHED",
      lastError: errors.join(" "),
      publishedAt: failed ? null : new Date(),
    },
  });

  return NextResponse.json({
    ok: !failed,
    status: failed ? "FAILED" : "PUBLISHED",
    error: errors.join(" "),
  });
}
