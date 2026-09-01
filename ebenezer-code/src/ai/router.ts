import type { AiProviderId, AiSettings } from '../shared/types'
import type { AIProvider } from './types'
import {
  LocalModelProvider,
  OpenAICompatibleProvider,
  QwenProvider
} from './providers/openai-compatible'

export function createAIProvider(settings: AiSettings, apiKey?: string): AIProvider {
  const config = { endpoint: settings.endpoint.trim(), apiKey: apiKey?.trim() || undefined }
  const map: Record<AiProviderId, () => AIProvider> = {
    'openai-compatible': () => new OpenAICompatibleProvider(config),
    qwen: () => new QwenProvider(config),
    local: () => new LocalModelProvider(config)
  }
  return map[settings.provider]()
}
