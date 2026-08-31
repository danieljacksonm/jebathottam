export type PermissionLevel = 'READ_ONLY' | 'WRITE' | 'TERMINAL' | 'DANGEROUS'

/** Phase 1 stub — full enforcement in Phase 4 */
export const DEFAULT_PERMISSION: PermissionLevel = 'READ_ONLY'

export function permissionRank(level: PermissionLevel): number {
  switch (level) {
    case 'READ_ONLY':
      return 1
    case 'WRITE':
      return 2
    case 'TERMINAL':
      return 3
    case 'DANGEROUS':
      return 4
    default:
      return 0
  }
}
