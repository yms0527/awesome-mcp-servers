package github

import (
	"archive/zip"
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/google/go-github/v69/github"
	"github.com/sirupsen/logrus"

	"github.com/geropl/github-mcp-go/pkg/errors"
)

// ActionsOperations handles GitHub Actions-related operations
type ActionsOperations struct {
	client *Client
	logger *logrus.Logger
}

// NewActionsOperations creates a new ActionsOperations
func NewActionsOperations(client *Client, logger *logrus.Logger) *ActionsOperations {
	return &ActionsOperations{
		client: client,
		logger: logger,
	}
}

// ListWorkflows lists all workflows in a repository
func (a *ActionsOperations) ListWorkflows(ctx context.Context, owner, repo string, page, perPage int) (*github.Workflows, error) {
	// Validate owner and repo
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repository name cannot be empty")
	}

	// Set default pagination values if not provided
	if page <= 0 {
		page = 1
	}
	if perPage <= 0 {
		perPage = 30
	} else if perPage > 100 {
		perPage = 100
	}

	// Create list options for pagination
	opts := &github.ListOptions{
		Page:    page,
		PerPage: perPage,
	}

	// Call the GitHub API
	workflows, _, err := a.client.GetClient().Actions.ListWorkflows(ctx, owner, repo, opts)
	if err != nil {
		return nil, a.client.HandleError(err)
	}

	return workflows, nil
}

// GetWorkflow gets detailed information about a specific workflow
func (a *ActionsOperations) GetWorkflow(ctx context.Context, owner, repo string, workflowID interface{}) (*github.Workflow, error) {
	// Validate owner and repo
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repository name cannot be empty")
	}
	
	// Handle different types of workflowID (can be int64 or string)
	var id int64
	var name string
	
	switch v := workflowID.(type) {
	case int64:
		id = v
	case float64:
		id = int64(v)
	case int:
		id = int64(v)
	case string:
		if v == "" {
			return nil, errors.NewValidationError("workflow_id cannot be empty")
		}
		
		// Try to convert string to int64 if it looks like a number
		if i, err := strconv.ParseInt(v, 10, 64); err == nil {
			id = i
		} else {
			name = v
		}
	default:
		return nil, errors.NewValidationError(fmt.Sprintf("workflow_id must be a string or number, got %T", workflowID))
	}
	
	// Call the GitHub API
	var workflow *github.Workflow
	var err error
	
	if id != 0 {
		workflow, _, err = a.client.GetClient().Actions.GetWorkflowByID(ctx, owner, repo, id)
	} else {
		workflow, _, err = a.client.GetClient().Actions.GetWorkflowByFileName(ctx, owner, repo, name)
	}
	
	if err != nil {
		return nil, a.client.HandleError(err)
	}
	
	return workflow, nil
}

// ListWorkflowRuns lists workflow runs for a repository or a specific workflow
func (a *ActionsOperations) ListWorkflowRuns(
	ctx context.Context,
	owner, repo string,
	workflowID interface{},
	branch, status, event string,
	page, perPage int,
) (*github.WorkflowRuns, error) {
	// Validate owner and repo
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repository name cannot be empty")
	}

	// Set default pagination values if not provided
	if page <= 0 {
		page = 1
	}
	if perPage <= 0 {
		perPage = 30
	} else if perPage > 100 {
		perPage = 100
	}

	// Create options for the API call
	opts := &github.ListWorkflowRunsOptions{
		ListOptions: github.ListOptions{
			Page:    page,
			PerPage: perPage,
		},
	}

	// Add optional filters if provided
	if branch != "" {
		opts.Branch = branch
	}
	if status != "" {
		opts.Status = status
	}
	if event != "" {
		opts.Event = event
	}

	// Call the GitHub API
	var runs *github.WorkflowRuns
	var err error

	// If workflowID is provided, list runs for that specific workflow
	if workflowID != nil {
		// Handle different types of workflowID (can be int64 or string)
		var id int64
		var name string

		switch v := workflowID.(type) {
		case int64:
			id = v
		case float64:
			id = int64(v)
		case int:
			id = int64(v)
		case string:
			if v == "" {
				// Empty string means no workflow filter, list all runs
				runs, _, err = a.client.GetClient().Actions.ListRepositoryWorkflowRuns(ctx, owner, repo, opts)
				if err != nil {
					return nil, a.client.HandleError(err)
				}
				return runs, nil
			}

			// Try to convert string to int64 if it looks like a number
			if i, err := strconv.ParseInt(v, 10, 64); err == nil {
				id = i
			} else {
				name = v
			}
		default:
			return nil, errors.NewValidationError(fmt.Sprintf("workflow_id must be a string or number, got %T", workflowID))
		}

		// Call the appropriate API method based on the workflow identifier
		if id != 0 {
			runs, _, err = a.client.GetClient().Actions.ListWorkflowRunsByID(ctx, owner, repo, id, opts)
		} else if name != "" {
			runs, _, err = a.client.GetClient().Actions.ListWorkflowRunsByFileName(ctx, owner, repo, name, opts)
		}
	} else {
		// No workflow ID provided, list all runs for the repository
		runs, _, err = a.client.GetClient().Actions.ListRepositoryWorkflowRuns(ctx, owner, repo, opts)
	}

	if err != nil {
		return nil, a.client.HandleError(err)
	}

	return runs, nil
}

// GetWorkflowRun gets detailed information about a specific workflow run
func (a *ActionsOperations) GetWorkflowRun(ctx context.Context, owner, repo string, runID interface{}) (*github.WorkflowRun, error) {
	// Validate owner and repo
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repository name cannot be empty")
	}
	
	// Handle different types of runID (can be int64 or string)
	var id int64
	
	switch v := runID.(type) {
	case int64:
		id = v
	case float64:
		id = int64(v)
	case int:
		id = int64(v)
	case string:
		if v == "" {
			return nil, errors.NewValidationError("run_id cannot be empty")
		}
		
		// Try to convert string to int64
		var err error
		id, err = strconv.ParseInt(v, 10, 64)
		if err != nil {
			return nil, errors.NewValidationError(fmt.Sprintf("run_id must be a valid number, got %s", v))
		}
	default:
		return nil, errors.NewValidationError(fmt.Sprintf("run_id must be a string or number, got %T", runID))
	}
	
	// Call the GitHub API
	run, _, err := a.client.GetClient().Actions.GetWorkflowRunByID(ctx, owner, repo, id)
	if err != nil {
		return nil, a.client.HandleError(err)
	}
	
	return run, nil
}

// LogsResult contains information about downloaded workflow run logs
type LogsResult struct {
	// Path to the directory containing extracted log files
	LogsDir string
	// Size of the logs in bytes
	Size int64
	// Number of log files
	FileCount int
	// ID of the workflow run
	RunID int64
	// Name of the workflow
	WorkflowName string
	// Time when the logs were downloaded
	DownloadTime time.Time
	// Files in the logs directory
	Files []string
}

// ListWorkflowJobs lists jobs for a workflow run
func (a *ActionsOperations) ListWorkflowJobs(ctx context.Context, owner, repo string, runID interface{}, filter string, page, perPage int) (*github.Jobs, error) {
	// Validate owner and repo
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repository name cannot be empty")
	}
	
	// Handle different types of runID (can be int64 or string)
	var id int64
	
	switch v := runID.(type) {
	case int64:
		id = v
	case float64:
		id = int64(v)
	case int:
		id = int64(v)
	case string:
		if v == "" {
			return nil, errors.NewValidationError("run_id cannot be empty")
		}
		
		// Try to convert string to int64
		var err error
		id, err = strconv.ParseInt(v, 10, 64)
		if err != nil {
			return nil, errors.NewValidationError(fmt.Sprintf("run_id must be a valid number, got %s", v))
		}
	default:
		return nil, errors.NewValidationError(fmt.Sprintf("run_id must be a string or number, got %T", runID))
	}
	
	// Set default pagination values if not provided
	if page <= 0 {
		page = 1
	}
	if perPage <= 0 {
		perPage = 30
	} else if perPage > 100 {
		perPage = 100
	}
	
	// Create options for the API call
	opts := &github.ListWorkflowJobsOptions{
		ListOptions: github.ListOptions{
			Page:    page,
			PerPage: perPage,
		},
	}
	
	// Add filter if provided
	if filter != "" {
		opts.Filter = filter
	}
	
	// Call the GitHub API
	jobs, _, err := a.client.GetClient().Actions.ListWorkflowJobs(ctx, owner, repo, id, opts)
	if err != nil {
		return nil, a.client.HandleError(err)
	}
	
	return jobs, nil
}

// GetWorkflowJob gets detailed information about a specific job
func (a *ActionsOperations) GetWorkflowJob(ctx context.Context, owner, repo string, jobID interface{}) (*github.WorkflowJob, error) {
	// Validate owner and repo
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repository name cannot be empty")
	}
	
	// Handle different types of jobID (can be int64 or string)
	var id int64
	
	switch v := jobID.(type) {
	case int64:
		id = v
	case float64:
		id = int64(v)
	case int:
		id = int64(v)
	case string:
		if v == "" {
			return nil, errors.NewValidationError("job_id cannot be empty")
		}
		
		// Try to convert string to int64
		var err error
		id, err = strconv.ParseInt(v, 10, 64)
		if err != nil {
			return nil, errors.NewValidationError(fmt.Sprintf("job_id must be a valid number, got %s", v))
		}
	default:
		return nil, errors.NewValidationError(fmt.Sprintf("job_id must be a string or number, got %T", jobID))
	}
	
	// Call the GitHub API
	job, _, err := a.client.GetClient().Actions.GetWorkflowJobByID(ctx, owner, repo, id)
	if err != nil {
		return nil, a.client.HandleError(err)
	}
	
	return job, nil
}

// DownloadWorkflowRunLogs downloads and extracts logs for a workflow run
func (a *ActionsOperations) DownloadWorkflowRunLogs(ctx context.Context, owner, repo string, runID interface{}) (*LogsResult, error) {
	// Validate owner and repo
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repository name cannot be empty")
	}
	
	// Handle different types of runID (can be int64 or string)
	var id int64
	
	switch v := runID.(type) {
	case int64:
		id = v
	case float64:
		id = int64(v)
	case int:
		id = int64(v)
	case string:
		if v == "" {
			return nil, errors.NewValidationError("run_id cannot be empty")
		}
		
		// Try to convert string to int64
		var err error
		id, err = strconv.ParseInt(v, 10, 64)
		if err != nil {
			return nil, errors.NewValidationError(fmt.Sprintf("run_id must be a valid number, got %s", v))
		}
	default:
		return nil, errors.NewValidationError(fmt.Sprintf("run_id must be a string or number, got %T", runID))
	}
	
	// Get workflow run to get the workflow name
	run, err := a.GetWorkflowRun(ctx, owner, repo, id)
	if err != nil {
		return nil, err
	}
	
	// Create a temporary directory for the zip file
	tempZipDir, err := os.MkdirTemp("", "github-workflow-logs-zip-*")
	if err != nil {
		return nil, fmt.Errorf("failed to create temporary directory for zip file: %w", err)
	}
	defer os.RemoveAll(tempZipDir) // Clean up the zip directory when done
	
	// Create a temporary directory for the extracted logs
	logsDir, err := os.MkdirTemp("", fmt.Sprintf("github-workflow-logs-%s-%s-%d-*", owner, repo, id))
	if err != nil {
		return nil, fmt.Errorf("failed to create temporary directory for logs: %w", err)
	}
	
	// Create the zip file path
	zipFilePath := filepath.Join(tempZipDir, fmt.Sprintf("%s_%s_run_%d_logs.zip", owner, repo, id))
	
	// Get the URL to the logs
	a.logger.Infof("Getting workflow run logs URL for %s/%s run %d", owner, repo, id)
	logsURL, _, err := a.client.GetClient().Actions.GetWorkflowRunLogs(ctx, owner, repo, id, 0)
	if err != nil {
		os.RemoveAll(logsDir) // Clean up logs directory on error
		return nil, a.client.HandleError(err)
	}
	
	// Download the logs from the URL
	a.logger.Infof("Downloading workflow run logs from %s", logsURL.String())
	httpClient := a.client.GetClient().Client()
	resp, err := httpClient.Get(logsURL.String())
	if err != nil {
		os.RemoveAll(logsDir) // Clean up logs directory on error
		return nil, fmt.Errorf("failed to download logs: %w", err)
	}
	defer resp.Body.Close()
	
	// Check response status
	if resp.StatusCode != 200 {
		os.RemoveAll(logsDir) // Clean up logs directory on error
		return nil, fmt.Errorf("failed to download logs: HTTP %d", resp.StatusCode)
	}
	
	// Create the zip file
	zipFile, err := os.Create(zipFilePath)
	if err != nil {
		os.RemoveAll(logsDir) // Clean up logs directory on error
		return nil, fmt.Errorf("failed to create zip file: %w", err)
	}
	defer zipFile.Close()
	
	// Copy the response body to the zip file
	a.logger.Infof("Saving logs to %s", zipFilePath)
	size, err := io.Copy(zipFile, resp.Body)
	if err != nil {
		os.RemoveAll(logsDir) // Clean up logs directory on error
		return nil, fmt.Errorf("failed to download logs: %w", err)
	}
	
	// Close the zip file before extracting
	zipFile.Close()
	
	// Extract the zip file
	a.logger.Infof("Extracting workflow run logs to %s", logsDir)
	fileCount, extractedFiles, err := extractZip(zipFilePath, logsDir)
	if err != nil {
		os.RemoveAll(logsDir) // Clean up logs directory on error
		return nil, fmt.Errorf("failed to extract logs: %w", err)
	}
	
	return &LogsResult{
		LogsDir:      logsDir,
		Size:         size,
		FileCount:    fileCount,
		RunID:        id,
		WorkflowName: run.GetName(),
		DownloadTime: time.Now(),
		Files:        extractedFiles,
	}, nil
}

// extractZip extracts a zip file to a destination directory
func extractZip(zipFilePath, destDir string) (int, []string, error) {
	// Open the zip file
	reader, err := zip.OpenReader(zipFilePath)
	if err != nil {
		return 0, nil, fmt.Errorf("failed to open zip file: %w", err)
	}
	defer reader.Close()
	
	// Count the number of files and track their names
	fileCount := 0
	var extractedFiles []string
	
	// Extract each file
	for _, file := range reader.File {
		// Skip directories
		if file.FileInfo().IsDir() {
			continue
		}
		
		// Open the file in the zip
		rc, err := file.Open()
		if err != nil {
			return 0, nil, fmt.Errorf("failed to open file in zip: %w", err)
		}
		
		// Create the file path in the destination directory
		path := filepath.Join(destDir, file.Name)
		
		// Ensure the directory exists
		if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
			rc.Close()
			return 0, nil, fmt.Errorf("failed to create directory: %w", err)
		}
		
		// Create the file
		outFile, err := os.Create(path)
		if err != nil {
			rc.Close()
			return 0, nil, fmt.Errorf("failed to create file: %w", err)
		}
		
		// Copy the contents
		_, err = io.Copy(outFile, rc)
		outFile.Close()
		rc.Close()
		
		if err != nil {
			return 0, nil, fmt.Errorf("failed to write file: %w", err)
		}
		
		fileCount++
		extractedFiles = append(extractedFiles, file.Name)
	}
	
	return fileCount, extractedFiles, nil
}
