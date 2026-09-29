import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { SocialPostActions } from "@/components/admin/SocialDesk";

export const dynamic = "force-dynamic";

export default async function SocialPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { id } = await params;
  const post = await prisma.socialPost.findUnique({
    where: { id },
    include: { variants: true, campaign: true },
  });
  if (!post) notFound();
  return (
    <div>
      <p className="admin-muted">
        <Link href="/admin/social">Social media</Link>
      </p>
      <h1>{post.title}</h1>
      <p>
        {post.status}
        {post.scheduledFor ? ` · scheduled ${post.scheduledFor}` : ""}
        {post.campaign ? ` · ${post.campaign.name}` : ""}
      </p>
      {post.lastError ? <p className="admin-error">{post.lastError}</p> : null}
      <p>{post.masterCaption}</p>
      {post.linkUrl ? <p>{post.linkUrl}</p> : null}
      <SocialPostActions
        id={post.id}
        variants={post.variants.map((variant) => ({
          platform: variant.platform,
          caption: variant.caption,
          hashtags: variant.hashtags,
        }))}
      />
    </div>
  );
}
