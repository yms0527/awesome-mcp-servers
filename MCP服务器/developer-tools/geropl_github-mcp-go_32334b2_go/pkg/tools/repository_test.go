package tools

import (
	"testing"
)

const (
	// Reuse constants from pulls_test.go
	REPO_OWNER = OWNER
	TEST_REPO  = "github-mcp-go-test"
)

func TestRepository(t *testing.T) {
	testCases := []*TestCase{
		// Note: The following test cases require write permissions to repositories
		// and are commented out for now. They can be enabled if the token has the
		// necessary permissions.
		
		/*
		// create_repository - Happy Path
		{
			Name: "BasicRepoCreation",
			Tool: "create_repository",
			Input: map[string]interface{}{
				"name":        "test-repo-basic",
				"description": "Test repository for basic creation",
			},
			After: func(ctx context.Context, client *ghclient.Client) error {
				// Delete the repository after the test
				_, err := client.GetClient().Repositories.Delete(ctx, REPO_OWNER, "test-repo-basic")
				return err
			},
		},
		{
			Name: "PrivateRepoCreation",
			Tool: "create_repository",
			Input: map[string]interface{}{
				"name":        "test-repo-private",
				"description": "Test private repository",
				"private":     true,
			},
			After: func(ctx context.Context, client *ghclient.Client) error {
				// Delete the repository after the test
				_, err := client.GetClient().Repositories.Delete(ctx, REPO_OWNER, "test-repo-private")
				return err
			},
		},
		{
			Name: "RepoWithAutoInit",
			Tool: "create_repository",
			Input: map[string]interface{}{
				"name":        "test-repo-autoinit",
				"description": "Test repository with auto-initialization",
				"autoInit":    true,
			},
			After: func(ctx context.Context, client *ghclient.Client) error {
				// Delete the repository after the test
				_, err := client.GetClient().Repositories.Delete(ctx, REPO_OWNER, "test-repo-autoinit")
				return err
			},
		},

		// create_repository - Error Cases
		{
			Name: "EmptyRepoName",
			Tool: "create_repository",
			Input: map[string]interface{}{
				"name":        "",
				"description": "Repository with empty name",
			},
		},
		{
			Name: "InvalidRepoName",
			Tool: "create_repository",
			Input: map[string]interface{}{
				"name":        "invalid/repo/name",
				"description": "Repository with invalid name",
			},
		},

		// fork_repository - Happy Path
		{
			Name: "BasicFork",
			Tool: "fork_repository",
			Input: map[string]interface{}{
				"owner": "octocat",
				"repo":  "hello-world",
			},
			After: func(ctx context.Context, client *ghclient.Client) error {
				// Delete the forked repository after the test
				_, err := client.GetClient().Repositories.Delete(ctx, REPO_OWNER, "hello-world")
				return err
			},
		},

		// fork_repository - Error Cases
		{
			Name: "InvalidOwner",
			Tool: "fork_repository",
			Input: map[string]interface{}{
				"owner": "non-existent-user",
				"repo":  "non-existent-repo",
			},
		},
		{
			Name: "InvalidRepo",
			Tool: "fork_repository",
			Input: map[string]interface{}{
				"owner": "octocat",
				"repo":  "non-existent-repo",
			},
		},
		*/
	}

	for _, tc := range testCases {
		t.Run(tc.Name, func(t *testing.T) {
			RunTest(t, tc)
		})
	}
}
