import Store from 'electron-store'
import path from 'node:path'
import type { RecentProject } from '../../shared/types'
import { detectTechnology } from './project-detect'

type StoreShape = {
  recentProjects: RecentProject[]
}

const store = new Store<StoreShape>({
  name: 'ebenezer-code',
  defaults: { recentProjects: [] }
})

export function getRecentProjects(): RecentProject[] {
  return store.get('recentProjects') || []
}

export async function addRecentProject(projectPath: string): Promise<RecentProject[]> {
  const name = path.basename(projectPath)
  const technology = await detectTechnology(projectPath)
  const entry: RecentProject = {
    name,
    path: projectPath,
    lastOpened: new Date().toISOString(),
    technology
  }
  const existing = getRecentProjects().filter((p) => p.path !== projectPath)
  const next = [entry, ...existing].slice(0, 20)
  store.set('recentProjects', next)
  return next
}
