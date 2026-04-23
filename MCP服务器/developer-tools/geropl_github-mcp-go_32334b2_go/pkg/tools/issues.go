package tools

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/mark3labs/mcp-go/mcp"

	"github.com/geropl/github-mcp-go/pkg/errors"
	"github.com/geropl/github-mcp-go/pkg/github"
)

// RegisterIssueTools registers issue-related tools
func RegisterIssueTools(s *Server) {
	client := s.GetClient()
	logger := s.GetLogger()
	issueOps := github.NewIssueOperations(client, logger)

	// Register get_issue tool
	getIssueTool := mcp.NewTool("get_issue",
		mcp.WithDescription("Get details of a specific issue in a GitHub repository"),
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
			mcp.Description("Issue number"),
		),
	)

	s.RegisterTool(getIssueTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
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
		result, err := issueOps.GetIssue(ctx, owner, repo, number)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error getting issue: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatIssueToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register list_issues tool
	listIssuesTool := mcp.NewTool("list_issues",
		mcp.WithDescription("List issues in a GitHub repository with filtering options"),
		mcp.WithString("owner",
			mcp.Required(),
			mcp.Description("Repository owner (username or organization)"),
		),
		mcp.WithString("repo",
			mcp.Required(),
			mcp.Description("Repository name"),
		),
		mcp.WithString("state",
			mcp.Description("Issue state (open, closed, all) - default: open"),
		),
		mcp.WithString("labels",
			mcp.Description("Comma-separated list of label names"),
		),
		mcp.WithString("sort",
			mcp.Description("Sort field (created, updated, comments) - default: created"),
		),
		mcp.WithString("direction",
			mcp.Description("Sort direction (asc, desc) - default: desc"),
		),
		mcp.WithString("since",
			mcp.Description("Only issues updated at or after this time (ISO 8601 format)"),
		),
	)

	s.RegisterTool(listIssuesTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Extract parameters
		owner, ok := request.Params.Arguments["owner"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("owner must be a string"))), nil
		}

		repo, ok := request.Params.Arguments["repo"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("repo must be a string"))), nil
		}

		// Optional parameters with defaults
		state := "open"
		if stateVal, ok := request.Params.Arguments["state"].(string); ok && stateVal != "" {
			state = stateVal
		}

		sort := "created"
		if sortVal, ok := request.Params.Arguments["sort"].(string); ok && sortVal != "" {
			sort = sortVal
		}

		direction := "desc"
		if directionVal, ok := request.Params.Arguments["direction"].(string); ok && directionVal != "" {
			direction = directionVal
		}

		// Parse labels
		var labels []string
		if labelsVal, ok := request.Params.Arguments["labels"].(string); ok && labelsVal != "" {
			labels = strings.Split(labelsVal, ",")
			// Trim whitespace from each label
			for i, label := range labels {
				labels[i] = strings.TrimSpace(label)
			}
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

		// Call the operation
		result, err := issueOps.ListIssues(ctx, owner, repo, state, sort, direction, labels, since)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error listing issues: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatIssueListToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register create_issue tool
	createIssueTool := mcp.NewTool("create_issue",
		mcp.WithDescription("Create a new issue in a GitHub repository"),
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
			mcp.Description("Issue title"),
		),
		mcp.WithString("body",
			mcp.Description("Issue body"),
		),
		mcp.WithString("labels",
			mcp.Description("Comma-separated list of label names"),
		),
		mcp.WithString("assignees",
			mcp.Description("Comma-separated list of usernames to assign"),
		),
		mcp.WithNumber("milestone",
			mcp.Description("Milestone ID to associate with the issue"),
		),
	)

	s.RegisterTool(createIssueTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
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
		if bodyVal, ok := request.Params.Arguments["body"].(string); ok {
			body = bodyVal
		}

		// Parse labels
		var labels []string
		if labelsVal, ok := request.Params.Arguments["labels"].(string); ok && labelsVal != "" {
			labels = strings.Split(labelsVal, ",")
			// Trim whitespace from each label
			for i, label := range labels {
				labels[i] = strings.TrimSpace(label)
			}
		}

		// Parse assignees
		var assignees []string
		if assigneesVal, ok := request.Params.Arguments["assignees"].(string); ok && assigneesVal != "" {
			assignees = strings.Split(assigneesVal, ",")
			// Trim whitespace from each assignee
			for i, assignee := range assignees {
				assignees[i] = strings.TrimSpace(assignee)
			}
		}

		// Parse milestone
		milestone := 0
		if milestoneVal, ok := request.Params.Arguments["milestone"].(float64); ok {
			milestone = int(milestoneVal)
		}

		// Call the operation
		result, err := issueOps.CreateIssue(ctx, owner, repo, title, body, labels, assignees, milestone)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error creating issue: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatIssueToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register update_issue tool
	updateIssueTool := mcp.NewTool("update_issue",
		mcp.WithDescription("Update an existing issue in a GitHub repository"),
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
			mcp.Description("Issue number"),
		),
		mcp.WithString("title",
			mcp.Description("New issue title"),
		),
		mcp.WithString("body",
			mcp.Description("New issue body"),
		),
		mcp.WithString("state",
			mcp.Description("New issue state (open, closed)"),
		),
		mcp.WithString("labels",
			mcp.Description("Comma-separated list of label names"),
		),
		mcp.WithString("assignees",
			mcp.Description("Comma-separated list of usernames to assign"),
		),
		mcp.WithNumber("milestone",
			mcp.Description("Milestone ID to associate with the issue"),
		),
	)

	s.RegisterTool(updateIssueTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
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

		// Optional parameters
		title := ""
		if titleVal, ok := request.Params.Arguments["title"].(string); ok {
			title = titleVal
		}

		body := ""
		if bodyVal, ok := request.Params.Arguments["body"].(string); ok {
			body = bodyVal
		}

		state := ""
		if stateVal, ok := request.Params.Arguments["state"].(string); ok {
			state = stateVal
		}

		// Parse labels
		var labels []string
		if labelsVal, ok := request.Params.Arguments["labels"].(string); ok && labelsVal != "" {
			labels = strings.Split(labelsVal, ",")
			// Trim whitespace from each label
			for i, label := range labels {
				labels[i] = strings.TrimSpace(label)
			}
		}

		// Parse assignees
		var assignees []string
		if assigneesVal, ok := request.Params.Arguments["assignees"].(string); ok && assigneesVal != "" {
			assignees = strings.Split(assigneesVal, ",")
			// Trim whitespace from each assignee
			for i, assignee := range assignees {
				assignees[i] = strings.TrimSpace(assignee)
			}
		}

		// Parse milestone
		milestone := 0
		if milestoneVal, ok := request.Params.Arguments["milestone"].(float64); ok {
			milestone = int(milestoneVal)
		}

		// Call the operation
		result, err := issueOps.UpdateIssue(ctx, owner, repo, number, title, body, state, labels, assignees, milestone)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error updating issue: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatIssueToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register add_issue_comment tool
	addIssueCommentTool := mcp.NewTool("add_issue_comment",
		mcp.WithDescription("Add a comment to an issue in a GitHub repository"),
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
			mcp.Description("Issue number"),
		),
		mcp.WithString("body",
			mcp.Required(),
			mcp.Description("Comment body"),
		),
	)

	s.RegisterTool(addIssueCommentTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
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

		body, ok := request.Params.Arguments["body"].(string)
		if !ok {
			return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("body must be a string"))), nil
		}

		// Call the operation
		result, err := issueOps.AddIssueComment(ctx, owner, repo, number, body)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error adding comment: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatIssueCommentToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

	// Register list_issue_comments tool
	listIssueCommentsTool := mcp.NewTool("list_issue_comments",
		mcp.WithDescription("List comments on an issue in a GitHub repository"),
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
			mcp.Description("Issue number"),
		),
		mcp.WithString("sort",
			mcp.Description("Sort field (created, updated) - default: created"),
		),
		mcp.WithString("direction",
			mcp.Description("Sort direction (asc, desc) - default: desc"),
		),
		mcp.WithString("since",
			mcp.Description("Only comments updated at or after this time (ISO 8601 format)"),
		),
	)

	s.RegisterTool(listIssueCommentsTool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
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

		// Optional parameters with defaults
		sort := "created"
		if sortVal, ok := request.Params.Arguments["sort"].(string); ok && sortVal != "" {
			sort = sortVal
		}

		direction := "desc"
		if directionVal, ok := request.Params.Arguments["direction"].(string); ok && directionVal != "" {
			direction = directionVal
		}

		// Parse since
		var since *time.Time
		if sinceVal, ok := request.Params.Arguments["since"].(string); ok && sinceVal != "" {
			t, err := time.Parse(time.RFC3339, sinceVal)
			if err != nil {
				return mcp.NewToolResultError(errors.FormatGitHubError(errors.NewInvalidArgumentError("since must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)"))), nil
			}
			since = &t
		}

		// Call the operation
		result, err := issueOps.ListIssueComments(ctx, owner, repo, number, sort, direction, since)
		if err != nil {
			if ghErr, ok := err.(*errors.GitHubError); ok {
				return mcp.NewToolResultError(errors.FormatGitHubError(ghErr)), nil
			}
			return mcp.NewToolResultError(fmt.Sprintf("Error listing comments: %v", err)), nil
		}

		// Format the result as markdown
		markdown := formatIssueCommentListToMarkdown(result)
		return mcp.NewToolResultText(markdown), nil
	})

}
