import type { EbenezerApi } from './index'

declare global {
  interface Window {
    ebenezer: EbenezerApi
  }
}

export {}
