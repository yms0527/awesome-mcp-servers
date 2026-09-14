package github

import (
	"bytes"
	"context"
	"fmt"

	"github.com/google/go-github/v69/github"
	"github.com/sirupsen/logrus"

	"github.com/geropl/github-mcp-go/pkg/errors"
)

// PullRequestOperations handles pull request-related operations
type PullRequestOperations struct {
	client *Client
	logger *logrus.Logger
}

// NewPullRequestOperations creates a new PullRequestOperations
func NewPullRequestOperations(client *Client, logger *logrus.Logger) *PullRequestOperations {
	return &PullRequestOperations{
		client: client,
		logger: logger,
	}
}

// CreatePullRequest creates a new pull request
func (p *PullRequestOperations) CreatePullRequest(ctx context.Context, owner, repo, title, body, head, base string, draft bool) (*github.PullRequest, error) {
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
	if head == "" {
		return nil, errors.NewValidationError("head cannot be empty")
	}
	if base == "" {
		return nil, errors.NewValidationError("base cannot be empty")
	}

	// Create pull request
	newPR := &github.NewPullRequest{
		Title: github.String(title),
		Body:  github.String(body),
		Head:  github.String(head),
		Base:  github.String(base),
		Draft: github.Bool(draft),
	}

	pr, _, err := p.client.GetClient().PullRequests.Create(ctx, owner, repo, newPR)
	if err != nil {
		return nil, p.client.HandleError(err)
	}

	return pr, nil
}

// GetPullRequest gets a pull request
func (p *PullRequestOperations) GetPullRequest(ctx context.Context, owner, repo string, number int) (*github.PullRequest, error) {
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

	// Get pull request
	pr, _, err := p.client.GetClient().PullRequests.Get(ctx, owner, repo, number)
	if err != nil {
		return nil, p.client.HandleError(err)
	}

	return pr, nil
}

// GetPullRequestDiff gets the diff of a pull request
func (p *PullRequestOperations) GetPullRequestDiff(ctx context.Context, owner, repo string, number int) (string, error) {
	// Validate parameters
	if owner == "" {
		return "", errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return "", errors.NewValidationError("repo cannot be empty")
	}
	if number <= 0 {
		return "", errors.NewValidationError("number must be greater than 0")
	}

	// Get pull request diff
	// Use the Accept header to get the diff format
	req, err := p.client.GetClient().NewRequest("GET", fmt.Sprintf("repos/%s/%s/pulls/%d", owner, repo, number), nil)
	if err != nil {
		return "", p.client.HandleError(err)
	}

	req.Header.Set("Accept", "application/vnd.github.v3.diff")

	var buf bytes.Buffer
	_, err = p.client.GetClient().Do(ctx, req, &buf)
	if err != nil {
		return "", p.client.HandleError(err)
	}

	return buf.String(), nil
}
