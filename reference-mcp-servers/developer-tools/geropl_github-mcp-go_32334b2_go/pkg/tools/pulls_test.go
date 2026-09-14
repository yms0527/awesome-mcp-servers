package tools

import (
	"context"
	"testing"

	ghclient "github.com/geropl/github-mcp-go/pkg/github"
)

const (
	OWNER  = "geropl"
	REPO   = "github-mcp-go-test"
	BRANCH = "test/feature-branch-1"
	PR_NUMBER = 1 // A known PR number in the test repository
)

func TestPullRequest(t *testing.T) {
	// Use a fixed branch name for the SuccessfulCreation test case to match the cassette
	fixedBranch := "test/feature-branch-1741340849"

	testCases := []*TestCase{
		// create_pull_request - Happy Path
		{
			Name: "SuccessfulCreation",
			Tool: "create_pull_request",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"title": "Test PR",
				"body":  "Test PR body",
				"head":  fixedBranch,
				"base":  "main",
				"draft": false,
			},
			Before: func(ctx context.Context, client *ghclient.Client) error {
				return createBranchWithFile(ctx, client, OWNER, REPO, fixedBranch, "main")
			},
			After: func(ctx context.Context, client *ghclient.Client) error {
				// will close the PR as a side-effect
				return deleteBranch(ctx, client, OWNER, REPO, fixedBranch)
			},
		},
		
		// Additional create_pull_request - Happy Path test cases
		{
			Name: "CreateDraftPR",
			Tool: "create_pull_request",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"title": "Draft PR",
				"body":  "This is a draft PR",
				"head":  "test/draft-pr-branch",
				"base":  "main",
				"draft": true,
			},
			Before: func(ctx context.Context, client *ghclient.Client) error {
				return createBranchWithFile(ctx, client, OWNER, REPO, "test/draft-pr-branch", "main")
			},
			After: func(ctx context.Context, client *ghclient.Client) error {
				return deleteBranch(ctx, client, OWNER, REPO, "test/draft-pr-branch")
			},
		},
		{
			Name: "CreatePRWithLabels",
			Tool: "create_pull_request",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"title": "PR with Labels",
				"body":  "This PR has labels",
				"head":  "test/labels-pr-branch",
				"base":  "main",
				"draft": false,
				"labels": []string{"bug", "enhancement"},
			},
			Before: func(ctx context.Context, client *ghclient.Client) error {
				return createBranchWithFile(ctx, client, OWNER, REPO, "test/labels-pr-branch", "main")
			},
			After: func(ctx context.Context, client *ghclient.Client) error {
				return deleteBranch(ctx, client, OWNER, REPO, "test/labels-pr-branch")
			},
		},
		{
			Name: "CreatePRWithAssignees",
			Tool: "create_pull_request",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"title": "PR with Assignees",
				"body":  "This PR has assignees",
				"head":  "test/assignees-pr-branch",
				"base":  "main",
				"draft": false,
				"assignees": []string{OWNER},
			},
			Before: func(ctx context.Context, client *ghclient.Client) error {
				return createBranchWithFile(ctx, client, OWNER, REPO, "test/assignees-pr-branch", "main")
			},
			After: func(ctx context.Context, client *ghclient.Client) error {
				return deleteBranch(ctx, client, OWNER, REPO, "test/assignees-pr-branch")
			},
		},
		{
			Name: "CreatePRWithReviewers",
			Tool: "create_pull_request",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"title": "PR with Reviewers",
				"body":  "This PR has reviewers",
				"head":  "test/reviewers-pr-branch",
				"base":  "main",
				"draft": false,
				"reviewers": []string{OWNER},
			},
			Before: func(ctx context.Context, client *ghclient.Client) error {
				return createBranchWithFile(ctx, client, OWNER, REPO, "test/reviewers-pr-branch", "main")
			},
			After: func(ctx context.Context, client *ghclient.Client) error {
				return deleteBranch(ctx, client, OWNER, REPO, "test/reviewers-pr-branch")
			},
		},

		// create_pull_request - Error Cases
		{
			Name: "InvalidOwner",
			Tool: "create_pull_request",
			Input: map[string]interface{}{
				"owner": "non-existent-user",
				"repo":  REPO,
				"title": "Test PR",
				"body":  "Test PR body",
				"head":  "test/error-branch",
				"base":  "main",
				"draft": false,
			},
		},
		{
			Name: "InvalidRepo",
			Tool: "create_pull_request",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  "non-existent-repo",
				"title": "Test PR",
				"body":  "Test PR body",
				"head":  "test/error-branch",
				"base":  "main",
				"draft": false,
			},
		},
		{
			Name: "InvalidBranch",
			Tool: "create_pull_request",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"title": "Test PR",
				"body":  "Test PR body",
				"head":  "non-existent-branch",
				"base":  "main",
				"draft": false,
			},
		},
		{
			Name: "SameBranches",
			Tool: "create_pull_request",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"title": "Test PR",
				"body":  "Test PR body",
				"head":  "main",
				"base":  "main",
				"draft": false,
			},
		},
		{
			Name: "MissingRequiredFields",
			Tool: "create_pull_request",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				// Missing title
				"body":  "Test PR body",
				"head":  "test/error-branch",
				"base":  "main",
				"draft": false,
			},
		},

		// get_pull_request - Happy Path
		{
			Name: "GetExistingPR",
			Tool: "get_pull_request",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"number": PR_NUMBER,
			},
		},
		{
			Name: "GetMergedPR",
			Tool: "get_pull_request",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"number": PR_NUMBER + 1, // Assuming PR_NUMBER + 1 is a merged PR
			},
		},
		{
			Name: "GetClosedPR",
			Tool: "get_pull_request",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"number": PR_NUMBER + 2, // Assuming PR_NUMBER + 2 is a closed PR
			},
		},

		// get_pull_request - Error Cases
		{
			Name: "GetNonExistentPR",
			Tool: "get_pull_request",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"number": 9999, // A non-existent PR number
			},
		},
		{
			Name: "InvalidOwnerGetPR",
			Tool: "get_pull_request",
			Input: map[string]interface{}{
				"owner": "non-existent-user",
				"repo":  REPO,
				"number": PR_NUMBER,
			},
		},
		{
			Name: "InvalidRepoGetPR",
			Tool: "get_pull_request",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  "non-existent-repo",
				"number": PR_NUMBER,
			},
		},
		{
			Name: "InvalidPRNumber",
			Tool: "get_pull_request",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"number": -1, // Invalid PR number
			},
		},

		// get_pull_request_diff - Happy Path
		{
			Name: "GetDiffForOpenPR",
			Tool: "get_pull_request_diff",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"number": PR_NUMBER,
			},
		},
		{
			Name: "GetDiffForMergedPR",
			Tool: "get_pull_request_diff",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"number": PR_NUMBER + 1, // Assuming PR_NUMBER + 1 is a merged PR
			},
		},
		{
			Name: "GetDiffForClosedPR",
			Tool: "get_pull_request_diff",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"number": PR_NUMBER + 2, // Assuming PR_NUMBER + 2 is a closed PR
			},
		},
		{
			Name: "GetDiffWithLargeChanges",
			Tool: "get_pull_request_diff",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"number": PR_NUMBER + 3, // Assuming PR_NUMBER + 3 is a PR with large changes
			},
		},

		// get_pull_request_diff - Error Cases
		{
			Name: "GetDiffForNonExistentPR",
			Tool: "get_pull_request_diff",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"number": 9999, // A non-existent PR number
			},
		},
		{
			Name: "InvalidOwnerGetDiff",
			Tool: "get_pull_request_diff",
			Input: map[string]interface{}{
				"owner": "non-existent-user",
				"repo":  REPO,
				"number": PR_NUMBER,
			},
		},
		{
			Name: "InvalidRepoGetDiff",
			Tool: "get_pull_request_diff",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  "non-existent-repo",
				"number": PR_NUMBER,
			},
		},
		{
			Name: "InvalidPRNumberGetDiff",
			Tool: "get_pull_request_diff",
			Input: map[string]interface{}{
				"owner": OWNER,
				"repo":  REPO,
				"number": -1, // Invalid PR number
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.Name, func(t *testing.T) {
			RunTest(t, tc)
		})
	}
}
