import { query } from './db';
import { UserPayload } from './auth';

export type Permission = 'create' | 'read' | 'update' | 'delete';
export type Resource = 
  | 'users' 
  | 'blogs' 
  | 'events' 
  | 'gallery' 
  | 'team' 
  | 'followers' 
  | 'notes' 
  | 'prophecy' 
  | 'media' 
  | 'settings'
  | 'social_media_accounts'
  | 'social_media_posts'
  | 'social_media_analytics';

export interface RolePermission {
  role: string;
  resource: Resource;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

// Cache for permissions to avoid repeated database queries
const permissionsCache = new Map<string, RolePermission[]>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get all permissions for a specific role
 */
export async function getRolePermissions(role: string): Promise<RolePermission[]> {
  const cacheKey = `role_${role}`;
  
  // Check cache first
  if (permissionsCache.has(cacheKey)) {
    return permissionsCache.get(cacheKey)!;
  }

  try {
    const permissions = await query<RolePermission[]>(
      `SELECT role, resource, can_create, can_read, can_update, can_delete 
       FROM role_permissions 
       WHERE role = ?`,
      [role]
    );

    // Cache the result
    permissionsCache.set(cacheKey, permissions);
    
    // Clear cache after TTL
    setTimeout(() => permissionsCache.delete(cacheKey), CACHE_TTL);

    return permissions;
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    return [];
  }
}

/**
 * Check if a user has permission to perform an action on a resource
 */
export async function hasPermission(
  user: UserPayload,
  resource: Resource,
  permission: Permission
): Promise<boolean> {
  try {
    const permissions = await getRolePermissions(user.role);
    const resourcePermission = permissions.find(p => p.resource === resource);

    if (!resourcePermission) {
      return false;
    }

    switch (permission) {
      case 'create':
        return resourcePermission.can_create;
      case 'read':
        return resourcePermission.can_read;
      case 'update':
        return resourcePermission.can_update;
      case 'delete':
        return resourcePermission.can_delete;
      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Check multiple permissions at once
 */
export async function hasAnyPermission(
  user: UserPayload,
  checks: Array<{ resource: Resource; permission: Permission }>
): Promise<boolean> {
  const results = await Promise.all(
    checks.map(check => hasPermission(user, check.resource, check.permission))
  );
  return results.some(result => result);
}

/**
 * Check if user has all specified permissions
 */
export async function hasAllPermissions(
  user: UserPayload,
  checks: Array<{ resource: Resource; permission: Permission }>
): Promise<boolean> {
  const results = await Promise.all(
    checks.map(check => hasPermission(user, check.resource, check.permission))
  );
  return results.every(result => result);
}

/**
 * Get all resources a user has access to with their permissions
 */
export async function getUserAccessMap(user: UserPayload): Promise<Map<Resource, {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}>> {
  const permissions = await getRolePermissions(user.role);
  const accessMap = new Map<Resource, any>();

  permissions.forEach(perm => {
    accessMap.set(perm.resource, {
      create: perm.can_create,
      read: perm.can_read,
      update: perm.can_update,
      delete: perm.can_delete,
    });
  });

  return accessMap;
}

/**
 * Role capability helpers
 */
export const RoleCapabilities = {
  isSuperAdmin: (role: string) => role === 'super_admin',
  isMediaTeam: (role: string) => role === 'media_team',
  isMinistryMember: (role: string) => role === 'ministry_member',
  isVisitor: (role: string) => role === 'visitor',
  
  canManageSocialMedia: (role: string) => role === 'media_team',
  canManageUsers: (role: string) => role === 'super_admin',
  canManageSettings: (role: string) => role === 'super_admin',
  
  hasAdminAccess: (role: string) => 
    role === 'super_admin' || role === 'media_team' || role === 'ministry_member',
};

/**
 * Log user activity for audit trail
 */
export async function logActivity(
  userId: number,
  action: string,
  resourceType?: string,
  resourceId?: number,
  details?: any,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    await query(
      `INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        action,
        resourceType || null,
        resourceId || null,
        details ? JSON.stringify(details) : null,
        ipAddress || null,
        userAgent || null,
      ]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

/**
 * Clear permissions cache (useful when permissions are updated)
 */
export function clearPermissionsCache(): void {
  permissionsCache.clear();
}
