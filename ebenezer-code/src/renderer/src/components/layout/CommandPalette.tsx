import { useEffect, useMemo, useState } from 'react'
import { openProject, saveActiveFile } from '../../lib/project-actions'
import { useIdeStore } from '../../state/ide-store'

type Command = { id: string; label: string; run: () => void | Promise<void> }

export function CommandPalette(): JSX.Element | null {
  const open = useIdeStore((s) => s.paletteOpen)
  const setPaletteOpen = useIdeStore((s) => s.setPaletteOpen)
  const setActivity = useIdeStore((s) => s.setActivity)
  const setBottomTab = useIdeStore((s) => s.setBottomTab)
  const setProject = useIdeStore((s) => s.setProject)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)

  const commands = useMemo<Command[]>(
    () => [
      {
        id: 'open',
        label: 'Open Project',
        run: async () => {
          const dir = await window.ebenezer.openDirectory()
          if (dir) await openProject(dir)
        }
      },
      {
        id: 'close-project',
        label: 'Close Project',
        run: () => setProject(null)
      },
      {
        id: 'save',
        label: 'Save File',
        run: () => saveActiveFile()
      },
      {
        id: 'explorer',
        label: 'Show Explorer',
        run: () => setActivity('explorer')
      },
      {
        id: 'git',
        label: 'Show Git',
        run: () => {
          setActivity('git')
          setBottomTab('git')
        }
      },
      {
        id: 'terminal',
        label: 'Open Terminal',
        run: () => setBottomTab('terminal')
      },
      {
        id: 'settings',
        label: 'Settings',
        run: () => setActivity('settings')
      },
      {
        id: 'ai',
        label: 'AI Chat',
        run: () => {
          setActivity('ai')
          useIdeStore.getState().setAiOpen(true)
        }
      },
      {
        id: 'ai-settings',
        label: 'AI Models Settings',
        run: () => setActivity('settings')
      }
    ],
    [setActivity, setBottomTab, setProject]
  )

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    setIndex(0)
  }, [query, open])

  if (!open) return null

  const run = async (cmd: Command): Promise<void> => {
    setPaletteOpen(false)
    setQuery('')
    await cmd.run()
  }

  return (
    <div className="palette-backdrop" onClick={() => setPaletteOpen(false)}>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          placeholder="Type a command…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setPaletteOpen(false)
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setIndex((i) => Math.min(filtered.length - 1, i + 1))
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              setIndex((i) => Math.max(0, i - 1))
            }
            if (e.key === 'Enter' && filtered[index]) void run(filtered[index])
          }}
        />
        {filtered.map((cmd, i) => (
          <button
            key={cmd.id}
            type="button"
            className={`palette-item ${i === index ? 'active' : ''}`}
            onClick={() => void run(cmd)}
          >
            {cmd.label}
          </button>
        ))}
      </div>
    </div>
  )
}
