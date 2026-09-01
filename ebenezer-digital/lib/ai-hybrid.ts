import type { ChatMessage } from "@/lib/ai";
import { cacheGet, cacheSet } from "@/lib/cache";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

function isSimpleQuery(messages: ChatMessage[]): boolean {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return false;
  const text = lastUser.content.trim();
  return text.length < 280 && !/\b(code|debug|implement|refactor|sql|api)\b/i.test(text);
}

export function shouldUseHybrid(fast?: boolean, messages?: ChatMessage[]): boolean {
  if (fast) return true;
  if (!process.env.GROQ_API_KEY?.trim()) return false;
  return Boolean(messages && isSimpleQuery(messages));
}

export async function hybridChat(
  messages: ChatMessage[],
  opts?: { stream?: boolean }
): Promise<Response | null> {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) return null;

  const cacheKey = `ai:hybrid:${JSON.stringify(messages.slice(-3))}`;
  if (!opts?.stream) {
    const cached = await cacheGet<string>(cacheKey);
    if (cached) {
      return new Response(JSON.stringify({ content: cached, model: GROQ_MODEL, mode: "hybrid" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.4,
      max_tokens: 700,
      stream: Boolean(opts?.stream),
    }),
    signal: AbortSignal.timeout(25000),
  });

  if (!res.ok) return null;

  if (opts?.stream) return res;

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content || "";
  if (content) await cacheSet(cacheKey, content, 600);
  return new Response(JSON.stringify({ content, model: GROQ_MODEL, mode: "hybrid" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
