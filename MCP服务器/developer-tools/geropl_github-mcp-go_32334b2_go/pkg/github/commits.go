package github

import (
	"context"
	"time"

	"github.com/google/go-github/v69/github"
	"github.com/sirupsen/logrus"

	"github.com/geropl/github-mcp-go/pkg/errors"
)

// CommitOperations handles commit-related operations
type CommitOperations struct {
	client *Client
	logger *logrus.Logger
}

// NewCommitOperations creates a new CommitOperations
func NewCommitOperations(client *Client, logger *logrus.Logger) *CommitOperations {
	return &CommitOperations{
		client: client,
		logger: logger,
	}
}

// GetCommit gets a specific commit by SHA
func (c *CommitOperations) GetCommit(ctx context.Context, owner, repo, sha string) (*github.RepositoryCommit, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if sha == "" {
		return nil, errors.NewValidationError("sha cannot be empty")
	}

	// Get commit
	commit, _, err := c.client.GetClient().Repositories.GetCommit(ctx, owner, repo, sha, nil)
	if err != nil {
		return nil, c.client.HandleError(err)
	}

	return commit, nil
}

// ListCommits lists commits in a repository with filtering options
func (c *CommitOperations) ListCommits(ctx context.Context, owner, repo, path, author string, since, until time.Time, perPage int) ([]*github.RepositoryCommit, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}

	// Set up options
	opts := &github.CommitsListOptions{
		Path:   path,
		Author: author,
		Since:  since,
		Until:  until,
		ListOptions: github.ListOptions{
			PerPage: perPage,
		},
	}

	// List commits
	commits, _, err := c.client.GetClient().Repositories.ListCommits(ctx, owner, repo, opts)
	if err != nil {
		return nil, c.client.HandleError(err)
	}

	return commits, nil
}

// CompareCommits compares two commits/branches and shows differences
func (c *CommitOperations) CompareCommits(ctx context.Context, owner, repo, base, head string) (*github.CommitsComparison, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if base == "" {
		return nil, errors.NewValidationError("base cannot be empty")
	}
	if head == "" {
		return nil, errors.NewValidationError("head cannot be empty")
	}

	// Compare commits
	comparison, _, err := c.client.GetClient().Repositories.CompareCommits(ctx, owner, repo, base, head, nil)
	if err != nil {
		return nil, c.client.HandleError(err)
	}

	return comparison, nil
}

// GetCommitStatus gets the combined status for a specific commit
func (c *CommitOperations) GetCommitStatus(ctx context.Context, owner, repo, sha string) (*github.CombinedStatus, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if sha == "" {
		return nil, errors.NewValidationError("sha cannot be empty")
	}

	// Get commit status
	status, _, err := c.client.GetClient().Repositories.GetCombinedStatus(ctx, owner, repo, sha, nil)
	if err != nil {
		return nil, c.client.HandleError(err)
	}

	return status, nil
}

// CreateCommitComment adds a comment to a specific commit
func (c *CommitOperations) CreateCommitComment(ctx context.Context, owner, repo, sha, body, path string, position int) (*github.RepositoryComment, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if sha == "" {
		return nil, errors.NewValidationError("sha cannot be empty")
	}
	if body == "" {
		return nil, errors.NewValidationError("body cannot be empty")
	}

	// Create comment
	comment := &github.RepositoryComment{
		Body: github.String(body),
	}

	// Add path and position if provided
	if path != "" {
		comment.Path = github.String(path)
	}
	if position > 0 {
		comment.Position = github.Int(position)
	}

	// Add comment
	repositoryComment, _, err := c.client.GetClient().Repositories.CreateComment(ctx, owner, repo, sha, comment)
	if err != nil {
		return nil, c.client.HandleError(err)
	}

	return repositoryComment, nil
}

// ListCommitComments lists comments for a specific commit
func (c *CommitOperations) ListCommitComments(ctx context.Context, owner, repo, sha string) ([]*github.RepositoryComment, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if sha == "" {
		return nil, errors.NewValidationError("sha cannot be empty")
	}

	// List comments
	comments, _, err := c.client.GetClient().Repositories.ListCommitComments(ctx, owner, repo, sha, nil)
	if err != nil {
		return nil, c.client.HandleError(err)
	}

	return comments, nil
}


// CreateCommit creates a new commit directly (without push)
func (c *CommitOperations) CreateCommit(ctx context.Context, owner, repo, message, tree string, parents []string, author, committer *github.CommitAuthor) (*github.Commit, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if message == "" {
		return nil, errors.NewValidationError("message cannot be empty")
	}
	if tree == "" {
		return nil, errors.NewValidationError("tree cannot be empty")
	}
	if len(parents) == 0 {
		return nil, errors.NewValidationError("at least one parent is required")
	}

	// Create commit request
	commitRequest := &github.Commit{
		Message: github.String(message),
		Tree: &github.Tree{
			SHA: github.String(tree),
		},
		Parents: make([]*github.Commit, len(parents)),
	}

	// Add parents
	for i, parent := range parents {
		commitRequest.Parents[i] = &github.Commit{
			SHA: github.String(parent),
		}
	}

	// Add author and committer if provided
	if author != nil {
		commitRequest.Author = author
	}
	if committer != nil {
		commitRequest.Committer = committer
	}

	// Create commit
	commit, _, err := c.client.GetClient().Git.CreateCommit(ctx, owner, repo, commitRequest, nil)
	if err != nil {
		return nil, c.client.HandleError(err)
	}

	return commit, nil
}
