"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const platforms = ["facebook", "instagram", "linkedin", "youtube", "threads"];

export function SocialComposer() {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <form
      className="admin-card"
      onSubmit={async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const res = await fetch("/api/admin/crm/social", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: String(data.get("title") || ""),
            masterCaption: String(data.get("masterCaption") || ""),
            hashtags: String(data.get("hashtags") || ""),
            linkUrl: String(data.get("linkUrl") || ""),
            location: String(data.get("location") || ""),
            callToAction: String(data.get("callToAction") || ""),
            language: String(data.get("language") || "en"),
            mediaPath: String(data.get("mediaPath") || ""),
            relatedType: String(data.get("relatedType") || ""),
            relatedSlug: String(data.get("relatedSlug") || ""),
            scheduledFor: String(data.get("scheduledFor") || ""),
            campaignName: String(data.get("campaignName") || ""),
            platforms: data.getAll("platforms").map(String),
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(json.error || "Could not save post");
          return;
        }
        router.push(`/admin/social/${json.id}`);
        router.refresh();
      }}
    >
      <h2>New post</h2>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-field">
        <label>Title</label>
        <input name="title" required />
      </div>
      <div className="admin-field">
        <label>Master caption</label>
        <textarea name="masterCaption" />
      </div>
      <div className="admin-field">
        <label>Platforms</label>
        {platforms.map((platform) => (
          <label key={platform} className="admin-check">
            <input type="checkbox" name="platforms" value={platform} defaultChecked={platform === "facebook"} />
            {platform}
          </label>
        ))}
      </div>
      <div className="admin-grid-2">
        <div className="admin-field">
          <label>Hashtags</label>
          <input name="hashtags" />
        </div>
        <div className="admin-field">
          <label>Link</label>
          <input name="linkUrl" placeholder="https://canaantravelhub.com/en/blog/..." />
        </div>
        <div className="admin-field">
          <label>Image path</label>
          <input name="mediaPath" placeholder="/images/travel/d/darjeeling.jpg" />
        </div>
        <div className="admin-field">
          <label>Schedule</label>
          <input name="scheduledFor" type="datetime-local" />
        </div>
        <div className="admin-field">
          <label>Related type</label>
          <select name="relatedType" defaultValue="">
            <option value="">None</option>
            <option value="blog">Blog</option>
            <option value="destination">Destination</option>
            <option value="package">Package</option>
          </select>
        </div>
        <div className="admin-field">
          <label>Related slug</label>
          <input name="relatedSlug" />
        </div>
        <div className="admin-field">
          <label>Campaign</label>
          <input name="campaignName" />
        </div>
        <div className="admin-field">
          <label>Language</label>
          <select name="language" defaultValue="en">
            <option value="en">English</option>
            <option value="ta">Tamil</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      </div>
      <button className="admin-btn">Save draft</button>
    </form>
  );
}

export function SocialAccountForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  return (
    <form
      className="admin-card"
      onSubmit={async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const res = await fetch("/api/admin/crm/social/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform: String(data.get("platform") || ""),
            accountName: String(data.get("accountName") || ""),
            externalId: String(data.get("externalId") || ""),
            token: String(data.get("token") || ""),
          }),
        });
        const json = await res.json().catch(() => ({}));
        setMessage(res.ok ? `Saved as ${json.status}. Publishing still requires a live API adapter.` : json.error || "Could not save account");
        if (res.ok) router.refresh();
      }}
    >
      <h2>Connect account</h2>
      <ol className="admin-muted">
        <li>Pick the platform and type the public account or page name.</li>
        <li>Paste the account ID from that platform’s developer console.</li>
        <li>Paste the access token only when you have it. Leave it empty to save the account as NOT CONNECTED.</li>
        <li>A saved token is encrypted and the status becomes CONNECTED.</li>
        <li>CONNECTED does not publish by itself. Open the post and press Publish now. If the live API is off, the post is marked FAILED and the error stays on the post.</li>
      </ol>
      <p className="admin-muted">
        Full steps for Facebook, Instagram, LinkedIn, YouTube, Threads, email, and invoice details are on the Connections page.
      </p>
      {message ? <p>{message}</p> : null}
      <div className="admin-grid-2">
        <div className="admin-field">
          <label>Platform</label>
          <select name="platform" defaultValue="facebook">
            {platforms.map((platform) => (
              <option key={platform}>{platform}</option>
            ))}
          </select>
        </div>
        <div className="admin-field">
          <label>Account name</label>
          <input name="accountName" required />
        </div>
        <div className="admin-field">
          <label>Account ID</label>
          <input name="externalId" />
        </div>
        <div className="admin-field">
          <label>Access token</label>
          <input name="token" type="password" autoComplete="off" />
        </div>
      </div>
      <button className="admin-btn secondary">Save account</button>
    </form>
  );
}

export function SocialPostActions({
  id,
  variants,
}: {
  id: string;
  variants: { platform: string; caption: string; hashtags: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [captions, setCaptions] = useState(variants);

  async function act(action: string) {
    setError("");
    const res = await fetch(`/api/admin/crm/social/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, variants: captions }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.ok === false) {
      setError(json.error || "The post was not published.");
    }
    router.refresh();
  }

  return (
    <div className="admin-card">
      <h2>Platform versions</h2>
      {error ? <p className="admin-error">{error}</p> : null}
      {captions.map((variant, index) => (
        <div key={variant.platform} className="admin-field">
          <label>{variant.platform}</label>
          <textarea
            value={variant.caption}
            onChange={(event) =>
              setCaptions((current) =>
                current.map((item, itemIndex) =>
                  itemIndex === index ? { ...item, caption: event.target.value } : item,
                ),
              )
            }
          />
        </div>
      ))}
      <div className="admin-actions">
        <button className="admin-btn secondary" type="button" onClick={() => void act("save")}>
          Save captions
        </button>
        <button className="admin-btn" type="button" onClick={() => void act("publish")}>
          Publish now
        </button>
        <button
          className="admin-btn secondary"
          type="button"
          onClick={() => {
            const text = captions
              .map((variant) => `${variant.platform}\n${variant.caption}\n${variant.hashtags}`.trim())
              .join("\n\n");
            const blob = new Blob([text], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "social-captions.txt";
            link.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export captions
        </button>
        <button className="admin-btn danger" type="button" onClick={() => void act("cancel")}>
          Cancel
        </button>
      </div>
    </div>
  );
}
