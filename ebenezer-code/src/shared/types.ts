export type PermissionLevel = 'READ_ONLY' | 'WRITE' | 'TERMINAL' | 'DANGEROUS'

export type FileEntry = {
  name: string
  path: string
  isDirectory: boolean
}

export type RecentProject = {
  name: string
  path: string
  lastOpened: string
  technology: string
}

export type ProjectTemplate = 'blank' | 'html' | 'nodejs'

export type GitFileStatus = {
  path: string
  index: string
  working_dir: string
}

export type GitStatusResult = {
  ok: boolean
  isRepo: boolean
  branch: string
  files: GitFileStatus[]
  error?: string
}

export type AiProviderId = 'openai-compatible' | 'qwen' | 'local'

export type AiSettings = {
  provider: AiProviderId
  endpoint: string
  model: string
  temperature: number
  maxTokens: number
  contextSize: number
}

export type AiSettingsPublic = AiSettings & {
  hasApiKey: boolean
}

export type AppSettings = {
  editorFontSize: number
  editorTabSize: number
  editorWordWrap: boolean
  terminalFontSize: number
  theme: 'dark'
  showHiddenFiles: boolean
  ai: AiSettings
}

export const DEFAULT_AI_SETTINGS: AiSettings = {
  provider: 'openai-compatible',
  endpoint: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  temperature: 0.2,
  maxTokens: 4096,
  contextSize: 32000
}

export const DEFAULT_SETTINGS: AppSettings = {
  editorFontSize: 14,
  editorTabSize: 2,
  editorWordWrap: true,
  terminalFontSize: 13,
  theme: 'dark',
  showHiddenFiles: false,
  ai: { ...DEFAULT_AI_SETTINGS }
}

export const AI_PROVIDER_PRESETS: Record<
  AiProviderId,
  { label: string; endpoint: string; model: string; needsKey: boolean }
> = {
  'openai-compatible': {
    label: 'OpenAI Compatible',
    endpoint: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    needsKey: true
  },
  qwen: {
    label: 'Qwen (DashScope compatible)',
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-plus',
    needsKey: true
  },
  local: {
    label: 'Local OpenAI-compatible',
    endpoint: 'http://127.0.0.1:11434/v1',
    model: 'llama3.2',
    needsKey: false
  }
}

/** Alternate DashScope endpoint for international accounts */
export const QWEN_INTL_ENDPOINT = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'

export type CreateProjectRequest = {
  parentDir: string
  name: string
  template: ProjectTemplate
}

export type AiChatRole = 'system' | 'user' | 'assistant'

export type AiChatMessage = {
  role: AiChatRole
  content: string
}

export type AiChatContext = {
  projectRoot?: string | null
  filePath?: string | null
  fileContent?: string | null
  selection?: string | null
  includeRules?: boolean
}

export type AiChatRequest = {
  requestId: string
  messages: AiChatMessage[]
  context?: AiChatContext
}

export type AiChatChunk = {
  requestId: string
  delta?: string
  done?: boolean
  error?: string
}

export type AiConnectionTestResult = {
  ok: boolean
  message: string
  model?: string
}
