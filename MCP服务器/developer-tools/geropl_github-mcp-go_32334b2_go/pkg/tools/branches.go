package tools

import (
	"context"
	"fmt"

	"github.com/mark3labs/mcp-go/mcp"

	"github.com/geropl/github-mcp-go/pkg/errors"
	"github.com/geropl/github-mcp-go/pkg/github"
)

// RegisterBranchTools registers branch-related tools
func RegisterBranchTools(s *Server) {
	client := s.GetClient()
	logger := s.GetLogger()
	branchOps := github.NewBranchOperations(client, logger)

	// Register list_branches tool
	listBranchesTool := mcp.NewTool("list_branches",
		mcp.WithDescription("List branches in a GitHub repository"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithBoolean("protected",
			mcp.Description("Filter to only protected branches"),
		),
	)

	s.RegisterTool(listBranchesTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		protected := false
		if protectedVal, ok := request.Params.Arguments["protected"].(bool); ok {
			protected = protectedVal
		}

		// Call the operation
		branches, err := branchOps.ListBranches(ctx, owner, repo, protected)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error listing branches: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatBranchListToMarkdown(branches)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register get_branch tool
	getBranchTool := mcp.NewTool("get_branch",
		mcp.WithDescription("Get details about a specific branch in a GitHub repository"),
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
	)

	s.RegisterTool(getBranchTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
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

		// Call the operation
		branchInfo, err := branchOps.GetBranch(ctx, owner, repo, branch)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error getting branch: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatBranchToMarkdown(branchInfo)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register create_branch tool
	createBranchTool := mcp.NewTool("create_branch",
		mcp.WithDescription("Create a new branch in a GitHub repository"),
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
			mcp.Description("New branch name"),
		),
		mcp.WithString("from",
			mcp.Required(),
			mcp.Description("Base branch name or commit SHA to create branch from"),
		),
	)

	s.RegisterTool(createBranchTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
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

		from, ok := request.Params.Arguments["from"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("from must be a string"))), nil
		}

		// Call the operation
		ref, err := branchOps.CreateBranch(ctx, owner, repo, branch, from)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error creating branch: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatReferenceToMarkdown(ref)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register merge_branches tool
	mergeBranchesTool := mcp.NewTool("merge_branches",
		mcp.WithDescription("Merge one branch into another in a GitHub repository"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithString("base",
			mcp.Required(),
			mcp.Description("Base branch name (the branch that will receive the changes)"),
		),
		mcp.WithString("head",
			mcp.Required(),
			mcp.Description("Head branch name (the branch containing the changes to merge)"),
		),
		mcp.WithString("message",
			mcp.Description("Commit message for the merge commit"),
		),
	)

	s.RegisterTool(mergeBranchesTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		base, ok := request.Params.Arguments["base"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("base must be a string"))), nil
		}

		head, ok := request.Params.Arguments["head"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("head must be a string"))), nil
		}

		message := fmt.Sprintf("Merge %s into %s", head, base)
		if messageVal, ok := request.Params.Arguments["message"].(string); ok && messageVal != "" {
			message = messageVal
		}

		// Call the operation
		result, err := branchOps.MergeBranches(ctx, owner, repo, base, head, message)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error merging branches: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatMergeResultToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register delete_branch tool
	deleteBranchTool := mcp.NewTool("delete_branch",
		mcp.WithDescription("Delete a branch from a GitHub repository"),
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
			mcp.Description("Branch name to delete"),
		),
	)

	s.RegisterTool(deleteBranchTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
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

		// Call the operation
		err := branchOps.DeleteBranch(ctx, owner, repo, branch)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error deleting branch: %v", err)), nil
		}

		// Format the result as markdown
		markdown := fmt.Sprintf("# Branch Deleted\n\n")
		markdown += fmt.Sprintf("Branch `%s` has been successfully deleted from repository `%s/%s`.\n", branch, owner, repo)
		return mcp.NewToolResultText(markdown), nil
	})
}
