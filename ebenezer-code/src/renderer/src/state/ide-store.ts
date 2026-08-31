import { create } from 'zustand'
import type { AppSettings, FileEntry, GitStatusResult, RecentProject } from '../../../shared/types'
import { DEFAULT_SETTINGS } from '../../../shared/types'

export type OpenTab = {
  path: string
  name: string
  content: string
  original: string
  language: string
}

export type ActivityView = 'explorer' | 'search' | 'git' | 'extensions' | 'ai' | 'settings'
export type BottomTab = 'terminal' | 'problems' | 'output' | 'git'

type IdeState = {
  projectRoot: string | null
  projectName: string | null
  recent: RecentProject[]
  activity: ActivityView
  bottomTab: BottomTab
  aiOpen: boolean
  rootEntries: FileEntry[]
  expanded: Record<string, FileEntry[]>
  tabs: OpenTab[]
  activePath: string | null
  selection: string
  git: GitStatusResult | null
  settings: AppSettings
  paletteOpen: boolean
  setActivity: (v: ActivityView) => void
  setBottomTab: (v: BottomTab) => void
  setAiOpen: (v: boolean) => void
  setPaletteOpen: (v: boolean) => void
  setRecent: (recent: RecentProject[]) => void
  setSettings: (settings: AppSettings) => void
  setProject: (root: string | null) => void
  setRootEntries: (entries: FileEntry[]) => void
  setExpanded: (path: string, entries: FileEntry[]) => void
  openTab: (tab: OpenTab) => void
  closeTab: (path: string) => void
  setActivePath: (path: string | null) => void
  updateTabContent: (path: string, content: string) => void
  markSaved: (path: string, content: string) => void
  setSelection: (selection: string) => void
  setGit: (git: GitStatusResult | null) => void
}

function languageFromPath(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() || ''
  const map: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    md: 'markdown',
    css: 'css',
    html: 'html',
    htm: 'html',
    py: 'python',
    php: 'php',
    rs: 'rust',
    go: 'go',
    java: 'java',
    kt: 'kotlin',
    xml: 'xml',
    yml: 'yaml',
    yaml: 'yaml',
    sh: 'shell',
    bash: 'shell',
    sql: 'sql'
  }
  return map[ext] || 'plaintext'
}

export { languageFromPath }

export const useIdeStore = create<IdeState>((set, get) => ({
  projectRoot: null,
  projectName: null,
  recent: [],
  activity: 'explorer',
  bottomTab: 'terminal',
  aiOpen: true,
  rootEntries: [],
  expanded: {},
  tabs: [],
  activePath: null,
  selection: '',
  git: null,
  settings: DEFAULT_SETTINGS,
  paletteOpen: false,
  setActivity: (activity) => set({ activity }),
  setBottomTab: (bottomTab) => set({ bottomTab }),
  setAiOpen: (aiOpen) => set({ aiOpen }),
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
  setRecent: (recent) => set({ recent }),
  setSettings: (settings) => set({ settings }),
  setProject: (root) =>
    set({
      projectRoot: root,
      projectName: root ? root.replace(/\\/g, '/').split('/').pop() || root : null,
      rootEntries: [],
      expanded: {},
      tabs: [],
      activePath: null,
      selection: '',
      git: null
    }),
  setRootEntries: (rootEntries) => set({ rootEntries }),
  setExpanded: (path, entries) => set({ expanded: { ...get().expanded, [path]: entries } }),
  openTab: (tab) => {
    const existing = get().tabs.find((t) => t.path === tab.path)
    if (existing) {
      set({ activePath: tab.path })
      return
    }
    set({ tabs: [...get().tabs, tab], activePath: tab.path })
  },
  closeTab: (path) => {
    const tabs = get().tabs.filter((t) => t.path !== path)
    const activePath =
      get().activePath === path ? tabs[tabs.length - 1]?.path || null : get().activePath
    set({ tabs, activePath })
  },
  setActivePath: (activePath) => set({ activePath }),
  updateTabContent: (path, content) =>
    set({
      tabs: get().tabs.map((t) => (t.path === path ? { ...t, content } : t))
    }),
  markSaved: (path, content) =>
    set({
      tabs: get().tabs.map((t) =>
        t.path === path ? { ...t, content, original: content } : t
      )
    }),
  setSelection: (selection) => set({ selection }),
  setGit: (git) => set({ git })
}))
