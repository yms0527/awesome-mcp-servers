import { z } from 'zod';

// Get merge request schemas
export const GetMergeRequestSchema = z.object({
  project_id: z.string(),
  merge_request_iid: z.number(),
});

export const GitLabGetMergeRequestSchema = z.object({
  id: z.number(),
  iid: z.number(),
  project_id: z.number(),
  title: z.string(),
  description: z.string(),
  source_branch: z.string(),
  target_branch: z.string(),
});

export const GetMergeRequestLatestVersionSchema = z.object({
  project_id: z.string(),
  merge_request_iid: z.number(),
});

export const GitLabGetMergeRequestLatestVersionSchema = z.object({
  id: z.number(),
  head_commit_sha: z.string(),
  base_commit_sha: z.string(),
  start_commit_sha: z.string(),
  created_at: z.string(),
  merge_request_id: z.number(),
  state: z.string(),
  real_size: z.string(),
  patch_id_sha: z.string()
});

export const CreateDiscussionSchema = z.object({
  project_id: z.string(),
  merge_request_iid: z.number(),
  position: z.object({
    base_sha: z.string(),
    head_sha: z.string(),
    start_sha: z.string(),
    new_path: z.string(),
    old_path: z.string(),
    new_line: z.number().nullable(),
    old_line: z.number().nullable(),
    position_type: z.enum(['text']),
  }),
  body: z.string()
})

export const GitLabCreateDiscussionSchema = z.object({
  id: z.string(),
});


// Export types
export type GitLabGetMergeRequest = z.infer<typeof GitLabGetMergeRequestSchema>;
export type GitLabGetMergeRequestVersion = z.infer<typeof GitLabGetMergeRequestLatestVersionSchema>;
export type GitLabCreateDiscussion = z.infer<typeof GitLabCreateDiscussionSchema>;
