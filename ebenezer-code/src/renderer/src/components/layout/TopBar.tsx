import { useEffect, useState } from 'react'
import { useIdeStore } from '../../state/ide-store'
import { openProject } from '../../lib/project-actions'
import type { AiSettingsPublic } from '../../../../shared/types'

export function TopBar(): JSX.Element {
  const projectName = useIdeStore((s) => s.projectName)
  const setPaletteOpen = useIdeStore((s) => s.setPaletteOpen)
  const setAiOpen = useIdeStore((s) => s.setAiOpen)
  const aiOpen = useIdeStore((s) => s.aiOpen)
  const setActivity = useIdeStore((s) => s.setActivity)
  const [ai, setAi] = useState<AiSettingsPublic | null>(null)

  useEffect(() => {
    void window.ebenezer.getAiSettings().then(setAi)
    const id = window.setInterval(() => {
      void window.ebenezer.getAiSettings().then(setAi)
    }, 5000)
    return () => window.clearInterval(id)
  }, [])

  const ready = Boolean(ai && (ai.provider === 'local' || ai.hasApiKey))

  return (
    <header className="topbar">
      <div className="logo">
        EBENEZER <span>CODE</span>
      </div>
      <div className="project-name">{projectName || 'No project'}</div>
      <div className="spacer" />
      <button type="button" className="ghost" onClick={() => setPaletteOpen(true)}>
        Command
      </button>
      <button
        type="button"
        className="ghost"
        onClick={() => {
          void window.ebenezer.openDirectory().then((d) => {
            if (d) return openProject(d)
          })
        }}
      >
        Open
      </button>
      <span className="muted" title={ai ? `${ai.provider} · ${ai.model}` : 'AI'}>
        {ready ? 'AI Ready' : 'AI Offline'}
      </span>
      <button type="button" className="ghost" onClick={() => setActivity('settings')} title="AI models">
        {ai?.model || 'Model'}
      </button>
      <button type="button" className="ghost" onClick={() => setAiOpen(!aiOpen)}>
        AI Panel
      </button>
      <button type="button" className="ghost" onClick={() => setActivity('settings')}>
        Settings
      </button>
    </header>
  )
}
