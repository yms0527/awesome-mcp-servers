package github

import (
	"context"

	"github.com/google/go-github/v69/github"
	"github.com/sirupsen/logrus"

	"github.com/geropl/github-mcp-go/pkg/errors"
)

// BranchOperations handles branch-related operations
type BranchOperations struct {
	client *Client
	logger *logrus.Logger
}

// NewBranchOperations creates a new BranchOperations
func NewBranchOperations(client *Client, logger *logrus.Logger) *BranchOperations {
	return &BranchOperations{
		client: client,
		logger: logger,
	}
}

// ListBranches lists branches in a repository with optional filtering
func (b *BranchOperations) ListBranches(ctx context.Context, owner, repo string, protected bool) ([]*github.Branch, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}

	// Set up options
	opts := &github.BranchListOptions{
		Protected: &protected,
		ListOptions: github.ListOptions{
			PerPage: 100,
		},
	}

	// List branches
	branches, _, err := b.client.GetClient().Repositories.ListBranches(ctx, owner, repo, opts)
	if err != nil {
		return nil, b.client.HandleError(err)
	}

	return branches, nil
}

// GetBranch gets a specific branch and its protection status
func (b *BranchOperations) GetBranch(ctx context.Context, owner, repo, branch string) (*github.Branch, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if branch == "" {
		return nil, errors.NewValidationError("branch cannot be empty")
	}

	// Get branch
	branchInfo, _, err := b.client.GetClient().Repositories.GetBranch(ctx, owner, repo, branch, 1)
	if err != nil {
		return nil, b.client.HandleError(err)
	}

	return branchInfo, nil
}

// CreateBranch creates a new branch from a specified SHA or another branch
func (b *BranchOperations) CreateBranch(ctx context.Context, owner, repo, branchName, shaOrBase string) (*github.Reference, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if branchName == "" {
		return nil, errors.NewValidationError("branch name cannot be empty")
	}
	if shaOrBase == "" {
		return nil, errors.NewValidationError("SHA or base branch cannot be empty")
	}

	// Get the SHA of the base reference
	var sha string
	if len(shaOrBase) == 40 {
		// If it's already a SHA (40 characters), use it directly
		sha = shaOrBase
	} else {
		// Otherwise, get the SHA from the reference
		baseRef, _, err := b.client.GetClient().Git.GetRef(ctx, owner, repo, "heads/"+shaOrBase)
		if err != nil {
			return nil, b.client.HandleError(err)
		}
		sha = baseRef.GetObject().GetSHA()
	}

	// Create the new branch reference
	ref := &github.Reference{
		Ref: github.Ptr("refs/heads/" + branchName),
		Object: &github.GitObject{
			SHA: github.Ptr(sha),
		},
	}

	// Create the reference
	newRef, _, err := b.client.GetClient().Git.CreateRef(ctx, owner, repo, ref)
	if err != nil {
		return nil, b.client.HandleError(err)
	}

	return newRef, nil
}

// MergeBranches merges one branch into another
func (b *BranchOperations) MergeBranches(ctx context.Context, owner, repo, base, head, commitMessage string) (*github.RepositoryCommit, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if base == "" {
		return nil, errors.NewValidationError("base branch cannot be empty")
	}
	if head == "" {
		return nil, errors.NewValidationError("head branch cannot be empty")
	}

	// Set up merge request
	request := &github.RepositoryMergeRequest{
		Base:          github.Ptr(base),
		Head:          github.Ptr(head),
		CommitMessage: github.Ptr(commitMessage),
	}

	// Merge branches
	commit, _, err := b.client.GetClient().Repositories.Merge(ctx, owner, repo, request)
	if err != nil {
		return nil, b.client.HandleError(err)
	}

	return commit, nil
}

// DeleteBranch deletes a branch
func (b *BranchOperations) DeleteBranch(ctx context.Context, owner, repo, branch string) error {
	// Validate parameters
	if owner == "" {
		return errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return errors.NewValidationError("repo cannot be empty")
	}
	if branch == "" {
		return errors.NewValidationError("branch cannot be empty")
	}

	// Delete branch
	_, err := b.client.GetClient().Git.DeleteRef(ctx, owner, repo, "heads/"+branch)
	if err != nil {
		return b.client.HandleError(err)
	}

	return nil
}
