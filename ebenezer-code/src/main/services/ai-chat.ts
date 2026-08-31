import { BrowserWindow } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'
import { withSystemContext } from '../../ai/context'
import { createAIProvider } from '../../ai/router'
import { IPC } from '../../shared/ipc-channels'
import type {
  AiChatRequest,
  AiConnectionTestResult,
  AiSettings
} from '../../shared/types'
import * as secrets from './secrets'
import * as settings from './settings'

const controllers = new Map<string, AbortController>()

async function loadProjectRules(projectRoot?: string | null): Promise<string | null> {
  if (!projectRoot) return null
  const rulesPath = path.join(projectRoot, '.ebenezer', 'rules.md')
  try {
    return await fs.readFile(rulesPath, 'utf8')
  } catch {
    return null
  }
}

function requireKeyForProvider(ai: AiSettings, apiKey: string | null): void {
  if (ai.provider === 'local') return
  if (!apiKey) {
    throw new Error(
      'API key not set. Open Settings → AI / Models, save your key, then try again.'
    )
  }
}

export async function testConnection(): Promise<AiConnectionTestResult> {
  const ai = settings.getAiSettings()
  const apiKey = secrets.getApiKey()
  requireKeyForProvider(ai, apiKey)
  const provider = createAIProvider(ai, apiKey || undefined)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 30_000)
  try {
    return await provider.testConnection({ model: ai.model, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export async function startChat(req: AiChatRequest, win: BrowserWindow): Promise<void> {
  const existing = controllers.get(req.requestId)
  if (existing) existing.abort()

  const controller = new AbortController()
  controllers.set(req.requestId, controller)

  const send = (payload: {
    requestId: string
    delta?: string
    done?: boolean
    error?: string
  }): void => {
    if (!win.isDestroyed()) {
      win.webContents.send(IPC.aiChatChunk, payload)
    }
  }

  try {
    if (!Array.isArray(req.messages) || req.messages.length === 0) {
      throw new Error('Chat messages are required')
    }

    const ai = settings.getAiSettings()
    const apiKey = secrets.getApiKey()
    requireKeyForProvider(ai, apiKey)

    const includeRules = req.context?.includeRules !== false
    const rules = includeRules ? await loadProjectRules(req.context?.projectRoot) : null
    const messages = withSystemContext(req.messages, req.context, rules)

    // Trim conversation by approximate char budget from contextSize setting
    const budget = Math.max(4_000, Math.min(ai.contextSize, 200_000))
    let total = messages.reduce((n, m) => n + m.content.length, 0)
    const trimmed = [...messages]
    while (total > budget && trimmed.length > 2) {
      const removed = trimmed.splice(1, 1)[0]
      total -= removed?.content.length || 0
    }

    const provider = createAIProvider(ai, apiKey || undefined)
    for await (const chunk of provider.chatStream({
      model: ai.model,
      messages: trimmed,
      temperature: ai.temperature,
      maxTokens: ai.maxTokens,
      signal: controller.signal
    })) {
      if (controller.signal.aborted) break
      if (chunk.content) {
        send({ requestId: req.requestId, delta: chunk.content })
      }
      if (chunk.done) break
    }
    send({ requestId: req.requestId, done: true })
  } catch (e) {
    if (controller.signal.aborted) {
      send({ requestId: req.requestId, done: true, error: 'Cancelled' })
    } else {
      send({
        requestId: req.requestId,
        done: true,
        error: e instanceof Error ? e.message : String(e)
      })
    }
  } finally {
    controllers.delete(req.requestId)
  }
}

export function abortChat(requestId: string): void {
  const controller = controllers.get(requestId)
  if (controller) {
    controller.abort()
    controllers.delete(requestId)
  }
}
