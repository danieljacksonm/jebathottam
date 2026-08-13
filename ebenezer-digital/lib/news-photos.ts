/** High-quality editorial stills (Unsplash) used only when a wire story has no real photo. */

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=88&sat=-8`;

export const DESK_PHOTOS = {
  world: U("photo-1451187580459-43490279c0fa"),
  india: U("photo-1524492412937-b28074a5d7c1"),
  asia: U("photo-1508804185872-d7badad00f7d"),
  europe: U("photo-1467269204594-9661b134dd2b"),
  americas: U("photo-1485871981521-5b1fd3805eee"),
  africa: U("photo-1489392191049-fc10c97e64b6"),
  middleEast: U("photo-1518684079-3c830dcef090"),
  tech: U("photo-1518770660439-4636190af475"),
  business: U("photo-1454165804606-c3d57bc86b40"),
  science: U("photo-1451187580459-43490279c0fa"),
  climate: U("photo-1500382017468-9049fed747ef"),
  sports: U("photo-1461896836934-ffe607ba6851"),
  politics: U("photo-1529107386315-e1a2ed48a620"),
  default: U("photo-1504711434969-e33886168f5c"),
};

export function photoForStory(region: string, title = "", topic = ""): string {
  const hay = `${region} ${title} ${topic}`.toLowerCase();
  if (/india|delhi|mumbai|chennai|modi/.test(hay)) return DESK_PHOTOS.india;
  if (/sport|cricket|football|tennis|olymp/.test(hay)) return DESK_PHOTOS.sports;
  if (/tech|ai |chip|software|app /.test(hay)) return DESK_PHOTOS.tech;
  if (/business|market|bank|trade|stock/.test(hay)) return DESK_PHOTOS.business;
  if (/climate|flood|heat|weather|green/.test(hay)) return DESK_PHOTOS.climate;
  if (/science|space|nasa|research/.test(hay)) return DESK_PHOTOS.science;
  if (/politic|election|minister|parliament/.test(hay)) return DESK_PHOTOS.politics;
  if (/africa/.test(hay)) return DESK_PHOTOS.africa;
  if (/europe|uk |london|paris|berlin/.test(hay)) return DESK_PHOTOS.europe;
  if (/america|us |washington|canada/.test(hay)) return DESK_PHOTOS.americas;
  if (/asia|china|japan|korea/.test(hay)) return DESK_PHOTOS.asia;
  if (/middle east|gaza|israel|dubai|iran/.test(hay)) return DESK_PHOTOS.middleEast;
  return DESK_PHOTOS.world;
}

export function isWeakImage(url?: string): boolean {
  if (!url) return true;
  const u = url.toLowerCase();
  if (u === "/images/journal/hero.jpg") return true;
  if (u.includes("1x1") || u.includes("pixel") || u.includes("spacer") || u.includes("tracking")) return true;
  if (u.includes("logo") && (u.includes("16x") || u.includes("32x") || u.includes("favicon"))) return true;
  if (/\.(gif)(\?|$)/.test(u) && /pixel|track|beacon/.test(u)) return true;
  return false;
}

export function sanitizeImageUrl(raw: string | undefined, fallback: string): string {
  if (!raw) return fallback;
  let url = raw.trim().replace(/^\/\//, "https://");
  if (url.startsWith("/")) return url;
  if (!/^https?:\/\//i.test(url)) return fallback;
  if (isWeakImage(url)) return fallback;
  return upgradeImageUrl(url);
}

export function upgradeImageUrl(url: string): string {
  if (url.startsWith("/")) return url;
  let out = url;
  out = out.replace(/\/(\d{2,3})\.(jpg|jpeg|png)/i, "/1000.$2");
  out = out.replace(/\/news\/\d+\//, "/news/976/");
  if (out.includes("images.unsplash.com")) {
    if (!/[?&]w=/.test(out)) out += (out.includes("?") ? "&" : "?") + "w=2000&q=88";
    else out = out.replace(/([?&]w=)\d+/i, "$12000").replace(/([?&]q=)\d+/i, "$188");
  }
  return out;
}

export function storyFingerprint(title: string): string {
  return title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(the|a|an|in|on|at|to|of|for|and|or|as|by|is|are|was|after|over|new)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 90);
}
