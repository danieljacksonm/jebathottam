import {
  buildSystemPrompt,
  ChatMessage,
  OLLAMA_BASE_URL,
  OLLAMA_MODEL,
  resolveAiMode,
  validateInternalApiKey,
  type AiMode,
} from "@/lib/ai";
import { loadEbenKnowledge } from "@/lib/ai-knowledge";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 120;

type Body = {
  messages?: { role: string; content: string }[];
  stream?: boolean;
  mode?: AiMode | string;
  context?: string;
  fast?: boolean;
};

function normalizeMessages(
  input: Body["messages"],
  mode: AiMode,
  context?: string
): ChatMessage[] {
  const cleaned = (input || [])
    .filter(
      (m) =>
        m &&
        typeof m.content === "string" &&
        m.content.trim().length > 0 &&
        (m.role === "user" || m.role === "assistant" || m.role === "system")
    )
    .map((m) => ({
      role: m.role as ChatMessage["role"],
      content: m.content.trim().slice(0, 8000),
    }))
    .filter((m) => m.role !== "system")
    .slice(-20);

  return [
    { role: "system", content: buildSystemPrompt(mode, context) },
    ...cleaned,
  ];
}

export async function POST(request: Request) {
  if (!validateInternalApiKey(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const mode = resolveAiMode(body.mode);
  const knowledge = loadEbenKnowledge();
  const mergedContext = [knowledge, body.context || ""].filter(Boolean).join("\n\n");
  const messages = normalizeMessages(body.messages, mode, mergedContext);
  const userTurns = messages.filter((m) => m.role === "user");
  if (userTurns.length === 0) {
    return new Response(JSON.stringify({ error: "Add at least one user message" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const wantStream = body.stream !== false;

  try {
    const ollamaRes = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: wantStream,
        keep_alive: "2m",
        options: {
          temperature: 0.5,
          num_predict: body.fast ? 480 : 900,
          num_ctx: body.fast ? 2048 : 3072,
          num_thread: 4,
        },
      }),
      signal: AbortSignal.timeout(110000),
    });

    if (!ollamaRes.ok) {
      const text = await ollamaRes.text().catch(() => "");
      const missingModel =
        ollamaRes.status === 404 || /not found|pull/i.test(text);
      return new Response(
        JSON.stringify({
          error: missingModel
            ? "Nzer 1.0 is not installed. On VPS run: ollama pull qwen2.5:1.5b"
            : "Model server error",
          detail: text.slice(0, 500) || `Ollama status ${ollamaRes.status}`,
          hint: "ollama pull qwen2.5:1.5b",
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!wantStream) {
      const data = await ollamaRes.json();
      const content = data?.message?.content || "";
      return new Response(
        JSON.stringify({ content, model: OLLAMA_MODEL, mode }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = ollamaRes.body?.getReader();
        if (!reader) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "No stream" })}\n\n`)
          );
          controller.close();
          return;
        }

        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              try {
                const json = JSON.parse(trimmed) as {
                  message?: { content?: string };
                  done?: boolean;
                  error?: string;
                };
                if (json.error) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ error: json.error })}\n\n`
                    )
                  );
                  continue;
                }
                const token = json.message?.content || "";
                if (token) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ token })}\n\n`)
                  );
                }
                if (json.done) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        done: true,
                        model: OLLAMA_MODEL,
                        mode,
                      })}\n\n`
                    )
                  );
                }
              } catch {
                // skip bad line
              }
            }
          }
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                error: err instanceof Error ? err.message : "Stream failed",
              })}\n\n`
            )
          );
        } finally {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error:
          err instanceof Error
            ? err.message
            : "Cannot reach AI model server (Ollama)",
        hint: "On the VPS: install Ollama, then run ollama pull qwen2.5:1.5b (Nzer 1.0)",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}
