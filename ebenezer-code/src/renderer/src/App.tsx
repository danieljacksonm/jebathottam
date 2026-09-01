import { useEffect } from 'react'
import { ActivityBar } from './components/layout/ActivityBar'
import { BottomPanel } from './components/layout/BottomPanel'
import { CommandPalette } from './components/layout/CommandPalette'
import { TopBar } from './components/layout/TopBar'
import { ExplorerPanel } from './components/explorer/ExplorerPanel'
import { EditorTabs, MonacoEditorHost } from './components/editor/MonacoEditorHost'
import { GitPanel } from './components/git/GitPanel'
import { SettingsPanel } from './components/settings/SettingsPanel'
import { AiPanel } from './components/ai/AiPanel'
import { WelcomeScreen } from './components/welcome/WelcomeScreen'
import { saveActiveFile } from './lib/project-actions'
import { useIdeStore } from './state/ide-store'

function Sidebar(): JSX.Element {
  const activity = useIdeStore((s) => s.activity)

  if (activity === 'explorer') return <ExplorerPanel />
  if (activity === 'git') {
    return (
      <>
        <div className="sidebar-header">
          <span>Git</span>
        </div>
        <div className="sidebar-body">
          <GitPanel />
        </div>
      </>
    )
  }
  if (activity === 'settings') {
    return (
      <>
        <div className="sidebar-header">
          <span>Settings</span>
        </div>
        <div className="sidebar-body">
          <SettingsPanel />
        </div>
      </>
    )
  }
  if (activity === 'search') {
    return <div className="coming-soon">Codebase search: Coming Soon (Phase 3).</div>
  }
  if (activity === 'extensions') {
    return <div className="coming-soon">Extensions: Coming Soon (Phase 5).</div>
  }
  return <AiPanel />
}

export default function App(): JSX.Element {
  const projectRoot = useIdeStore((s) => s.projectRoot)
  const aiOpen = useIdeStore((s) => s.aiOpen)
  const setPaletteOpen = useIdeStore((s) => s.setPaletteOpen)

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const meta = e.ctrlKey || e.metaKey
      if (meta && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        setPaletteOpen(true)
      }
      if (meta && e.key.toLowerCase() === 's') {
        e.preventDefault()
        void saveActiveFile()
      }
      if (meta && e.key === '`') {
        e.preventDefault()
        useIdeStore.getState().setBottomTab('terminal')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setPaletteOpen])

  if (!projectRoot) {
    return (
      <div className="app-shell">
        <TopBar />
        <WelcomeScreen />
        <CommandPalette />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <TopBar />
      <div className={`workspace ${aiOpen ? '' : 'ai-collapsed'}`}>
        <ActivityBar />
        <aside className="sidebar">
          <Sidebar />
        </aside>
        <main className="editor-area">
          <EditorTabs />
          <MonacoEditorHost />
        </main>
        {aiOpen ? (
          <aside className="ai-panel">
            <AiPanel />
          </aside>
        ) : (
          <aside className="ai-panel" style={{ display: 'none' }} />
        )}
        <BottomPanel />
      </div>
      <CommandPalette />
    </div>
  )
}
