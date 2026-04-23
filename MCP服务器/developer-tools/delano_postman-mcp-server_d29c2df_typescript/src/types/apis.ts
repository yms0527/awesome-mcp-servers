/**
 * API Types for Postman API Operations
 */
import { CollectionInfo } from './collection.js';

// Schema type enums
export enum ApiSchemaType {
  PROTO2 = 'proto:2',
  PROTO3 = 'proto:3',
  GRAPHQL = 'graphql',
  OPENAPI_3_1 = 'openapi:3_1',
  OPENAPI_3 = 'openapi:3',
  OPENAPI_2 = 'openapi:2',
  OPENAPI_1 = 'openapi:1',
  RAML_1 = 'raml:1',
  RAML_0_8 = 'raml:0_8',
  WSDL_2 = 'wsdl:2',
  WSDL_1 = 'wsdl:1',
  ASYNCAPI_2 = 'asyncapi:2'
}

// Collection operation types
export enum ApiCollectionOperationType {
  COPY = 'COPY_COLLECTION',
  CREATE = 'CREATE_NEW',
  GENERATE = 'GENERATE_FROM_SCHEMA'
}

// Basic API types
export interface ApiBase {
  name: string;
  summary?: string;
  description?: string;
}

// Essential request types
export interface CreateApiRequest {
  name: string;
  workspaceId: string;
  summary?: string;
  description?: string;
}

export interface UpdateApiRequest {
  name?: string;
  summary?: string;
  description?: string;
  versionTag?: string;
}

// Parameters for list/query operations
export interface ListApisParams {
  workspaceId: string;
  cursor?: string;
  limit?: number;
  createdBy?: number;
  description?: string;
}

export interface GetApiParams {
  apiId: string;
  include?: Array<'collections' | 'versions' | 'schemas' | 'gitInfo'>;
}

// Schema related types
export interface SchemaFile {
  path: string;
  content: string;
  root?: {
    enabled: boolean;
  };
}

export interface CreateApiSchemaRequest {
  type: ApiSchemaType;
  files: SchemaFile[];
}

// Version related types
export interface SchemaReference {
  id?: string;
  filePath?: string;
  directoryPath?: string;
}

export interface CollectionReference {
  id?: string;
  filePath?: string;
}

export interface CreateApiVersionRequest {
  name: string;
  schemas: SchemaReference[];
  collections: CollectionReference[];
  branch?: string;
  releaseNotes?: string;
}

export interface UpdateApiVersionRequest {
  name: string;
  releaseNotes?: string;
}

// Collection related types
export interface AddApiCollectionRequest {
  operationType: ApiCollectionOperationType;
  name?: string;
  data?: {
    collectionId?: string;
    info?: CollectionInfo;
    item?: any[];
  };
  options?: Record<string, any>;
}

// Comment related types
export interface CommentRequest {
  content: string;
  threadId?: number;
}

export interface UpdateCommentRequest {
  content: string;
}

// Tag related types
export interface ApiTag {
  slug: string;
  name?: string;
}

export interface UpdateApiTagsRequest {
  tags: ApiTag[];
}

// Query parameters
export interface QueryParams {
  cursor?: string;
  limit?: number;
}

export interface GetSchemaFilesParams extends QueryParams {
  apiId: string;
  schemaId: string;
  versionId?: string;
}

export interface GetCommentsParams extends QueryParams {
  apiId: string;
}

// Response types
export interface ApiResponse {
  id: string;
  name: string;
  summary?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  versions?: ApiVersionResponse[];
  collections?: ApiCollectionResponse[];
  schemas?: ApiSchemaResponse[];
  gitInfo?: ApiGitInfo;
}

export interface ApiVersionResponse {
  id: string;
  name: string;
  releaseNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCollectionResponse {
  id: string;
  name: string;
  uid: string;
}

export interface ApiSchemaResponse {
  id: string;
  type: ApiSchemaType;
  files: SchemaFile[];
}

export interface ApiGitInfo {
  repository: string;
  branch: string;
  folder?: string;
}

export interface ApiCommentResponse {
  id: number;
  content: string;
  threadId?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
}

export interface ApiTagResponse {
  slug: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Task status types
export interface AsyncTaskResponse {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  result?: any;
  error?: string;
}
