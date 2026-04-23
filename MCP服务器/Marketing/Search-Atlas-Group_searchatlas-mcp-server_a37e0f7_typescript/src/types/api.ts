/**
 * API response types
 * Mirrors the Django REST Framework response shapes used by the SearchAtlas backend.
 */

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Project {
  id: number;
  customer_id: string;
  domain: string;
  country_code?: string;
  location?: string;
  keywords?: string[];
  competitors?: string[];
  created_at: string;
  updated_at: string;
}

export interface ConversationSession {
  id: number;
  session_id: string;
  title: string | null;
  agent_namespace: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Artifact {
  artifact_id: string;
  identifier: string;
  type: string;
  title: string;
  language?: string;
  content: string;
  content_size: number;
  version: number;
  created_at: string;
  updated_at: string;
  message_id: string;
  session_id?: string;
  session_title?: string;
  agent_namespace?: string;
}

export interface ArtifactListResponse {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  artifacts: Artifact[];
}

export interface PlaybookListItem {
  id: string;
  name: string;
  description: string;
  agent_namespace: string;
  agent_namespaces: string[];
  icon_url: string | null;
  expected_benefits?: string[];
  ownership_type: "private" | "shared";
  usage_count: number;
  is_owner: boolean;
  created_at: string;
  updated_at: string;
}

export interface SSEChunk {
  content?: string;
  is_complete?: boolean;
  is_delta?: boolean;
  status?: string;
  error?: string;
  timeout?: boolean;
  message_type?: string;
  message_id?: string;
  data?: unknown;
}
