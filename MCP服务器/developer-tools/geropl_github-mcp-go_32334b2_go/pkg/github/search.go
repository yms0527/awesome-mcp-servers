package github

import (
	"context"

	"github.com/geropl/github-mcp-go/pkg/errors"
	gh "github.com/google/go-github/v69/github"
	"github.com/sirupsen/logrus"
)

// SearchOperations provides methods for searching GitHub resources
type SearchOperations struct {
	client *Client
	logger *logrus.Logger
}

// NewSearchOperations creates a new SearchOperations instance
func NewSearchOperations(client *Client, logger *logrus.Logger) *SearchOperations {
	return &SearchOperations{
		client: client,
		logger: logger,
	}
}

// CodeSearchResult represents the result of a code search
type CodeSearchResult struct {
	TotalCount        int
	IncompleteResults bool
	Items             []*gh.CodeResult
}

// SearchCode searches for code across GitHub repositories
func (s *SearchOperations) SearchCode(ctx context.Context, query string, page, perPage int) (*CodeSearchResult, error) {
	if query == "" {
		return nil, errors.NewInvalidArgumentError("query cannot be empty")
	}

	// Set default values for pagination
	if page <= 0 {
		page = 1
	}
	if perPage <= 0 {
		perPage = 30
	} else if perPage > 100 {
		perPage = 100
	}

	// Perform the search
	opts := &gh.SearchOptions{
		ListOptions: gh.ListOptions{
			Page:    page,
			PerPage: perPage,
		},
		TextMatch: false,
	}

	s.logger.WithFields(logrus.Fields{
		"query":   query,
		"page":    page,
		"perPage": perPage,
	}).Debug("Searching for code")

	result, _, err := s.client.GetClient().Search.Code(ctx, query, opts)
	if err != nil {
		return nil, s.client.HandleError(err)
	}

	return &CodeSearchResult{
		TotalCount:        result.GetTotal(),
		IncompleteResults: result.GetIncompleteResults(),
		Items:             result.CodeResults,
	}, nil
}

// IssueSearchResult represents the result of an issue search
type IssueSearchResult struct {
	TotalCount        int
	IncompleteResults bool
	Items             []*gh.Issue
}

// SearchIssues searches for issues across GitHub repositories
func (s *SearchOperations) SearchIssues(ctx context.Context, query string, page, perPage int) (*IssueSearchResult, error) {
	if query == "" {
		return nil, errors.NewInvalidArgumentError("query cannot be empty")
	}

	// Set default values for pagination
	if page <= 0 {
		page = 1
	}
	if perPage <= 0 {
		perPage = 30
	} else if perPage > 100 {
		perPage = 100
	}

	// Perform the search
	opts := &gh.SearchOptions{
		ListOptions: gh.ListOptions{
			Page:    page,
			PerPage: perPage,
		},
		TextMatch: false,
	}

	s.logger.WithFields(logrus.Fields{
		"query":   query,
		"page":    page,
		"perPage": perPage,
	}).Debug("Searching for issues")

	result, _, err := s.client.GetClient().Search.Issues(ctx, query, opts)
	if err != nil {
		return nil, s.client.HandleError(err)
	}

	return &IssueSearchResult{
		TotalCount:        result.GetTotal(),
		IncompleteResults: result.GetIncompleteResults(),
		Items:             result.Issues,
	}, nil
}

// CommitSearchResult represents the result of a commit search
type CommitSearchResult struct {
	TotalCount        int
	IncompleteResults bool
	Items             []*gh.CommitResult
}

// SearchCommits searches for commits across GitHub repositories
func (s *SearchOperations) SearchCommits(ctx context.Context, query string, page, perPage int) (*CommitSearchResult, error) {
	if query == "" {
		return nil, errors.NewInvalidArgumentError("query cannot be empty")
	}

	// Set default values for pagination
	if page <= 0 {
		page = 1
	}
	if perPage <= 0 {
		perPage = 30
	} else if perPage > 100 {
		perPage = 100
	}

	// Perform the search
	opts := &gh.SearchOptions{
		ListOptions: gh.ListOptions{
			Page:    page,
			PerPage: perPage,
		},
		TextMatch: false,
	}

	s.logger.WithFields(logrus.Fields{
		"query":   query,
		"page":    page,
		"perPage": perPage,
	}).Debug("Searching for commits")

	result, _, err := s.client.GetClient().Search.Commits(ctx, query, opts)
	if err != nil {
		return nil, s.client.HandleError(err)
	}

	return &CommitSearchResult{
		TotalCount:        result.GetTotal(),
		IncompleteResults: result.GetIncompleteResults(),
		Items:             result.Commits,
	}, nil
}

// SearchRepositories searches for repositories
func (s *SearchOperations) SearchRepositories(ctx context.Context, query string, page, perPage int) (*gh.RepositoriesSearchResult, error) {
	if page <= 0 {
		page = 1
	}
	if perPage <= 0 {
		perPage = 30
	}
	if perPage > 100 {
		perPage = 100
	}

	opts := &gh.SearchOptions{
		ListOptions: gh.ListOptions{
			Page:    page,
			PerPage: perPage,
		},
	}

	result, _, err := s.client.GetClient().Search.Repositories(ctx, query, opts)
	if err != nil {
		return nil, s.client.HandleError(err)
	}

	return result, nil
}
