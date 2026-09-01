import { languageFromPath, useIdeStore } from '../state/ide-store'

export async function openProject(path: string): Promise<void> {
  const recent = await window.ebenezer.addRecentProject(path)
  useIdeStore.getState().setRecent(recent)
  useIdeStore.getState().setProject(path)
  const entries = await window.ebenezer.listDir(path)
  useIdeStore.getState().setRootEntries(entries)
  const git = await window.ebenezer.gitStatus(path)
  useIdeStore.getState().setGit(git)
  useIdeStore.getState().setActivity('explorer')
}

export async function openFileInEditor(filePath: string): Promise<void> {
  const content = await window.ebenezer.readFile(filePath)
  const name = filePath.replace(/\\/g, '/').split('/').pop() || filePath
  useIdeStore.getState().openTab({
    path: filePath,
    name,
    content,
    original: content,
    language: languageFromPath(filePath)
  })
}

export async function saveActiveFile(): Promise<void> {
  const { activePath, tabs, markSaved } = useIdeStore.getState()
  if (!activePath) return
  const tab = tabs.find((t) => t.path === activePath)
  if (!tab) return
  await window.ebenezer.writeFile(tab.path, tab.content)
  markSaved(tab.path, tab.content)
}

export async function refreshGit(): Promise<void> {
  const root = useIdeStore.getState().projectRoot
  if (!root) return
  const git = await window.ebenezer.gitStatus(root)
  useIdeStore.getState().setGit(git)
}

export async function refreshExplorer(): Promise<void> {
  const root = useIdeStore.getState().projectRoot
  if (!root) return
  const entries = await window.ebenezer.listDir(root)
  useIdeStore.getState().setRootEntries(entries)
  useIdeStore.getState().setExpanded(root, entries)
}
