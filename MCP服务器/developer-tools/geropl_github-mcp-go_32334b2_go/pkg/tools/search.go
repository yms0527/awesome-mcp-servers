package tools

import (
	"context"
	"fmt"
	"strings"

	"github.com/mark3labs/mcp-go/mcp"

	"github.com/geropl/github-mcp-go/pkg/errors"
	"github.com/geropl/github-mcp-go/pkg/github"
)

// RegisterSearchTools registers search-related tools
func RegisterSearchTools(s *Server) {
	client := s.GetClient()
	logger := s.GetLogger()
	searchOps := github.NewSearchOperations(client, logger)

	// Register search_code tool
	searchCodeTool := mcp.NewTool("search_code",
		mcp.WithDescription("Search for code across GitHub repositories"),
		mcp.WithString("query",
			mcp.Required(),
			mcp.Description("Search query (see GitHub search syntax)"),
		),
		mcp.WithString("language",
			mcp.Description("Filter by programming language"),
		),
		mcp.WithString("owner",
			mcp.Description("Filter by repository owner"),
		),
		mcp.WithString("repo",
			mcp.Description("Filter by repository name (requires owner parameter)"),
		),
		mcp.WithNumber("page",
			mcp.Description("Page number for pagination (default: 1)"),
		),
		mcp.WithNumber("perPage",
			mcp.Description("Number of results per page (default: 30, max: 100)"),
		),
	)

	s.RegisterTool(searchCodeTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		query, ok := request.Params.Arguments["query"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("query must be a string"))), nil
		}

		// Process optional parameters
		language, hasLanguage := request.Params.Arguments["language"].(string)
		owner, hasOwner := request.Params.Arguments["owner"].(string)
		repo, hasRepo := request.Params.Arguments["repo"].(string)

		// Build the query with filters
		queryParts := []string{query}

		if hasLanguage && language != "" {
			queryParts = append(queryParts, fmt.Sprintf("language:%s", language))
		}

		if hasOwner && owner != "" {
			if hasRepo && repo != "" {
				queryParts = append(queryParts, fmt.Sprintf("repo:%s/%s", owner, repo))
			} else {
				queryParts = append(queryParts, fmt.Sprintf("user:%s", owner))
			}
		}

		finalQuery := strings.Join(queryParts, " ")

		// Extract pagination parameters
		page := 1
		if pageVal, ok := request.Params.Arguments["page"].(float64); ok {
			page = int(pageVal)
		}

		perPage := 30
		if perPageVal, ok := request.Params.Arguments["perPage"].(float64); ok {
			perPage = int(perPageVal)
			if perPage <= 0 || perPage > 100 {
				return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("perPage must be between 1 and 100"))), nil
			}
		}

		// Call the operation
		result, err := searchOps.SearchCode(ctx, finalQuery, page, perPage)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error searching code: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatCodeSearchToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register search_repositories tool
	searchReposTool := mcp.NewTool("search_repositories",
		mcp.WithDescription("Search for GitHub repositories"),
		mcp.WithString("query",
			mcp.Required(),
			mcp.Description("Search query (see GitHub search syntax)"),
		),
		mcp.WithNumber("page",
			mcp.Description("Page number for pagination (default: 1)"),
		),
		mcp.WithNumber("perPage",
			mcp.Description("Number of results per page (default: 30, max: 100)"),
		),
	)

	s.RegisterTool(searchReposTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		query, ok := request.Params.Arguments["query"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("query must be a string"))), nil
		}

		var page, perPage int
		if pageVal, ok := request.Params.Arguments["page"]; ok {
			if pageFloat, ok := pageVal.(float64); ok {
				page = int(pageFloat)
			}
		}

		if perPageVal, ok := request.Params.Arguments["perPage"]; ok {
			if perPageFloat, ok := perPageVal.(float64); ok {
				perPage = int(perPageFloat)
			}
		}

		// Call the operation
		result, err := searchOps.SearchRepositories(ctx, query, page, perPage)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error searching repositories: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatRepositorySearchToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register search_issues tool
	searchIssuesTool := mcp.NewTool("search_issues",
		mcp.WithDescription("Search for issues and pull requests across GitHub repositories"),
		mcp.WithString("query",
			mcp.Required(),
			mcp.Description("Search query (see GitHub search syntax)"),
		),
		mcp.WithString("type",
			mcp.Description("Type of items to search for (issue, pull-request). Default: issue"),
		),
		mcp.WithString("state",
			mcp.Description("Filter by issue state (open, closed, all)"),
		),
		mcp.WithString("labels",
			mcp.Description("Filter by comma-separated list of labels"),
		),
		mcp.WithString("owner",
			mcp.Description("Filter by repository owner"),
		),
		mcp.WithString("repo",
			mcp.Description("Filter by repository name (requires owner parameter)"),
		),
		mcp.WithNumber("page",
			mcp.Description("Page number for pagination (default: 1)"),
		),
		mcp.WithNumber("perPage",
			mcp.Description("Number of results per page (default: 30, max: 100)"),
		),
	)

	s.RegisterTool(searchIssuesTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		query, ok := request.Params.Arguments["query"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("query must be a string"))), nil
		}

		// Process optional parameters
		state, hasState := request.Params.Arguments["state"].(string)
		labels, hasLabels := request.Params.Arguments["labels"].(string)
		owner, hasOwner := request.Params.Arguments["owner"].(string)
		repo, hasRepo := request.Params.Arguments["repo"].(string)
		itemType, hasType := request.Params.Arguments["type"].(string)

		// Build the query with filters
		queryParts := []string{query}

		if hasState && state != "" {
			queryParts = append(queryParts, fmt.Sprintf("state:%s", state))
		}

		if hasLabels && labels != "" {
			labelList := strings.Split(labels, ",")
			for _, label := range labelList {
				trimmedLabel := strings.TrimSpace(label)
				if trimmedLabel != "" {
					queryParts = append(queryParts, fmt.Sprintf("label:%s", trimmedLabel))
				}
			}
		}

		if hasOwner && owner != "" {
			if hasRepo && repo != "" {
				queryParts = append(queryParts, fmt.Sprintf("repo:%s/%s", owner, repo))
			} else {
				queryParts = append(queryParts, fmt.Sprintf("user:%s", owner))
			}
		}

		// Process the type parameter
		lowerQuery := strings.ToLower(query)
		if !hasType || itemType == "" {
			// Default to "issue" if not specified
			itemType = "issue"
		}

		// Validate and normalize the type
		switch strings.ToLower(itemType) {
		case "issue":
			if !strings.Contains(lowerQuery, "is:issue") {
				queryParts = append(queryParts, "is:issue")
			}
		case "pull-request", "pr":
			if !strings.Contains(lowerQuery, "is:pr") && !strings.Contains(lowerQuery, "is:pull-request") {
				queryParts = append(queryParts, "is:pull-request")
			}
		default:
			return mcp.NewToolResultError(errors.FormatGitHubError(
				errors.NewInvalidArgumentError("type must be either 'issue' or 'pull-request'"))), nil
		}

		finalQuery := strings.Join(queryParts, " ")

		// Extract pagination parameters
		page := 1
		if pageVal, ok := request.Params.Arguments["page"].(float64); ok {
			page = int(pageVal)
		}

		perPage := 30
		if perPageVal, ok := request.Params.Arguments["perPage"].(float64); ok {
			perPage = int(perPageVal)
			if perPage <= 0 || perPage > 100 {
				return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("perPage must be between 1 and 100"))), nil
			}
		}

		// Call the operation
		result, err := searchOps.SearchIssues(ctx, finalQuery, page, perPage)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error searching issues: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatIssueSearchToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register search_commits tool
	searchCommitsTool := mcp.NewTool("search_commits",
		mcp.WithDescription("Search for commits across GitHub repositories"),
		mcp.WithString("query",
			mcp.Required(),
			mcp.Description("Search query (see GitHub search syntax)"),
		),
		mcp.WithString("owner",
			mcp.Description("Filter by repository owner"),
		),
		mcp.WithString("repo",
			mcp.Description("Filter by repository name (requires owner parameter)"),
		),
		mcp.WithString("sort",
			mcp.Description("Sort by (author-date, committer-date)"),
		),
		mcp.WithString("order",
			mcp.Description("Sort order (asc, desc)"),
		),
		mcp.WithNumber("page",
			mcp.Description("Page number for pagination (default: 1)"),
		),
		mcp.WithNumber("perPage",
			mcp.Description("Number of results per page (default: 30, max: 100)"),
		),
	)

	s.RegisterTool(searchCommitsTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		query, ok := request.Params.Arguments["query"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("query must be a string"))), nil
		}

		// Process optional parameters
		owner, hasOwner := request.Params.Arguments["owner"].(string)
		repo, hasRepo := request.Params.Arguments["repo"].(string)

		// Build the query with filters
		queryParts := []string{query}

		if hasOwner && owner != "" {
			if hasRepo && repo != "" {
				queryParts = append(queryParts, fmt.Sprintf("repo:%s/%s", owner, repo))
			} else {
				queryParts = append(queryParts, fmt.Sprintf("user:%s", owner))
			}
		}

		finalQuery := strings.Join(queryParts, " ")

		// Extract pagination parameters
		page := 1
		if pageVal, ok := request.Params.Arguments["page"].(float64); ok {
			page = int(pageVal)
		}

		perPage := 30
		if perPageVal, ok := request.Params.Arguments["perPage"].(float64); ok {
			perPage = int(perPageVal)
			if perPage <= 0 || perPage > 100 {
				return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("perPage must be between 1 and 100"))), nil
			}
		}

		// Call the operation
		result, err := searchOps.SearchCommits(ctx, finalQuery, page, perPage)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error searching commits: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatCommitSearchToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})
}
