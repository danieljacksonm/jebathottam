# AI (Phase 2)

Real provider abstraction lives here.

- `types.ts` — `AIProvider` interface
- `providers/openai-compatible.ts` — OpenAI / Qwen / local compatible HTTP
- `router.ts` — create provider from settings
- `context.ts` — file / selection / rules context builder

Chat execution runs in the Electron main process (`src/main/services/ai-chat.ts`) so API keys never enter the renderer.
