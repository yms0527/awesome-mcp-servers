package tools

import (
	"testing"
)

const (
	// Reuse constants from pulls_test.go
	ISSUE_OWNER = OWNER
	ISSUE_REPO  = REPO
)

func TestIssues(t *testing.T) {
	testCases := []*TestCase{
		// get_issue - Happy Path
		{
			Name: "GetExistingIssue",
			Tool: "get_issue",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   ISSUE_REPO,
				"number": 1, // Assuming issue #1 exists
			},
		},
		{
			Name: "GetClosedIssue",
			Tool: "get_issue",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   ISSUE_REPO,
				"number": 2, // Assuming issue #2 is closed
			},
		},

		// get_issue - Error Cases
		{
			Name: "GetNonExistentIssue",
			Tool: "get_issue",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   ISSUE_REPO,
				"number": 9999, // Non-existent issue
			},
		},
		{
			Name: "InvalidOwnerGetIssue",
			Tool: "get_issue",
			Input: map[string]interface{}{
				"owner":  "non-existent-user",
				"repo":   ISSUE_REPO,
				"number": 1,
			},
		},
		{
			Name: "InvalidRepoGetIssue",
			Tool: "get_issue",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   "non-existent-repo",
				"number": 1,
			},
		},

		// list_issues - Happy Path
		{
			Name: "ListAllIssues",
			Tool: "list_issues",
			Input: map[string]interface{}{
				"owner": ISSUE_OWNER,
				"repo":  ISSUE_REPO,
				"state": "all",
			},
		},
		{
			Name: "ListOpenIssues",
			Tool: "list_issues",
			Input: map[string]interface{}{
				"owner": ISSUE_OWNER,
				"repo":  ISSUE_REPO,
				"state": "open",
			},
		},
		{
			Name: "ListClosedIssues",
			Tool: "list_issues",
			Input: map[string]interface{}{
				"owner": ISSUE_OWNER,
				"repo":  ISSUE_REPO,
				"state": "closed",
			},
		},
		{
			Name: "ListIssuesWithLabels",
			Tool: "list_issues",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   ISSUE_REPO,
				"state":  "all",
				"labels": "bug,enhancement",
			},
		},

		// list_issues - Error Cases
		{
			Name: "ListIssuesInvalidOwner",
			Tool: "list_issues",
			Input: map[string]interface{}{
				"owner": "non-existent-user",
				"repo":  ISSUE_REPO,
			},
		},
		{
			Name: "ListIssuesInvalidRepo",
			Tool: "list_issues",
			Input: map[string]interface{}{
				"owner": ISSUE_OWNER,
				"repo":  "non-existent-repo",
			},
		},
		{
			Name: "ListIssuesInvalidState",
			Tool: "list_issues",
			Input: map[string]interface{}{
				"owner": ISSUE_OWNER,
				"repo":  ISSUE_REPO,
				"state": "invalid-state",
			},
		},

		// create_issue - Happy Path
		{
			Name: "BasicIssueCreation",
			Tool: "create_issue",
			Input: map[string]interface{}{
				"owner": ISSUE_OWNER,
				"repo":  ISSUE_REPO,
				"title": "Test Issue",
				"body":  "This is a test issue created by the test suite.",
			},
			// After hook removed to avoid authentication issues during testing
		},
		{
			Name: "IssueCreationWithLabels",
			Tool: "create_issue",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   ISSUE_REPO,
				"title":  "Test Issue with Labels",
				"body":   "This is a test issue with labels created by the test suite.",
				"labels": "bug,enhancement",
			},
			// After hook removed to avoid authentication issues during testing
		},

		// create_issue - Error Cases
		{
			Name: "CreateIssueInvalidOwner",
			Tool: "create_issue",
			Input: map[string]interface{}{
				"owner": "non-existent-user",
				"repo":  ISSUE_REPO,
				"title": "Test Issue",
				"body":  "This is a test issue.",
			},
		},
		{
			Name: "CreateIssueInvalidRepo",
			Tool: "create_issue",
			Input: map[string]interface{}{
				"owner": ISSUE_OWNER,
				"repo":  "non-existent-repo",
				"title": "Test Issue",
				"body":  "This is a test issue.",
			},
		},
		{
			Name: "CreateIssueEmptyTitle",
			Tool: "create_issue",
			Input: map[string]interface{}{
				"owner": ISSUE_OWNER,
				"repo":  ISSUE_REPO,
				"title": "",
				"body":  "This is a test issue.",
			},
		},

		// update_issue - Happy Path
		{
			Name: "UpdateIssueTitle",
			Tool: "update_issue",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   ISSUE_REPO,
				"number": 1, // Assuming issue #1 exists
				"title":  "Updated Test Issue Title",
			},
		},
		{
			Name: "UpdateIssueBody",
			Tool: "update_issue",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   ISSUE_REPO,
				"number": 1, // Assuming issue #1 exists
				"body":   "This is an updated test issue body.",
			},
		},
		{
			Name: "CloseIssue",
			Tool: "update_issue",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   ISSUE_REPO,
				"number": 1, // Assuming issue #1 exists
				"state":  "closed",
			},
		},

		// update_issue - Error Cases
		{
			Name: "UpdateIssueInvalidOwner",
			Tool: "update_issue",
			Input: map[string]interface{}{
				"owner":  "non-existent-user",
				"repo":   ISSUE_REPO,
				"number": 1,
				"title":  "Updated Test Issue",
			},
		},
		{
			Name: "UpdateIssueInvalidRepo",
			Tool: "update_issue",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   "non-existent-repo",
				"number": 1,
				"title":  "Updated Test Issue",
			},
		},
		{
			Name: "UpdateNonExistentIssue",
			Tool: "update_issue",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   ISSUE_REPO,
				"number": 9999, // Non-existent issue
				"title":  "Updated Test Issue",
			},
		},

		// add_issue_comment - Happy Path
		{
			Name: "AddCommentToIssue",
			Tool: "add_issue_comment",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   ISSUE_REPO,
				"number": 1, // Assuming issue #1 exists
				"body":   "This is a test comment.",
			},
		},

		// add_issue_comment - Error Cases
		{
			Name: "AddCommentInvalidOwner",
			Tool: "add_issue_comment",
			Input: map[string]interface{}{
				"owner":  "non-existent-user",
				"repo":   ISSUE_REPO,
				"number": 1,
				"body":   "This is a test comment.",
			},
		},
		{
			Name: "AddCommentInvalidRepo",
			Tool: "add_issue_comment",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   "non-existent-repo",
				"number": 1,
				"body":   "This is a test comment.",
			},
		},
		{
			Name: "AddCommentNonExistentIssue",
			Tool: "add_issue_comment",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   ISSUE_REPO,
				"number": 9999, // Non-existent issue
				"body":   "This is a test comment.",
			},
		},
		{
			Name: "AddEmptyComment",
			Tool: "add_issue_comment",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   ISSUE_REPO,
				"number": 1,
				"body":   "",
			},
		},

		// list_issue_comments - Happy Path
		{
			Name: "ListCommentsOnIssue",
			Tool: "list_issue_comments",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   ISSUE_REPO,
				"number": 1, // Assuming issue #1 exists and has comments
			},
		},
		{
			Name: "ListCommentsSortedByUpdated",
			Tool: "list_issue_comments",
			Input: map[string]interface{}{
				"owner":     ISSUE_OWNER,
				"repo":      ISSUE_REPO,
				"number":    1, // Assuming issue #1 exists and has comments
				"sort":      "updated",
				"direction": "asc",
			},
		},

		// list_issue_comments - Error Cases
		{
			Name: "ListCommentsInvalidOwner",
			Tool: "list_issue_comments",
			Input: map[string]interface{}{
				"owner":  "non-existent-user",
				"repo":   ISSUE_REPO,
				"number": 1,
			},
		},
		{
			Name: "ListCommentsInvalidRepo",
			Tool: "list_issue_comments",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   "non-existent-repo",
				"number": 1,
			},
		},
		{
			Name: "ListCommentsNonExistentIssue",
			Tool: "list_issue_comments",
			Input: map[string]interface{}{
				"owner":  ISSUE_OWNER,
				"repo":   ISSUE_REPO,
				"number": 9999, // Non-existent issue
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.Name, func(t *testing.T) {
			RunTest(t, tc)
		})
	}
}
