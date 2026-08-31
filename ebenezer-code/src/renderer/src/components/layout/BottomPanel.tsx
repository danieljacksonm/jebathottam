import { useIdeStore } from '../../state/ide-store'
import { TerminalPanel } from '../terminal/TerminalPanel'
import { GitPanel } from '../git/GitPanel'

export function BottomPanel(): JSX.Element {
  const bottomTab = useIdeStore((s) => s.bottomTab)
  const setBottomTab = useIdeStore((s) => s.setBottomTab)

  return (
    <section className="bottom-panel">
      <div className="bottom-tabs">
        {(
          [
            ['terminal', 'Terminal'],
            ['problems', 'Problems'],
            ['output', 'Output'],
            ['git', 'Git']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={bottomTab === id ? 'active' : ''}
            onClick={() => setBottomTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="bottom-body">
        {bottomTab === 'terminal' && <TerminalPanel />}
        {bottomTab === 'git' && <GitPanel />}
        {bottomTab === 'problems' && (
          <div className="coming-soon">Problems panel: Coming Soon (Phase 4 error assistant).</div>
        )}
        {bottomTab === 'output' && (
          <div className="coming-soon">Output channel: Coming Soon.</div>
        )}
      </div>
    </section>
  )
}
