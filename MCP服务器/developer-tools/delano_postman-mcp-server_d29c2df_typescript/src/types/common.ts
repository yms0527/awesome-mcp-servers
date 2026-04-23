export interface WorkspaceArg {
  workspace: string;
}

export interface EnvironmentIdArg {
  environmentId: string;
}

export interface CollectionIdArg {
  collection_id: string;
}

export interface EnvironmentValue {
  key: string;
  value: string;
  type?: 'default' | 'secret';
  enabled?: boolean;
}
