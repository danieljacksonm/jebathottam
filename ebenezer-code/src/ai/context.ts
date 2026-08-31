import type { AiChatContext, AiChatMessage } from '../shared/types'

const MAX_FILE_CHARS = 24_000
const MAX_SELECTION_CHARS = 12_000
const MAX_RULES_CHARS = 8_000

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max)}\n\n…[truncated]`
}

export function buildSystemPrompt(context?: AiChatContext, rulesText?: string | null): string {
  const parts: string[] = [
    'You are Ebenezer Code, an AI coding assistant inside a desktop IDE.',
    'Be precise, practical, and grounded in the provided project context.',
    'If context is missing, say what you need. Do not invent file paths that were not provided.',
    'When suggesting code changes, use clear fenced code blocks with language tags.',
    'Do not claim you modified files on disk — the user reviews and applies edits in later phases.'
  ]

  if (context?.projectRoot) {
    parts.push(`Project root: ${context.projectRoot}`)
  }

  if (rulesText?.trim()) {
    parts.push('Project rules (.ebenezer/rules.md):\n' + truncate(rulesText.trim(), MAX_RULES_CHARS))
  }

  if (context?.filePath) {
    parts.push(`Active file: ${context.filePath}`)
  }

  if (context?.selection?.trim()) {
    parts.push('Selected code:\n```\n' + truncate(context.selection.trim(), MAX_SELECTION_CHARS) + '\n```')
  }

  if (context?.fileContent != null && context.fileContent !== '') {
    parts.push(
      'Active file contents:\n```\n' + truncate(context.fileContent, MAX_FILE_CHARS) + '\n```'
    )
  }

  return parts.join('\n\n')
}

export function withSystemContext(
  messages: AiChatMessage[],
  context?: AiChatContext,
  rulesText?: string | null
): AiChatMessage[] {
  const system = buildSystemPrompt(context, rulesText)
  const withoutSystem = messages.filter((m) => m.role !== 'system')
  return [{ role: 'system', content: system }, ...withoutSystem]
}
