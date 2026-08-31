import { BrowserWindow } from 'electron'
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import os from 'node:os'
import { IPC } from '../../shared/ipc-channels'

type ShellSession = {
  id: string
  proc: ChildProcessWithoutNullStreams
  buffer: string
}

const sessions = new Map<string, ShellSession>()

function shellCommand(): { file: string; args: string[] } {
  if (process.platform === 'win32') {
    return { file: 'powershell.exe', args: ['-NoLogo', '-NoExit'] }
  }
  const shell = process.env.SHELL || '/bin/bash'
  return { file: shell, args: ['-i'] }
}

export function createTerminal(id: string, cwd: string, win: BrowserWindow): void {
  killTerminal(id)
  const { file, args } = shellCommand()
  const proc = spawn(file, args, {
    cwd,
    env: process.env,
    windowsHide: true
  })

  const session: ShellSession = { id, proc, buffer: '' }
  sessions.set(id, session)

  const send = (data: string): void => {
    if (!win.isDestroyed()) {
      win.webContents.send(IPC.terminalData, { id, data })
    }
  }

  send(`Ebenezer Code terminal · ${file}\r\nCWD: ${cwd}\r\n\r\n`)

  proc.stdout.on('data', (chunk: Buffer) => send(chunk.toString('utf8')))
  proc.stderr.on('data', (chunk: Buffer) => send(chunk.toString('utf8')))

  proc.on('exit', (code) => {
    sessions.delete(id)
    if (!win.isDestroyed()) {
      win.webContents.send(IPC.terminalExit, { id, exitCode: code ?? 0 })
    }
  })
}

export function writeTerminal(id: string, data: string): void {
  const session = sessions.get(id)
  if (!session || session.proc.killed) return

  // Line-buffered input for PowerShell/bash without PTY
  session.buffer += data
  if (session.buffer.includes('\r') || session.buffer.includes('\n')) {
    const line = session.buffer.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    session.buffer = ''
    session.proc.stdin.write(line)
  }
}

export function resizeTerminal(_id: string, _cols: number, _rows: number): void {
  // No-op without PTY; reserved for node-pty when native build tools are available
}

export function killTerminal(id: string): void {
  const session = sessions.get(id)
  if (!session) return
  try {
    session.proc.kill()
  } catch {
    /* ignore */
  }
  sessions.delete(id)
}

export function killAllTerminals(): void {
  for (const id of [...sessions.keys()]) {
    killTerminal(id)
  }
}

export function getDefaultShellHint(): string {
  return os.platform() === 'win32' ? 'PowerShell' : process.env.SHELL || 'bash'
}
