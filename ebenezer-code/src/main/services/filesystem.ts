import fs from 'node:fs/promises'
import path from 'node:path'
import type { FileEntry } from '../../shared/types'

const DEFAULT_HIDDEN = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage', 'vendor', 'out', 'release'])

export function isPathInside(root: string, target: string): boolean {
  const resolvedRoot = path.resolve(root)
  const resolvedTarget = path.resolve(target)
  const rel = path.relative(resolvedRoot, resolvedTarget)
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))
}

export async function listDirectory(
  dirPath: string,
  opts: { showHidden?: boolean; projectRoot?: string } = {}
): Promise<FileEntry[]> {
  if (opts.projectRoot && !isPathInside(opts.projectRoot, dirPath)) {
    throw new Error('Path is outside the open project')
  }
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  const result: FileEntry[] = []
  for (const entry of entries) {
    if (!opts.showHidden && (entry.name.startsWith('.') || DEFAULT_HIDDEN.has(entry.name))) {
      continue
    }
    result.push({
      name: entry.name,
      path: path.join(dirPath, entry.name),
      isDirectory: entry.isDirectory()
    })
  }
  result.sort((a, b) => {
    if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1
    return a.name.localeCompare(b.name)
  })
  return result
}

export async function readTextFile(filePath: string, projectRoot?: string): Promise<string> {
  if (projectRoot && !isPathInside(projectRoot, filePath)) {
    throw new Error('Path is outside the open project')
  }
  return fs.readFile(filePath, 'utf8')
}

export async function writeTextFile(filePath: string, content: string, projectRoot?: string): Promise<void> {
  if (projectRoot && !isPathInside(projectRoot, filePath)) {
    throw new Error('Path is outside the open project')
  }
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content, 'utf8')
}

export async function createFile(filePath: string, projectRoot?: string): Promise<void> {
  if (projectRoot && !isPathInside(projectRoot, filePath)) {
    throw new Error('Path is outside the open project')
  }
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, '', { flag: 'wx' })
}

export async function createDirectory(dirPath: string, projectRoot?: string): Promise<void> {
  if (projectRoot && !isPathInside(projectRoot, dirPath)) {
    throw new Error('Path is outside the open project')
  }
  await fs.mkdir(dirPath, { recursive: true })
}

export async function renamePath(from: string, to: string, projectRoot?: string): Promise<void> {
  if (projectRoot) {
    if (!isPathInside(projectRoot, from) || !isPathInside(projectRoot, to)) {
      throw new Error('Path is outside the open project')
    }
  }
  await fs.rename(from, to)
}

export async function deletePath(target: string, projectRoot?: string): Promise<void> {
  if (projectRoot && !isPathInside(projectRoot, target)) {
    throw new Error('Path is outside the open project')
  }
  await fs.rm(target, { recursive: true, force: false })
}

export async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.access(target)
    return true
  } catch {
    return false
  }
}
