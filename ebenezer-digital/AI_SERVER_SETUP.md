# Ebenezer AI — VPS setup (CPU, ~8GB RAM)

Your server has **no GPU** and about **8GB RAM**, with other Next.js apps already running.
Use a **small** open-source model only.

Recommended first model: **`qwen2.5:1.5b`**  
If RAM is tight, use **`qwen2.5:0.5b`**.

---

## 1) Install Ollama on Ubuntu

```bash
curl -fsSL https://ollama.com/install.sh | sh
sudo systemctl enable ollama
sudo systemctl start ollama
ollama --version
```

## 2) Pull a small model

```bash
# ~1GB download — good start for this VPS
ollama pull qwen2.5:1.5b

# OR even smaller if memory is low:
# ollama pull qwen2.5:0.5b
```

Test:

```bash
ollama run qwen2.5:1.5b "Say hello in one short sentence"
```

## 3) Keep Ollama private (localhost only)

Ollama should listen on `127.0.0.1` so only your Next.js app can call it.
Do **not** open port `11434` on the public firewall.

## 4) Env for Ebenezer Digital

In `/home/dani/ebenezer-digital/.env`:

```bash
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:1.5b
AI_API_KEY=change-me-long-random
```

Then:

```bash
cd /home/dani/ebenezer-digital
git pull
npm run build
pm2 restart ebenezer-digital --update-env
```

## 5) Test

- Chat UI: `https://ebenezerdigital.com/ai`
- Health: `https://ebenezerdigital.com/api/ai/health`
- Product API (later): `POST /api/ai/chat` with header `x-ai-api-key: YOUR_KEY`

## 6) RAM tips

- Stop unused PM2 apps while testing the model if needed
- Prefer 0.5b / 1.5b models
- Avoid 7B+ models on this VPS (will swap / crash)
- Real “training” later = RAG (company docs) first; LoRA fine-tune needs a stronger GPU box

## What we built in the app

| Path | Purpose |
|------|---------|
| `/ai` | Chat UI (modes: general, news, product, billing) |
| `/ai?mode=news` | News assistant for viewers |
| `/ai?mode=product` | Store product helper |
| `/ai?mode=billing` | Checkout / license helper |
| `/api/ai/chat` | Streaming chat API (`mode` + `context`) |
| `/api/ai/news-brief` | One-click world news brief |
| `/api/ai/health` | Model online check |
| `/api/billing/checkout` | Billing placeholder (connect Razorpay/Stripe later) |
| `lib/ai.ts` | Shared Ollama config + mode prompts |

### Product integrations
- News home: AI world brief + ask panel
- News article: ask about this story
- News menu / mobile bar: Ask AI
- Store nav + product page: product advisor
- Checkout: billing help panel

