import type { AiChatMessage } from '../shared/types'

export type ChatCompletionParams = {
  model: string
  messages: AiChatMessage[]
  temperature: number
  maxTokens: number
  signal?: AbortSignal
}

export type ChatCompletionChunk = {
  content: string
  done: boolean
}

/**
 * Provider abstraction — never hard-code a single vendor model.
 * OpenAI-compatible HTTP chat completions cover OpenAI, Qwen DashScope, Ollama, LM Studio, etc.
 */
export interface AIProvider {
  readonly id: string
  readonly label: string
  chatStream(params: ChatCompletionParams): AsyncGenerator<ChatCompletionChunk, void, unknown>
  testConnection(params: {
    model: string
    signal?: AbortSignal
  }): Promise<{ ok: boolean; message: string; model?: string }>
}

export type ProviderConfig = {
  endpoint: string
  apiKey?: string
}
