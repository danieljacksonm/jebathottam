import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../shared/ipc-channels'
import type {
  AiChatChunk,
  AiChatRequest,
  AiConnectionTestResult,
  AiSettings,
  AiSettingsPublic,
  AppSettings,
  CreateProjectRequest,
  FileEntry,
  GitStatusResult,
  RecentProject
} from '../shared/types'

const api = {
  openDirectory: (): Promise<string | null> => ipcRenderer.invoke(IPC.dialogOpenDirectory),
  openSaveProjectParent: (): Promise<string | null> => ipcRenderer.invoke(IPC.dialogOpenSaveProject),
  listDir: (dirPath: string): Promise<FileEntry[]> => ipcRenderer.invoke(IPC.fsListDir, dirPath),
  readFile: (filePath: string): Promise<string> => ipcRenderer.invoke(IPC.fsReadFile, filePath),
  writeFile: (filePath: string, content: string): Promise<boolean> =>
    ipcRenderer.invoke(IPC.fsWriteFile, filePath, content),
  createFile: (filePath: string): Promise<boolean> => ipcRenderer.invoke(IPC.fsCreateFile, filePath),
  createDir: (dirPath: string): Promise<boolean> => ipcRenderer.invoke(IPC.fsCreateDir, dirPath),
  rename: (from: string, to: string): Promise<boolean> => ipcRenderer.invoke(IPC.fsRename, from, to),
  deletePath: (target: string): Promise<boolean> => ipcRenderer.invoke(IPC.fsDelete, target),
  exists: (target: string): Promise<boolean> => ipcRenderer.invoke(IPC.fsExists, target),
  getRecentProjects: (): Promise<RecentProject[]> => ipcRenderer.invoke(IPC.projectGetRecent),
  addRecentProject: (projectPath: string): Promise<RecentProject[]> =>
    ipcRenderer.invoke(IPC.projectAddRecent, projectPath),
  detectTechnology: (projectPath: string): Promise<string> =>
    ipcRenderer.invoke(IPC.projectDetect, projectPath),
  createProject: (req: CreateProjectRequest): Promise<string> =>
    ipcRenderer.invoke(IPC.projectCreate, req),
  gitStatus: (cwd: string): Promise<GitStatusResult> => ipcRenderer.invoke(IPC.gitStatus, cwd),
  gitStage: (cwd: string, files: string[]): Promise<boolean> =>
    ipcRenderer.invoke(IPC.gitStage, cwd, files),
  gitUnstage: (cwd: string, files: string[]): Promise<boolean> =>
    ipcRenderer.invoke(IPC.gitUnstage, cwd, files),
  gitCommit: (cwd: string, message: string): Promise<string> =>
    ipcRenderer.invoke(IPC.gitCommit, cwd, message),
  terminalCreate: (id: string, cwd: string): Promise<boolean> =>
    ipcRenderer.invoke(IPC.terminalCreate, id, cwd),
  terminalWrite: (id: string, data: string): Promise<boolean> =>
    ipcRenderer.invoke(IPC.terminalWrite, id, data),
  terminalResize: (id: string, cols: number, rows: number): Promise<boolean> =>
    ipcRenderer.invoke(IPC.terminalResize, id, cols, rows),
  terminalKill: (id: string): Promise<boolean> => ipcRenderer.invoke(IPC.terminalKill, id),
  onTerminalData: (cb: (payload: { id: string; data: string }) => void): (() => void) => {
    const listener = (_: Electron.IpcRendererEvent, payload: { id: string; data: string }): void =>
      cb(payload)
    ipcRenderer.on(IPC.terminalData, listener)
    return () => ipcRenderer.removeListener(IPC.terminalData, listener)
  },
  onTerminalExit: (cb: (payload: { id: string; exitCode: number }) => void): (() => void) => {
    const listener = (
      _: Electron.IpcRendererEvent,
      payload: { id: string; exitCode: number }
    ): void => cb(payload)
    ipcRenderer.on(IPC.terminalExit, listener)
    return () => ipcRenderer.removeListener(IPC.terminalExit, listener)
  },
  getSettings: (): Promise<AppSettings> => ipcRenderer.invoke(IPC.settingsGet),
  setSettings: (partial: Partial<AppSettings>): Promise<AppSettings> =>
    ipcRenderer.invoke(IPC.settingsSet, partial),
  getAiSettings: (): Promise<AiSettingsPublic> => ipcRenderer.invoke(IPC.aiGetPublicSettings),
  setAiSettings: (partial: Partial<AiSettings>): Promise<AiSettingsPublic> =>
    ipcRenderer.invoke(IPC.aiSetSettings, partial),
  setAiApiKey: (apiKey: string): Promise<AiSettingsPublic> =>
    ipcRenderer.invoke(IPC.aiSetApiKey, apiKey),
  clearAiApiKey: (): Promise<AiSettingsPublic> => ipcRenderer.invoke(IPC.aiClearApiKey),
  testAiConnection: (): Promise<AiConnectionTestResult> => ipcRenderer.invoke(IPC.aiTestConnection),
  aiChatStart: (req: AiChatRequest): Promise<boolean> => ipcRenderer.invoke(IPC.aiChatStart, req),
  aiChatAbort: (requestId: string): Promise<boolean> =>
    ipcRenderer.invoke(IPC.aiChatAbort, requestId),
  onAiChatChunk: (cb: (chunk: AiChatChunk) => void): (() => void) => {
    const listener = (_: Electron.IpcRendererEvent, chunk: AiChatChunk): void => cb(chunk)
    ipcRenderer.on(IPC.aiChatChunk, listener)
    return () => ipcRenderer.removeListener(IPC.aiChatChunk, listener)
  },
  getVersion: (): Promise<string> => ipcRenderer.invoke(IPC.appGetVersion)
}

contextBridge.exposeInMainWorld('ebenezer', api)

export type EbenezerApi = typeof api
