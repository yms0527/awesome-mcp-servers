package tools

import (
	"context"
	"fmt"

	"github.com/mark3labs/mcp-go/mcp"

	"github.com/geropl/github-mcp-go/pkg/errors"
	"github.com/geropl/github-mcp-go/pkg/github"
)

// RegisterPullRequestTools registers pull request-related tools
func RegisterPullRequestTools(s *Server) {
	client := s.GetClient()
	logger := s.GetLogger()
	prOps := github.NewPullRequestOperations(client, logger)

	// Register create_pull_request tool
	createPRTool := mcp.NewTool("create_pull_request",
		mcp.WithDescription("Create a new pull request in a GitHub repository"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithString("title",
			mcp.Required(),
			mcp.Description("Pull request title"),
		),
		mcp.WithString("body",
			mcp.Description("Pull request body"),
		),
		mcp.WithString("head",
			mcp.Required(),
			mcp.Description("The name of the branch where your changes are implemented"),
		),
		mcp.WithString("base",
			mcp.Required(),
			mcp.Description("The name of the branch you want the changes pulled into"),
		),
		mcp.WithBoolean("draft",
			mcp.Description("Whether to create the pull request as a draft"),
		),
	)

	s.RegisterTool(createPRTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		title, ok := request.Params.Arguments["title"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("title must be a string"))), nil
		}

		body := ""
		if bodyVal, ok := request.Params.Arguments["body"]; ok {
			if bodyStr, ok := bodyVal.(string); ok {
				body = bodyStr
			}
		}

		head, ok := request.Params.Arguments["head"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("head must be a string"))), nil
		}

		base, ok := request.Params.Arguments["base"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("base must be a string"))), nil
		}

		draft := false
		if draftVal, ok := request.Params.Arguments["draft"]; ok {
			if draftBool, ok := draftVal.(bool); ok {
				draft = draftBool
			}
		}

		// Call the operation
		result, err := prOps.CreatePullRequest(ctx, owner, repo, title, body, head, base, draft)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error creating pull request: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatPullRequestToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register get_pull_request tool
	getPRTool := mcp.NewTool("get_pull_request",
		mcp.WithDescription("Get details of a specific pull request in a GitHub repository"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithNumber("number",
			mcp.Required(),
			mcp.Description("Pull request number"),
		),
	)

	s.RegisterTool(getPRTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		numberFloat, ok := request.Params.Arguments["number"].(float64)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("number must be a number"))), nil
		}
		number := int(numberFloat)

		// Call the operation
		result, err := prOps.GetPullRequest(ctx, owner, repo, number)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error getting pull request: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatPullRequestToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register get_pull_request_diff tool
	getPRDiffTool := mcp.NewTool("get_pull_request_diff",
		mcp.WithDescription("Get the diff of a pull request in a GitHub repository"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithNumber("number",
			mcp.Required(),
			mcp.Description("Pull request number"),
		),
	)

	s.RegisterTool(getPRDiffTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		numberFloat, ok := request.Params.Arguments["number"].(float64)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("number must be a number"))), nil
		}
		number := int(numberFloat)

		// Call the operation
		diff, err := prOps.GetPullRequestDiff(ctx, owner, repo, number)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error getting pull request diff: %v", err)), nil
		}

		// Format the diff as markdown
		markdown := formatPullRequestDiffToMarkdown(number, diff)
		return mcp.NewToolResultText(markdown), nil
	})
}
