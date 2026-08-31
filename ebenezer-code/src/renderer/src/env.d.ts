/// <reference types="vite/client" />

import type { EbenezerApi } from '../../preload/index'

declare global {
  interface Window {
    ebenezer: EbenezerApi
  }
}

export {}
