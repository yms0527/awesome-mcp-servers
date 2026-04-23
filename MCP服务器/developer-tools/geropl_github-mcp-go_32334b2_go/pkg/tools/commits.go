package tools

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/mark3labs/mcp-go/mcp"

	"github.com/geropl/github-mcp-go/pkg/errors"
	"github.com/geropl/github-mcp-go/pkg/github"
	gh "github.com/google/go-github/v69/github"
)

// RegisterCommitTools registers commit-related tools
func RegisterCommitTools(s *Server) {
	client := s.GetClient()
	logger := s.GetLogger()
	commitOps := github.NewCommitOperations(client, logger)

	// Register get_commit tool
	getCommitTool := mcp.NewTool("get_commit",
		mcp.WithDescription("Get details of a specific commit in a GitHub repository"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithString("sha",
			mcp.Required(),
			mcp.Description("Commit SHA"),
		),
	)

	s.RegisterTool(getCommitTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		sha, ok := request.Params.Arguments["sha"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("sha must be a string"))), nil
		}

		// Call the operation
		result, err := commitOps.GetCommit(ctx, owner, repo, sha)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error getting commit: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatRepositoryCommitToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register list_commits tool
	listCommitsTool := mcp.NewTool("list_commits",
		mcp.WithDescription("List commits in a GitHub repository with filtering options"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithString("path",
			mcp.Description("Only commits containing this file path will be returned"),
		),
		mcp.WithString("author",
			mcp.Description("GitHub login or email address by which to filter by commit author"),
		),
		mcp.WithString("since",
			mcp.Description("Only commits after this date will be returned (ISO 8601 format)"),
		),
		mcp.WithString("until",
			mcp.Description("Only commits before this date will be returned (ISO 8601 format)"),
		),
		mcp.WithNumber("per_page",
			mcp.Description("Number of results per page (max 100, default 30)"),
		),
	)

	s.RegisterTool(listCommitsTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		// Optional parameters
		path := ""
		if pathVal, ok := request.Params.Arguments["path"].(string); ok {
			path = pathVal
		}

		author := ""
		if authorVal, ok := request.Params.Arguments["author"].(string); ok {
			author = authorVal
		}

		// Parse since
		var since time.Time
		if sinceVal, ok := request.Params.Arguments["since"].(string); ok && sinceVal != "" {
			var err error
			since, err = time.Parse(time.RFC3339, sinceVal)
			if err != nil {
				return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("since must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)"))), nil
			}
		}

		// Parse until
		var until time.Time
		if untilVal, ok := request.Params.Arguments["until"].(string); ok && untilVal != "" {
			var err error
			until, err = time.Parse(time.RFC3339, untilVal)
			if err != nil {
				return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("until must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)"))), nil
			}
		}

		// Parse per_page
		perPage := 30
		if perPageVal, ok := request.Params.Arguments["per_page"].(float64); ok {
			perPage = int(perPageVal)
			if perPage <= 0 || perPage > 100 {
				return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("per_page must be between 1 and 100"))), nil
			}
		}

		// Call the operation
		result, err := commitOps.ListCommits(ctx, owner, repo, path, author, since, until, perPage)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error listing commits: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatCommitListToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register compare_commits tool
	compareCommitsTool := mcp.NewTool("compare_commits",
		mcp.WithDescription("Compare two commits or branches in a GitHub repository"),
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
			mcp.Description("Base branch or commit SHA"),
		),
		mcp.WithString("head",
			mcp.Required(),
			mcp.Description("Head branch or commit SHA"),
		),
	)

	s.RegisterTool(compareCommitsTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
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

		// Call the operation
		result, err := commitOps.CompareCommits(ctx, owner, repo, base, head)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error comparing commits: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatCommitComparisonToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register get_commit_status tool
	getCommitStatusTool := mcp.NewTool("get_commit_status",
		mcp.WithDescription("Get the combined status for a specific commit in a GitHub repository"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithString("sha",
			mcp.Required(),
			mcp.Description("Commit SHA"),
		),
	)

	s.RegisterTool(getCommitStatusTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		sha, ok := request.Params.Arguments["sha"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("sha must be a string"))), nil
		}

		// Call the operation
		result, err := commitOps.GetCommitStatus(ctx, owner, repo, sha)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error getting commit status: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatCommitStatusToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register create_commit_comment tool
	createCommitCommentTool := mcp.NewTool("create_commit_comment",
		mcp.WithDescription("Add a comment to a specific commit in a GitHub repository"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithString("sha",
			mcp.Required(),
			mcp.Description("Commit SHA"),
		),
		mcp.WithString("body",
			mcp.Required(),
			mcp.Description("Comment body"),
		),
		mcp.WithString("path",
			mcp.Description("Relative path of the file to comment on"),
		),
		mcp.WithNumber("position",
			mcp.Description("Line index in the diff to comment on"),
		),
	)

	s.RegisterTool(createCommitCommentTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		sha, ok := request.Params.Arguments["sha"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("sha must be a string"))), nil
		}

		body, ok := request.Params.Arguments["body"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("body must be a string"))), nil
		}

		// Optional parameters
		path := ""
		if pathVal, ok := request.Params.Arguments["path"].(string); ok {
			path = pathVal
		}

		position := 0
		if positionVal, ok := request.Params.Arguments["position"].(float64); ok {
			position = int(positionVal)
		}

		// Call the operation
		result, err := commitOps.CreateCommitComment(ctx, owner, repo, sha, body, path, position)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error creating commit comment: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatCommitCommentToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register list_commit_comments tool
	listCommitCommentsTool := mcp.NewTool("list_commit_comments",
		mcp.WithDescription("List comments for a specific commit in a GitHub repository"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithString("sha",
			mcp.Required(),
			mcp.Description("Commit SHA"),
		),
	)

	s.RegisterTool(listCommitCommentsTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		sha, ok := request.Params.Arguments["sha"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("sha must be a string"))), nil
		}

		// Call the operation
		result, err := commitOps.ListCommitComments(ctx, owner, repo, sha)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error listing commit comments: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatCommitCommentListToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register create_commit tool
	createCommitTool := mcp.NewTool("create_commit",
		mcp.WithDescription("Create a new commit directly (without push) in a GitHub repository"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithString("message",
			mcp.Required(),
			mcp.Description("Commit message"),
		),
		mcp.WithString("tree",
			mcp.Required(),
			mcp.Description("SHA of the tree object this commit points to"),
		),
		mcp.WithString("parents",
			mcp.Required(),
			mcp.Description("Comma-separated list of parent commit SHAs"),
		),
		mcp.WithString("author_name",
			mcp.Description("Name of the author of the commit"),
		),
		mcp.WithString("author_email",
			mcp.Description("Email of the author of the commit"),
		),
		mcp.WithString("author_date",
			mcp.Description("Date when the commit was authored (ISO 8601 format)"),
		),
		mcp.WithString("committer_name",
			mcp.Description("Name of the committer of the commit"),
		),
		mcp.WithString("committer_email",
			mcp.Description("Email of the committer of the commit"),
		),
		mcp.WithString("committer_date",
			mcp.Description("Date when the commit was committed (ISO 8601 format)"),
		),
	)

	s.RegisterTool(createCommitTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		message, ok := request.Params.Arguments["message"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("message must be a string"))), nil
		}

		tree, ok := request.Params.Arguments["tree"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("tree must be a string"))), nil
		}

		parentsStr, ok := request.Params.Arguments["parents"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("parents must be a string"))), nil
		}

		// Parse parents
		parents := strings.Split(parentsStr, ",")
		for i, parent := range parents {
			parents[i] = strings.TrimSpace(parent)
		}

		// Parse author information
		var author *gh.CommitAuthor
		authorName, hasAuthorName := request.Params.Arguments["author_name"].(string)
		authorEmail, hasAuthorEmail := request.Params.Arguments["author_email"].(string)
		authorDateStr, hasAuthorDate := request.Params.Arguments["author_date"].(string)

		if hasAuthorName || hasAuthorEmail || hasAuthorDate {
			author = &gh.CommitAuthor{}
			if hasAuthorName {
				author.Name = gh.String(authorName)
			}
			if hasAuthorEmail {
				author.Email = gh.String(authorEmail)
			}
			if hasAuthorDate {
				authorDate, err := time.Parse(time.RFC3339, authorDateStr)
				if err != nil {
					return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("author_date must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)"))), nil
				}
				author.Date = &gh.Timestamp{Time: authorDate}
			}
		}

		// Parse committer information
		var committer *gh.CommitAuthor
		committerName, hasCommitterName := request.Params.Arguments["committer_name"].(string)
		committerEmail, hasCommitterEmail := request.Params.Arguments["committer_email"].(string)
		committerDateStr, hasCommitterDate := request.Params.Arguments["committer_date"].(string)

		if hasCommitterName || hasCommitterEmail || hasCommitterDate {
			committer = &gh.CommitAuthor{}
			if hasCommitterName {
				committer.Name = gh.String(committerName)
			}
			if hasCommitterEmail {
				committer.Email = gh.String(committerEmail)
			}
			if hasCommitterDate {
				committerDate, err := time.Parse(time.RFC3339, committerDateStr)
				if err != nil {
					return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("committer_date must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)"))), nil
				}
				committer.Date = &gh.Timestamp{Time: committerDate}
			}
		}

		// Call the operation
		result, err := commitOps.CreateCommit(ctx, owner, repo, message, tree, parents, author, committer)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error creating commit: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatCommitToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})
}
