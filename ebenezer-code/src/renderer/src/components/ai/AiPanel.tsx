import { useEffect, useRef, useState } from 'react'
import type { AiChatMessage, AiSettingsPublic } from '../../../../shared/types'
import { useIdeStore } from '../../state/ide-store'

function newId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function AiPanel(): JSX.Element {
  const projectRoot = useIdeStore((s) => s.projectRoot)
  const activePath = useIdeStore((s) => s.activePath)
  const tabs = useIdeStore((s) => s.tabs)
  const selection = useIdeStore((s) => s.selection)
  const setActivity = useIdeStore((s) => s.setActivity)

  const [ai, setAi] = useState<AiSettingsPublic | null>(null)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [messages, setMessages] = useState<AiChatMessage[]>([])
  const requestIdRef = useRef<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const activeTab = tabs.find((t) => t.path === activePath)

  useEffect(() => {
    void window.ebenezer.getAiSettings().then(setAi)
  }, [])

  useEffect(() => {
    const off = window.ebenezer.onAiChatChunk((chunk) => {
      if (!requestIdRef.current || chunk.requestId !== requestIdRef.current) return
      if (chunk.error) {
        setError(chunk.error)
        setBusy(false)
        requestIdRef.current = null
        return
      }
      if (chunk.delta) {
        setMessages((prev) => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last?.role === 'assistant') {
            next[next.length - 1] = { ...last, content: last.content + chunk.delta }
          } else {
            next.push({ role: 'assistant', content: chunk.delta || '' })
          }
          return next
        })
      }
      if (chunk.done) {
        setBusy(false)
        requestIdRef.current = null
      }
    })
    return off
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, busy])

  const send = async (): Promise<void> => {
    const text = input.trim()
    if (!text || busy) return
    setError('')
    setInput('')

    const userMessage: AiChatMessage = { role: 'user', content: text }
    const history = [...messages, userMessage]
    setMessages(history)
    setBusy(true)

    const requestId = newId()
    requestIdRef.current = requestId
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    try {
      await window.ebenezer.aiChatStart({
        requestId,
        messages: history,
        context: {
          projectRoot,
          filePath: activePath,
          fileContent: activeTab?.content ?? null,
          selection: selection || null,
          includeRules: true
        }
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setBusy(false)
      requestIdRef.current = null
    }
  }

  const stop = (): void => {
    if (requestIdRef.current) {
      void window.ebenezer.aiChatAbort(requestIdRef.current)
    }
  }

  const clear = (): void => {
    if (busy && requestIdRef.current) void window.ebenezer.aiChatAbort(requestIdRef.current)
    setMessages([])
    setError('')
    setBusy(false)
    requestIdRef.current = null
  }

  const statusLabel = !ai
    ? 'Loading…'
    : ai.provider === 'local' || ai.hasApiKey
      ? `${ai.provider} · ${ai.model}`
      : 'Not configured'

  return (
    <div className="ai-chat">
      <div className="sidebar-header">
        <span>AI Chat</span>
        <button type="button" className="ghost" onClick={() => setActivity('settings')}>
          Models
        </button>
      </div>

      <div className="ai-meta muted">
        <div>{statusLabel}</div>
        <div>
          Context: {activePath ? activePath.split(/[/\\]/).pop() : 'none'}
          {selection ? ' + selection' : ''}
        </div>
      </div>

      {!ai?.hasApiKey && ai?.provider !== 'local' ? (
        <p className="ai-banner muted">
          Configure an API key in Settings → AI / Models. Local models can run without a key.
        </p>
      ) : null}

      <div className="ai-messages" ref={listRef}>
        {messages.length === 0 ? (
          <p className="muted" style={{ padding: '0.5rem 0.75rem' }}>
            Ask about the open file or selection. Example: “Explain this code” or “Find likely bugs
            here.” Full codebase search arrives in Phase 3.
          </p>
        ) : (
          messages.map((m, i) => (
            <div key={`${m.role}-${i}`} className={`ai-msg ai-msg-${m.role}`}>
              <div className="ai-msg-role">{m.role === 'user' ? 'You' : 'Ebenezer'}</div>
              <pre className="ai-msg-body">{m.content || (busy && i === messages.length - 1 ? '…' : '')}</pre>
            </div>
          ))
        )}
      </div>

      {error ? <div className="ai-error">{error}</div> : null}

      <div className="ai-compose">
        <textarea
          rows={3}
          value={input}
          placeholder="Ask Ebenezer Code…"
          disabled={busy}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void send()
            }
          }}
        />
        <div className="ai-compose-actions">
          <button type="button" className="ghost" onClick={clear} disabled={busy && !requestIdRef.current}>
            Clear
          </button>
          {busy ? (
            <button type="button" onClick={stop}>
              Stop
            </button>
          ) : (
            <button type="button" className="primary" onClick={() => void send()} disabled={!input.trim()}>
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
