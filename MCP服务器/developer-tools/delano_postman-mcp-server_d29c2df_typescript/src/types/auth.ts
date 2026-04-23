/**
 * Collection access key information
 */
export interface CollectionAccessKey {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  collection: {
    id: string;
    name: string;
  };
}

/**
 * Detailed workspace role information including SCIM data
 */
export interface WorkspaceRoleInfo {
  id: string;
  name: string;
  description?: string;
  type: 'user' | 'group' | 'team';
  roleId: 'VIEWER' | 'EDITOR';
  entityId: number;
  entityType: string;
  scimId?: string;
}

/**
 * Collection role information
 */
export interface CollectionRole {
  id: string;
  name: string;
  description?: string;
  type: 'user' | 'group' | 'team';
  roleId: 'VIEWER' | 'EDITOR';
  entityId: number;
  entityType: string;
}

/**
 * Authenticated user information
 */
export interface AuthenticatedUser {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
  avatar?: string;
  isPublic: boolean;
  verified: boolean;
  teams?: Array<{
    id: string;
    name: string;
    role?: string;
  }>;
  flow_count?: number; // Only returned for Free plan users
}
