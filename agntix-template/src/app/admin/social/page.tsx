import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { SocialAccountForm, SocialComposer } from "@/components/admin/SocialDesk";

export const dynamic = "force-dynamic";

export default async function SocialPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; view?: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const query = await searchParams;
  const status = query.status || "";
  const [posts, accounts, campaigns] = await Promise.all([
    prisma.socialPost.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
      take: 80,
      include: { campaign: true, variants: true },
    }),
    prisma.socialAccount.findMany({ orderBy: { platform: "asc" } }),
    prisma.socialCampaign.findMany({
      include: { posts: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      <h1>Social media</h1>
      <p className="admin-muted">
        Drafts and schedules stay in Canaan. Analytics appear only after a platform API is connected. Nothing here invents reach or likes. Setup steps are on{" "}
        <Link href="/admin/connections">Connections</Link>.
      </p>
      <div className="admin-actions">
        {["", "DRAFT", "SCHEDULED", "PUBLISHED", "FAILED", "CANCELLED"].map((item) => (
          <Link key={item || "all"} href={item ? `/admin/social?status=${item}` : "/admin/social"}>
            {item || "All"}
          </Link>
        ))}
        <Link href="/admin/social?view=calendar">Calendar</Link>
      </div>
      {query.view === "calendar" ? (
        <section className="admin-card">
          <h2>Scheduled and published</h2>
          <ul>
            {posts
              .filter((post) => post.scheduledFor || post.publishedAt)
              .map((post) => (
                <li key={post.id}>
                  {post.scheduledFor || post.publishedAt?.toISOString().slice(0, 10)} ·{" "}
                  <Link href={`/admin/social/${post.id}`}>{post.title}</Link> · {post.status}
                </li>
              ))}
          </ul>
        </section>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Platforms</th>
              <th>Campaign</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <Link href={`/admin/social/${post.id}`}>{post.title}</Link>
                  {post.lastError ? <div className="admin-error">{post.lastError}</div> : null}
                </td>
                <td>{post.status}</td>
                <td>{post.variants.map((variant) => variant.platform).join(", ")}</td>
                <td>{post.campaign?.name || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="admin-grid-2" style={{ marginTop: "1rem" }}>
        <SocialComposer />
        <div>
          <SocialAccountForm />
          <section className="admin-card" style={{ marginTop: "1rem" }}>
            <h2>Accounts</h2>
            {accounts.length === 0 ? (
              <p>No accounts yet. Connect an account to view analytics.</p>
            ) : (
              <ul>
                {accounts.map((account) => (
                  <li key={account.id}>
                    {account.platform} · {account.accountName} · {account.status}
                    {account.status !== "CONNECTED" ? " — Connect account to view analytics." : null}
                  </li>
                ))}
              </ul>
            )}
            <h2>Campaigns</h2>
            <ul>
              {campaigns.map((campaign) => (
                <li key={campaign.id}>
                  {campaign.name} · {campaign.posts.length} posts ·{" "}
                  {campaign.posts.filter((post) => post.status === "SCHEDULED").length} scheduled ·{" "}
                  {campaign.posts.filter((post) => post.status === "PUBLISHED").length} published
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
