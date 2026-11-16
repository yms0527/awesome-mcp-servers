package tools

import (
	"context"
	"fmt"

	"github.com/mark3labs/mcp-go/mcp"

	"github.com/geropl/github-mcp-go/pkg/errors"
	"github.com/geropl/github-mcp-go/pkg/github"
)

// RegisterRepositoryTools registers repository-related tools
func RegisterRepositoryTools(s *Server) {
	client := s.GetClient()
	logger := s.GetLogger()
	repoOps := github.NewRepositoryOperations(client, logger)

	// Register create_repository tool
	createRepoTool := mcp.NewTool("create_repository",
		mcp.WithDescription("Create a new GitHub repository in your account"),
		mcp.WithString("name",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithString("description",
			mcp.Description("Repository description"),
		),
		mcp.WithBoolean("private",
			mcp.Description("Whether the repository should be private"),
		),
		mcp.WithBoolean("autoInit",
			mcp.Description("Initialize with README.md"),
		),
	)

	s.RegisterTool(createRepoTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		name, ok := request.Params.Arguments["name"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("name must be a string"))), nil
		}

		description := ""
		if descVal, ok := request.Params.Arguments["description"]; ok {
			if descStr, ok := descVal.(string); ok {
				description = descStr
			}
		}

		private := false
		if privateVal, ok := request.Params.Arguments["private"]; ok {
			if privateBool, ok := privateVal.(bool); ok {
				private = privateBool
			}
		}

		autoInit := false
		if autoInitVal, ok := request.Params.Arguments["autoInit"]; ok {
			if autoInitBool, ok := autoInitVal.(bool); ok {
				autoInit = autoInitBool
			}
		}

		// Call the operation
		result, err := repoOps.CreateRepository(ctx, name, description, private, autoInit)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error creating repository: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatRepositoryToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register fork_repository tool
	forkRepoTool := mcp.NewTool("fork_repository",
		mcp.WithDescription("Fork a GitHub repository to your account or specified organization"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithString("organization",
			mcp.Description("Optional: organization to fork to (defaults to your personal account)"),
		),
	)

	s.RegisterTool(forkRepoTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		organization := ""
		if orgVal, ok := request.Params.Arguments["organization"]; ok {
			if orgStr, ok := orgVal.(string); ok {
				organization = orgStr
			}
		}

		// Call the operation
		result, err := repoOps.ForkRepository(ctx, owner, repo, organization)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error forking repository: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatRepositoryToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})
}
