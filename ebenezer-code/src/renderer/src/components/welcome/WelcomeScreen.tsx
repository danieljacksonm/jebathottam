import { useEffect, useState } from 'react'
import type { ProjectTemplate } from '../../../../shared/types'
import { openProject } from '../../lib/project-actions'
import { useIdeStore } from '../../state/ide-store'
import { SettingsPanel } from '../settings/SettingsPanel'

export function WelcomeScreen(): JSX.Element {
  const recent = useIdeStore((s) => s.recent)
  const setRecent = useIdeStore((s) => s.setRecent)
  const [showNew, setShowNew] = useState(false)
  const [showAiSettings, setShowAiSettings] = useState(false)
  const [name, setName] = useState('my-project')
  const [template, setTemplate] = useState<ProjectTemplate>('blank')
  const [error, setError] = useState('')

  useEffect(() => {
    void window.ebenezer.getRecentProjects().then(setRecent)
  }, [setRecent])

  const onOpen = async (): Promise<void> => {
    setError('')
    const dir = await window.ebenezer.openDirectory()
    if (!dir) return
    await openProject(dir)
  }

  const onCreate = async (): Promise<void> => {
    setError('')
    const parent = await window.ebenezer.openSaveProjectParent()
    if (!parent) return
    try {
      const root = await window.ebenezer.createProject({ parentDir: parent, name, template })
      await openProject(root)
      setShowNew(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="welcome">
      <div className="welcome-card">
        <h1>
          Ebenezer <span style={{ color: 'var(--brand)' }}>Code</span>
        </h1>
        <p className="tagline">Build with intelligence.</p>
        <div className="welcome-actions">
          <button type="button" className="primary" onClick={() => void onOpen()}>
            Open Project
          </button>
          <button type="button" onClick={() => setShowNew(true)}>
            New Project
          </button>
          <button type="button" className="ghost" onClick={() => setShowAiSettings(true)}>
            Configure AI
          </button>
        </div>

        <h3 style={{ margin: '0 0 0.5rem' }}>Recent</h3>
        <div className="recent-list">
          {recent.length === 0 && <p className="muted">No recent projects yet.</p>}
          {recent.map((p) => (
            <button
              key={p.path}
              type="button"
              className="recent-item"
              onClick={() => void openProject(p.path)}
            >
              <strong>
                {p.name} · {p.technology}
              </strong>
              <span className="path">{p.path}</span>
            </button>
          ))}
        </div>
        {error ? <p style={{ color: 'var(--danger)' }}>{error}</p> : null}
      </div>

      {showAiSettings && (
        <div className="modal-backdrop" onClick={() => setShowAiSettings(false)}>
          <div className="modal" style={{ width: 'min(520px, 94vw)', maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>AI / Models</strong>
              <button type="button" className="ghost" onClick={() => setShowAiSettings(false)}>
                Close
              </button>
            </div>
            <SettingsPanel initialTab="ai" />
          </div>
        </div>
      )}

      {showNew && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3 style={{ margin: 0 }}>New project</h3>
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              Template
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value as ProjectTemplate)}
              >
                <option value="blank">Blank</option>
                <option value="html">HTML</option>
                <option value="nodejs">Node.js</option>
              </select>
            </label>
            <p className="muted">Only implemented templates are listed.</p>
            <div className="row">
              <button type="button" className="primary" onClick={() => void onCreate()}>
                Create
              </button>
              <button type="button" onClick={() => setShowNew(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
