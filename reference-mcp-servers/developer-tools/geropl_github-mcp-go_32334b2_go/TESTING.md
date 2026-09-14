# Testing Guide

## Overview

This document provides a comprehensive guide to the testing approach used in the GitHub MCP Go project. The tests are designed as integration tests over the tools offered, where we use go-vcr for recording HTTP interactions, to re-run the tests like unit tests.

**IMPORTANT**: Adding test cases, as well as running them and verifying they work as indentend is a crucial part of our "Definition of Done"!

## Testing Workflow

The project follows an iterative testing approach:

1. **Focus on one test case** in the appropriate test file
2. **Record HTTP interactions**:
   ```bash
   go test -v ./pkg/tools -run TestCategory/toolName-TestCaseName -record
   ```
3. **Create golden files**:
   ```bash
   go test -v ./pkg/tools -run TestCategory/toolName-TestCaseName -golden
   ```
4. **Verify the test passes**:
   ```bash
   go test -v ./pkg/tools -run TestCategory/toolName-TestCaseName
   ```
5. **Verify the golden file exists and contains sensible expectations**:
   ```bash
   cat testdata/TestCategory/toolName-TestCaseName.golden
   ```
6. **Update test verification** in activeContext.md
7. **Move to the next test case**

## Testing Architecture

### Components

- **TestCase struct**: Defines test parameters including name, tool, input, and setup/cleanup functions
- **go-vcr**: Records and replays HTTP interactions with the GitHub API
- **Golden files**: Store expected test results for comparison

### Test Structure

Tests are implemented using a table-driven approach:

```go
func TestPullRequest(t *testing.T) {
    testCases := []TestCase{
        {
            Name: "SuccessfulCreation",
            Tool: "create_pull_request",
            Input: map[string]interface{}{
                // Test parameters
            },
            Before: func(ctx context.Context, client *ghclient.Client) error {
                // Setup code
            },
            After: func(ctx context.Context, client *ghclient.Client) error {
                // Cleanup code
            },
        },
        // Additional test cases
    }

    for _, tc := range testCases {
        t.Run(tc.Name, func(t *testing.T) {
            RunTest(t, tc)
        })
    }
}
```

## Running Tests

### Normal Mode

Run tests without recording or updating golden files:

```bash
go test -v ./pkg/tools -run TestPullRequest
```

This mode uses existing cassettes and golden files to verify that the implementation produces the expected results.

### Recording Mode

#### Prerequisites

Before running tests, ensure you have GitHub personal access token with the following permissions to the test repo `geropl/github-mcp-go-test`:
 - content r/w
 - issues r/w
 - pull reqeuests r/w
 - actions r/o

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
```

#### Run tests in recording mode

Record new HTTP interactions with the GitHub API:

```bash
go test -v ./pkg/tools -run TestPullRequest -record
```

Use this mode when:
- Implementing a new test case
- The GitHub API responses have changed
- The test implementation has changed significantly

### Golden Mode

Update the golden files with the current test results:

```bash
go test -v ./pkg/tools -run TestPullRequest -golden
```

Use this mode when:
- The expected output format has changed intentionally
- Adding new fields to the response
- Changing the formatting of the response

## Test Organization

All tests reside in `pkg/tools`. The test files are organized by GitHub resource type:

```
testdata/
├── TestBranches/
│   ├── create_branch-CreateBranchFromAnotherBranch.golden
│   ├── create_branch-CreateBranchFromAnotherBranch.yaml
│   └── ...
├── TestCommits/
├── TestFiles/
├── TestIssues/
├── TestPullRequest/
├── TestRepository/
└── TestSearch/
```

Each test case has two files under it's name:
- `.yaml` files: VCR cassettes with recorded HTTP interactions
- `.golden` files: Expected test results in JSON format

## Troubleshooting Common Test Issues

### Test Passes in Recording Mode But Fails in Normal Mode
- Check for time-dependent values in responses
- Verify API responses haven't changed
- Ensure golden files match current implementation

### Inconsistent Test Results
- Check for race conditions or external dependencies
- Verify test isolation (tests shouldn't depend on each other)
- Ensure cleanup functions run properly

### VCR Recording Issues
- Check GitHub token permissions
- Verify network connectivity
- Ensure the test repository exists and is accessible
