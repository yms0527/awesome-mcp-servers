package errors

import (
	"fmt"
)

// Error types
const (
	ErrorTypeValidation      = "validation"
	ErrorTypeAuthentication  = "authentication"
	ErrorTypePermission      = "permission"
	ErrorTypeNotFound        = "not_found"
	ErrorTypeRateLimit       = "rate_limit"
	ErrorTypeConflict        = "conflict"
	ErrorTypeInternal        = "internal"
	ErrorTypeGitHubAPI       = "github_api"
	ErrorTypeInvalidArgument = "invalid_argument"
)

// GitHubError represents an error from the GitHub API
type GitHubError struct {
	Type       string
	Message    string
	StatusCode int
	Response   interface{}
}

// Error implements the error interface
func (e *GitHubError) Error() string {
	return fmt.Sprintf("%s: %s", e.Type, e.Message)
}

// NewValidationError creates a new validation error
func NewValidationError(message string) *GitHubError {
	return &GitHubError{
		Type:    ErrorTypeValidation,
		Message: message,
	}
}

// NewAuthenticationError creates a new authentication error
func NewAuthenticationError(message string) *GitHubError {
	return &GitHubError{
		Type:    ErrorTypeAuthentication,
		Message: message,
	}
}

// NewPermissionError creates a new permission error
func NewPermissionError(message string) *GitHubError {
	return &GitHubError{
		Type:    ErrorTypePermission,
		Message: message,
	}
}

// NewNotFoundError creates a new not found error
func NewNotFoundError(message string) *GitHubError {
	return &GitHubError{
		Type:    ErrorTypeNotFound,
		Message: message,
	}
}

// NewRateLimitError creates a new rate limit error
func NewRateLimitError(message string, resetAt string) *GitHubError {
	return &GitHubError{
		Type:    ErrorTypeRateLimit,
		Message: fmt.Sprintf("%s (resets at: %s)", message, resetAt),
	}
}

// NewConflictError creates a new conflict error
func NewConflictError(message string) *GitHubError {
	return &GitHubError{
		Type:    ErrorTypeConflict,
		Message: message,
	}
}

// NewInternalError creates a new internal error
func NewInternalError(message string) *GitHubError {
	return &GitHubError{
		Type:    ErrorTypeInternal,
		Message: message,
	}
}

// NewGitHubAPIError creates a new GitHub API error
func NewGitHubAPIError(statusCode int, message string, response interface{}) *GitHubError {
	return &GitHubError{
		Type:       ErrorTypeGitHubAPI,
		Message:    message,
		StatusCode: statusCode,
		Response:   response,
	}
}

// NewInvalidArgumentError creates a new invalid argument error
func NewInvalidArgumentError(message string) *GitHubError {
	return &GitHubError{
		Type:    ErrorTypeInvalidArgument,
		Message: message,
	}
}

// CreateGitHubError creates a GitHubError from a GitHub API error
func CreateGitHubError(statusCode int, response interface{}) *GitHubError {
	var message string
	if resp, ok := response.(map[string]interface{}); ok {
		if msg, ok := resp["message"].(string); ok {
			message = msg
		} else {
			message = "GitHub API error"
		}
	} else {
		message = "GitHub API error"
	}

	switch statusCode {
	case 401:
		return NewAuthenticationError(message)
	case 403:
		return NewPermissionError(message)
	case 404:
		return NewNotFoundError(message)
	case 409:
		return NewConflictError(message)
	case 422:
		return NewValidationError(message)
	case 429:
		resetAt := "unknown"
		if resp, ok := response.(map[string]interface{}); ok {
			if reset, ok := resp["reset_at"].(string); ok {
				resetAt = reset
			}
		}
		return NewRateLimitError(message, resetAt)
	default:
		return NewGitHubAPIError(statusCode, message, response)
	}
}

// IsGitHubError checks if an error is a GitHubError
func IsGitHubError(err error) bool {
	_, ok := err.(*GitHubError)
	return ok
}

// FormatGitHubError formats a GitHubError for MCP response
func FormatGitHubError(err *GitHubError) string {
	var message string

	switch err.Type {
	case ErrorTypeValidation:
		message = fmt.Sprintf("Validation Error: %s", err.Message)
		if err.Response != nil {
			message += fmt.Sprintf("\nDetails: %v", err.Response)
		}
	case ErrorTypeAuthentication:
		message = fmt.Sprintf("Authentication Failed: %s", err.Message)
	case ErrorTypePermission:
		message = fmt.Sprintf("Permission Denied: %s", err.Message)
	case ErrorTypeNotFound:
		message = fmt.Sprintf("Not Found: %s", err.Message)
	case ErrorTypeRateLimit:
		message = fmt.Sprintf("Rate Limit Exceeded: %s", err.Message)
	case ErrorTypeConflict:
		message = fmt.Sprintf("Conflict: %s", err.Message)
	default:
		message = fmt.Sprintf("GitHub API Error: %s", err.Message)
	}

	return message
}
