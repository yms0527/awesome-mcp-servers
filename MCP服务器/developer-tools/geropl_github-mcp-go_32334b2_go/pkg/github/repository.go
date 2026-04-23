package github

import (
	"context"
	"fmt"

	"github.com/google/go-github/v69/github"
	"github.com/sirupsen/logrus"

	"github.com/geropl/github-mcp-go/pkg/errors"
)

// RepositoryOperations handles repository-related operations
type RepositoryOperations struct {
	client *Client
	logger *logrus.Logger
}

// NewRepositoryOperations creates a new RepositoryOperations
func NewRepositoryOperations(client *Client, logger *logrus.Logger) *RepositoryOperations {
	return &RepositoryOperations{
		client: client,
		logger: logger,
	}
}


// CreateRepository creates a new repository
func (r *RepositoryOperations) CreateRepository(ctx context.Context, name, description string, private bool, autoInit bool) (*github.Repository, error) {
	// Validate repository name
	if name == "" {
		return nil, errors.NewValidationError("repository name cannot be empty")
	}

	// Create repository
	repo := &github.Repository{
		Name:        github.Ptr(name),
		Description: github.Ptr(description),
		Private:     github.Ptr(private),
		AutoInit:    github.Ptr(autoInit),
	}

	result, _, err := r.client.GetClient().Repositories.Create(ctx, "", repo)
	if err != nil {
		return nil, r.client.HandleError(err)
	}

	return result, nil
}

// ForkRepository forks a repository
func (r *RepositoryOperations) ForkRepository(ctx context.Context, owner, repo, organization string) (*github.Repository, error) {
	// Validate owner and repo
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repository name cannot be empty")
	}

	// Create fork options
	opts := &github.RepositoryCreateForkOptions{}
	if organization != "" {
		opts.Organization = organization
	}

	result, _, err := r.client.GetClient().Repositories.CreateFork(ctx, owner, repo, opts)
	if err != nil {
		// Check if it's an AcceptedError (202), which is normal for fork operations
		if _, ok := err.(*github.AcceptedError); ok {
			r.logger.Info("Fork operation accepted, but not yet complete")
			// Try to get the repository to return to the user
			forkedRepo, _, getErr := r.client.GetClient().Repositories.Get(ctx, organization, repo)
			if getErr == nil {
				return forkedRepo, nil
			}
			// If we can't get the repository, return a message
			return result, fmt.Errorf("fork operation started but not yet complete, check your repositories later")
		}
		return nil, r.client.HandleError(err)
	}

	return result, nil
}
