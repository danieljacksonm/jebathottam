import { NextResponse } from "next/server";
import { checkOllamaHealth, OLLAMA_MODEL } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const health = await checkOllamaHealth();
  return NextResponse.json(
    {
      service: "ebenezer-ai",
      status: health.ok ? "ready" : "degraded",
      model: health.model || OLLAMA_MODEL,
      models: health.models,
      error: health.error || null,
      ramNote:
        "This VPS is CPU-only (~8GB RAM). Use a small model like qwen2.5:1.5b or qwen2.5:0.5b.",
    },
    { status: health.ok ? 200 : 503 }
  );
}
