import Store from 'electron-store'
import {
  DEFAULT_SETTINGS,
  type AiSettings,
  type AiSettingsPublic,
  type AppSettings
} from '../../shared/types'
import * as secrets from './secrets'

type SettingsStore = { settings: AppSettings }

const store = new Store<SettingsStore>({
  name: 'ebenezer-code-settings',
  defaults: { settings: DEFAULT_SETTINGS }
})

function normalizeSettings(raw: Partial<AppSettings> | undefined): AppSettings {
  const base = { ...DEFAULT_SETTINGS, ...(raw || {}) }
  return {
    ...base,
    ai: { ...DEFAULT_SETTINGS.ai, ...(raw?.ai || {}) }
  }
}

export function getSettings(): AppSettings {
  return normalizeSettings(store.get('settings'))
}

export function setSettings(partial: Partial<AppSettings>): AppSettings {
  const current = getSettings()
  const next = normalizeSettings({
    ...current,
    ...partial,
    ai: partial.ai ? { ...current.ai, ...partial.ai } : current.ai
  })
  store.set('settings', next)
  return next
}

export function getAiSettings(): AiSettings {
  return getSettings().ai
}

export function setAiSettings(partial: Partial<AiSettings>): AiSettings {
  const next = setSettings({ ai: { ...getAiSettings(), ...partial } })
  return next.ai
}

export function getAiPublicSettings(): AiSettingsPublic {
  return {
    ...getAiSettings(),
    hasApiKey: secrets.hasApiKey()
  }
}
