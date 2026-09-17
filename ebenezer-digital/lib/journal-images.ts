/**
 * Topic-aware hero images for Journal — professional visuals, not generic coding stock.
 */

const Q = "auto=format&fit=crop&crop=center&w=1600&q=90";

export type JournalImageTopic =
  | "ai"
  | "business"
  | "security"
  | "cloud"
  | "web"
  | "fintech"
  | "travel"
  | "data"
  | "mobile"
  | "education"
  | "general";

const POOLS: Record<JournalImageTopic, string[]> = {
  ai: [
    `https://images.unsplash.com/photo-1677442136019-21780ecad995?${Q}`,
    `https://images.unsplash.com/photo-1620712943543-bcc4688e7485?${Q}`,
    `https://images.unsplash.com/photo-1535378628312-5c3f1a0e2a2a?${Q}`,
  ],
  business: [
    `https://images.unsplash.com/photo-1460925895917-afdab827c52f?${Q}`,
    `https://images.unsplash.com/photo-1556761175-5973dc0f32e7?${Q}`,
    `https://images.unsplash.com/photo-1553877522-43269d4ea984?${Q}`,
  ],
  security: [
    `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?${Q}`,
    `https://images.unsplash.com/photo-1563986768609-322da13575f3?${Q}`,
    `https://images.unsplash.com/photo-1555949963-aa79dcee981c?${Q}`,
  ],
  cloud: [
    `https://images.unsplash.com/photo-1451187580459-43490279c0fa?${Q}`,
    `https://images.unsplash.com/photo-1544197150-b99a580bb7a2?${Q}`,
    `https://images.unsplash.com/photo-1558494949-ef010cbdcc31?${Q}`,
  ],
  web: [
    `https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?${Q}`,
    `https://images.unsplash.com/photo-1498050108023-c5249f4df085?${Q}`,
    `https://images.unsplash.com/photo-1504639725590-34d0984388bd?${Q}`,
  ],
  fintech: [
    `https://images.unsplash.com/photo-1554224155-6726b3ff858f?${Q}`,
    `https://images.unsplash.com/photo-1563013544-824ae1b704d3?${Q}`,
    `https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?${Q}`,
  ],
  travel: [
    `https://images.unsplash.com/photo-1488646953014-85cb44e25828?${Q}`,
    `https://images.unsplash.com/photo-1436491865332-7a61a192cc71?${Q}`,
    `https://images.unsplash.com/photo-1501785888045-ca1397b9a0f3?${Q}`,
  ],
  data: [
    `https://images.unsplash.com/photo-1551288049-bebda4e38f71?${Q}`,
    `https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?${Q}`,
    `https://images.unsplash.com/photo-1518186285589-2f7649de83e0?${Q}`,
  ],
  mobile: [
    `https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?${Q}`,
    `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?${Q}`,
    `https://images.unsplash.com/photo-1523206489230-c012c64b2b48?${Q}`,
  ],
  education: [
    `https://images.unsplash.com/photo-1523240795612-9a054b0db644?${Q}`,
    `https://images.unsplash.com/photo-1503676260728-1c00da094a0b?${Q}`,
    `https://images.unsplash.com/photo-1427504490245-70e384c007af?${Q}`,
  ],
  general: [
    `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?${Q}`,
    `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?${Q}`,
    `https://images.unsplash.com/photo-1522071820081-009f0129c71c?${Q}`,
  ],
};

/** Default hero when no cover is set — editorial desk, not code on a screen. */
export const JOURNAL_DEFAULT_HERO =
  `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?${Q}`;

const CATEGORY_MAP: Record<string, JournalImageTopic> = {
  technology: "web",
  tech: "web",
  ai: "ai",
  business: "business",
  security: "security",
  cybersecurity: "security",
  cloud: "cloud",
  finance: "fintech",
  fintech: "fintech",
  travel: "travel",
  data: "data",
  mobile: "mobile",
  education: "education",
  general: "general",
  digital: "web",
  seo: "web",
  marketing: "business",
};

export function inferJournalImageTopic(category?: string, title?: string): JournalImageTopic {
  const hay = `${category || ""} ${title || ""}`.toLowerCase();
  for (const [key, topic] of Object.entries(CATEGORY_MAP)) {
    if (hay.includes(key)) return topic;
  }
  if (/ai|machine|model|gpt|llm/.test(hay)) return "ai";
  if (/security|encrypt|password|firewall/.test(hay)) return "security";
  if (/cloud|server|host|dns|api/.test(hay)) return "cloud";
  if (/bill|invoice|gst|payment|bank/.test(hay)) return "fintech";
  return "general";
}

export function journalCoverForTopic(
  category?: string,
  title?: string,
  seed = 0
): string {
  const topic = inferJournalImageTopic(category, title);
  const pool = POOLS[topic];
  return pool[Math.abs(seed) % pool.length] || JOURNAL_DEFAULT_HERO;
}

export function journalHeroFallback(coverImage?: string | null): string {
  if (coverImage?.trim() && !coverImage.includes("/images/journal/hero.jpg")) {
    return coverImage;
  }
  return JOURNAL_DEFAULT_HERO;
}
