package tools

import (
	"testing"
)

// TestCase and RunTest are defined in test_helpers.go
// This file is part of the same package, so we don't need to import it

const (
	// Reuse constants from pulls_test.go
	SEARCH_OWNER = "geropl"
	SEARCH_REPO  = "github-mcp-go-test"
)

func TestSearch(t *testing.T) {
	testCases := []*TestCase{
		// search_repositories test cases - Happy Path
		{
			Name: "BasicSearch",
			Tool: "search_repositories",
			Input: map[string]interface{}{
				"query": "language:go",
			},
		},
		{
			Name: "SearchWithPagination",
			Tool: "search_repositories",
			Input: map[string]interface{}{
				"query":   "language:go",
				"page":    1,
				"perPage": 5,
			},
		},
		{
			Name: "SearchWithSpecificFilters",
			Tool: "search_repositories",
			Input: map[string]interface{}{
				"query": "language:go stars:>1000",
			},
		},

		// search_repositories test cases - Error Cases
		{
			Name: "EmptyQuery",
			Tool: "search_repositories",
			Input: map[string]interface{}{
				"query": "",
			},
		},
		{
			Name: "InvalidPagination",
			Tool: "search_repositories",
			Input: map[string]interface{}{
				"query":   "language:go",
				"page":    -1,
				"perPage": 1000, // Exceeds maximum
			},
		},
		{
			Name: "ComplexQuerySyntaxError",
			Tool: "search_repositories",
			Input: map[string]interface{}{
				"query": "language:go AND stars:>1000", // Invalid syntax (should be language:go stars:>1000)
			},
		},

		// search_code test cases - Happy Path
		{
			Name: "BasicCodeSearch",
			Tool: "search_code",
			Input: map[string]interface{}{
				"query": "function",
			},
		},
		{
			Name: "CodeSearchWithLanguage",
			Tool: "search_code",
			Input: map[string]interface{}{
				"query":    "function",
				"language": "go",
			},
		},
		{
			Name: "CodeSearchWithOwnerRepo",
			Tool: "search_code",
			Input: map[string]interface{}{
				"query": "function",
				"owner": SEARCH_OWNER,
				"repo":  SEARCH_REPO,
			},
		},
		{
			Name: "CodeSearchWithPagination",
			Tool: "search_code",
			Input: map[string]interface{}{
				"query":   "function",
				"page":    1,
				"perPage": 5,
			},
		},

		// search_code test cases - Error Cases
		{
			Name: "EmptyCodeQuery",
			Tool: "search_code",
			Input: map[string]interface{}{
				"query": "",
			},
		},
		{
			Name: "InvalidCodePagination",
			Tool: "search_code",
			Input: map[string]interface{}{
				"query":   "function",
				"page":    -1,
				"perPage": 1000, // Exceeds maximum
			},
		},
		{
			Name: "ComplexCodeQuerySyntaxError",
			Tool: "search_code",
			Input: map[string]interface{}{
				"query": "language:go AND function", // Invalid syntax (should be language:go function)
			},
		},

		// search_commits test cases - Happy Path
		{
			Name: "BasicCommitSearch",
			Tool: "search_commits",
			Input: map[string]interface{}{
				"query": "fix bug",
			},
		},
		{
			Name: "CommitSearchWithAuthor",
			Tool: "search_commits",
			Input: map[string]interface{}{
				"query": "fix bug author:" + SEARCH_OWNER,
			},
		},
		{
			Name: "CommitSearchWithRepository",
			Tool: "search_commits",
			Input: map[string]interface{}{
				"query": "fix bug repo:" + SEARCH_OWNER + "/" + SEARCH_REPO,
			},
		},
		{
			Name: "CommitSearchWithPagination",
			Tool: "search_commits",
			Input: map[string]interface{}{
				"query":   "fix bug",
				"page":    1,
				"perPage": 5,
			},
		},

		// search_commits test cases - Error Cases
		{
			Name: "EmptyCommitQuery",
			Tool: "search_commits",
			Input: map[string]interface{}{
				"query": "",
			},
		},
		{
			Name: "InvalidCommitPagination",
			Tool: "search_commits",
			Input: map[string]interface{}{
				"query":   "fix bug",
				"page":    -1,
				"perPage": 1000, // Exceeds maximum
			},
		},
		{
			Name: "ComplexCommitQuerySyntaxError",
			Tool: "search_commits",
			Input: map[string]interface{}{
				"query": "language:go AND fix bug", // Invalid syntax (should be language:go fix bug)
			},
		},

		// search_issues test cases - Happy Path
		{
			Name: "BasicIssueSearch",
			Tool: "search_issues",
			Input: map[string]interface{}{
				"query": "bug",
				"type":  "issue",
			},
		},
		{
			Name: "BasicPullRequestSearch",
			Tool: "search_issues",
			Input: map[string]interface{}{
				"query": "feature",
				"type":  "pull-request",
			},
		},
		{
			Name: "IssueSearchWithState",
			Tool: "search_issues",
			Input: map[string]interface{}{
				"query": "bug state:open",
			},
		},
		{
			Name: "IssueSearchWithLabels",
			Tool: "search_issues",
			Input: map[string]interface{}{
				"query": "bug label:bug",
			},
		},
		{
			Name: "IssueSearchWithPagination",
			Tool: "search_issues",
			Input: map[string]interface{}{
				"query":   "bug",
				"page":    1,
				"perPage": 5,
			},
		},

		// search_issues test cases - Error Cases
		{
			Name: "EmptyIssueQuery",
			Tool: "search_issues",
			Input: map[string]interface{}{
				"query": "",
			},
		},
		{
			Name: "InvalidIssuePagination",
			Tool: "search_issues",
			Input: map[string]interface{}{
				"query":   "bug",
				"page":    -1,
				"perPage": 1000, // Exceeds maximum
			},
		},
		{
			Name: "ComplexIssueQuerySyntaxError",
			Tool: "search_issues",
			Input: map[string]interface{}{
				"query": "language:go AND bug", // Invalid syntax (should be language:go bug)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.Name, func(t *testing.T) {
			RunTest(t, tc)
		})
	}
}
