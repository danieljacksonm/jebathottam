import { safeStorage } from 'electron'
import Store from 'electron-store'

type SecretStore = {
  apiKeyEncrypted?: string
}

const store = new Store<SecretStore>({
  name: 'ebenezer-code-secrets'
})

export function hasApiKey(): boolean {
  return Boolean(store.get('apiKeyEncrypted'))
}

export function getApiKey(): string | null {
  const encrypted = store.get('apiKeyEncrypted')
  if (!encrypted) return null
  if (!safeStorage.isEncryptionAvailable()) {
    // Fallback: treat stored value as utf8 base64 of plaintext (dev only warning path)
    try {
      return Buffer.from(encrypted, 'base64').toString('utf8')
    } catch {
      return null
    }
  }
  try {
    return safeStorage.decryptString(Buffer.from(encrypted, 'base64'))
  } catch {
    return null
  }
}

export function setApiKey(apiKey: string): void {
  const trimmed = apiKey.trim()
  if (!trimmed) {
    clearApiKey()
    return
  }
  if (safeStorage.isEncryptionAvailable()) {
    const encrypted = safeStorage.encryptString(trimmed)
    store.set('apiKeyEncrypted', encrypted.toString('base64'))
    return
  }
  store.set('apiKeyEncrypted', Buffer.from(trimmed, 'utf8').toString('base64'))
}

export function clearApiKey(): void {
  store.delete('apiKeyEncrypted')
}
