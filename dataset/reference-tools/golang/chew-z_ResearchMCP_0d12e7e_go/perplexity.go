package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/gomcpgo/mcp/pkg/protocol"
)

// systemPrompt defines the instruction prompt for Perplexity API
const systemPrompt = `
You are Perplexity, a helpful deep research assistant trained by Perplexity AI.
You will be asked a Question from a user and you will create a long, comprehensive, well-structured research report in response to the user's Question.
You will write an exhaustive, highly detailed report on the query topic. Prioritize verbosity, ensuring no relevant subtopic is overlooked.
Your report should be at least 300 words.
Your report should be informed by search results and will cite the relevant sources. DO NOT make up sources.
Your report must be correct, high-quality, well-formatted, and written by an expert using an unbiased and journalistic tone.
`

// NewPerplexityServer creates a new PerplexityServer with the provided configuration
func NewPerplexityServer(config *Config) (*PerplexityServer, error) {
	if config == nil {
		return nil, errors.New("config cannot be nil")
	}

	return &PerplexityServer{
		config: config,
		client: &http.Client{
			Timeout: config.HTTPTimeout,
		},
	}, nil
}

// ListTools implements the ToolHandler interface for PerplexityServer
// Returns the list of available tools (just "research" in this case)
func (s *PerplexityServer) ListTools(ctx context.Context) (*protocol.ListToolsResponse, error) {
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

// CallTool implements the ToolHandler interface for PerplexityServer
// Processes the request and calls the Perplexity API
func (s *PerplexityServer) CallTool(ctx context.Context, req *protocol.CallToolRequest) (*protocol.CallToolResponse, error) {
	logger := getLoggerFromContext(ctx)

	// Validate tool name
	if req.Name != "research" {
		return createErrorResponse(fmt.Sprintf("unknown tool: %s", req.Name)), nil
	}

	// Extract and validate query parameter
	query, ok := req.Arguments["query"].(string)
	if !ok {
		return createErrorResponse("query must be a string"), nil
	}

	// Create Perplexity request
	perplexityReq := PerplexityRequest{
		Model: s.config.DefaultModel,
		Messages: []PerplexityMessage{
			{
				Role:    "system",
				Content: systemPrompt,
			},
			{
				Role:    "user",
				Content: query,
			},
		},
	}

	// Send request to Perplexity API
	perplexityResp, err := s.sendPerplexityRequest(ctx, perplexityReq)
	if err != nil {
		logger.Error("Perplexity API error: %v", err)
		return createErrorResponse(fmt.Sprintf("error from Perplexity API: %v", err)), nil
	}

	// Format response with citations
	return s.formatResponse(perplexityResp), nil
}

// getLoggerFromContext safely extracts a logger from the context or creates a new one
func getLoggerFromContext(ctx context.Context) Logger {
	loggerValue := ctx.Value(loggerKey)
	if loggerValue != nil {
		if l, ok := loggerValue.(Logger); ok {
			return l
		}
	}
	// Create a new logger if one isn't in the context or type assertion fails
	return NewLogger(LevelInfo)
}

// createPerplexityRequest builds the HTTP request for the Perplexity API
func (s *PerplexityServer) createPerplexityRequest(ctx context.Context, req PerplexityRequest) (*http.Request, error) {
	// Marshal request to JSON
	reqBody, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create HTTP request
	httpReq, err := http.NewRequestWithContext(ctx, "POST", s.config.PerplexityAPIURL, bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	httpReq.Header.Set("Accept", "application/json")
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+s.config.PerplexityAPIKey)

	return httpReq, nil
}

// executeRequest makes the HTTP request to the Perplexity API and parses the response
func (s *PerplexityServer) executeRequest(httpReq *http.Request, logger Logger) (*PerplexityResponse, error) {
	// Make request
	logger.Debug("Sending request to Perplexity API with timeout: %v", s.config.HTTPTimeout)
	resp, err := s.client.Do(httpReq)
	if err != nil {
		// Add more context for timeout errors
		if strings.Contains(err.Error(), "timeout") || strings.Contains(err.Error(), "deadline exceeded") {
			return nil, fmt.Errorf("request timed out after %v: consider increasing PERPLEXITY_TIMEOUT: %w", s.config.HTTPTimeout, err)
		}
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	// Check for API errors
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	var response PerplexityResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	// Validate response
	if len(response.Choices) == 0 {
		return nil, errors.New("no response choices returned")
	}

	return &response, nil
}

// sendPerplexityRequest sends a request to the Perplexity API with retry capability
func (s *PerplexityServer) sendPerplexityRequest(ctx context.Context, req PerplexityRequest) (*PerplexityResponse, error) {
	logger := getLoggerFromContext(ctx)

	// Create HTTP request
	httpReq, err := s.createPerplexityRequest(ctx, req)
	if err != nil {
		return nil, err
	}

	// Variable to store the response
	var perplexityResp *PerplexityResponse

	// Define the operation to retry
	operation := func() error {
		resp, err := s.executeRequest(httpReq, logger)
		if err != nil {
			return err
		}
		perplexityResp = resp
		return nil
	}

	// Execute the operation with retry logic
	err = RetryWithBackoff(
		ctx,
		s.config.MaxRetries,
		s.config.InitialBackoff,
		s.config.MaxBackoff,
		operation,
		IsTimeoutError,
		logger,
	)

	if err != nil {
		return nil, err
	}

	return perplexityResp, nil
}

// formatResponse formats the Perplexity API response with citations
func (s *PerplexityServer) formatResponse(resp *PerplexityResponse) *protocol.CallToolResponse {
	content := resp.Choices[0].Message.Content

	// Add citations if available
	if len(resp.Citations) > 0 {
		content += "\n\nSources:\n"
		for _, citation := range resp.Citations {
			content += fmt.Sprintf("- %s\n", citation)
		}
	}

	return &protocol.CallToolResponse{
		Content: []protocol.ToolContent{
			{
				Type: "text",
				Text: content,
			},
		},
	}
}

// createErrorResponse creates a standardized error response
func createErrorResponse(message string) *protocol.CallToolResponse {
	return &protocol.CallToolResponse{
		IsError: true,
		Content: []protocol.ToolContent{
			{
				Type: "text",
				Text: message,
			},
		},
	}
}
