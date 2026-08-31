import { BrowserWindow, app, dialog, ipcMain } from 'electron'
import { IPC } from '../../shared/ipc-channels'
import type { AiChatRequest, AiSettings, AppSettings, CreateProjectRequest } from '../../shared/types'
import * as filesystem from '../services/filesystem'
import { createProject } from '../services/project-create'
import { detectTechnology } from '../services/project-detect'
import { addRecentProject, getRecentProjects } from '../services/recent-projects'
import * as git from '../services/git'
import * as terminal from '../services/terminal'
import * as settings from '../services/settings'
import * as secrets from '../services/secrets'
import * as aiChat from '../services/ai-chat'

let currentProjectRoot: string | null = null

export function setCurrentProjectRoot(root: string | null): void {
  currentProjectRoot = root
}

export function getCurrentProjectRoot(): string | null {
  return currentProjectRoot
}

export function registerIpc(getWindow: () => BrowserWindow | null): void {
  ipcMain.handle(IPC.dialogOpenDirectory, async () => {
    const win = getWindow()
    const result = win
      ? await dialog.showOpenDialog(win, { properties: ['openDirectory'] })
      : await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (result.canceled || !result.filePaths[0]) return null
    return result.filePaths[0]
  })

  ipcMain.handle(IPC.dialogOpenSaveProject, async () => {
    const win = getWindow()
    const options = {
      properties: ['openDirectory', 'createDirectory'] as Array<'openDirectory' | 'createDirectory'>,
      title: 'Choose parent folder for new project'
    }
    const result = win
      ? await dialog.showOpenDialog(win, options)
      : await dialog.showOpenDialog(options)
    if (result.canceled || !result.filePaths[0]) return null
    return result.filePaths[0]
  })

  ipcMain.handle(IPC.fsListDir, async (_e, dirPath: string) => {
    const showHidden = settings.getSettings().showHiddenFiles
    return filesystem.listDirectory(dirPath, {
      showHidden,
      projectRoot: currentProjectRoot || undefined
    })
  })

  ipcMain.handle(IPC.fsReadFile, async (_e, filePath: string) => {
    return filesystem.readTextFile(filePath, currentProjectRoot || undefined)
  })

  ipcMain.handle(IPC.fsWriteFile, async (_e, filePath: string, content: string) => {
    await filesystem.writeTextFile(filePath, content, currentProjectRoot || undefined)
    return true
  })

  ipcMain.handle(IPC.fsCreateFile, async (_e, filePath: string) => {
    await filesystem.createFile(filePath, currentProjectRoot || undefined)
    return true
  })

  ipcMain.handle(IPC.fsCreateDir, async (_e, dirPath: string) => {
    await filesystem.createDirectory(dirPath, currentProjectRoot || undefined)
    return true
  })

  ipcMain.handle(IPC.fsRename, async (_e, from: string, to: string) => {
    await filesystem.renamePath(from, to, currentProjectRoot || undefined)
    return true
  })

  ipcMain.handle(IPC.fsDelete, async (_e, target: string) => {
    await filesystem.deletePath(target, currentProjectRoot || undefined)
    return true
  })

  ipcMain.handle(IPC.fsExists, async (_e, target: string) => {
    return filesystem.pathExists(target)
  })

  ipcMain.handle(IPC.projectGetRecent, async () => getRecentProjects())

  ipcMain.handle(IPC.projectAddRecent, async (_e, projectPath: string) => {
    currentProjectRoot = projectPath
    return addRecentProject(projectPath)
  })

  ipcMain.handle(IPC.projectDetect, async (_e, projectPath: string) => {
    return detectTechnology(projectPath)
  })

  ipcMain.handle(IPC.projectCreate, async (_e, req: CreateProjectRequest) => {
    const root = await createProject(req)
    currentProjectRoot = root
    await addRecentProject(root)
    return root
  })

  ipcMain.handle(IPC.gitStatus, async (_e, cwd: string) => git.getGitStatus(cwd))
  ipcMain.handle(IPC.gitStage, async (_e, cwd: string, files: string[]) => {
    await git.stageFiles(cwd, files)
    return true
  })
  ipcMain.handle(IPC.gitUnstage, async (_e, cwd: string, files: string[]) => {
    await git.unstageFiles(cwd, files)
    return true
  })
  ipcMain.handle(IPC.gitCommit, async (_e, cwd: string, message: string) => {
    return git.commitFiles(cwd, message)
  })

  ipcMain.handle(IPC.terminalCreate, async (_e, id: string, cwd: string) => {
    const win = getWindow()
    if (!win) throw new Error('No window')
    terminal.createTerminal(id, cwd, win)
    return true
  })
  ipcMain.handle(IPC.terminalWrite, async (_e, id: string, data: string) => {
    terminal.writeTerminal(id, data)
    return true
  })
  ipcMain.handle(IPC.terminalResize, async (_e, id: string, cols: number, rows: number) => {
    terminal.resizeTerminal(id, cols, rows)
    return true
  })
  ipcMain.handle(IPC.terminalKill, async (_e, id: string) => {
    terminal.killTerminal(id)
    return true
  })

  ipcMain.handle(IPC.settingsGet, async () => settings.getSettings())
  ipcMain.handle(IPC.settingsSet, async (_e, partial: Partial<AppSettings>) => {
    // Never accept API keys through generic settings
    const { ai: _aiIgnored, ...safe } = partial
    return settings.setSettings(safe)
  })

  ipcMain.handle(IPC.aiGetPublicSettings, async () => settings.getAiPublicSettings())
  ipcMain.handle(IPC.aiSetSettings, async (_e, partial: Partial<AiSettings>) => {
    settings.setAiSettings(partial)
    return settings.getAiPublicSettings()
  })
  ipcMain.handle(IPC.aiSetApiKey, async (_e, apiKey: string) => {
    if (typeof apiKey !== 'string') throw new Error('Invalid API key')
    secrets.setApiKey(apiKey)
    return settings.getAiPublicSettings()
  })
  ipcMain.handle(IPC.aiClearApiKey, async () => {
    secrets.clearApiKey()
    return settings.getAiPublicSettings()
  })
  ipcMain.handle(IPC.aiTestConnection, async () => aiChat.testConnection())
  ipcMain.handle(IPC.aiChatStart, async (_e, req: AiChatRequest) => {
    const win = getWindow()
    if (!win) throw new Error('No window')
    if (!req?.requestId || !Array.isArray(req.messages)) {
      throw new Error('Invalid chat request')
    }
    // Fire-and-stream; chunks arrive via ai:chatChunk
    void aiChat.startChat(req, win)
    return true
  })
  ipcMain.handle(IPC.aiChatAbort, async (_e, requestId: string) => {
    aiChat.abortChat(requestId)
    return true
  })

  ipcMain.handle(IPC.appGetVersion, async () => app.getVersion())
}
