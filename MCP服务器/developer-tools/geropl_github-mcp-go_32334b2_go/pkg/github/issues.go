package github

import (
	"context"
	"time"

	"github.com/google/go-github/v69/github"
	"github.com/sirupsen/logrus"

	"github.com/geropl/github-mcp-go/pkg/errors"
)

// IssueOperations handles issue-related operations
type IssueOperations struct {
	client *Client
	logger *logrus.Logger
}

// NewIssueOperations creates a new IssueOperations
func NewIssueOperations(client *Client, logger *logrus.Logger) *IssueOperations {
	return &IssueOperations{
		client: client,
		logger: logger,
	}
}

// GetIssue gets a specific issue by number
func (i *IssueOperations) GetIssue(ctx context.Context, owner, repo string, number int) (*github.Issue, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if number <= 0 {
		return nil, errors.NewValidationError("number must be greater than 0")
	}

	// Get issue
	issue, _, err := i.client.GetClient().Issues.Get(ctx, owner, repo, number)
	if err != nil {
		return nil, i.client.HandleError(err)
	}

	return issue, nil
}

// ListIssues lists issues in a repository with filtering options
func (i *IssueOperations) ListIssues(ctx context.Context, owner, repo, state, sort, direction string, labels []string, since time.Time) ([]*github.Issue, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}

	// Set up options
	opts := &github.IssueListByRepoOptions{
		State:     state,
		Sort:      sort,
		Direction: direction,
		Labels:    labels,
		Since:     since,
		ListOptions: github.ListOptions{
			PerPage: 30,
		},
	}

	// List issues
	issues, _, err := i.client.GetClient().Issues.ListByRepo(ctx, owner, repo, opts)
	if err != nil {
		return nil, i.client.HandleError(err)
	}

	return issues, nil
}

// CreateIssue creates a new issue
func (i *IssueOperations) CreateIssue(ctx context.Context, owner, repo, title, body string, labels []string, assignees []string, milestone int) (*github.Issue, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if title == "" {
		return nil, errors.NewValidationError("title cannot be empty")
	}

	// Set up issue request
	issueRequest := &github.IssueRequest{
		Title: github.String(title),
		Body:  github.String(body),
	}

	// Only set labels if not empty
	if len(labels) > 0 {
		issueRequest.Labels = &labels
	}

	// Only set assignees if not empty
	if len(assignees) > 0 {
		issueRequest.Assignees = &assignees
	}

	if milestone > 0 {
		issueRequest.Milestone = github.Int(milestone)
	}

	// Create issue
	issue, _, err := i.client.GetClient().Issues.Create(ctx, owner, repo, issueRequest)
	if err != nil {
		return nil, i.client.HandleError(err)
	}

	return issue, nil
}

// UpdateIssue updates an existing issue
func (i *IssueOperations) UpdateIssue(ctx context.Context, owner, repo string, number int, title, body, state string, labels []string, assignees []string, milestone int) (*github.Issue, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if number <= 0 {
		return nil, errors.NewValidationError("number must be greater than 0")
	}

	// Set up issue request
	issueRequest := &github.IssueRequest{}

	if title != "" {
		issueRequest.Title = github.String(title)
	}
	if body != "" {
		issueRequest.Body = github.String(body)
	}
	if state != "" {
		issueRequest.State = github.String(state)
	}
	if labels != nil && len(labels) > 0 {
		issueRequest.Labels = &labels
	}
	if assignees != nil && len(assignees) > 0 {
		issueRequest.Assignees = &assignees
	}
	if milestone > 0 {
		issueRequest.Milestone = github.Int(milestone)
	}

	// Update issue
	issue, _, err := i.client.GetClient().Issues.Edit(ctx, owner, repo, number, issueRequest)
	if err != nil {
		return nil, i.client.HandleError(err)
	}

	return issue, nil
}

// AddIssueComment adds a comment to an issue
func (i *IssueOperations) AddIssueComment(ctx context.Context, owner, repo string, number int, body string) (*github.IssueComment, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if number <= 0 {
		return nil, errors.NewValidationError("number must be greater than 0")
	}
	if body == "" {
		return nil, errors.NewValidationError("body cannot be empty")
	}

	// Create comment
	comment := &github.IssueComment{
		Body: github.String(body),
	}

	// Add comment
	issueComment, _, err := i.client.GetClient().Issues.CreateComment(ctx, owner, repo, number, comment)
	if err != nil {
		return nil, i.client.HandleError(err)
	}

	return issueComment, nil
}

// ListIssueComments lists comments on an issue
func (i *IssueOperations) ListIssueComments(ctx context.Context, owner, repo string, number int, sort, direction string, since *time.Time) ([]*github.IssueComment, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if number <= 0 {
		return nil, errors.NewValidationError("number must be greater than 0")
	}

	// Set up options
	opts := &github.IssueListCommentsOptions{
		Sort:      github.String(sort),
		Direction: github.String(direction),
		Since:     since,
		ListOptions: github.ListOptions{
			PerPage: 30,
		},
	}

	// List comments
	comments, _, err := i.client.GetClient().Issues.ListComments(ctx, owner, repo, number, opts)
	if err != nil {
		return nil, i.client.HandleError(err)
	}

	return comments, nil
}
