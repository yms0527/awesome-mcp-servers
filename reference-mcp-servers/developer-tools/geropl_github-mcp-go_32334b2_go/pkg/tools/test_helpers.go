package tools

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
	"github.com/sirupsen/logrus"
	"gopkg.in/dnaeon/go-vcr.v4/pkg/cassette"
	"gopkg.in/dnaeon/go-vcr.v4/pkg/recorder"

	"github.com/geropl/github-mcp-go/pkg/github"
	"github.com/google/go-cmp/cmp"
	gh "github.com/google/go-github/v69/github"
)

var (
	// UpdateGolden is a flag to update golden files
	golden = flag.Bool("golden", false, "update golden files")
	// RecordMode is a flag to control VCR recording
	record = flag.Bool("record", false, "record new HTTP interactions")
)

type TestCase struct {
	Name   string
	Tool   string
	Input  map[string]interface{}
	Before func(ctx context.Context, client *github.Client) error
	After  func(ctx context.Context, client *github.Client) error

	// OutputFilter allows to filter the output before comparison, to avoid comparing dynamic/random values
	OutputFilter func(output string) string
}

func (tc *TestCase) FullName() string {
	return fmt.Sprintf("%s-%s", tc.Tool, tc.Name)
}

// TestResult represents the expected result of a test
type TestResult struct {
	Output string `json:"output"`
	Err    string `json:"err"`
}

func RunTest(t *testing.T, tc *TestCase) {
	// Create a non-recording client for Before/After hooks
	ctx := context.Background()
	nonRecordingClient := createNonRecordingClient()

	// Run hooks if we are recording
	if *record {
		// Ensure After hook runs even if test or Before hook fails
		defer func() {
			if tc.After != nil {
				if err := tc.After(ctx, nonRecordingClient); err != nil {
					t.Fatalf("Failed to run After hook: %v", err)
				}
			}
		}()
		// Run Before hook if it exists
		if tc.Before != nil {
			if err := tc.Before(ctx, nonRecordingClient); err != nil {
				t.Fatalf("Failed to run Before hook: %v", err)
			}
		}
	}

	s, r := createTestServer(t, tc, *record)
	defer r.Stop() // Ensure recorder is stopped

	testCtx := context.Background()
	actual, testErr := executeTestTool(testCtx, createCallToolHandler(s.server), tc.Tool, tc.Input)
	if testErr != nil {
		t.Fatalf("Failed to execute test tool: %v", testErr)
	}
	if tc.OutputFilter != nil {
		actual.Output = tc.OutputFilter(actual.Output)
	}

	// Create directory structure for golden file
	goldenPath := filepath.Join(getProjectRoot(), "testdata", testName(t), tc.FullName())
	if err := os.MkdirAll(filepath.Dir(goldenPath), 0755); err != nil {
		t.Fatalf("Failed to create golden directory: %v", err)
	}
	goldenFile := goldenPath + ".golden"

	// If -golden flag is set, update the golden file
	if *golden {
		writeErr := writeGoldenFile(goldenFile, actual)
		if writeErr != nil {
			t.Fatalf("Failed to write golden file: %v", writeErr)
		}
		return
	}

	expected, readErr := readGoldenFile(goldenFile)
	if readErr != nil {
		t.Fatalf("Failed to read golden file: %v", readErr)
	}

	// Compare actual and expected results
	if diff := cmp.Diff(expected.Output, actual.Output); diff != "" {
		t.Errorf("Test output mismatch (-want +got):\n%s", diff)
	}
	if diff := cmp.Diff(expected.Err, actual.Err); diff != "" {
		t.Errorf("Error mismatch (-want +got):\n%s", diff)
	}
}

// createTestServer creates a test server with a VCR recorder
func createTestServer(t *testing.T, tc *TestCase, doRecord bool) (*Server, *recorder.Recorder) {
	logger := logrus.New()

	options := []recorder.Option{
		// filter "Authorization" header
		recorder.WithHook(func(i *cassette.Interaction) error {
			i.Request.Headers.Del("Authorization")
			return nil
		}, recorder.AfterCaptureHook),
		recorder.WithMatcher(cassette.NewDefaultMatcher(cassette.WithIgnoreAuthorization())),
	}
	if doRecord {
		options = append(options, recorder.WithMode(recorder.ModeRecordOnly))
	} else {
		options = append(options, recorder.WithMode(recorder.ModeReplayOnly))
	}

	// Create directory structure for cassette
	cassettePath := path.Join(getProjectRoot(), "testdata", testName(t), tc.FullName())
	if err := os.MkdirAll(filepath.Dir(cassettePath), 0755); err != nil {
		t.Fatalf("Failed to create cassette directory: %v", err)
	}

	r, err := recorder.New(cassettePath, options...)
	if err != nil {
		t.Fatalf("Failed to create recorder: %v", err)
	}

	// Create a GitHub client with the recorder's transport
	httpClient := &http.Client{Transport: r}

	// Only require token in record mode
	token := os.Getenv("GITHUB_PERSONAL_ACCESS_TOKEN")
	githubClient := github.NewClientWithHTTPClient(token, httpClient, logger)

	// Create a server (with write access enabled for tests)
	s := NewServer("test-server", "0.1.0", githubClient, logger, true)
	RegisterTools(s)
	return s, r
}

// executeTestTool executes a test tool with the given input and returns the result
func executeTestTool(ctx context.Context, handler func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error), toolName string, input map[string]interface{}) (*TestResult, error) {
	// Create a request
	request := mcp.CallToolRequest{}
	request.Params.Name = toolName
	request.Params.Arguments = input

	// Execute the tool handler directly
	result, err := handler(ctx, request)
	if err != nil {
		return &TestResult{
			Output: "",
			Err:    err.Error(),
		}, nil
	}

	// Process the result
	if result.IsError {
		// For error results, the content is the error message
		if len(result.Content) > 0 {
			// Try to extract the text content
			content := result.Content[0]
			if textContent, ok := content.(mcp.TextContent); ok {
				return &TestResult{
					Output: "",
					Err:    textContent.Text,
				}, nil
			}
			// If we can't extract the text, return a generic error
			return &TestResult{
				Output: "",
				Err:    "Unknown error",
			}, nil
		}
		return &TestResult{
			Output: "",
			Err:    "Empty error content",
		}, nil
	}

	// For success results, the content is the output
	if len(result.Content) > 0 {
		// Try to extract the text content
		content := result.Content[0]
		if textContent, ok := content.(mcp.TextContent); ok {
			return &TestResult{
				Output: textContent.Text,
				Err:    "",
			}, nil
		}
		// If we can't extract the text, return a generic output
		return &TestResult{
			Output: "Non-text content",
			Err:    "",
		}, nil
	}
	return &TestResult{
		Output: "Empty content",
		Err:    "",
	}, nil
}

func writeGoldenFile(goldenFile string, actual *TestResult) error {
	if err := os.MkdirAll(filepath.Dir(goldenFile), 0755); err != nil {
		return fmt.Errorf("failed to create golden directory: %v", err)
	}
	data, err := json.MarshalIndent(actual, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal actual result: %v", err)
	}
	if err := os.WriteFile(goldenFile, data, 0644); err != nil {
		return fmt.Errorf("failed to write golden file: %v", err)
	}
	return nil
}

func readGoldenFile(goldenFile string) (*TestResult, error) {
	// Read expected result from golden file
	data, err := os.ReadFile(goldenFile)
	if err != nil {
		return nil, fmt.Errorf("failed to read golden file: %v", err)
	}

	var expected TestResult
	if err := json.Unmarshal(data, &expected); err != nil {
		return nil, fmt.Errorf("failed to unmarshal expected result: %v", err)
	}
	return &expected, nil
}

func getProjectRoot() string {
	_, filename, _, _ := runtime.Caller(0)
	return path.Join(path.Dir(filename), "..", "..")
}

func testName(t *testing.T) string {
	return strings.Split(t.Name(), "/")[0]
}

// createNonRecordingClient creates a GitHub client that is authenticated but doesn't record interactions
func createNonRecordingClient() *github.Client {
	logger := logrus.New()
	token := os.Getenv("GITHUB_PERSONAL_ACCESS_TOKEN")

	// Create a regular HTTP client (not using VCR)
	httpClient := &http.Client{}

	// Create a GitHub client with the HTTP client
	githubClient := github.NewClientWithHTTPClient(token, httpClient, logger)

	return githubClient
}

// useful test helper

// createBranchWithFile creates a new branch in the repository and adds a test file
func createBranchWithFile(ctx context.Context, client *github.Client, owner, repo, branch, baseBranch string) error {
	// Get the SHA of the base branch
	baseRef, _, err := client.GetClient().Git.GetRef(ctx, owner, repo, "refs/heads/"+baseBranch)
	if err != nil {
		return fmt.Errorf("failed to get base branch ref: %v", err)
	}

	// Create a new reference (branch)
	newRef := &gh.Reference{
		Ref: gh.Ptr("refs/heads/" + branch),
		Object: &gh.GitObject{
			SHA: baseRef.Object.SHA,
		},
	}

	_, _, err = client.GetClient().Git.CreateRef(ctx, owner, repo, newRef)
	if err != nil {
		return fmt.Errorf("failed to create branch: %v", err)
	}

	// Create a test file on the new branch using the Contents API
	content := fmt.Sprintf("# Test file\n\nCreated for testing at %s", time.Now().Format(time.RFC3339))

	// Create the file
	opts := &gh.RepositoryContentFileOptions{
		Message: gh.Ptr("Add test file for PR testing"),
		Content: []byte(content),
		Branch:  gh.Ptr(branch),
	}

	_, _, err = client.GetClient().Repositories.CreateFile(ctx, owner, repo, "test-file.md", opts)
	if err != nil {
		return fmt.Errorf("failed to create file: %v", err)
	}

	return nil
}

// createBranch creates a new branch in the repository and adds a test file
func createBranch(ctx context.Context, client *github.Client, owner, repo, branch, baseBranch string) error {
	// Get the SHA of the base branch
	baseRef, _, err := client.GetClient().Git.GetRef(ctx, owner, repo, "refs/heads/"+baseBranch)
	if err != nil {
		return fmt.Errorf("failed to get base branch ref: %v", err)
	}

	// Create a new reference (branch)
	newRef := &gh.Reference{
		Ref: gh.Ptr("refs/heads/" + branch),
		Object: &gh.GitObject{
			SHA: baseRef.Object.SHA,
		},
	}

	_, _, err = client.GetClient().Git.CreateRef(ctx, owner, repo, newRef)
	if err != nil {
		return fmt.Errorf("failed to create branch: %v", err)
	}

	return nil
}

// deleteBranch deletes a branch from the repository
func deleteBranch(ctx context.Context, client *github.Client, owner, repo, branch string) error {
	_, err := client.GetClient().Git.DeleteRef(ctx, owner, repo, "refs/heads/"+branch)
	if err != nil {
		return fmt.Errorf("failed to delete branch: %v", err)
	}

	return nil
}

func createCommit(ctx context.Context, client *github.Client, owner, repo, branch, fileName, content string) error {
	// Create the file
	opts := &gh.RepositoryContentFileOptions{
		Message: gh.Ptr("Push a file to this branch"),
		Content: []byte(content),
		Branch:  gh.Ptr(branch),
	}

	_, _, err := client.GetClient().Repositories.CreateFile(ctx, owner, repo, fileName, opts)
	if err != nil {
		return fmt.Errorf("failed to create file: %v", err)
	}
	return nil
}

func createCallToolHandler(server *server.MCPServer) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		// Create a proper JSON-RPC request
		jsonRpcRequest := mcp.JSONRPCRequest{
			JSONRPC: "2.0",
			ID:      "1",
			Params:  request.Params,
		}
		jsonRpcRequest.Method = "tools/call"

		rawMessage, err := json.Marshal(jsonRpcRequest)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal request: %v", err)
		}

		rawResponse := server.HandleMessage(ctx, rawMessage)

		// Check if the response is an error
		if jsonRpcError, ok := rawResponse.(mcp.JSONRPCError); ok {
			return nil, fmt.Errorf("JSON-RPC error: %s", jsonRpcError.Error.Message)
		}

		// Check if the response is a success
		jsonRpcResponse, ok := rawResponse.(mcp.JSONRPCResponse)
		if !ok {
			return nil, fmt.Errorf("unexpected response type: %T", rawResponse)
		}

		// Process the result based on its type
		result, ok := jsonRpcResponse.Result.(*mcp.CallToolResult)
		if !ok {
			return nil, fmt.Errorf("unexpected result type: %T", jsonRpcResponse.Result)
		}
		return result, nil
	}
}
