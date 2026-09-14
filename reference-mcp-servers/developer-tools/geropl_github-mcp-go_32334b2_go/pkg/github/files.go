package github

import (
	"context"
	"encoding/base64"

	"github.com/google/go-github/v69/github"
	"github.com/sirupsen/logrus"

	"github.com/geropl/github-mcp-go/pkg/errors"
)

// FileOperations handles file-related operations
type FileOperations struct {
	client *Client
	logger *logrus.Logger
}

// NewFileOperations creates a new FileOperations
func NewFileOperations(client *Client, logger *logrus.Logger) *FileOperations {
	return &FileOperations{
		client: client,
		logger: logger,
	}
}

// GetFileContents gets the contents of a file or directory
func (f *FileOperations) GetFileContents(ctx context.Context, owner, repo, path, branch string) (interface{}, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if path == "" {
		return nil, errors.NewValidationError("path cannot be empty")
	}

	// Set up options
	opts := &github.RepositoryContentGetOptions{}
	if branch != "" {
		opts.Ref = branch
	}

	// Get file contents
	fileContent, directoryContent, _, err := f.client.GetClient().Repositories.GetContents(ctx, owner, repo, path, opts)
	if err != nil {
		return nil, f.client.HandleError(err)
	}

	// If it's a directory, return the directory contents
	if directoryContent != nil {
		return directoryContent, nil
	}

	// If it's a file, return the file content
	return fileContent, nil
}

// CreateOrUpdateFile creates or updates a file
func (f *FileOperations) CreateOrUpdateFile(ctx context.Context, owner, repo, path, content, message, branch, sha string) (*github.RepositoryContentResponse, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if path == "" {
		return nil, errors.NewValidationError("path cannot be empty")
	}
	if content == "" {
		return nil, errors.NewValidationError("content cannot be empty")
	}
	if message == "" {
		return nil, errors.NewValidationError("message cannot be empty")
	}

	// Set up options
	opts := &github.RepositoryContentFileOptions{
		Message: github.Ptr(message),
		Content: []byte(content),
	}
	if branch != "" {
		opts.Branch = github.Ptr(branch)
	}
	if sha != "" {
		opts.SHA = github.Ptr(sha)
	}

	// Create or update file
	response, _, err := f.client.GetClient().Repositories.CreateFile(ctx, owner, repo, path, opts)
	if err != nil {
		return nil, f.client.HandleError(err)
	}

	return response, nil
}

// PushFiles pushes multiple files in a single commit
type FileToCommit struct {
	Path    string
	Content string
}

// PushFiles pushes multiple files in a single commit
func (f *FileOperations) PushFiles(ctx context.Context, owner, repo, branch string, files []FileToCommit, message string) (*github.RepositoryCommit, error) {
	// Validate parameters
	if owner == "" {
		return nil, errors.NewValidationError("owner cannot be empty")
	}
	if repo == "" {
		return nil, errors.NewValidationError("repo cannot be empty")
	}
	if branch == "" {
		return nil, errors.NewValidationError("branch cannot be empty")
	}
	if len(files) == 0 {
		return nil, errors.NewValidationError("files cannot be empty")
	}
	if message == "" {
		return nil, errors.NewValidationError("message cannot be empty")
	}

	// Get the reference
	ref, _, err := f.client.GetClient().Git.GetRef(ctx, owner, repo, "refs/heads/"+branch)
	if err != nil {
		return nil, f.client.HandleError(err)
	}

	// Get the tree based on the reference
	tree, _, err := f.client.GetClient().Git.GetTree(ctx, owner, repo, *ref.Object.SHA, false)
	if err != nil {
		return nil, f.client.HandleError(err)
	}

	// Create a new tree with the files
	entries := []*github.TreeEntry{}
	for _, file := range files {
		entries = append(entries, &github.TreeEntry{
			Path:    github.Ptr(file.Path),
			Mode:    github.Ptr("100644"),
			Type:    github.Ptr("blob"),
			Content: github.Ptr(file.Content),
		})
	}

	newTree, _, err := f.client.GetClient().Git.CreateTree(ctx, owner, repo, *tree.SHA, entries)
	if err != nil {
		return nil, f.client.HandleError(err)
	}

	// Get the parent commit
	parent, _, err := f.client.GetClient().Repositories.GetCommit(ctx, owner, repo, *ref.Object.SHA, nil)
	if err != nil {
		return nil, f.client.HandleError(err)
	}

	// Create the commit
	newCommit, _, err := f.client.GetClient().Git.CreateCommit(ctx, owner, repo, &github.Commit{
		Message: github.String(message),
		Tree:    newTree,
		Parents: []*github.Commit{{SHA: parent.SHA}},
	}, &github.CreateCommitOptions{})
	if err != nil {
		return nil, f.client.HandleError(err)
	}

	// Update the reference
	ref.Object.SHA = newCommit.SHA
	_, _, err = f.client.GetClient().Git.UpdateRef(ctx, owner, repo, ref, false)
	if err != nil {
		return nil, f.client.HandleError(err)
	}

	// Get the commit
	commit, _, err := f.client.GetClient().Repositories.GetCommit(ctx, owner, repo, *newCommit.SHA, nil)
	if err != nil {
		return nil, f.client.HandleError(err)
	}

	return commit, nil
}

// DecodeFileContent decodes the base64-encoded content of a file
func (f *FileOperations) DecodeFileContent(content *github.RepositoryContent) (string, error) {
	if content.Content == nil {
		return "", errors.NewInternalError("file content is nil")
	}

	decoded, err := base64.StdEncoding.DecodeString(*content.Content)
	if err != nil {
		return "", errors.NewInternalError("failed to decode file content: " + err.Error())
	}

	return string(decoded), nil
}
