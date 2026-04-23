package github

import (
	"encoding/json"
	"net/http"

	"github.com/google/go-github/v69/github"
	"github.com/sirupsen/logrus"

	"github.com/geropl/github-mcp-go/pkg/errors"
)

// Client wraps the GitHub client and provides additional functionality
type Client struct {
	client *github.Client
	logger *logrus.Logger
}

// NewClient creates a new GitHub client
func NewClient(token string, logger *logrus.Logger) *Client {
	httpClient := &http.Client{}
	client := github.NewClient(httpClient)
	if token != "" {
		client = client.WithAuthToken(token)
	}

	return &Client{
		client: client,
		logger: logger,
	}
}

// NewClientWithHTTPClient creates a new GitHub client with a custom HTTP client
func NewClientWithHTTPClient(token string, httpClient *http.Client, logger *logrus.Logger) *Client {
	client := github.NewClient(httpClient)
	if token != "" {
		client = client.WithAuthToken(token)
	}

	return &Client{
		client: client,
		logger: logger,
	}
}

// GetClient returns the underlying GitHub client
func (c *Client) GetClient() *github.Client {
	return c.client
}

// HandleError handles GitHub API errors
func (c *Client) HandleError(err error) error {
	if err == nil {
		return nil
	}

	c.logger.WithError(err).Error("GitHub API error")

	// Check if it's a GitHub error response
	if ghErr, ok := err.(*github.ErrorResponse); ok {
		statusCode := ghErr.Response.StatusCode
		var responseBody interface{}

		// Try to parse the response body
		if ghErr.Response.Body != nil {
			defer ghErr.Response.Body.Close()
			var data map[string]interface{}
			if err := json.NewDecoder(ghErr.Response.Body).Decode(&data); err == nil {
				responseBody = data
			}
		}

		return errors.CreateGitHubError(statusCode, responseBody)
	}

	// Check if it's a rate limit error
	if rateLimitErr, ok := err.(*github.RateLimitError); ok {
		resetAt := rateLimitErr.Rate.Reset.Time.String()
		return errors.NewRateLimitError("GitHub API rate limit exceeded", resetAt)
	}

	// Check if it's an authentication error
	if _, ok := err.(*github.AcceptedError); ok {
		return errors.NewInternalError("GitHub API returned 202 Accepted, operation is still in progress")
	}

	// Generic error
	return errors.NewInternalError("GitHub API error: " + err.Error())
}

// IsNotFound checks if an error is a not found error
func (c *Client) IsNotFound(err error) bool {
	if ghErr, ok := err.(*github.ErrorResponse); ok {
		return ghErr.Response.StatusCode == http.StatusNotFound
	}
	return false
}

// IsRateLimitError checks if an error is a rate limit error
func (c *Client) IsRateLimitError(err error) bool {
	_, ok := err.(*github.RateLimitError)
	return ok
}

// IsAuthenticationError checks if an error is an authentication error
func (c *Client) IsAuthenticationError(err error) bool {
	if ghErr, ok := err.(*github.ErrorResponse); ok {
		return ghErr.Response.StatusCode == http.StatusUnauthorized
	}
	return false
}
