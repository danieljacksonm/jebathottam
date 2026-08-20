import fs from "fs";
import path from "path";

export type DiscoverEvent = {
  id: string;
  type: "search" | "intent_detected" | "recommendation_shown" | "destination_clicked";
  query?: string;
  intent?: string;
  destination?: string;
  createdAt: string;
};

const FILE = path.join(process.cwd(), "data", "discover-events.json");

function load(): DiscoverEvent[] {
  try {
    if (fs.existsSync(FILE)) {
      return JSON.parse(fs.readFileSync(FILE, "utf-8")) as DiscoverEvent[];
    }
  } catch {
    /* ignore */
  }
  return [];
}

function save(events: DiscoverEvent[]) {
  try {
    const dir = path.dirname(FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(events.slice(-3000), null, 2), "utf-8");
  } catch (e) {
    console.error("discover analytics save failed", e);
  }
}

export function trackDiscover(event: Omit<DiscoverEvent, "id" | "createdAt"> & Partial<Pick<DiscoverEvent, "id" | "createdAt">>) {
  const events = load();
  events.push({
    id: event.id || `d_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: event.type,
    query: event.query?.slice(0, 300),
    intent: event.intent,
    destination: event.destination,
    createdAt: event.createdAt || new Date().toISOString(),
  });
  save(events);
}

export function discoverSummary() {
  const events = load();
  const byType = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});
  const byIntent = events.reduce<Record<string, number>>((acc, e) => {
    if (!e.intent) return acc;
    acc[e.intent] = (acc[e.intent] || 0) + 1;
    return acc;
  }, {});
  return { total: events.length, byType, byIntent };
}
