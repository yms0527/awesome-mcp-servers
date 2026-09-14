package tools

import (
	"bufio"
	"strings"
	"testing"
)

func TestActions(t *testing.T) {
	ignoreRandomTempDirElementInDownloadLogs := func(output string) string {
		s := bufio.NewScanner(strings.NewReader(output))
		var result string
		for s.Scan() {

			line := s.Text()
			if strings.HasPrefix(line, "**Logs Directory:**") {
				// Replace the last, random element of the directory path with a static
				parts := strings.Split(line, "-")
				parts[len(parts)-1] = "StaticForTesting"
				line = strings.Join(parts, "-")
			}
			result += line + "\n"
		}
		return result
	}

	testCases := []*TestCase{
		// get_workflow - Happy Path
		{
			Name: "GetWorkflowByID",
			Tool: "get_workflow",
			Input: map[string]interface{}{
				"owner":       "geropl",
				"repo":        "github-mcp-go-test",
				"workflow_id": "149593961", // Actual workflow ID
			},
		},
		{
			Name: "GetWorkflowByFileName",
			Tool: "get_workflow",
			Input: map[string]interface{}{
				"owner":       "geropl",
				"repo":        "github-mcp-go-test",
				"workflow_id": "test-workflow.yml", // Just the filename, not the full path
			},
		},

		// get_workflow - Error Cases
		{
			Name: "GetWorkflowInvalidOwner",
			Tool: "get_workflow",
			Input: map[string]interface{}{
				"owner":       "",
				"repo":        "github-mcp-go-test",
				"workflow_id": "12345678",
			},
		},
		{
			Name: "GetWorkflowInvalidRepo",
			Tool: "get_workflow",
			Input: map[string]interface{}{
				"owner":       "geropl",
				"repo":        "",
				"workflow_id": "12345678",
			},
		},
		{
			Name: "GetWorkflowInvalidID",
			Tool: "get_workflow",
			Input: map[string]interface{}{
				"owner":       "geropl",
				"repo":        "github-mcp-go-test",
				"workflow_id": "",
			},
		},
		{
			Name: "GetWorkflowNonExistentID",
			Tool: "get_workflow",
			Input: map[string]interface{}{
				"owner":       "geropl",
				"repo":        "github-mcp-go-test",
				"workflow_id": "99999999", // Non-existent workflow ID
			},
		},
		{
			Name: "GetWorkflowNonExistentFileName",
			Tool: "get_workflow",
			Input: map[string]interface{}{
				"owner":       "geropl",
				"repo":        "github-mcp-go-test",
				"workflow_id": "non-existent.yml",
			},
		},

		// list_workflows - Happy Path
		{
			Name: "ListWorkflows",
			Tool: "list_workflows",
			Input: map[string]interface{}{
				"owner": "geropl",
				"repo":  "github-mcp-go-test",
			},
		},

		// list_workflows - Error Cases
		{
			Name: "ListWorkflowsInvalidOwner",
			Tool: "list_workflows",
			Input: map[string]interface{}{
				"owner": "",
				"repo":  "github-mcp-go-test",
			},
		},
		{
			Name: "ListWorkflowsInvalidRepo",
			Tool: "list_workflows",
			Input: map[string]interface{}{
				"owner": "geropl",
				"repo":  "",
			},
		},
		{
			Name: "ListWorkflowsNonExistentRepo",
			Tool: "list_workflows",
			Input: map[string]interface{}{
				"owner": "geropl",
				"repo":  "non-existent-repo",
			},
		},

		// list_workflow_runs - Happy Path
		{
			Name: "ListWorkflowRuns",
			Tool: "list_workflow_runs",
			Input: map[string]interface{}{
				"owner": "geropl",
				"repo":  "github-mcp-go-test",
			},
		},
		{
			Name: "ListWorkflowRunsWithWorkflowID",
			Tool: "list_workflow_runs",
			Input: map[string]interface{}{
				"owner":       "geropl",
				"repo":        "github-mcp-go-test",
				"workflow_id": "149593961", // Actual workflow ID
			},
		},
		{
			Name: "ListWorkflowRunsWithFilters",
			Tool: "list_workflow_runs",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"branch": "main",
				"status": "completed",
			},
		},

		// list_workflow_runs - Error Cases
		{
			Name: "ListWorkflowRunsInvalidOwner",
			Tool: "list_workflow_runs",
			Input: map[string]interface{}{
				"owner": "",
				"repo":  "github-mcp-go-test",
			},
		},
		{
			Name: "ListWorkflowRunsInvalidRepo",
			Tool: "list_workflow_runs",
			Input: map[string]interface{}{
				"owner": "geropl",
				"repo":  "",
			},
		},
		{
			Name: "ListWorkflowRunsNonExistentRepo",
			Tool: "list_workflow_runs",
			Input: map[string]interface{}{
				"owner": "geropl",
				"repo":  "non-existent-repo",
			},
		},
		{
			Name: "ListWorkflowRunsInvalidWorkflowID",
			Tool: "list_workflow_runs",
			Input: map[string]interface{}{
				"owner":       "geropl",
				"repo":        "github-mcp-go-test",
				"workflow_id": true, // Invalid type
			},
		},

		// get_workflow_run - Happy Path
		{
			Name: "GetWorkflowRun",
			Tool: "get_workflow_run",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"run_id": "13839912722", // Actual run ID
			},
		},

		// get_workflow_run - Error Cases
		{
			Name: "GetWorkflowRunInvalidOwner",
			Tool: "get_workflow_run",
			Input: map[string]interface{}{
				"owner":  "",
				"repo":   "github-mcp-go-test",
				"run_id": "13839912722",
			},
		},
		{
			Name: "GetWorkflowRunInvalidRepo",
			Tool: "get_workflow_run",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "",
				"run_id": "13839912722",
			},
		},
		{
			Name: "GetWorkflowRunInvalidID",
			Tool: "get_workflow_run",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"run_id": "",
			},
		},
		{
			Name: "GetWorkflowRunNonExistentID",
			Tool: "get_workflow_run",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"run_id": "99999999999", // Non-existent run ID
			},
		},
		{
			Name: "GetWorkflowRunInvalidIDType",
			Tool: "get_workflow_run",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"run_id": true, // Invalid type
			},
		},

		// download_workflow_run_logs - Happy Path
		{
			Name: "DownloadWorkflowRunLogs",
			Tool: "download_workflow_run_logs",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"run_id": "13839912722", // Actual run ID
			},
			OutputFilter: ignoreRandomTempDirElementInDownloadLogs,
		},

		// download_workflow_run_logs - Error Cases
		{
			Name: "DownloadWorkflowRunLogsInvalidOwner",
			Tool: "download_workflow_run_logs",
			Input: map[string]interface{}{
				"owner":  "",
				"repo":   "github-mcp-go-test",
				"run_id": "13839912722",
			},
		},
		{
			Name: "DownloadWorkflowRunLogsInvalidRepo",
			Tool: "download_workflow_run_logs",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "",
				"run_id": "13839912722",
			},
		},
		{
			Name: "DownloadWorkflowRunLogsInvalidID",
			Tool: "download_workflow_run_logs",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"run_id": "",
			},
		},
		{
			Name: "DownloadWorkflowRunLogsNonExistentID",
			Tool: "download_workflow_run_logs",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"run_id": "99999999999", // Non-existent run ID
			},
		},
		{
			Name: "DownloadWorkflowRunLogsInvalidIDType",
			Tool: "download_workflow_run_logs",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"run_id": true, // Invalid type
			},
		},

		// list_workflow_jobs - Happy Path
		{
			Name: "ListWorkflowJobs",
			Tool: "list_workflow_jobs",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"run_id": "13839912722", // Actual run ID
			},
		},
		{
			Name: "ListWorkflowJobsWithFilter",
			Tool: "list_workflow_jobs",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"run_id": "13839912722", // Actual run ID
				"filter": "completed",
			},
		},

		// list_workflow_jobs - Error Cases
		{
			Name: "ListWorkflowJobsInvalidOwner",
			Tool: "list_workflow_jobs",
			Input: map[string]interface{}{
				"owner":  "",
				"repo":   "github-mcp-go-test",
				"run_id": "13839912722",
			},
		},
		{
			Name: "ListWorkflowJobsInvalidRepo",
			Tool: "list_workflow_jobs",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "",
				"run_id": "13839912722",
			},
		},
		{
			Name: "ListWorkflowJobsInvalidID",
			Tool: "list_workflow_jobs",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"run_id": "",
			},
		},
		{
			Name: "ListWorkflowJobsNonExistentID",
			Tool: "list_workflow_jobs",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"run_id": "99999999999", // Non-existent run ID
			},
		},
		{
			Name: "ListWorkflowJobsInvalidIDType",
			Tool: "list_workflow_jobs",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"run_id": true, // Invalid type
			},
		},

		// get_workflow_job - Happy Path
		{
			Name: "GetWorkflowJob",
			Tool: "get_workflow_job",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"job_id": "38724486736", // Actual job ID
			},
		},

		// get_workflow_job - Error Cases
		{
			Name: "GetWorkflowJobInvalidOwner",
			Tool: "get_workflow_job",
			Input: map[string]interface{}{
				"owner":  "",
				"repo":   "github-mcp-go-test",
				"job_id": "38724486736",
			},
		},
		{
			Name: "GetWorkflowJobInvalidRepo",
			Tool: "get_workflow_job",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "",
				"job_id": "38724486736",
			},
		},
		{
			Name: "GetWorkflowJobInvalidID",
			Tool: "get_workflow_job",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"job_id": "",
			},
		},
		{
			Name: "GetWorkflowJobNonExistentID",
			Tool: "get_workflow_job",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"job_id": "99999999999", // Non-existent job ID
			},
		},
		{
			Name: "GetWorkflowJobInvalidIDType",
			Tool: "get_workflow_job",
			Input: map[string]interface{}{
				"owner":  "geropl",
				"repo":   "github-mcp-go-test",
				"job_id": true, // Invalid type
			},
		},
	}

	// Run all test cases
	for _, tc := range testCases {
		t.Run(tc.Name, func(t *testing.T) {
			RunTest(t, tc)
		})
	}
}
