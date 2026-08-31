import { useEffect, useState } from 'react'
import {
  AI_PROVIDER_PRESETS,
  QWEN_INTL_ENDPOINT,
  type AiProviderId,
  type AiSettingsPublic
} from '../../../../shared/types'
import { useIdeStore } from '../../state/ide-store'

type SettingsTab =
  | 'general'
  | 'editor'
  | 'appearance'
  | 'terminal'
  | 'ai'
  | 'security'
  | 'git'
  | 'keyboard'
  | 'extensions'

export function SettingsPanel({ initialTab = 'editor' }: { initialTab?: SettingsTab } = {}): JSX.Element {
  const settings = useIdeStore((s) => s.settings)
  const setSettings = useIdeStore((s) => s.setSettings)
  const [tab, setTab] = useState<SettingsTab>(initialTab)
  const [ai, setAi] = useState<AiSettingsPublic | null>(null)
  const [apiKeyDraft, setApiKeyDraft] = useState('')
  const [aiStatus, setAiStatus] = useState('')
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    void window.ebenezer.getSettings().then(setSettings)
    void window.ebenezer.getAiSettings().then(setAi)
  }, [setSettings])

  const update = async (partial: Partial<typeof settings>): Promise<void> => {
    const next = await window.ebenezer.setSettings(partial)
    setSettings(next)
  }

  const refreshAi = async (): Promise<void> => {
    setAi(await window.ebenezer.getAiSettings())
  }

  const applyProviderPreset = async (provider: AiProviderId): Promise<void> => {
    const preset = AI_PROVIDER_PRESETS[provider]
    const next = await window.ebenezer.setAiSettings({
      provider,
      endpoint: preset.endpoint,
      model: preset.model
    })
    setAi(next)
    setAiStatus(
      provider === 'qwen'
        ? 'Qwen selected. Paste your DashScope API key below, then click Save & Test.'
        : `Switched to ${preset.label}`
    )
  }

  const saveAll = async (): Promise<void> => {
    if (!ai) return
    const nextSettings = await window.ebenezer.setAiSettings({
      provider: ai.provider,
      endpoint: ai.endpoint,
      model: ai.model,
      temperature: ai.temperature,
      maxTokens: ai.maxTokens,
      contextSize: ai.contextSize
    })
    let next = nextSettings
    if (apiKeyDraft.trim()) {
      next = await window.ebenezer.setAiApiKey(apiKeyDraft)
      setApiKeyDraft('')
    }
    setAi(next)
    if (!next.hasApiKey && next.provider !== 'local') {
      setAiStatus('Settings saved, but API key is still missing. Paste key, then Save & Test.')
      return
    }
    setAiStatus('Saved. Running connection test…')
    setTesting(true)
    try {
      const result = await window.ebenezer.testAiConnection()
      setAiStatus(result.ok ? `OK — ${result.message}` : `Failed — ${result.message}`)
      await refreshAi()
    } catch (e) {
      setAiStatus(e instanceof Error ? e.message : String(e))
    } finally {
      setTesting(false)
    }
  }

  const clearKey = async (): Promise<void> => {
    const next = await window.ebenezer.clearAiApiKey()
    setAi(next)
    setAiStatus('API key cleared')
  }

  const test = async (): Promise<void> => {
    if (apiKeyDraft.trim()) {
      await window.ebenezer.setAiApiKey(apiKeyDraft)
      setApiKeyDraft('')
    }
    setTesting(true)
    setAiStatus('Testing connection…')
    try {
      const result = await window.ebenezer.testAiConnection()
      setAiStatus(result.ok ? `OK — ${result.message}` : `Failed — ${result.message}`)
      await refreshAi()
    } catch (e) {
      setAiStatus(e instanceof Error ? e.message : String(e))
    } finally {
      setTesting(false)
    }
  }

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'editor', label: 'Editor' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'terminal', label: 'Terminal' },
    { id: 'ai', label: 'AI / Models' },
    { id: 'git', label: 'Git' },
    { id: 'security', label: 'Security' },
    { id: 'keyboard', label: 'Keyboard' },
    { id: 'extensions', label: 'Extensions' }
  ]

  return (
    <div className="settings-page">
      <h3 style={{ margin: 0 }}>Settings</h3>
      <div className="settings-tabs" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <label>
          <span>Show hidden / ignored folders</span>
          <input
            type="checkbox"
            checked={settings.showHiddenFiles}
            onChange={(e) => void update({ showHiddenFiles: e.target.checked })}
          />
        </label>
      )}

      {tab === 'editor' && (
        <>
          <label>
            Editor font size
            <input
              type="number"
              min={10}
              max={28}
              value={settings.editorFontSize}
              onChange={(e) => void update({ editorFontSize: Number(e.target.value) })}
            />
          </label>
          <label>
            Tab size
            <input
              type="number"
              min={1}
              max={8}
              value={settings.editorTabSize}
              onChange={(e) => void update({ editorTabSize: Number(e.target.value) })}
            />
          </label>
          <label>
            <span>Word wrap</span>
            <input
              type="checkbox"
              checked={settings.editorWordWrap}
              onChange={(e) => void update({ editorWordWrap: e.target.checked })}
            />
          </label>
        </>
      )}

      {tab === 'appearance' && (
        <p className="muted">
          Theme: <strong>Dark</strong> (Phase 1 default). More themes Coming Soon.
        </p>
      )}

      {tab === 'terminal' && (
        <label>
          Terminal font size
          <input
            type="number"
            min={10}
            max={24}
            value={settings.terminalFontSize}
            onChange={(e) => void update({ terminalFontSize: Number(e.target.value) })}
          />
        </label>
      )}

      {tab === 'ai' && ai && (
        <div className="settings-ai">
          {ai.provider === 'qwen' ? (
            <p className="ai-banner muted" style={{ margin: 0 }}>
              Qwen needs a <strong>DashScope API key</strong> from Alibaba Cloud (not an OpenAI key).
              Get it from the DashScope console. Paste key → click <strong>Save &amp; Test</strong>.
            </p>
          ) : null}

          <label>
            Provider
            <select
              value={ai.provider}
              onChange={(e) => void applyProviderPreset(e.target.value as AiProviderId)}
            >
              {(Object.keys(AI_PROVIDER_PRESETS) as AiProviderId[]).map((id) => (
                <option key={id} value={id}>
                  {AI_PROVIDER_PRESETS[id].label}
                </option>
              ))}
            </select>
          </label>

          {ai.provider === 'qwen' ? (
            <div className="row">
              <button
                type="button"
                className="ghost"
                onClick={() =>
                  setAi({
                    ...ai,
                    endpoint: AI_PROVIDER_PRESETS.qwen.endpoint
                  })
                }
              >
                China endpoint
              </button>
              <button
                type="button"
                className="ghost"
                onClick={() => setAi({ ...ai, endpoint: QWEN_INTL_ENDPOINT })}
              >
                International endpoint
              </button>
            </div>
          ) : null}

          <label>
            Endpoint
            <input
              value={ai.endpoint}
              onChange={(e) => setAi({ ...ai, endpoint: e.target.value })}
              spellCheck={false}
            />
          </label>
          <label>
            Model
            <input
              value={ai.model}
              onChange={(e) => setAi({ ...ai, model: e.target.value })}
              spellCheck={false}
              placeholder="qwen-plus"
            />
          </label>
          <label>
            Temperature
            <input
              type="number"
              min={0}
              max={2}
              step={0.1}
              value={ai.temperature}
              onChange={(e) => setAi({ ...ai, temperature: Number(e.target.value) })}
            />
          </label>
          <label>
            Max output tokens
            <input
              type="number"
              min={256}
              max={128000}
              value={ai.maxTokens}
              onChange={(e) => setAi({ ...ai, maxTokens: Number(e.target.value) })}
            />
          </label>
          <label>
            Context size (chars budget)
            <input
              type="number"
              min={4000}
              max={200000}
              value={ai.contextSize}
              onChange={(e) => setAi({ ...ai, contextSize: Number(e.target.value) })}
            />
          </label>
          <label>
            API key {ai.hasApiKey ? '(saved ✓)' : '(not set — required for Qwen)'}
            <input
              type="password"
              value={apiKeyDraft}
              placeholder={
                ai.hasApiKey ? '•••••••• (paste new key to replace)' : 'Paste DashScope sk-... key here'
              }
              onChange={(e) => setApiKeyDraft(e.target.value)}
              autoComplete="off"
            />
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            <button type="button" className="primary" onClick={() => void saveAll()} disabled={testing}>
              {testing ? 'Testing…' : 'Save & Test'}
            </button>
            <button type="button" onClick={() => void test()} disabled={testing}>
              Test only
            </button>
            <button type="button" className="ghost" onClick={() => void clearKey()} disabled={!ai.hasApiKey}>
              Clear key
            </button>
          </div>
          {aiStatus ? (
            <p
              className={
                aiStatus.startsWith('Failed') || aiStatus.includes('missing') || aiStatus.includes('not set')
                  ? 'ai-error'
                  : 'muted'
              }
            >
              {aiStatus}
            </p>
          ) : null}
          <p className="muted">Keys use OS secure storage. Never put keys in project files or Git.</p>
        </div>
      )}

      {tab === 'git' && (
        <p className="muted">
          Basic Git status / stage / commit is available in the Git panel. Push / pull / branch UI:
          Coming Soon.
        </p>
      )}

      {tab === 'security' && (
        <p className="muted">
          <strong>Coming Soon (Phase 5 agent).</strong> Agent permission levels and approval dialogs
          for write / terminal / network.
        </p>
      )}

      {tab === 'keyboard' && (
        <p className="muted">
          Ctrl+Shift+P command palette · Ctrl+S save · Ctrl+` terminal. Custom keybindings: Coming
          Soon.
        </p>
      )}

      {tab === 'extensions' && (
        <p className="muted">Extension architecture: Coming Soon (Phase 6).</p>
      )}
    </div>
  )
}
