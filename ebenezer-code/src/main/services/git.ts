import { simpleGit } from 'simple-git'
import type { GitStatusResult } from '../../shared/types'

export async function getGitStatus(cwd: string): Promise<GitStatusResult> {
  try {
    const git = simpleGit(cwd)
    const isRepo = await git.checkIsRepo()
    if (!isRepo) {
      return { ok: true, isRepo: false, branch: '', files: [] }
    }
    const status = await git.status()
    return {
      ok: true,
      isRepo: true,
      branch: status.current || 'HEAD',
      files: status.files.map((f) => ({
        path: f.path,
        index: f.index,
        working_dir: f.working_dir
      }))
    }
  } catch (error) {
    return {
      ok: false,
      isRepo: false,
      branch: '',
      files: [],
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

export async function stageFiles(cwd: string, files: string[]): Promise<void> {
  const git = simpleGit(cwd)
  await git.add(files)
}

export async function unstageFiles(cwd: string, files: string[]): Promise<void> {
  const git = simpleGit(cwd)
  await git.reset(['HEAD', '--', ...files])
}

export async function commitFiles(cwd: string, message: string): Promise<string> {
  const git = simpleGit(cwd)
  const result = await git.commit(message)
  return result.commit || ''
}
