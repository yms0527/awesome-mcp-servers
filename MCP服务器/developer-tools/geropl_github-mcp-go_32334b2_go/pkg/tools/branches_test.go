package tools

import (
	"context"
	"testing"

	"github.com/geropl/github-mcp-go/pkg/github"
)

const (
	// Reuse constants from pulls_test.go
	BRANCH_OWNER = OWNER
	BRANCH_REPO  = REPO
)

func TestBranches(t *testing.T) {
	// Define test cases
	testCases := []*TestCase{
		// list_branches test cases
		{
			Name: "ListAllBranches",
			Tool: "list_branches",
			Input: map[string]interface{}{
				"owner": BRANCH_OWNER,
				"repo":  BRANCH_REPO,
			},
		},
		{
			Name: "ListProtectedBranches",
			Tool: "list_branches",
			Input: map[string]interface{}{
				"owner":     BRANCH_OWNER,
				"repo":      BRANCH_REPO,
				"protected": true,
			},
		},
		{
			Name: "ListBranchesInvalidOwner",
			Tool: "list_branches",
			Input: map[string]interface{}{
				"owner": "invalid-owner",
				"repo":  BRANCH_REPO,
			},
		},
		{
			Name: "ListBranchesInvalidRepo",
			Tool: "list_branches",
			Input: map[string]interface{}{
				"owner": BRANCH_OWNER,
				"repo":  "invalid-repo",
			},
		},

		// get_branch test cases
		{
			Name: "GetExistingBranch",
			Tool: "get_branch",
			Input: map[string]interface{}{
				"owner":  BRANCH_OWNER,
				"repo":   BRANCH_REPO,
				"branch": "main",
			},
		},
		{
			Name: "GetNonExistentBranch",
			Tool: "get_branch",
			Input: map[string]interface{}{
				"owner":  BRANCH_OWNER,
				"repo":   BRANCH_REPO,
				"branch": "non-existent-branch",
			},
		},
		{
			Name: "InvalidOwnerGetBranch",
			Tool: "get_branch",
			Input: map[string]interface{}{
				"owner":  "invalid-owner",
				"repo":   BRANCH_REPO,
				"branch": "main",
			},
		},
		{
			Name: "InvalidRepoGetBranch",
			Tool: "get_branch",
			Input: map[string]interface{}{
				"owner":  BRANCH_OWNER,
				"repo":   "invalid-repo",
				"branch": "main",
			},
		},

		// create_branch test cases
		// TOOD(gpl): Skip this test for now, as we need to extend the Before hook to enable passing of the commit SHA
		// {
		// 	Name: "CreateBranchFromSHA",
		// 	Tool: "create_branch",
		// 	Input: map[string]interface{}{
		// 		"owner":  BRANCH_OWNER,
		// 		"repo":   BRANCH_REPO,
		// 		"branch": "new-branch-from-sha",
		// 		"from":   "main-sha", // Placeholder that will be replaced with actual SHA
		// 	},
		// 	Before: func(ctx context.Context, client *github.Client) error {
		// 		// Verify main branch exists
		// 		_, _, err := client.GetClient().Git.GetRef(ctx, BRANCH_OWNER, BRANCH_REPO, "refs/heads/main")
		// 		return err
		// 	},
		// 	After: func(ctx context.Context, client *github.Client) error {
		// 		// Clean up the created branch
		// 		return deleteBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "new-branch-from-sha")
		// 	},
		// },
		{
			Name: "CreateBranchFromAnotherBranch",
			Tool: "create_branch",
			Input: map[string]interface{}{
				"owner":  BRANCH_OWNER,
				"repo":   BRANCH_REPO,
				"branch": "new-branch-from-branch",
				"from":   "main",
			},
			After: func(ctx context.Context, client *github.Client) error {
				// Clean up the created branch
				return deleteBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "new-branch-from-branch")
			},
		},
		{
			Name: "CreateBranchInvalidOwner",
			Tool: "create_branch",
			Input: map[string]interface{}{
				"owner":  "invalid-owner",
				"repo":   BRANCH_REPO,
				"branch": "new-branch",
				"from":   "main",
			},
		},
		{
			Name: "CreateBranchInvalidRepo",
			Tool: "create_branch",
			Input: map[string]interface{}{
				"owner":  BRANCH_OWNER,
				"repo":   "invalid-repo",
				"branch": "new-branch",
				"from":   "main",
			},
		},
		{
			Name: "CreateBranchInvalidBase",
			Tool: "create_branch",
			Input: map[string]interface{}{
				"owner":  BRANCH_OWNER,
				"repo":   BRANCH_REPO,
				"branch": "new-branch",
				"from":   "invalid-base",
			},
		},
		{
			Name: "CreateBranchEmptyName",
			Tool: "create_branch",
			Input: map[string]interface{}{
				"owner":  BRANCH_OWNER,
				"repo":   BRANCH_REPO,
				"branch": "",
				"from":   "main",
			},
		},

		// merge_branches test cases
		{
			Name: "MergeBranches",
			Tool: "merge_branches",
			Input: map[string]interface{}{
				"owner":   BRANCH_OWNER,
				"repo":    BRANCH_REPO,
				"base":    "test-base",
				"head":    "feature-branch",
				"message": "Merge feature-branch into test-base",
			},
			Before: func(ctx context.Context, client *github.Client) error {
				err := createBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "test-base", "main")
				if err != nil {
					return err
				}

				err = createBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "feature-branch", "test-base")
				if err != nil {
					return err
				}

				return createCommit(ctx, client, BRANCH_OWNER, BRANCH_REPO, "feature-branch", "changes-to-merge", "really important changes")
			},
			After: func(ctx context.Context, client *github.Client) error {
				// Clean up the feature branch
				err := deleteBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "test-base")
				if err != nil {
					return err
				}
				return deleteBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "feature-branch")
			},
		},
		{
			Name: "MergeBranchesInvalidOwner",
			Tool: "merge_branches",
			Input: map[string]interface{}{
				"owner": "invalid-owner",
				"repo":  BRANCH_REPO,
				"base":  "test-base",
				"head":  "feature-branch",
			},
			Before: func(ctx context.Context, client *github.Client) error {
				err := createBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "test-base", "main")
				if err != nil {
					return err
				}
				// Create a feature branch for testing
				return createBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "feature-branch", "main")
			},
			After: func(ctx context.Context, client *github.Client) error {
				err := deleteBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "test-base")
				if err != nil {
					return err
				}
				return deleteBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "feature-branch")
			},
		},
		{
			Name: "MergeBranchesInvalidRepo",
			Tool: "merge_branches",
			Input: map[string]interface{}{
				"owner": BRANCH_OWNER,
				"repo":  "invalid-repo",
				"base":  "test-base",
				"head":  "feature-branch",
			},
			Before: func(ctx context.Context, client *github.Client) error {
				err := createBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "test-base", "main")
				if err != nil {
					return err
				}
				// Create a feature branch for testing
				return createBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "feature-branch", "main")
			},
			After: func(ctx context.Context, client *github.Client) error {
				err := deleteBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "test-base")
				if err != nil {
					return err
				}
				return deleteBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "feature-branch")
			},
		},
		{
			Name: "MergeBranchesInvalidBase",
			Tool: "merge_branches",
			Input: map[string]interface{}{
				"owner": BRANCH_OWNER,
				"repo":  BRANCH_REPO,
				"base":  "invalid-base",
				"head":  "feature-branch",
			},
			Before: func(ctx context.Context, client *github.Client) error {
				// Create a feature branch for testing
				return createBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "feature-branch", "main")
			},
			After: func(ctx context.Context, client *github.Client) error {
				// Clean up the feature branch
				return deleteBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "feature-branch")
			},
		},
		{
			Name: "MergeBranchesInvalidHead",
			Tool: "merge_branches",
			Input: map[string]interface{}{
				"owner": BRANCH_OWNER,
				"repo":  BRANCH_REPO,
				"base":  "main",
				"head":  "invalid-head",
			},
		},

		// delete_branch test cases
		{
			Name: "DeleteBranch",
			Tool: "delete_branch",
			Input: map[string]interface{}{
				"owner":  BRANCH_OWNER,
				"repo":   BRANCH_REPO,
				"branch": "branch-to-delete",
			},
			Before: func(ctx context.Context, client *github.Client) error {
				// Create a branch to delete
				return createBranch(ctx, client, BRANCH_OWNER, BRANCH_REPO, "branch-to-delete", "main")
			},
		},
		{
			Name: "DeleteNonExistentBranch",
			Tool: "delete_branch",
			Input: map[string]interface{}{
				"owner":  BRANCH_OWNER,
				"repo":   BRANCH_REPO,
				"branch": "non-existent-branch",
			},
		},
		{
			Name: "DeleteBranchInvalidOwner",
			Tool: "delete_branch",
			Input: map[string]interface{}{
				"owner":  "invalid-owner",
				"repo":   BRANCH_REPO,
				"branch": "branch-to-delete",
			},
		},
		{
			Name: "DeleteBranchInvalidRepo",
			Tool: "delete_branch",
			Input: map[string]interface{}{
				"owner":  BRANCH_OWNER,
				"repo":   "invalid-repo",
				"branch": "branch-to-delete",
			},
		},
	}

	// Run test cases
	for _, tc := range testCases {
		t.Run(tc.Name, func(t *testing.T) {
			RunTest(t, tc)
		})
	}
}
