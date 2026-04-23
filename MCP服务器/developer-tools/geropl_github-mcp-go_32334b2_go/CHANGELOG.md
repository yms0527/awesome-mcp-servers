# Changelog

All notable changes to the GitHub MCP Go project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2025-03-19

### Added
- Multi-tool support for the GitHub MCP Server setup command:
  - Added support for Roo Code alongside existing Cline and Claude Desktop support
  - Modified the setup command to accept a comma-separated list of tools
  - Implemented error handling to continue processing other tools if one fails
  - Added comprehensive testing with proper test environment isolation

## [0.3.1] - 2025-03-17

### Fixed
- Added missing GitHub Actions tools to the read-only tools list:
  - `get_workflow`
  - `list_workflow_runs`
  - `get_workflow_run`
  - `download_workflow_run_logs`
  - `list_workflow_jobs`
  - `get_workflow_job`
- This ensures all GitHub Actions tools are properly auto-approved when using `--auto-approve allow-read-only`

## [0.3.0] - 2025-03-17

### Added
- GitHub Actions tools for interacting with workflows:
  - `list_workflows`: List all workflows in a repository
  - `get_workflow`: Get detailed information about a specific workflow
  - `list_workflow_runs`: List workflow runs for a repository or specific workflow
  - `get_workflow_run`: Get detailed information about a specific workflow run
  - `download_workflow_run_logs`: Download and process logs for a workflow run
  - `list_workflow_jobs`: List jobs for a workflow run
  - `get_workflow_job`: Get detailed information about a specific job
- Added all GitHub Actions tools to the read-only tools list

## [0.2.1] - 2025-03-13

### Added
- Minimal Gitpod configuration for improved development experience

### Fixed
- GitHub client construction to properly configure the token

## [0.2.0] - 2025-03-12

### Added
- GitHub release workflow for automated binary builds and releases
- Command-line interface using Cobra
- Setup command for easy installation and configuration
  - Support for Cline and Claude Desktop
  - Auto-approval options for tools
  - Token management
- Tool classification system for auto-approval
  - Read-only tools classification
- Write access control for remote operations
  - `--write-access` flag for serve command
  - `--write-access` flag for setup command
  - Security controls to prevent accidental remote modifications

## [0.1.0] - Initial Release

### Added
- Core server functionality
- GitHub client integration
- Repository operations tools
  - `search_repositories`: Search for GitHub repositories
  - `create_repository`: Create a new GitHub repository
  - `fork_repository`: Fork a GitHub repository
- Pull request operations tools
  - `create_pull_request`: Create a new pull request
  - `get_pull_request`: Get detailed information about a pull request
  - `get_pull_request_diff`: Get the diff of a pull request
- File operations tools
  - `get_file_contents`: Get contents of a file or directory
  - `create_or_update_file`: Create or update a single file
  - `push_files`: Push multiple files in a single commit
- Issue operations tools
  - `create_issue`: Create a new issue
  - `list_issues`: List issues with filtering options
  - `update_issue`: Update an existing issue
  - `add_issue_comment`: Add a comment to an issue
  - `get_issue`: Get details of a specific issue
- Branch operations tools
  - `list_branches`: List branches in a repository
  - `get_branch`: Get details about a specific branch
  - `create_branch`: Create a new branch
  - `merge_branches`: Merge one branch into another
  - `delete_branch`: Delete a branch
- Search operations tools
  - `search_code`: Search for code across repositories
  - `search_issues`: Search for issues and pull requests
  - `search_commits`: Search for commits
- Commit operations tools
  - `get_commit`: Get details of a specific commit
  - `list_commits`: List commits in a repository
  - `compare_commits`: Compare two commits or branches
  - `get_commit_status`: Get the combined status for a specific commit
  - `create_commit_comment`: Add a comment to a specific commit
  - `list_commit_comments`: List comments for a specific commit
  - `create_commit`: Create a new commit directly
- Testing framework with go-vcr and golden files
