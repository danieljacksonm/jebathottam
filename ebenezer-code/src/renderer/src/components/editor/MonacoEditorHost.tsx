import { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import { useIdeStore } from '../../state/ide-store'

export function MonacoEditorHost(): JSX.Element {
  const hostRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const activePath = useIdeStore((s) => s.activePath)
  const tabs = useIdeStore((s) => s.tabs)
  const settings = useIdeStore((s) => s.settings)
  const updateTabContent = useIdeStore((s) => s.updateTabContent)
  const setSelection = useIdeStore((s) => s.setSelection)
  const tab = tabs.find((t) => t.path === activePath)

  useEffect(() => {
    if (!hostRef.current) return
    const editor = monaco.editor.create(hostRef.current, {
      value: '',
      language: 'plaintext',
      theme: 'vs-dark',
      automaticLayout: true,
      fontSize: settings.editorFontSize,
      tabSize: settings.editorTabSize,
      wordWrap: settings.editorWordWrap ? 'on' : 'off',
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      folding: true,
      matchBrackets: 'always',
      lineNumbers: 'on',
      renderLineHighlight: 'line'
    })
    editorRef.current = editor
    const subContent = editor.onDidChangeModelContent(() => {
      const path = useIdeStore.getState().activePath
      if (!path) return
      updateTabContent(path, editor.getValue())
    })
    const subSel = editor.onDidChangeCursorSelection(() => {
      const model = editor.getModel()
      if (!model) {
        setSelection('')
        return
      }
      const sel = editor.getSelection()
      if (!sel || sel.isEmpty()) {
        setSelection('')
        return
      }
      setSelection(model.getValueInRange(sel))
    })
    return () => {
      subContent.dispose()
      subSel.dispose()
      editor.dispose()
      editorRef.current = null
    }
    // intentionally mount once; settings applied in separate effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    editor.updateOptions({
      fontSize: settings.editorFontSize,
      tabSize: settings.editorTabSize,
      wordWrap: settings.editorWordWrap ? 'on' : 'off'
    })
  }, [settings.editorFontSize, settings.editorTabSize, settings.editorWordWrap])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    if (!tab) {
      editor.setModel(null)
      setSelection('')
      return
    }
    const uriPath = tab.path.replace(/\\/g, '/')
    const model =
      monaco.editor.getModels().find((m) => m.uri.path === uriPath || m.uri.fsPath === tab.path) ||
      monaco.editor.createModel(tab.content, tab.language, monaco.Uri.file(tab.path))
    if (model.getLanguageId() !== tab.language) {
      monaco.editor.setModelLanguage(model, tab.language)
    }
    if (editor.getModel() !== model) {
      editor.setModel(model)
      if (model.getValue() !== tab.content) {
        model.setValue(tab.content)
      }
    }
  }, [tab?.path, tab?.language, setSelection])

  return (
    <div className="monaco-host-wrap">
      {!tab ? (
        <div className="monaco-empty muted">Open a file from the explorer.</div>
      ) : null}
      <div
        className="monaco-host"
        ref={hostRef}
        style={{ visibility: tab ? 'visible' : 'hidden' }}
      />
    </div>
  )
}

export function EditorTabs(): JSX.Element {
  const tabs = useIdeStore((s) => s.tabs)
  const activePath = useIdeStore((s) => s.activePath)
  const setActivePath = useIdeStore((s) => s.setActivePath)
  const closeTab = useIdeStore((s) => s.closeTab)

  return (
    <div className="tabs">
      {tabs.map((tab) => {
        const dirty = tab.content !== tab.original
        return (
          <button
            key={tab.path}
            type="button"
            className={`tab ${activePath === tab.path ? 'active' : ''}`}
            onClick={() => setActivePath(tab.path)}
          >
            {dirty ? <span className="dirty">●</span> : null}
            {tab.name}
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                closeTab(tab.path)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation()
                  closeTab(tab.path)
                }
              }}
            >
              ×
            </span>
          </button>
        )
      })}
    </div>
  )
}
