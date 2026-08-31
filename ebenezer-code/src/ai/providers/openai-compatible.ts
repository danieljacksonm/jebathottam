import type { AiChatMessage } from '../../shared/types'
import type { AIProvider, ChatCompletionChunk, ChatCompletionParams, ProviderConfig } from '../types'

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/+$/, '')
  const p = path.replace(/^\/+/, '')
  return `${b}/${p}`
}

function extractDelta(json: unknown): string {
  if (!json || typeof json !== 'object') return ''
  const choices = (json as { choices?: Array<{ delta?: { content?: string }; message?: { content?: string } }> })
    .choices
  const delta = choices?.[0]?.delta?.content
  if (typeof delta === 'string') return delta
  const message = choices?.[0]?.message?.content
  if (typeof message === 'string') return message
  return ''
}

async function* parseSseStream(
  body: ReadableStream<Uint8Array>,
  signal?: AbortSignal
): AsyncGenerator<ChatCompletionChunk, void, unknown> {
  const reader = body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  try {
    while (true) {
      if (signal?.aborted) break
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split(/\r?\n/)
      buffer = parts.pop() || ''

      for (const line of parts) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const data = trimmed.slice(5).trim()
        if (!data) continue
        if (data === '[DONE]') {
          yield { content: '', done: true }
          return
        }
        try {
          const json = JSON.parse(data) as unknown
          const content = extractDelta(json)
          if (content) yield { content, done: false }
        } catch {
          // skip malformed SSE lines
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
  yield { content: '', done: true }
}

/**
 * OpenAI-compatible chat completions provider.
 * Works with OpenAI, Qwen compatible-mode, Ollama, LM Studio, vLLM, etc.
 */
export class OpenAICompatibleProvider implements AIProvider {
  readonly id: string = 'openai-compatible'
  readonly label: string
  private readonly endpoint: string
  private readonly apiKey?: string

  constructor(config: ProviderConfig, label = 'OpenAI Compatible') {
    this.endpoint = config.endpoint
    this.apiKey = config.apiKey
    this.label = label
  }

  private headers(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`
    }
    return headers
  }

  async *chatStream(params: ChatCompletionParams): AsyncGenerator<ChatCompletionChunk, void, unknown> {
    const url = joinUrl(this.endpoint, 'chat/completions')
    const res = await fetch(url, {
      method: 'POST',
      headers: this.headers(),
      signal: params.signal,
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature,
        max_tokens: params.maxTokens,
        stream: true
      })
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`AI provider error ${res.status}: ${text.slice(0, 400) || res.statusText}`)
    }

    if (!res.body) {
      throw new Error('AI provider returned an empty body')
    }

    yield* parseSseStream(res.body, params.signal)
  }

  async testConnection(params: {
    model: string
    signal?: AbortSignal
  }): Promise<{ ok: boolean; message: string; model?: string }> {
    const url = joinUrl(this.endpoint, 'chat/completions')
    const messages: AiChatMessage[] = [
      { role: 'user', content: 'Reply with exactly: ok' }
    ]
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: this.headers(),
        signal: params.signal,
        body: JSON.stringify({
          model: params.model,
          messages,
          temperature: 0,
          max_tokens: 16,
          stream: false
        })
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        return {
          ok: false,
          message: `HTTP ${res.status}: ${text.slice(0, 240) || res.statusText}`
        }
      }
      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>
        model?: string
      }
      const content = json.choices?.[0]?.message?.content?.trim() || ''
      return {
        ok: true,
        message: content ? `Connected. Sample reply: ${content.slice(0, 80)}` : 'Connected.',
        model: json.model || params.model
      }
    } catch (e) {
      return {
        ok: false,
        message: e instanceof Error ? e.message : String(e)
      }
    }
  }
}

export class QwenProvider extends OpenAICompatibleProvider {
  override readonly id = 'qwen'
  constructor(config: ProviderConfig) {
    super(config, 'Qwen')
  }
}

export class LocalModelProvider extends OpenAICompatibleProvider {
  override readonly id = 'local'
  constructor(config: ProviderConfig) {
    super(config, 'Local')
  }
}
