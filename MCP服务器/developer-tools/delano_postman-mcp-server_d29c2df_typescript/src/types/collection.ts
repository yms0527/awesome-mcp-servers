import { WorkspaceArg, CollectionIdArg } from './common.js';

/**
 * Basic collection interfaces for type safety and documentation
 */
export interface GetCollectionsArgs extends Partial<WorkspaceArg> {
  name?: string;
  limit?: number;
  offset?: number;
}

export interface GetCollectionArgs extends CollectionIdArg {
  access_key?: string;
  model?: 'minimal';
}

export interface GetCollectionFolderArgs extends CollectionIdArg {
  folder_id: string;
  ids?: boolean;
  uid?: boolean;
  populate?: boolean;
}

export interface DeleteCollectionFolderArgs extends CollectionIdArg {
  folder_id: string;
}

export interface GetCollectionRequestArgs extends CollectionIdArg {
  request_id: string;
  ids?: boolean;
  uid?: boolean;
  populate?: boolean;
}

export interface DeleteCollectionRequestArgs extends CollectionIdArg {
  request_id: string;
}

export interface GetCollectionResponseArgs extends CollectionIdArg {
  response_id: string;
  ids?: boolean;
  uid?: boolean;
  populate?: boolean;
}

export interface DeleteCollectionResponseArgs extends CollectionIdArg {
  response_id: string;
}

/**
 * Core collection data structures
 */
export interface CollectionInfo {
  name: string;
  description?: string;
  schema: string;
}

export interface CollectionItem {
  id?: string;
  name?: string;
  description?: string;
  request?: CollectionRequest;
  response?: CollectionResponse[];
  item?: CollectionItem[];
  auth?: CollectionAuth;
  event?: CollectionEvent[];
  variable?: CollectionVariable[];
  protocolProfileBehavior?: Record<string, any>;
}

export interface CollectionRequest {
  method?: string;
  header?: Array<{key: string; value: string; description?: string}>;
  url?: string | {
    raw?: string;
    protocol?: string;
    host?: string[];
    path?: string[];
    variable?: Array<{
      key: string;
      value?: string;
      description?: string;
    }>;
  };
  description?: string;
  body?: any;
}

export interface CollectionResponse {
  id?: string;
  name?: string;
  originalRequest?: CollectionRequest;
  status?: string;
  code?: number;
  header?: Array<{key: string; value: string}>;
  body?: string;
  cookie?: any[];
}

export interface CollectionAuth {
  type: string;
  [key: string]: any;
}

export interface CollectionEvent {
  listen: string;
  script?: {
    id?: string;
    type?: string;
    exec?: string[];
  };
}

export interface CollectionVariable {
  key: string;
  value?: string;
  type?: string;
  enabled?: boolean;
}

/**
 * Operation interfaces
 */
export interface CreateCollectionArgs extends WorkspaceArg {
  collection: {
    info: CollectionInfo;
    item?: CollectionItem[];
    auth?: CollectionAuth;
    event?: CollectionEvent[];
    variable?: CollectionVariable[];
  };
}

export interface UpdateCollectionArgs extends CollectionIdArg {
  collection: {
    info: CollectionInfo;
    item: CollectionItem[];
    auth?: CollectionAuth;
    event?: CollectionEvent[];
    variable?: CollectionVariable[];
  };
}

export interface ForkCollectionArgs extends CollectionIdArg, WorkspaceArg {
  label: string;
}
