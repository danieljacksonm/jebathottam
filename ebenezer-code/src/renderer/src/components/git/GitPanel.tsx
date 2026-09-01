import { useState } from 'react'
import { refreshGit } from '../../lib/project-actions'
import { useIdeStore } from '../../state/ide-store'

export function GitPanel(): JSX.Element {
  const projectRoot = useIdeStore((s) => s.projectRoot)
  const git = useIdeStore((s) => s.git)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (!projectRoot) {
    return <div className="coming-soon">Open a project to use Git.</div>
  }

  if (!git) {
    return (
      <div className="coming-soon">
        <button type="button" onClick={() => void refreshGit()}>
          Load Git status
        </button>
      </div>
    )
  }

  if (!git.isRepo) {
    return (
      <div className="coming-soon">
        This folder is not a Git repository.
        <div className="row" style={{ marginTop: 8 }}>
          <button type="button" onClick={() => void refreshGit()}>
            Refresh
          </button>
        </div>
      </div>
    )
  }

  const stage = async (path: string): Promise<void> => {
    setError('')
    await window.ebenezer.gitStage(projectRoot, [path])
    await refreshGit()
  }

  const unstage = async (path: string): Promise<void> => {
    setError('')
    await window.ebenezer.gitUnstage(projectRoot, [path])
    await refreshGit()
  }

  const commit = async (): Promise<void> => {
    setError('')
    if (!message.trim()) {
      setError('Commit message required')
      return
    }
    try {
      await window.ebenezer.gitCommit(projectRoot, message.trim())
      setMessage('')
      await refreshGit()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="git-list">
      <div className="row" style={{ marginBottom: 8 }}>
        <strong>Branch: {git.branch}</strong>
        <button type="button" className="ghost" onClick={() => void refreshGit()}>
          Refresh
        </button>
      </div>
      {git.files.length === 0 && <p className="muted">Working tree clean.</p>}
      {git.files.map((f) => {
        const staged = f.index !== ' ' && f.index !== '?'
        return (
          <div key={f.path} className="git-file">
            <span>
              [{f.index}
              {f.working_dir}] {f.path}
            </span>
            <span className="row">
              {staged ? (
                <button type="button" className="ghost" onClick={() => void unstage(f.path)}>
                  Unstage
                </button>
              ) : (
                <button type="button" className="ghost" onClick={() => void stage(f.path)}>
                  Stage
                </button>
              )}
            </span>
          </div>
        )
      })}
      <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
        <input
          placeholder="Commit message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="button" className="primary" onClick={() => void commit()}>
          Commit
        </button>
        <p className="muted">Push / Pull: Coming Soon</p>
        {error ? <p style={{ color: 'var(--danger)' }}>{error}</p> : null}
        {git.error ? <p style={{ color: 'var(--danger)' }}>{git.error}</p> : null}
      </div>
    </div>
  )
}
