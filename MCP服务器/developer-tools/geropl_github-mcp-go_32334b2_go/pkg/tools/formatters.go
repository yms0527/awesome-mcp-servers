package tools

import (
	"fmt"
	"strings"
	"time"

	ghClient "github.com/geropl/github-mcp-go/pkg/github"
	"github.com/google/go-github/v69/github"
)

// formatPullRequestToMarkdown converts a GitHub PullRequest to markdown
func formatPullRequestToMarkdown(pr *github.PullRequest) string {
	md := fmt.Sprintf("# Pull Request: %s\n\n", pr.GetTitle())
	md += fmt.Sprintf("**Number:** #%d  \n", pr.GetNumber())
	md += fmt.Sprintf("**State:** %s  \n", pr.GetState())
	md += fmt.Sprintf("**Created:** %s  \n", pr.GetCreatedAt().Format(time.RFC1123))
	md += fmt.Sprintf("**URL:** %s  \n\n", pr.GetHTMLURL())

	if pr.GetBody() != "" {
		md += fmt.Sprintf("## Description\n\n%s\n\n", pr.GetBody())
	}

	md += fmt.Sprintf("## Details\n\n")
	md += fmt.Sprintf("- **Head:** %s  \n", pr.GetHead().GetRef())
	md += fmt.Sprintf("- **Base:** %s  \n", pr.GetBase().GetRef())
	// Mergeable state might not be available immediately
	if pr.Mergeable != nil {
		md += fmt.Sprintf("- **Mergeable:** %t  \n", *pr.Mergeable)
	}
	md += fmt.Sprintf("- **Draft:** %t  \n", pr.GetDraft())
	md += fmt.Sprintf("- **Changes:** +%d/-%d in %d files  \n",
		pr.GetAdditions(), pr.GetDeletions(), pr.GetChangedFiles())

	return md
}

// formatRepositoryToMarkdown converts a GitHub Repository to markdown
func formatRepositoryToMarkdown(repo *github.Repository) string {
	md := fmt.Sprintf("# Repository: %s\n\n", repo.GetFullName())
	md += fmt.Sprintf("**URL:** %s  \n", repo.GetHTMLURL())

	if repo.GetDescription() != "" {
		md += fmt.Sprintf("**Description:** %s  \n", repo.GetDescription())
	}

	md += fmt.Sprintf("**Created:** %s  \n\n", repo.GetCreatedAt().Format(time.RFC1123))

	md += fmt.Sprintf("## Details\n\n")
	md += fmt.Sprintf("- **Default Branch:** %s  \n", repo.GetDefaultBranch())
	md += fmt.Sprintf("- **Stars:** %d  \n", repo.GetStargazersCount())
	md += fmt.Sprintf("- **Forks:** %d  \n", repo.GetForksCount())
	md += fmt.Sprintf("- **Open Issues:** %d  \n", repo.GetOpenIssuesCount())
	md += fmt.Sprintf("- **Private:** %t  \n", repo.GetPrivate())

	return md
}

// formatRepositorySearchToMarkdown converts GitHub repository search results to markdown
func formatRepositorySearchToMarkdown(result *github.RepositoriesSearchResult) string {
	md := fmt.Sprintf("# Repository Search Results\n\n")
	md += fmt.Sprintf("**Total Results:** %d\n\n", result.GetTotal())

	if len(result.Repositories) == 0 {
		md += "No repositories found.\n"
		return md
	}

	md += "## Repositories\n\n"

	for i, repo := range result.Repositories {
		md += fmt.Sprintf("### %d. [%s](%s)\n\n", i+1, repo.GetFullName(), repo.GetHTMLURL())

		if repo.GetDescription() != "" {
			md += fmt.Sprintf("%s\n\n", repo.GetDescription())
		}

		md += fmt.Sprintf("- **Stars:** %d\n", repo.GetStargazersCount())
		md += fmt.Sprintf("- **Language:** %s\n", repo.GetLanguage())
		md += fmt.Sprintf("- **Updated:** %s\n\n", repo.GetUpdatedAt().Format(time.RFC1123))
	}

	return md
}

// formatFileContentToMarkdown converts GitHub file content to markdown
func formatFileContentToMarkdown(content map[string]interface{}) string {
	md := fmt.Sprintf("# File: %s\n\n", content["path"])

	md += fmt.Sprintf("**Path:** %s  \n", content["path"])
	md += fmt.Sprintf("**Size:** %v bytes  \n", content["size"])
	md += fmt.Sprintf("**URL:** %s  \n\n", content["html_url"])

	if fileContent, ok := content["content"].(string); ok && fileContent != "" {
		// Determine if we should use a code block based on file extension
		path := content["path"].(string)
		extension := ""
		if lastDot := strings.LastIndex(path, "."); lastDot >= 0 {
			extension = path[lastDot+1:]
		}

		// Add content with appropriate formatting
		md += "## Content\n\n"
		if extension != "" {
			md += fmt.Sprintf("```%s\n%s\n```\n", extension, fileContent)
		} else {
			md += fmt.Sprintf("```\n%s\n```\n", fileContent)
		}
	}

	return md
}

// formatDirectoryContentToMarkdown converts GitHub directory content to markdown
func formatDirectoryContentToMarkdown(content map[string]interface{}) string {
	md := fmt.Sprintf("# Directory: %s\n\n", content["path"])

	contents, ok := content["contents"].([]map[string]interface{})
	if !ok {
		return md + "No contents found."
	}

	md += "## Contents\n\n"

	for i, item := range contents {
		itemType := item["type"].(string)
		name := item["name"].(string)
		htmlURL := item["html_url"].(string)

		if itemType == "dir" {
			md += fmt.Sprintf("%d. 📁 [%s](%s)  \n", i+1, name, htmlURL)
		} else {
			md += fmt.Sprintf("%d. 📄 [%s](%s)  \n", i+1, name, htmlURL)
		}
	}

	return md
}

// formatFileUpdateToMarkdown converts GitHub file update result to markdown
func formatFileUpdateToMarkdown(result *github.RepositoryContentResponse) string {
	md := fmt.Sprintf("# File Update: %s\n\n", result.GetContent().GetPath())

	md += fmt.Sprintf("**Path:** %s  \n", result.GetContent().GetPath())
	md += fmt.Sprintf("**SHA:** %s  \n", result.GetContent().GetSHA())
	md += fmt.Sprintf("**URL:** %s  \n\n", result.GetContent().GetHTMLURL())

	// Commit information is not directly accessible in RepositoryContentResponse
	// We'll just show the content information

	return md
}

// formatRepositoryCommitToMarkdown converts GitHub repository commit result to markdown
func formatRepositoryCommitToMarkdown(commit *github.RepositoryCommit) string {
	md := fmt.Sprintf("# Commit: %.7s\n\n", commit.GetSHA())

	md += fmt.Sprintf("**SHA:** %s  \n", commit.GetSHA())
	md += fmt.Sprintf("**Message:** %s  \n", commit.GetCommit().GetMessage())
	md += fmt.Sprintf("**URL:** %s  \n", commit.GetHTMLURL())

	// Get author information if available
	if author := commit.GetAuthor(); author != nil {
		md += fmt.Sprintf("**Author:** %s  \n", author.GetLogin())
	} else if commitAuthor := commit.GetCommit().GetAuthor(); commitAuthor != nil {
		md += fmt.Sprintf("**Author:** %s <%s>  \n", commitAuthor.GetName(), commitAuthor.GetEmail())
	}

	// Get committer information if available
	if committer := commit.GetCommitter(); committer != nil {
		md += fmt.Sprintf("**Committer:** %s  \n", committer.GetLogin())
	} else if commitCommitter := commit.GetCommit().GetCommitter(); commitCommitter != nil {
		md += fmt.Sprintf("**Committer:** %s <%s>  \n", commitCommitter.GetName(), commitCommitter.GetEmail())
	}

	md += fmt.Sprintf("**Date:** %s  \n\n", commit.GetCommit().GetCommitter().GetDate().Format(time.RFC1123))

	// Add stats if available
	if stats := commit.GetStats(); stats != nil {
		md += fmt.Sprintf("## Stats\n\n")
		md += fmt.Sprintf("**Additions:** %d  \n", stats.GetAdditions())
		md += fmt.Sprintf("**Deletions:** %d  \n", stats.GetDeletions())
		md += fmt.Sprintf("**Total Changes:** %d  \n\n", stats.GetTotal())
	}

	// Add files if available
	if len(commit.Files) > 0 {
		md += fmt.Sprintf("## Files Changed\n\n")
		for _, file := range commit.Files {
			md += fmt.Sprintf("- **%s** (%d changes: +%d/-%d)  \n",
				file.GetFilename(), file.GetChanges(), file.GetAdditions(), file.GetDeletions())
		}
		md += "\n"
	}

	return md
}

// formatCommitToMarkdown converts GitHub commit result to markdown
func formatCommitToMarkdown(result *github.Commit) string {
	md := fmt.Sprintf("# Commit: %.7s\n\n", result.GetSHA())

	md += fmt.Sprintf("**SHA:** %s  \n", result.GetSHA())
	md += fmt.Sprintf("**Message:** %s  \n", result.GetMessage())

	// Get author information if available
	if author := result.GetAuthor(); author != nil {
		md += fmt.Sprintf("**Author:** %s <%s>  \n", author.GetName(), author.GetEmail())
		if !author.GetDate().IsZero() {
			md += fmt.Sprintf("**Author Date:** %s  \n", author.GetDate().Format(time.RFC1123))
		}
	}

	// Get committer information if available
	if committer := result.GetCommitter(); committer != nil {
		md += fmt.Sprintf("**Committer:** %s <%s>  \n", committer.GetName(), committer.GetEmail())
		if !committer.GetDate().IsZero() {
			md += fmt.Sprintf("**Commit Date:** %s  \n", committer.GetDate().Format(time.RFC1123))
		}
	}

	if result.GetHTMLURL() != "" {
		md += fmt.Sprintf("**URL:** %s  \n\n", result.GetHTMLURL())
	}

	return md
}

// formatCommitListToMarkdown converts a list of GitHub commits to markdown
func formatCommitListToMarkdown(commits []*github.RepositoryCommit) string {
	md := fmt.Sprintf("# Commits\n\n")

	if len(commits) == 0 {
		md += "No commits found.\n"
		return md
	}

	md += fmt.Sprintf("Found %d commits.\n\n", len(commits))

	for i, commit := range commits {
		md += fmt.Sprintf("## %d. %.7s: %s\n\n", i+1, commit.GetSHA(),
			strings.Split(commit.GetCommit().GetMessage(), "\n")[0])

		md += fmt.Sprintf("**SHA:** %s  \n", commit.GetSHA())
		md += fmt.Sprintf("**URL:** %s  \n", commit.GetHTMLURL())

		// Get author information if available
		if author := commit.GetAuthor(); author != nil {
			md += fmt.Sprintf("**Author:** %s  \n", author.GetLogin())
		} else if commitAuthor := commit.GetCommit().GetAuthor(); commitAuthor != nil {
			md += fmt.Sprintf("**Author:** %s  \n", commitAuthor.GetName())
		}

		// Get date information
		if commitDate := commit.GetCommit().GetCommitter().GetDate(); !commitDate.IsZero() {
			md += fmt.Sprintf("**Date:** %s  \n", commitDate.Format(time.RFC1123))
		}

		// Add stats if available
		if stats := commit.GetStats(); stats != nil {
			md += fmt.Sprintf("**Changes:** +%d/-%d  \n", stats.GetAdditions(), stats.GetDeletions())
		}

		md += "\n"
	}

	return md
}

// formatCommitComparisonToMarkdown converts GitHub commit comparison to markdown
func formatCommitComparisonToMarkdown(comparison *github.CommitsComparison) string {
	md := fmt.Sprintf("# Commit Comparison\n\n")

	md += fmt.Sprintf("**Base Commit:** %s  \n", comparison.GetMergeBaseCommit().GetSHA())
	md += fmt.Sprintf("**Ahead By:** %d commits  \n", comparison.GetAheadBy())
	md += fmt.Sprintf("**Behind By:** %d commits  \n", comparison.GetBehindBy())
	md += fmt.Sprintf("**Status:** %s  \n", comparison.GetStatus())
	md += fmt.Sprintf("**URL:** %s  \n\n", comparison.GetHTMLURL())

	// Add stats
	md += fmt.Sprintf("## Stats\n\n")
	md += fmt.Sprintf("**Total Commits:** %d  \n", comparison.GetTotalCommits())
	md += fmt.Sprintf("**Files Changed:** %d  \n", len(comparison.Files))

	// Calculate total additions and deletions
	totalAdditions := 0
	totalDeletions := 0
	for _, file := range comparison.Files {
		totalAdditions += file.GetAdditions()
		totalDeletions += file.GetDeletions()
	}
	md += fmt.Sprintf("**Additions:** %d  \n", totalAdditions)
	md += fmt.Sprintf("**Deletions:** %d  \n\n", totalDeletions)

	// Add commits
	if len(comparison.Commits) > 0 {
		md += fmt.Sprintf("## Commits\n\n")
		for i, commit := range comparison.Commits {
			md += fmt.Sprintf("%d. %.7s: %s  \n", i+1, commit.GetSHA(),
				strings.Split(commit.GetCommit().GetMessage(), "\n")[0])
		}
		md += "\n"
	}

	// Add files
	if len(comparison.Files) > 0 {
		md += fmt.Sprintf("## Files Changed\n\n")
		for _, file := range comparison.Files {
			md += fmt.Sprintf("- **%s** (%d changes: +%d/-%d)  \n",
				file.GetFilename(), file.GetChanges(), file.GetAdditions(), file.GetDeletions())
		}
		md += "\n"
	}

	return md
}

// formatCommitStatusToMarkdown converts GitHub commit status to markdown
func formatCommitStatusToMarkdown(status *github.CombinedStatus) string {
	md := fmt.Sprintf("# Commit Status\n\n")

	md += fmt.Sprintf("**SHA:** %s  \n", status.GetSHA())
	md += fmt.Sprintf("**State:** %s  \n", status.GetState())
	md += fmt.Sprintf("**Total Count:** %d  \n\n", status.GetTotalCount())

	// Add statuses
	if len(status.Statuses) > 0 {
		md += fmt.Sprintf("## Status Details\n\n")
		for i, s := range status.Statuses {
			md += fmt.Sprintf("### %d. %s\n\n", i+1, s.GetContext())
			md += fmt.Sprintf("**State:** %s  \n", s.GetState())
			md += fmt.Sprintf("**Description:** %s  \n", s.GetDescription())
			if s.GetTargetURL() != "" {
				md += fmt.Sprintf("**Target URL:** %s  \n", s.GetTargetURL())
			}
			md += fmt.Sprintf("**Updated:** %s  \n\n", s.GetUpdatedAt().Format(time.RFC1123))
		}
	}

	return md
}

// formatCommitCommentToMarkdown converts GitHub commit comment to markdown
func formatCommitCommentToMarkdown(comment *github.RepositoryComment) string {
	md := fmt.Sprintf("# Commit Comment\n\n")

	md += fmt.Sprintf("**ID:** %d  \n", comment.GetID())
	md += fmt.Sprintf("**Author:** %s  \n", comment.GetUser().GetLogin())
	md += fmt.Sprintf("**Created:** %s  \n", comment.GetCreatedAt().Format(time.RFC1123))

	// Check if the comment has been updated
	createdAt := comment.GetCreatedAt()
	updatedAt := comment.GetUpdatedAt()
	if !createdAt.Equal(updatedAt) {
		md += fmt.Sprintf("**Updated:** %s  \n", updatedAt.Format(time.RFC1123))
	}

	md += fmt.Sprintf("**URL:** %s  \n\n", comment.GetHTMLURL())

	// Add path and position if available
	if comment.GetPath() != "" {
		md += fmt.Sprintf("**Path:** %s  \n", comment.GetPath())
	}
	if comment.GetPosition() != 0 {
		md += fmt.Sprintf("**Position:** %d  \n\n", comment.GetPosition())
	}

	if comment.GetBody() != "" {
		md += fmt.Sprintf("## Content\n\n%s\n\n", comment.GetBody())
	}

	return md
}

// formatCommitCommentListToMarkdown converts a list of GitHub commit comments to markdown
func formatCommitCommentListToMarkdown(comments []*github.RepositoryComment) string {
	md := fmt.Sprintf("# Commit Comments\n\n")

	if len(comments) == 0 {
		md += "No comments found.\n"
		return md
	}

	md += fmt.Sprintf("Found %d comments.\n\n", len(comments))

	for i, comment := range comments {
		md += fmt.Sprintf("## %d. Comment by %s\n\n", i+1, comment.GetUser().GetLogin())
		md += fmt.Sprintf("**Created:** %s  \n", comment.GetCreatedAt().Format(time.RFC1123))

		// Check if the comment has been updated
		createdAt := comment.GetCreatedAt()
		updatedAt := comment.GetUpdatedAt()
		if !createdAt.Equal(updatedAt) {
			md += fmt.Sprintf("**Updated:** %s  \n", updatedAt.Format(time.RFC1123))
		}

		md += fmt.Sprintf("**URL:** %s  \n", comment.GetHTMLURL())

		// Add path and position if available
		if comment.GetPath() != "" {
			md += fmt.Sprintf("**Path:** %s  \n", comment.GetPath())
		}
		if comment.GetPosition() != 0 {
			md += fmt.Sprintf("**Position:** %d  \n", comment.GetPosition())
		}

		md += "\n"

		if comment.GetBody() != "" {
			body := comment.GetBody()
			if len(body) > 200 {
				body = truncateString(body, 200) + "..."
			}
			md += fmt.Sprintf("%s\n\n", body)
		}
	}

	return md
}

// formatPullRequestDiffToMarkdown formats a pull request diff as markdown
func formatPullRequestDiffToMarkdown(number int, diff string) string {
	md := fmt.Sprintf("# Pull Request Diff (#%d)\n\n", number)

	// Truncate diff if it's too long
	const maxDiffLength = 10000
	if len(diff) > maxDiffLength {
		diff = truncateString(diff, maxDiffLength) + "\n\n... (diff truncated due to size)"
	}

	md += "```diff\n" + diff + "\n```\n"

	return md
}

// formatIssueToMarkdown converts a GitHub Issue to markdown
func formatIssueToMarkdown(issue *github.Issue) string {
	md := fmt.Sprintf("# Issue: %s\n\n", issue.GetTitle())
	md += fmt.Sprintf("**Number:** #%d  \n", issue.GetNumber())
	md += fmt.Sprintf("**State:** %s  \n", issue.GetState())
	md += fmt.Sprintf("**Created:** %s  \n", issue.GetCreatedAt().Format(time.RFC1123))

	// Check if the issue is closed by checking if ClosedAt is not the zero value
	closedAt := issue.GetClosedAt()
	if !closedAt.IsZero() {
		md += fmt.Sprintf("**Closed:** %s  \n", closedAt.Format(time.RFC1123))
	}

	md += fmt.Sprintf("**URL:** %s  \n\n", issue.GetHTMLURL())

	if issue.GetBody() != "" {
		md += fmt.Sprintf("## Description\n\n%s\n\n", issue.GetBody())
	}

	md += fmt.Sprintf("## Details\n\n")

	// Add labels if present
	if len(issue.Labels) > 0 {
		md += "**Labels:**  \n"
		for _, label := range issue.Labels {
			md += fmt.Sprintf("- %s  \n", label.GetName())
		}
		md += "\n"
	}

	// Add assignees if present
	if len(issue.Assignees) > 0 {
		md += "**Assignees:**  \n"
		for _, assignee := range issue.Assignees {
			md += fmt.Sprintf("- %s  \n", assignee.GetLogin())
		}
		md += "\n"
	}

	// Add milestone if present
	if issue.Milestone != nil {
		md += fmt.Sprintf("**Milestone:** %s  \n\n", issue.GetMilestone().GetTitle())
	}

	// Add comments count
	md += fmt.Sprintf("**Comments:** %d  \n", issue.GetComments())

	return md
}

// formatIssueListToMarkdown converts a list of GitHub Issues to markdown
func formatIssueListToMarkdown(issues []*github.Issue) string {
	md := fmt.Sprintf("# Issues\n\n")

	if len(issues) == 0 {
		md += "No issues found.\n"
		return md
	}

	md += fmt.Sprintf("Found %d issues.\n\n", len(issues))

	for i, issue := range issues {
		md += fmt.Sprintf("## %d. %s\n\n", i+1, issue.GetTitle())
		md += fmt.Sprintf("**Number:** #%d  \n", issue.GetNumber())
		md += fmt.Sprintf("**State:** %s  \n", issue.GetState())
		md += fmt.Sprintf("**Created:** %s  \n", issue.GetCreatedAt().Format(time.RFC1123))
		md += fmt.Sprintf("**URL:** %s  \n\n", issue.GetHTMLURL())

		// Add a short preview of the body if present
		if issue.GetBody() != "" {
			body := issue.GetBody()
			if len(body) > 100 {
				body = truncateString(body, 100) + "..."
			}
			md += fmt.Sprintf("%s\n\n", body)
		}

		// Add labels if present
		if len(issue.Labels) > 0 {
			md += "**Labels:** "
			for j, label := range issue.Labels {
				if j > 0 {
					md += ", "
				}
				md += label.GetName()
			}
			md += "  \n"
		}

		// Add comments count
		md += fmt.Sprintf("**Comments:** %d  \n\n", issue.GetComments())
	}

	return md
}

// formatIssueCommentToMarkdown converts a GitHub IssueComment to markdown
func formatIssueCommentToMarkdown(comment *github.IssueComment) string {
	md := fmt.Sprintf("# Comment on Issue\n\n")

	md += fmt.Sprintf("**ID:** %d  \n", comment.GetID())
	md += fmt.Sprintf("**Author:** %s  \n", comment.GetUser().GetLogin())
	md += fmt.Sprintf("**Created:** %s  \n", comment.GetCreatedAt().Format(time.RFC1123))

	// Check if the comment has been updated
	createdAt := comment.GetCreatedAt()
	updatedAt := comment.GetUpdatedAt()
	if !createdAt.Equal(updatedAt) {
		md += fmt.Sprintf("**Updated:** %s  \n", updatedAt.Format(time.RFC1123))
	}

	md += fmt.Sprintf("**URL:** %s  \n\n", comment.GetHTMLURL())

	if comment.GetBody() != "" {
		md += fmt.Sprintf("## Content\n\n%s\n\n", comment.GetBody())
	}

	return md
}

// formatIssueCommentListToMarkdown converts a list of GitHub IssueComments to markdown
func formatIssueCommentListToMarkdown(comments []*github.IssueComment) string {
	md := fmt.Sprintf("# Issue Comments\n\n")

	if len(comments) == 0 {
		md += "No comments found.\n"
		return md
	}

	md += fmt.Sprintf("Found %d comments.\n\n", len(comments))

	for i, comment := range comments {
		md += fmt.Sprintf("## %d. Comment by %s\n\n", i+1, comment.GetUser().GetLogin())
		md += fmt.Sprintf("**Created:** %s  \n", comment.GetCreatedAt().Format(time.RFC1123))

		// Check if the comment has been updated
		createdAt := comment.GetCreatedAt()
		updatedAt := comment.GetUpdatedAt()
		if !createdAt.Equal(updatedAt) {
			md += fmt.Sprintf("**Updated:** %s  \n", updatedAt.Format(time.RFC1123))
		}

		md += fmt.Sprintf("**URL:** %s  \n\n", comment.GetHTMLURL())

		if comment.GetBody() != "" {
			body := comment.GetBody()
			if len(body) > 200 {
				body = truncateString(body, 200) + "..."
			}
			md += fmt.Sprintf("%s\n\n", body)
		}
	}

	return md
}

// formatBranchToMarkdown converts a GitHub Branch to markdown
func formatBranchToMarkdown(branch *github.Branch) string {
	md := fmt.Sprintf("# Branch: %s\n\n", branch.GetName())

	md += fmt.Sprintf("**Name:** %s  \n", branch.GetName())
	md += fmt.Sprintf("**SHA:** %s  \n", branch.GetCommit().GetSHA())

	// Add protection status
	if branch.GetProtected() {
		md += fmt.Sprintf("**Protected:** Yes  \n")
	} else {
		md += fmt.Sprintf("**Protected:** No  \n")
	}

	return md
}

// formatBranchListToMarkdown converts a list of GitHub Branches to markdown
func formatBranchListToMarkdown(branches []*github.Branch) string {
	md := fmt.Sprintf("# Branches\n\n")

	if len(branches) == 0 {
		md += "No branches found.\n"
		return md
	}

	md += fmt.Sprintf("Found %d branches.\n\n", len(branches))

	for i, branch := range branches {
		md += fmt.Sprintf("## %d. %s\n\n", i+1, branch.GetName())
		md += fmt.Sprintf("**SHA:** %s  \n", branch.GetCommit().GetSHA())

		// Add protection status
		if branch.GetProtected() {
			md += fmt.Sprintf("**Protected:** Yes  \n")
		} else {
			md += fmt.Sprintf("**Protected:** No  \n")
		}

		md += "\n"
	}

	return md
}

// formatReferenceToMarkdown converts a GitHub Reference (used for branch creation) to markdown
func formatReferenceToMarkdown(ref *github.Reference) string {
	md := fmt.Sprintf("# Reference: %s\n\n", ref.GetRef())

	// Extract branch name from ref (refs/heads/branch-name)
	branchName := strings.TrimPrefix(ref.GetRef(), "refs/heads/")

	md += fmt.Sprintf("**Branch Name:** %s  \n", branchName)
	md += fmt.Sprintf("**Full Reference:** %s  \n", ref.GetRef())
	md += fmt.Sprintf("**SHA:** %s  \n", ref.GetObject().GetSHA())
	md += fmt.Sprintf("**Type:** %s  \n", ref.GetObject().GetType())
	md += fmt.Sprintf("**URL:** %s  \n", ref.GetURL())

	return md
}

// formatMergeResultToMarkdown converts a GitHub merge result to markdown
func formatMergeResultToMarkdown(commit *github.RepositoryCommit) string {
	md := fmt.Sprintf("# Merge Result\n\n")

	md += fmt.Sprintf("**SHA:** %s  \n", commit.GetSHA())
	md += fmt.Sprintf("**Message:** %s  \n", commit.GetCommit().GetMessage())
	md += fmt.Sprintf("**URL:** %s  \n", commit.GetHTMLURL())

	// Get author information if available
	if author := commit.GetAuthor(); author != nil {
		md += fmt.Sprintf("**Author:** %s  \n", author.GetLogin())
	} else if commitAuthor := commit.GetCommit().GetAuthor(); commitAuthor != nil {
		md += fmt.Sprintf("**Author:** %s <%s>  \n", commitAuthor.GetName(), commitAuthor.GetEmail())
	}

	// Get committer information if available
	if committer := commit.GetCommitter(); committer != nil {
		md += fmt.Sprintf("**Committer:** %s  \n", committer.GetLogin())
	} else if commitCommitter := commit.GetCommit().GetCommitter(); commitCommitter != nil {
		md += fmt.Sprintf("**Committer:** %s <%s>  \n", commitCommitter.GetName(), commitCommitter.GetEmail())
	}

	md += fmt.Sprintf("**Date:** %s  \n\n", commit.GetCommit().GetCommitter().GetDate().Format(time.RFC1123))

	// Add stats if available
	if stats := commit.GetStats(); stats != nil {
		md += fmt.Sprintf("## Stats\n\n")
		md += fmt.Sprintf("**Additions:** %d  \n", stats.GetAdditions())
		md += fmt.Sprintf("**Deletions:** %d  \n", stats.GetDeletions())
		md += fmt.Sprintf("**Total Changes:** %d  \n\n", stats.GetTotal())
	}

	// Add files if available
	if len(commit.Files) > 0 {
		md += fmt.Sprintf("## Files Changed\n\n")
		for _, file := range commit.Files {
			md += fmt.Sprintf("- **%s** (%d changes: +%d/-%d)  \n",
				file.GetFilename(), file.GetChanges(), file.GetAdditions(), file.GetDeletions())
		}
		md += "\n"
	}

	return md
}

// formatCodeSearchToMarkdown formats a code search result as markdown
func formatCodeSearchToMarkdown(result *ghClient.CodeSearchResult) string {
	var sb strings.Builder

	sb.WriteString("# Code Search Results\n\n")
	sb.WriteString(fmt.Sprintf("**Total Results:** %d\n\n", result.TotalCount))

	if result.IncompleteResults {
		sb.WriteString("**Note:** Results may be incomplete due to GitHub API limitations.\n\n")
	}

	if len(result.Items) == 0 {
		sb.WriteString("No code matches found.\n")
		return sb.String()
	}

	sb.WriteString("## Matches\n\n")

	for i, item := range result.Items {
		repo := item.GetRepository()
		repoName := repo.GetFullName()
		path := item.GetPath()
		url := item.GetHTMLURL()

		sb.WriteString(fmt.Sprintf("### %d. [%s/%s](%s)\n\n", i+1, repoName, path, url))

		// Add file details
		sb.WriteString(fmt.Sprintf("**Repository:** [%s](%s)\n", repoName, repo.GetHTMLURL()))
		sb.WriteString(fmt.Sprintf("**Path:** %s\n", path))

		// Add file name
		sb.WriteString(fmt.Sprintf("**File:** %s\n", path))

		// Add code snippet if available
		sb.WriteString("\n**Preview:**\n\n")
		sb.WriteString("```\n")
		sb.WriteString(item.GetName()) // Use name as a simple preview
		sb.WriteString("\n```\n\n")

		sb.WriteString("\n")
	}

	return sb.String()
}

// formatIssueSearchToMarkdown formats an issue search result as markdown
func formatIssueSearchToMarkdown(result *ghClient.IssueSearchResult) string {
	var sb strings.Builder

	sb.WriteString("# Issue Search Results\n\n")
	sb.WriteString(fmt.Sprintf("**Total Results:** %d\n\n", result.TotalCount))

	if result.IncompleteResults {
		sb.WriteString("**Note:** Results may be incomplete due to GitHub API limitations.\n\n")
	}

	if len(result.Items) == 0 {
		sb.WriteString("No issues found.\n")
		return sb.String()
	}

	sb.WriteString("## Issues\n\n")

	for i, issue := range result.Items {
		number := issue.GetNumber()
		title := issue.GetTitle()
		url := issue.GetHTMLURL()
		state := issue.GetState()
		repo := issue.GetRepository()
		repoName := repo.GetFullName()
		createdAt := issue.GetCreatedAt().Format(time.RFC1123)

		// Determine if it's an issue or PR
		isPR := issue.PullRequestLinks != nil
		typeStr := "Issue"
		if isPR {
			typeStr = "Pull Request"
		}

		sb.WriteString(fmt.Sprintf("### %d. [%s #%d: %s](%s)\n\n", i+1, typeStr, number, title, url))

		// Add issue details
		sb.WriteString(fmt.Sprintf("**Repository:** [%s](%s)  \n", repoName, repo.GetHTMLURL()))
		sb.WriteString(fmt.Sprintf("**State:** %s  \n", state))
		sb.WriteString(fmt.Sprintf("**Created:** %s  \n", createdAt))

		// Add labels if present
		if len(issue.Labels) > 0 {
			sb.WriteString("**Labels:** ")
			for j, label := range issue.Labels {
				if j > 0 {
					sb.WriteString(", ")
				}
				sb.WriteString(label.GetName())
			}
			sb.WriteString("  \n")
		}

		// Add a short preview of the body if present
		if issue.GetBody() != "" {
			body := issue.GetBody()
			if len(body) > 200 {
				body = truncateString(body, 200) + "..."
			}
			sb.WriteString(fmt.Sprintf("\n%s\n\n", body))
		}

		sb.WriteString("\n")
	}

	return sb.String()
}

// formatCommitSearchToMarkdown formats a commit search result as markdown
func formatCommitSearchToMarkdown(result *ghClient.CommitSearchResult) string {
	var sb strings.Builder

	sb.WriteString("# Commit Search Results\n\n")
	sb.WriteString(fmt.Sprintf("**Total Results:** %d\n\n", result.TotalCount))

	if result.IncompleteResults {
		sb.WriteString("**Note:** Results may be incomplete due to GitHub API limitations.\n\n")
	}

	if len(result.Items) == 0 {
		sb.WriteString("No commit matches found.\n")
		return sb.String()
	}

	sb.WriteString("## Commits\n\n")

	for i, item := range result.Items {
		repo := item.GetRepository()
		repoName := repo.GetFullName()
		sha := item.GetSHA()
		url := item.GetHTMLURL()
		message := item.GetCommit().GetMessage()

		// Get the first line of the commit message
		messageFirstLine := message
		if idx := strings.Index(message, "\n"); idx > 0 {
			messageFirstLine = message[:idx]
		}

		sb.WriteString(fmt.Sprintf("### %d. [%s @ %s](%s)\n\n", i+1, repoName, sha[:7], url))

		// Add commit details
		sb.WriteString(fmt.Sprintf("**Repository:** [%s](%s)\n", repoName, repo.GetHTMLURL()))
		sb.WriteString(fmt.Sprintf("**SHA:** %s\n", sha))
		sb.WriteString(fmt.Sprintf("**Message:** %s\n", messageFirstLine))

		// Add author information if available
		author := item.GetAuthor()
		if author != nil {
			sb.WriteString(fmt.Sprintf("**Author:** [%s](%s)\n", author.GetLogin(), author.GetHTMLURL()))
		}

		// Add commit date
		if item.GetCommit().GetAuthor() != nil {
			date := item.GetCommit().GetAuthor().GetDate()
			sb.WriteString(fmt.Sprintf("**Date:** %s\n", date.Format(time.RFC3339)))
		}

		sb.WriteString("\n")
	}

	return sb.String()
}

func truncateString(s string, maxLength int) string {
	if maxLength <= 0 {
		return ""
	}

	// Convert to rune slice to properly handle Unicode characters
	runes := []rune(s)

	// If string is already shorter than max length, return it as is
	if len(runes) <= maxLength {
		return s
	}

	// Return truncated string with proper Unicode handling
	return string(runes[:maxLength])
}
