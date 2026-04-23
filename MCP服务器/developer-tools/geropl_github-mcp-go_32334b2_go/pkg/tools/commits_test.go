package tools

import (
	"testing"
)

const (
	// Reuse constants from pulls_test.go
	COMMIT_OWNER = OWNER
	COMMIT_REPO  = REPO
)

func TestCommits(t *testing.T) {
	testCases := []*TestCase{
		// get_commit - Happy Path
		{
			Name: "GetExistingCommit",
			Tool: "get_commit",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  COMMIT_REPO,
				"sha":   "main", // Using branch name as SHA to get the latest commit
			},
		},

		// get_commit - Error Cases
		{
			Name: "GetNonExistentCommit",
			Tool: "get_commit",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  COMMIT_REPO,
				"sha":   "non-existent-sha",
			},
		},
		{
			Name: "InvalidOwnerGetCommit",
			Tool: "get_commit",
			Input: map[string]interface{}{
				"owner": "non-existent-user",
				"repo":  COMMIT_REPO,
				"sha":   "main",
			},
		},
		{
			Name: "InvalidRepoGetCommit",
			Tool: "get_commit",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  "non-existent-repo",
				"sha":   "main",
			},
		},

		// list_commits - Happy Path
		{
			Name: "ListAllCommits",
			Tool: "list_commits",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  COMMIT_REPO,
			},
		},
		{
			Name: "ListCommitsWithPath",
			Tool: "list_commits",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  COMMIT_REPO,
				"path":  "README.md", // Assuming README.md exists
			},
		},
		{
			Name: "ListCommitsWithAuthor",
			Tool: "list_commits",
			Input: map[string]interface{}{
				"owner":  COMMIT_OWNER,
				"repo":   COMMIT_REPO,
				"author": COMMIT_OWNER, // Using the same user as the owner
			},
		},

		// list_commits - Error Cases
		{
			Name: "ListCommitsInvalidOwner",
			Tool: "list_commits",
			Input: map[string]interface{}{
				"owner": "non-existent-user",
				"repo":  COMMIT_REPO,
			},
		},
		{
			Name: "ListCommitsInvalidRepo",
			Tool: "list_commits",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  "non-existent-repo",
			},
		},

		// compare_commits - Happy Path
		{
			Name: "CompareCommits",
			Tool: "compare_commits",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  COMMIT_REPO,
				"base":  "main",
				"head":  "main", // Comparing with itself for testing
			},
		},

		// compare_commits - Error Cases
		{
			Name: "CompareInvalidBase",
			Tool: "compare_commits",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  COMMIT_REPO,
				"base":  "non-existent-base",
				"head":  "main",
			},
		},
		{
			Name: "CompareInvalidHead",
			Tool: "compare_commits",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  COMMIT_REPO,
				"base":  "main",
				"head":  "non-existent-head",
			},
		},
		{
			Name: "CompareInvalidOwner",
			Tool: "compare_commits",
			Input: map[string]interface{}{
				"owner": "non-existent-user",
				"repo":  COMMIT_REPO,
				"base":  "main",
				"head":  "main",
			},
		},
		{
			Name: "CompareInvalidRepo",
			Tool: "compare_commits",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  "non-existent-repo",
				"base":  "main",
				"head":  "main",
			},
		},

		// get_commit_status - Happy Path
		{
			Name: "GetCommitStatus",
			Tool: "get_commit_status",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  COMMIT_REPO,
				"sha":   "main", // Using branch name as SHA to get the latest commit
			},
		},

		// get_commit_status - Error Cases
		{
			Name: "GetNonExistentCommitStatus",
			Tool: "get_commit_status",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  COMMIT_REPO,
				"sha":   "non-existent-sha",
			},
		},
		{
			Name: "InvalidOwnerGetStatus",
			Tool: "get_commit_status",
			Input: map[string]interface{}{
				"owner": "non-existent-user",
				"repo":  COMMIT_REPO,
				"sha":   "main",
			},
		},
		{
			Name: "InvalidRepoGetStatus",
			Tool: "get_commit_status",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  "non-existent-repo",
				"sha":   "main",
			},
		},

		// list_commit_comments - Happy Path
		{
			Name: "ListCommentsOnCommit",
			Tool: "list_commit_comments",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  COMMIT_REPO,
				"sha":   "main", // Using branch name as SHA to get the latest commit
			},
		},

		// list_commit_comments - Error Cases
		{
			Name: "ListCommentsNonExistentCommit",
			Tool: "list_commit_comments",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  COMMIT_REPO,
				"sha":   "non-existent-sha",
			},
		},
		{
			Name: "InvalidOwnerListComments",
			Tool: "list_commit_comments",
			Input: map[string]interface{}{
				"owner": "non-existent-user",
				"repo":  COMMIT_REPO,
				"sha":   "main",
			},
		},
		{
			Name: "InvalidRepoListComments",
			Tool: "list_commit_comments",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  "non-existent-repo",
				"sha":   "main",
			},
		},

		// create_commit_comment - Happy Path
		{
			Name: "AddCommentToCommit",
			Tool: "create_commit_comment",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  COMMIT_REPO,
				"sha":   "main", // Using branch name as SHA to get the latest commit
				"body":  "This is a test comment on a commit.",
			},
		},
		{
			Name: "AddCommentWithPath",
			Tool: "create_commit_comment",
			Input: map[string]interface{}{
				"owner":    COMMIT_OWNER,
				"repo":     COMMIT_REPO,
				"sha":      "main", // Using branch name as SHA to get the latest commit
				"body":     "This is a test comment on a specific file in a commit.",
				"path":     "README.md", // Assuming README.md exists
				"position": 1,
			},
		},

		// create_commit_comment - Error Cases
		{
			Name: "InvalidOwnerAddComment",
			Tool: "create_commit_comment",
			Input: map[string]interface{}{
				"owner": "non-existent-user",
				"repo":  COMMIT_REPO,
				"sha":   "main",
				"body":  "This is a test comment.",
			},
		},
		{
			Name: "InvalidRepoAddComment",
			Tool: "create_commit_comment",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  "non-existent-repo",
				"sha":   "main",
				"body":  "This is a test comment.",
			},
		},
		{
			Name: "InvalidSHAAddComment",
			Tool: "create_commit_comment",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  COMMIT_REPO,
				"sha":   "non-existent-sha",
				"body":  "This is a test comment.",
			},
		},
		{
			Name: "EmptyBodyAddComment",
			Tool: "create_commit_comment",
			Input: map[string]interface{}{
				"owner": COMMIT_OWNER,
				"repo":  COMMIT_REPO,
				"sha":   "main",
				"body":  "",
			},
		},

		// create_commit - Happy Path
		// Note: This test case is commented out because it requires a valid tree SHA and parent SHA
		// which are specific to the repository and would need to be retrieved dynamically.
		// {
		// 	Name: "BasicCommitCreation",
		// 	Tool: "create_commit",
		// 	Input: map[string]interface{}{
		// 		"owner":   COMMIT_OWNER,
		// 		"repo":    COMMIT_REPO,
		// 		"message": "Test commit created by the test suite",
		// 		"tree":    "tree-sha", // Need a valid tree SHA
		// 		"parents": "parent-sha", // Need a valid parent SHA
		// 	},
		// },

		// create_commit - Error Cases
		{
			Name: "InvalidOwnerCreateCommit",
			Tool: "create_commit",
			Input: map[string]interface{}{
				"owner":   "non-existent-user",
				"repo":    COMMIT_REPO,
				"message": "Test commit",
				"tree":    "tree-sha",
				"parents": "parent-sha",
			},
		},
		{
			Name: "InvalidRepoCreateCommit",
			Tool: "create_commit",
			Input: map[string]interface{}{
				"owner":   COMMIT_OWNER,
				"repo":    "non-existent-repo",
				"message": "Test commit",
				"tree":    "tree-sha",
				"parents": "parent-sha",
			},
		},
		{
			Name: "InvalidTreeCreateCommit",
			Tool: "create_commit",
			Input: map[string]interface{}{
				"owner":   COMMIT_OWNER,
				"repo":    COMMIT_REPO,
				"message": "Test commit",
				"tree":    "invalid-tree-sha",
				"parents": "parent-sha",
			},
		},
		{
			Name: "InvalidParentCreateCommit",
			Tool: "create_commit",
			Input: map[string]interface{}{
				"owner":   COMMIT_OWNER,
				"repo":    COMMIT_REPO,
				"message": "Test commit",
				"tree":    "tree-sha",
				"parents": "invalid-parent-sha",
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.Name, func(t *testing.T) {
			RunTest(t, tc)
		})
	}
}
