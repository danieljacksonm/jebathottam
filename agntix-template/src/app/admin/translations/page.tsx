import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function missing(value: string, english: string) {
  const text = value.trim();
  return !text || text === english.trim();
}

export default async function TranslationsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const [destinations, packages, blogs] = await Promise.all([
    prisma.destination.findMany({
      select: {
        slug: true,
        nameEn: true,
        nameTa: true,
        nameHi: true,
        taglineTa: true,
        taglineHi: true,
        taglineEn: true,
        bodyTa: true,
        bodyHi: true,
        bodyEn: true,
      },
      orderBy: { nameEn: "asc" },
    }),
    prisma.travelPackage.findMany({
      select: { slug: true, titleJson: true, blurbJson: true, seoTitleEn: true },
      orderBy: { slug: "asc" },
    }),
    prisma.$queryRaw<
      { missingTa: number; missingHi: number; total: number }[]
    >`SELECT
        SUM(CASE WHEN titleTa = '' OR titleTa = titleEn THEN 1 ELSE 0 END) AS missingTa,
        SUM(CASE WHEN titleHi = '' OR titleHi = titleEn THEN 1 ELSE 0 END) AS missingHi,
        COUNT(*) AS total
      FROM BlogPost`,
  ]);

  const packageGaps = packages.map((pkg) => {
    let title: Record<string, string> = {};
    let blurb: Record<string, string> = {};
    try {
      title = JSON.parse(pkg.titleJson || "{}") as Record<string, string>;
      blurb = JSON.parse(pkg.blurbJson || "{}") as Record<string, string>;
    } catch {
      title = {};
      blurb = {};
    }
    return {
      slug: pkg.slug,
      ta: missing(title.ta || "", title.en || "") || missing(blurb.ta || "", blurb.en || ""),
      hi: missing(title.hi || "", title.en || "") || missing(blurb.hi || "", blurb.en || ""),
      seo: !pkg.seoTitleEn,
    };
  });

  const blog = blogs[0] || { missingTa: 0, missingHi: 0, total: 0 };

  return (
    <div className="admin-card">
      <h1>Translation audit</h1>
      <p className="admin-muted">
        Language versions share one slug (`/ta/destinations/darjeeling`) so hreflang points at the same page in each language. A checkmark means the Tamil or Hindi field is filled and is not a copy of English.
      </p>
      <p>
        Blogs: {Number(blog.total)} total · Tamil title gaps {Number(blog.missingTa)} · Hindi title gaps {Number(blog.missingHi)}
      </p>
      <h2>Destinations</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Slug</th>
            <th>English</th>
            <th>Tamil</th>
            <th>Hindi</th>
          </tr>
        </thead>
        <tbody>
          {destinations.map((item) => {
            const ta =
              !missing(item.nameTa, item.nameEn) &&
              !missing(item.taglineTa, item.taglineEn) &&
              !missing(item.bodyTa, item.bodyEn);
            const hi =
              !missing(item.nameHi, item.nameEn) &&
              !missing(item.taglineHi, item.taglineEn) &&
              !missing(item.bodyHi, item.bodyEn);
            return (
              <tr key={item.slug}>
                <td>{item.slug}</td>
                <td>Yes</td>
                <td>{ta ? "Yes" : "Missing"}</td>
                <td>{hi ? "Yes" : "Missing"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h2>Packages</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Slug</th>
            <th>Tamil</th>
            <th>Hindi</th>
            <th>SEO title</th>
          </tr>
        </thead>
        <tbody>
          {packageGaps.map((item) => (
            <tr key={item.slug}>
              <td>{item.slug}</td>
              <td>{item.ta ? "Missing" : "Yes"}</td>
              <td>{item.hi ? "Missing" : "Yes"}</td>
              <td>{item.seo ? "Missing" : "Yes"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
