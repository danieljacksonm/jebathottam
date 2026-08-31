# Ebenezer Code

Desktop AI IDE by **Ebenezer Digital**.

Tagline: **Build with intelligence.**

## Current status

| Phase | Scope | Status |
|-------|--------|--------|
| 1 | Desktop shell, Monaco, explorer, terminal, Git, settings | Done |
| 2 | AI provider abstraction, chat, file/selection context | In progress / shipping |
| 3 | Codebase index + search + @refs | Not started |
| 4 | Multi-file AI edits + diff accept/reject | Not started |
| 5 | Agent tools + permissions + fix loop | Not started |
| 6 | Inline completion, routing, extensions | Not started |

## Phase 2 AI

- Providers: OpenAI-compatible, Qwen (DashScope compatible), Local (Ollama/LM Studio style)
- Chat streams from the **main process** (API keys never enter the renderer)
- Context: active file, selection, `.ebenezer/rules.md`
- Keys: Electron `safeStorage`

Configure under **Settings → AI / Models**, then use the right **AI Chat** panel.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run package:win
```

## Security

Renderer has no Node access. Filesystem, terminal, Git, and AI HTTP calls run in the main process via secure IPC.
