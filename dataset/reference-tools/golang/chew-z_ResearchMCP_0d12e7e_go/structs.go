package main

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gomcpgo/mcp/pkg/protocol"
)

// PerplexityServer implements the ToolHandler interface to provide research capabilities
// through Perplexity's API.
type PerplexityServer struct {
	config *Config
	client HTTPClient
}

// ErrorPerplexityServer implements the ToolHandler interface but returns error responses
// for all calls. Used when the server is in degraded mode due to initialization errors.
type ErrorPerplexityServer struct {
	errorMessage string
}

// HTTPClient defines the interface for making HTTP requests
// This abstraction allows for easier testing with mocks
type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

// PerplexityRequest represents the request structure for Perplexity API
type PerplexityRequest struct {
	Model    string              `json:"model"`
	Messages []PerplexityMessage `json:"messages"`
}

// PerplexityMessage represents a single message in the Perplexity API request
type PerplexityMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// PerplexityResponse represents the response structure from Perplexity API
type PerplexityResponse struct {
	ID        string   `json:"id"`
	Model     string   `json:"model"`
	Citations []string `json:"citations"`
	Choices   []Choice `json:"choices"`
}

// Choice represents a single response choice from Perplexity API
type Choice struct {
	Message ChoiceMessage `json:"message"`
}

// ChoiceMessage represents the message content in a response choice
type ChoiceMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// ListTools implements the ToolHandler interface for ErrorPerplexityServer
// Returns the same tool signature as the normal server but in error mode
func (s *ErrorPerplexityServer) ListTools(ctx context.Context) (*protocol.ListToolsResponse, error) {
	return &protocol.ListToolsResponse{
		Tools: []protocol.Tool{
			{
				Name:        "research",
				Description: "Search the internet and provide up-to-date information about a topic using Perplexity.ai's Sonar Pro model",
				InputSchema: json.RawMessage(`{
					"type": "object",
					"properties": {
						"query": {
							"type": "string",
							"description": "The research query or question"
						}
					},
					"required": ["query"]
				}`),
			},
		},
	}, nil
}

// CallTool implements the ToolHandler interface for ErrorPerplexityServer
// Always returns the initialization error
func (s *ErrorPerplexityServer) CallTool(ctx context.Context, req *protocol.CallToolRequest) (*protocol.CallToolResponse, error) {
	return &protocol.CallToolResponse{
		IsError: true,
		Content: []protocol.ToolContent{
			{
				Type: "text",
				Text: s.errorMessage,
			},
		},
	}, nil
}
