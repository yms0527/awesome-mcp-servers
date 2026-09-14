export type WorkspaceType = 'personal' | 'team' | 'private' | 'public' | 'partner';
export type WorkspaceRole = 'Viewer' | 'Editor' | 'Admin';

export interface ListWorkspacesParams {
  type?: WorkspaceType;
  createdBy?: string;
  include?: string;
}

export interface WorkspaceBase {
  name: string;
  description?: string;
  type: WorkspaceType;
}

export type CreateWorkspaceRequest = WorkspaceBase;
export type UpdateWorkspaceRequest = Partial<WorkspaceBase>;

export interface GlobalVariable {
  key: string;
  value: string;
  type?: 'default' | 'secret';
  enabled?: boolean;
}

export interface RoleUpdate {
  op: 'add' | 'remove';
  path: string;
  value: WorkspaceRole;
}
