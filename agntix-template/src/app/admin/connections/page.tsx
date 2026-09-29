import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { companyProfile } from "@/lib/company";

export const dynamic = "force-dynamic";

const steps = [
  {
    name: "Facebook",
    where: "Meta Business Suite and developers.facebook.com",
    collect: "Page name, Page ID, and a Page access token that can publish to that Page.",
    note: "Instagram publishing uses the same Meta app, but it needs the Instagram professional account linked to the Facebook Page.",
  },
  {
    name: "Instagram",
    where: "The Instagram professional account linked to the Facebook Page",
    collect: "Instagram username, Instagram account ID, and a token with content-publishing permission.",
    note: "A personal Instagram login is not enough. The account must be a professional account tied to the Page.",
  },
  {
    name: "LinkedIn",
    where: "linkedin.com/developers",
    collect: "Organization or member name, organization ID, and a token allowed to create posts.",
    note: "LinkedIn often requires their app review before a company page can post.",
  },
  {
    name: "YouTube",
    where: "Google Cloud Console, YouTube Data API",
    collect: "Channel name, channel ID, and an OAuth token that can upload videos.",
    note: "A video file is still required at publish time. A caption alone does not create a video.",
  },
  {
    name: "Threads",
    where: "Meta for Developers, Threads API",
    collect: "Threads username, user ID, and a Threads token.",
    note: "Threads is a separate Meta product from Instagram. An Instagram token does not post to Threads.",
  },
];

export default async function ConnectionsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const accounts = await prisma.socialAccount.findMany({
    orderBy: { platform: "asc" },
  });
  const company = companyProfile();
  const smtpReady = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  );

  return (
    <div>
      <h1>Connections</h1>
      <p className="admin-muted">
        Use this page before you expect email, invoices, or social posts to leave Canaan.
        Drafts, quotes, and invoices already save inside admin. A network is connected only when its row below says CONNECTED.
      </p>

      <section className="admin-card">
        <h2>1. Admin login</h2>
        <ol>
          <li>Open /admin/login on this site.</li>
          <li>The password is the server value ADMIN_PASSWORD. It is not stored in the website pages.</li>
          <li>If login says the admin is not configured, set ADMIN_PASSWORD on the server and restart the Canaan service.</li>
        </ol>
      </section>

      <section className="admin-card" style={{ marginTop: "1rem" }}>
        <h2>2. Enquiry email</h2>
        <p>
          Status: {smtpReady ? "SMTP settings are present." : "SMTP is not configured. Enquiries are saved, and the enquiry record shows email as not sent."}
        </p>
        <p className="admin-muted">
          On the server, set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, and ENQUIRY_NOTIFY_EMAIL. Restart the service. A failed send stays marked failed. It is not shown as sent.
        </p>
      </section>

      <section className="admin-card" style={{ marginTop: "1rem" }}>
        <h2>3. Invoice company details</h2>
        <ul>
          <li>Email on PDF: {company.email || "blank until COMPANY_EMAIL is set"}</li>
          <li>Phone on PDF: {company.phone || "blank until COMPANY_PHONE is set"}</li>
          <li>Address on PDF: {company.address || "blank until COMPANY_ADDRESS is set"}</li>
          <li>GST on PDF: {company.gst || "blank. Leave it blank if GST is not registered."}</li>
        </ul>
        <p className="admin-muted">
          These values are read from the server environment. They are not typed into a public form. After changing them, restart the service, then download a PDF to confirm.
        </p>
      </section>

      <section className="admin-card" style={{ marginTop: "1rem" }}>
        <h2>4. Social accounts</h2>
        <p>
          Saving a token marks that account CONNECTED and encrypts the token. Publishing from{" "}
          <Link href="/admin/social">Social media</Link> still fails until that platform’s live API is switched on in the server. The failed post shows the error and stays FAILED.
        </p>
        <p>Status meanings:</p>
        <ul>
          <li>NOT CONNECTED — no token saved. Publish will refuse.</li>
          <li>CONNECTED — token is stored. The post is still not published until the live API accepts it.</li>
          <li>EXPIRED — the token needs to be replaced.</li>
          <li>ERROR — the last connection attempt failed. Read the error on the account.</li>
        </ul>
        {accounts.length === 0 ? (
          <p>No social accounts saved yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Account</th>
                <th>Status</th>
                <th>Token stored</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.platform}</td>
                  <td>{account.accountName}</td>
                  <td>{account.status}</td>
                  <td>{account.tokenCipher ? "Yes, encrypted" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p>
          <Link className="admin-btn" href="/admin/social">
            Open social media and save an account
          </Link>
        </p>
        <h3>What to collect before you paste a token</h3>
        {steps.map((step) => (
          <div key={step.name} style={{ marginTop: "0.8rem" }}>
            <strong>{step.name}</strong>
            <p>Get this from {step.where}.</p>
            <p>Save in admin: {step.collect}</p>
            <p className="admin-muted">{step.note}</p>
          </div>
        ))}
        <ol>
          <li>Create the app in that platform’s developer console and complete their permission review.</li>
          <li>Copy the account name, account ID, and access token.</li>
          <li>On Social media, use Connect account. Leave the token empty if you only want the name saved as NOT CONNECTED.</li>
          <li>Set SOCIAL_TOKEN_KEY on the server if you do not want tokens encrypted with the admin password. Restart after changing it. Old tokens cannot be read if this key changes.</li>
          <li>Create a draft post, check the caption and image, then press Publish now. If the live API is still off, the post becomes FAILED and the reason is shown. It is not marked published.</li>
        </ol>
      </section>
    </div>
  );
}
