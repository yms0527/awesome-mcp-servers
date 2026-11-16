package tools

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/google/go-github/v69/github"
	"github.com/mark3labs/mcp-go/mcp"

	"github.com/geropl/github-mcp-go/pkg/errors"
	ghclient "github.com/geropl/github-mcp-go/pkg/github"
)

// RegisterFileTools registers file-related tools
func RegisterFileTools(s *Server) {
	client := s.GetClient()
	logger := s.GetLogger()
	fileOps := ghclient.NewFileOperations(client, logger)

	// Register get_file_contents tool
	getFileContentsTool := mcp.NewTool("get_file_contents",
		mcp.WithDescription("Get the contents of a file or directory in a GitHub repository"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithString("path",
			mcp.Required(),
			mcp.Description("Path to the file or directory"),
		),
		mcp.WithString("branch",
			mcp.Description("Branch name (default: repository's default branch)"),
		),
	)

	s.RegisterTool(getFileContentsTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		path, ok := request.Params.Arguments["path"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("path must be a string"))), nil
		}

		branch := ""
		if branchVal, ok := request.Params.Arguments["branch"]; ok {
			if branchStr, ok := branchVal.(string); ok {
				branch = branchStr
			}
		}

		// Call the operation
		result, err := fileOps.GetFileContents(ctx, owner, repo, path, branch)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error getting file contents: %v", err)), nil
		}

		// Handle different result types
		switch content := result.(type) {
		case *github.RepositoryContent:
			// It's a file
			decodedContent, err := fileOps.DecodeFileContent(content)
			if err != nil {
				return mcp.NewToolResultError(fmt.Sprintf("Error decoding file content: %v", err)), nil
			}

			// Create a response with file metadata and content
			response := map[string]interface{}{
				"type":         "file",
				"name":         content.GetName(),
				"path":         content.GetPath(),
				"sha":          content.GetSHA(),
				"size":         content.GetSize(),
				"url":          content.GetURL(),
				"html_url":     content.GetHTMLURL(),
				"git_url":      content.GetGitURL(),
				"download_url": content.GetDownloadURL(),
				"content":      decodedContent,
			}

			// Format the result as markdown
			markdown := formatFileContentToMarkdown(response)
			return mcp.NewToolResultText(markdown), nil

		case []*github.RepositoryContent:
			// It's a directory
			var dirContents []map[string]interface{}
			for _, item := range content {
				dirContents = append(dirContents, map[string]interface{}{
					"type":         item.GetType(),
					"name":         item.GetName(),
					"path":         item.GetPath(),
					"sha":          item.GetSHA(),
					"size":         item.GetSize(),
					"url":          item.GetURL(),
					"html_url":     item.GetHTMLURL(),
					"git_url":      item.GetGitURL(),
					"download_url": item.GetDownloadURL(),
				})
			}

			response := map[string]interface{}{
				"type":     "directory",
				"path":     path,
				"contents": dirContents,
			}

			// Format the result as markdown
			markdown := formatDirectoryContentToMarkdown(response)
			return mcp.NewToolResultText(markdown), nil

		default:
			return mcp.NewToolResultError("Unexpected response type from GitHub API"), nil
		}
	})

	// Register create_or_update_file tool
	createOrUpdateFileTool := mcp.NewTool("create_or_update_file",
		mcp.WithDescription("Create or update a file in a GitHub repository"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithString("path",
			mcp.Required(),
			mcp.Description("Path to the file"),
		),
		mcp.WithString("content",
			mcp.Required(),
			mcp.Description("File content"),
		),
		mcp.WithString("message",
			mcp.Required(),
			mcp.Description("Commit message"),
		),
		mcp.WithString("branch",
			mcp.Description("Branch name (default: repository's default branch)"),
		),
		mcp.WithString("sha",
			mcp.Description("File SHA (required for updating an existing file)"),
		),
	)

	s.RegisterTool(createOrUpdateFileTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		path, ok := request.Params.Arguments["path"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("path must be a string"))), nil
		}

		content, ok := request.Params.Arguments["content"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("content must be a string"))), nil
		}

		message, ok := request.Params.Arguments["message"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("message must be a string"))), nil
		}

		branch := ""
		if branchVal, ok := request.Params.Arguments["branch"]; ok {
			if branchStr, ok := branchVal.(string); ok {
				branch = branchStr
			}
		}

		sha := ""
		if shaVal, ok := request.Params.Arguments["sha"]; ok {
			if shaStr, ok := shaVal.(string); ok {
				sha = shaStr
			}
		}

		// Call the operation
		result, err := fileOps.CreateOrUpdateFile(ctx, owner, repo, path, content, message, branch, sha)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error creating or updating file: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatFileUpdateToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register push_files tool
	pushFilesTool := mcp.NewTool("push_files",
		mcp.WithDescription("Push multiple files to a GitHub repository in a single commit"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithString("branch",
			mcp.Required(),
			mcp.Description("Branch name"),
		),
		mcp.WithString("files",
			mcp.Required(),
			mcp.Description("JSON array of files to push, each with path and content properties"),
		),
		mcp.WithString("message",
			mcp.Required(),
			mcp.Description("Commit message"),
		),
	)

	s.RegisterTool(pushFilesTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		branch, ok := request.Params.Arguments["branch"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("branch must be a string"))), nil
		}

		filesStr, ok := request.Params.Arguments["files"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("files must be a string containing JSON array"))), nil
		}

		// Parse the JSON string
		var filesObj []interface{}
		if err := json.Unmarshal([]byte(filesStr), &filesObj); err != nil {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("files must be a valid JSON array: " + err.Error()))), nil
		}

		message, ok := request.Params.Arguments["message"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("message must be a string"))), nil
		}

		// Convert files to the expected format
		var files []ghclient.FileToCommit
		for _, fileObj := range filesObj {
			fileMap, ok := fileObj.(map[string]interface{})
			if !ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("each file must be an object with path and content"))), nil
			}

			path, ok := fileMap["path"].(string)
			if !ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("file path must be a string"))), nil
			}

			content, ok := fileMap["content"].(string)
			if !ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("file content must be a string"))), nil
			}

			files = append(files, ghclient.FileToCommit{
				Path:    path,
				Content: content,
			})
		}

		// Call the operation
		result, err := fileOps.PushFiles(ctx, owner, repo, branch, files, message)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error pushing files: %v", err)), nil
		}

		// Format the result as markdown
		// Since this is a commit, we'll format it as a commit
		if result.Commit != nil {
			markdown := formatCommitToMarkdown(result.Commit)
			return mcp.NewToolResultText(markdown), nil
		}

		// Fallback to simple text if no commit is available
		return mcp.NewToolResultText(fmt.Sprintf("Files pushed successfully to %s/%s:%s", owner, repo, branch)), nil
	})
}
