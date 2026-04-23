package tools

import (
	"context"
	"testing"

	"github.com/google/go-github/v69/github"
	ghclient "github.com/geropl/github-mcp-go/pkg/github"
)

const (
	// Reuse constants from pulls_test.go
	FILE_OWNER = OWNER
	FILE_REPO  = REPO
)

func TestFiles(t *testing.T) {
	testCases := []*TestCase{
		// get_file_contents - Happy Path (File)
		{
			Name: "GetFileContents",
			Tool: "get_file_contents",
			Input: map[string]interface{}{
				"owner": FILE_OWNER,
				"repo":  FILE_REPO,
				"path":  "README.md",
			},
		},
		{
			Name: "GetFileContentsWithBranch",
			Tool: "get_file_contents",
			Input: map[string]interface{}{
				"owner":  FILE_OWNER,
				"repo":   FILE_REPO,
				"path":   "README.md",
				"branch": "main",
			},
		},

		// get_file_contents - Happy Path (Directory)
		{
			Name: "GetDirectoryContents",
			Tool: "get_file_contents",
			Input: map[string]interface{}{
				"owner": FILE_OWNER,
				"repo":  FILE_REPO,
				"path":  ".",
			},
		},
		{
			Name: "GetDirectoryContentsWithBranch",
			Tool: "get_file_contents",
			Input: map[string]interface{}{
				"owner":  FILE_OWNER,
				"repo":   FILE_REPO,
				"path":   ".",
				"branch": "main",
			},
		},

		// get_file_contents - Error Cases
		{
			Name: "GetNonExistentFile",
			Tool: "get_file_contents",
			Input: map[string]interface{}{
				"owner": FILE_OWNER,
				"repo":  FILE_REPO,
				"path":  "non-existent-file.txt",
			},
		},
		{
			Name: "GetFileInvalidOwner",
			Tool: "get_file_contents",
			Input: map[string]interface{}{
				"owner": "non-existent-user",
				"repo":  FILE_REPO,
				"path":  "README.md",
			},
		},
		{
			Name: "GetFileInvalidRepo",
			Tool: "get_file_contents",
			Input: map[string]interface{}{
				"owner": FILE_OWNER,
				"repo":  "non-existent-repo",
				"path":  "README.md",
			},
		},
		{
			Name: "GetFileEmptyPath",
			Tool: "get_file_contents",
			Input: map[string]interface{}{
				"owner": FILE_OWNER,
				"repo":  FILE_REPO,
				"path":  "",
			},
		},

		// create_or_update_file - Happy Path
		{
			Name: "CreateFile",
			Tool: "create_or_update_file",
			Input: map[string]interface{}{
				"owner":   FILE_OWNER,
				"repo":    FILE_REPO,
				"path":    "test-file.md",
				"content": "# Test File\n\nThis is a test file created by the test suite.",
				"message": "Create test file",
				"branch":  "main",
			},
			After: func(ctx context.Context, client *ghclient.Client) error {
				// Delete the file after the test
				opts := &github.RepositoryContentFileOptions{
					Message: github.Ptr("Delete test file"),
					SHA:     github.Ptr(""), // Need to get the SHA first
					Branch:  github.Ptr("main"),
				}
				
				// Get the file to get its SHA
				fileContent, _, _, err := client.GetClient().Repositories.GetContents(
					ctx, FILE_OWNER, FILE_REPO, "test-file.md", &github.RepositoryContentGetOptions{})
				if err != nil {
					// If the file doesn't exist, that's fine
					return nil
				}
				
				opts.SHA = github.Ptr(fileContent.GetSHA())
				
				// Delete the file
				_, _, err = client.GetClient().Repositories.DeleteFile(
					ctx, FILE_OWNER, FILE_REPO, "test-file.md", opts)
				return err
			},
		},
		// Note: For the UpdateFile test, we'll create a new file for each test run
		// since we can't modify the test case input dynamically
		{
			Name: "CreateFileForUpdate",
			Tool: "create_or_update_file",
			Input: map[string]interface{}{
				"owner":   FILE_OWNER,
				"repo":    FILE_REPO,
				"path":    "test-update-file.md",
				"content": "# Test File\n\nThis is a test file for updating.",
				"message": "Create test file for update",
				"branch":  "main",
			},
			After: func(ctx context.Context, client *ghclient.Client) error {
				// Delete the file after the test
				opts := &github.RepositoryContentFileOptions{
					Message: github.Ptr("Delete test file"),
					SHA:     github.Ptr(""), // Need to get the SHA first
					Branch:  github.Ptr("main"),
				}
				
				// Get the file to get its SHA
				fileContent, _, _, err := client.GetClient().Repositories.GetContents(
					ctx, FILE_OWNER, FILE_REPO, "test-update-file.md", &github.RepositoryContentGetOptions{})
				if err != nil {
					// If the file doesn't exist, that's fine
					return nil
				}
				
				opts.SHA = github.Ptr(fileContent.GetSHA())
				
				// Delete the file
				_, _, err = client.GetClient().Repositories.DeleteFile(
					ctx, FILE_OWNER, FILE_REPO, "test-update-file.md", opts)
				return err
			},
		},

		// create_or_update_file - Error Cases
		{
			Name: "CreateFileInvalidOwner",
			Tool: "create_or_update_file",
			Input: map[string]interface{}{
				"owner":   "non-existent-user",
				"repo":    FILE_REPO,
				"path":    "test-file.md",
				"content": "# Test File",
				"message": "Create test file",
			},
		},
		{
			Name: "CreateFileInvalidRepo",
			Tool: "create_or_update_file",
			Input: map[string]interface{}{
				"owner":   FILE_OWNER,
				"repo":    "non-existent-repo",
				"path":    "test-file.md",
				"content": "# Test File",
				"message": "Create test file",
			},
		},
		{
			Name: "CreateFileEmptyPath",
			Tool: "create_or_update_file",
			Input: map[string]interface{}{
				"owner":   FILE_OWNER,
				"repo":    FILE_REPO,
				"path":    "",
				"content": "# Test File",
				"message": "Create test file",
			},
		},
		{
			Name: "CreateFileEmptyContent",
			Tool: "create_or_update_file",
			Input: map[string]interface{}{
				"owner":   FILE_OWNER,
				"repo":    FILE_REPO,
				"path":    "test-file.md",
				"content": "",
				"message": "Create test file",
			},
		},
		{
			Name: "CreateFileEmptyMessage",
			Tool: "create_or_update_file",
			Input: map[string]interface{}{
				"owner":   FILE_OWNER,
				"repo":    FILE_REPO,
				"path":    "test-file.md",
				"content": "# Test File",
				"message": "",
			},
		},

		// push_files - Happy Path
		{
			Name: "PushFiles",
			Tool: "push_files",
			Input: map[string]interface{}{
				"owner":   FILE_OWNER,
				"repo":    FILE_REPO,
				"branch":  "main",
				"message": "Push multiple test files",
				"files":   `[{"path": "test-file1.md", "content": "# Test File 1"}, {"path": "test-file2.md", "content": "# Test File 2"}]`,
			},
			After: func(ctx context.Context, client *ghclient.Client) error {
				// Delete the files after the test
				for _, path := range []string{"test-file1.md", "test-file2.md"} {
					opts := &github.RepositoryContentFileOptions{
						Message: github.Ptr("Delete test file"),
						SHA:     github.Ptr(""), // Need to get the SHA first
						Branch:  github.Ptr("main"),
					}
					
					// Get the file to get its SHA
					fileContent, _, _, err := client.GetClient().Repositories.GetContents(
						ctx, FILE_OWNER, FILE_REPO, path, &github.RepositoryContentGetOptions{})
					if err != nil {
						// If the file doesn't exist, that's fine
						continue
					}
					
					opts.SHA = github.Ptr(fileContent.GetSHA())
					
					// Delete the file
					_, _, err = client.GetClient().Repositories.DeleteFile(
						ctx, FILE_OWNER, FILE_REPO, path, opts)
					if err != nil {
						return err
					}
				}
				return nil
			},
		},

		// push_files - Error Cases
		{
			Name: "PushFilesInvalidOwner",
			Tool: "push_files",
			Input: map[string]interface{}{
				"owner":   "non-existent-user",
				"repo":    FILE_REPO,
				"branch":  "main",
				"message": "Push test files",
				"files":   `[{"path": "test-file1.md", "content": "# Test File 1"}]`,
			},
		},
		{
			Name: "PushFilesInvalidRepo",
			Tool: "push_files",
			Input: map[string]interface{}{
				"owner":   FILE_OWNER,
				"repo":    "non-existent-repo",
				"branch":  "main",
				"message": "Push test files",
				"files":   `[{"path": "test-file1.md", "content": "# Test File 1"}]`,
			},
		},
		{
			Name: "PushFilesInvalidBranch",
			Tool: "push_files",
			Input: map[string]interface{}{
				"owner":   FILE_OWNER,
				"repo":    FILE_REPO,
				"branch":  "non-existent-branch",
				"message": "Push test files",
				"files":   `[{"path": "test-file1.md", "content": "# Test File 1"}]`,
			},
		},
		{
			Name: "PushFilesEmptyFiles",
			Tool: "push_files",
			Input: map[string]interface{}{
				"owner":   FILE_OWNER,
				"repo":    FILE_REPO,
				"branch":  "main",
				"message": "Push test files",
				"files":   `[]`,
			},
		},
		{
			Name: "PushFilesInvalidJSON",
			Tool: "push_files",
			Input: map[string]interface{}{
				"owner":   FILE_OWNER,
				"repo":    FILE_REPO,
				"branch":  "main",
				"message": "Push test files",
				"files":   `invalid json`,
			},
		},
		{
			Name: "PushFilesEmptyMessage",
			Tool: "push_files",
			Input: map[string]interface{}{
				"owner":   FILE_OWNER,
				"repo":    FILE_REPO,
				"branch":  "main",
				"message": "",
				"files":   `[{"path": "test-file1.md", "content": "# Test File 1"}]`,
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.Name, func(t *testing.T) {
			RunTest(t, tc)
		})
	}
}
