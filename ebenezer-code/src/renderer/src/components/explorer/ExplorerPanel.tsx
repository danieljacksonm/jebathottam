import { useState } from 'react'
import type { FileEntry } from '../../../../shared/types'
import { openFileInEditor, refreshExplorer } from '../../lib/project-actions'
import { useIdeStore } from '../../state/ide-store'

function TreeNode({ entry, depth }: { entry: FileEntry; depth: number }): JSX.Element {
  const expanded = useIdeStore((s) => s.expanded)
  const setExpanded = useIdeStore((s) => s.setExpanded)
  const activePath = useIdeStore((s) => s.activePath)
  const children = expanded[entry.path]
  const open = Boolean(children)

  const toggle = async (): Promise<void> => {
    if (!entry.isDirectory) {
      await openFileInEditor(entry.path)
      return
    }
    if (open) {
      const next = { ...useIdeStore.getState().expanded }
      delete next[entry.path]
      useIdeStore.setState({ expanded: next })
      return
    }
    const list = await window.ebenezer.listDir(entry.path)
    setExpanded(entry.path, list)
  }

  return (
    <div>
      <div
        className={`tree-item ${activePath === entry.path ? 'active' : ''}`}
        style={{ paddingLeft: 8 + depth * 12 }}
        onClick={() => void toggle()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') void toggle()
        }}
        role="treeitem"
        tabIndex={0}
      >
        <span className="icon">{entry.isDirectory ? (open ? '▾' : '▸') : '·'}</span>
        <span>{entry.name}</span>
      </div>
      {open &&
        children?.map((child) => <TreeNode key={child.path} entry={child} depth={depth + 1} />)}
    </div>
  )
}

export function ExplorerPanel(): JSX.Element {
  const projectRoot = useIdeStore((s) => s.projectRoot)
  const rootEntries = useIdeStore((s) => s.rootEntries)
  const [busy, setBusy] = useState(false)

  if (!projectRoot) {
    return <div className="coming-soon">Open a project to browse files.</div>
  }

  const newFile = async (): Promise<void> => {
    const name = window.prompt('New file name (relative to project root)')
    if (!name) return
    setBusy(true)
    try {
      const sep = projectRoot.includes('\\') ? '\\' : '/'
      await window.ebenezer.createFile(`${projectRoot}${sep}${name}`)
      await refreshExplorer()
      await openFileInEditor(`${projectRoot}${sep}${name}`)
    } finally {
      setBusy(false)
    }
  }

  const newFolder = async (): Promise<void> => {
    const name = window.prompt('New folder name')
    if (!name) return
    setBusy(true)
    try {
      const sep = projectRoot.includes('\\') ? '\\' : '/'
      await window.ebenezer.createDir(`${projectRoot}${sep}${name}`)
      await refreshExplorer()
    } finally {
      setBusy(false)
    }
  }

  const deleteSelected = async (): Promise<void> => {
    const active = useIdeStore.getState().activePath
    if (!active) return
    if (!window.confirm(`Delete ${active}?`)) return
    await window.ebenezer.deletePath(active)
    useIdeStore.getState().closeTab(active)
    await refreshExplorer()
  }

  return (
    <>
      <div className="sidebar-header">
        <span>Explorer</span>
        <div className="row">
          <button type="button" className="ghost" disabled={busy} onClick={() => void newFile()}>
            +F
          </button>
          <button type="button" className="ghost" disabled={busy} onClick={() => void newFolder()}>
            +D
          </button>
          <button type="button" className="ghost" onClick={() => void deleteSelected()}>
            Del
          </button>
        </div>
      </div>
      <div className="sidebar-body" role="tree">
        {rootEntries.map((e) => (
          <TreeNode key={e.path} entry={e} depth={0} />
        ))}
      </div>
    </>
  )
}
