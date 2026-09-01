import { useEffect, useRef } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { useIdeStore } from '../../state/ide-store'

const TERM_ID = 'main'

export function TerminalPanel(): JSX.Element {
  const hostRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<Terminal | null>(null)
  const projectRoot = useIdeStore((s) => s.projectRoot)
  const settings = useIdeStore((s) => s.settings)

  useEffect(() => {
    if (!hostRef.current || !projectRoot) return
    const term = new Terminal({
      convertEol: true,
      fontSize: settings.terminalFontSize,
      theme: {
        background: '#12151c',
        foreground: '#e8edf7',
        cursor: '#3d8bfd'
      }
    })
    const fit = new FitAddon()
    term.loadAddon(fit)
    term.open(hostRef.current)
    fit.fit()
    termRef.current = term

    void window.ebenezer.terminalCreate(TERM_ID, projectRoot)
    const offData = window.ebenezer.onTerminalData((payload) => {
      if (payload.id === TERM_ID) term.write(payload.data)
    })
    const offExit = window.ebenezer.onTerminalExit((payload) => {
      if (payload.id === TERM_ID) term.writeln(`\r\n[process exited: ${payload.exitCode}]`)
    })
    term.onData((data) => {
      void window.ebenezer.terminalWrite(TERM_ID, data)
    })

    const onResize = (): void => {
      fit.fit()
      void window.ebenezer.terminalResize(TERM_ID, term.cols, term.rows)
    }
    window.addEventListener('resize', onResize)
    onResize()

    return () => {
      offData()
      offExit()
      window.removeEventListener('resize', onResize)
      void window.ebenezer.terminalKill(TERM_ID)
      term.dispose()
      termRef.current = null
    }
  }, [projectRoot])

  if (!projectRoot) {
    return <div className="coming-soon">Open a project to use the terminal.</div>
  }

  return <div className="xterm-host" ref={hostRef} />
}
