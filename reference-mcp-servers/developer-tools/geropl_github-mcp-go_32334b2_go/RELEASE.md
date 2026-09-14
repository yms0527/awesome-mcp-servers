# Release Process

This document outlines the complete process for creating a new release of the GitHub MCP Go project.

## Prerequisites

- GitHub access with push permissions to the repository
- Local clone of the repository with the latest changes
- Git configured with your credentials
- Understanding of semantic versioning (MAJOR.MINOR.PATCH)

## Release Process Steps

1. **Determine Version Number**
   - Follow semantic versioning principles:
     - MAJOR: Breaking changes
     - MINOR: New features (backward compatible)
     - PATCH: Bug fixes (backward compatible)
   - Example: If current version is 0.3.1 and adding a new feature, next version should be 0.4.0

2. **Update serverVersion in Code**
   - Modify the serverVersion variable in `cmd/serve.go` to match the new version
   - Example: Change `serverVersion := "0.3.1"` to `serverVersion := "0.4.0"`

3. **Update CHANGELOG.md**
   - Move content from "Unreleased" section to a new section for the new version
   - Add details about the new features, changes, or fixes
   - Include the current date for the release
   - Format:
     ```markdown
     ## [0.4.0] - YYYY-MM-DD

     ### Added
     - New feature description
     
     ### Changed
     - Change description
     
     ### Fixed
     - Bug fix description
     ```

4. **Update Memory Bank Files**
   - Update `activeContext.md` to reflect the new release and current focus
   - Update `progress.md` to include the release in the project status
   - Ensure any other relevant memory bank files are updated

5. **Stage and Commit Changes**
   - Stage all changes: `git add .`
   - Commit with appropriate message: `git commit -m "Release vX.Y.Z"`

6. **Create and Push Git Tag**
   - Create an annotated tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
   - Push the commit: `git push origin main`
   - Push the tag to trigger the GitHub Actions workflow: `git push origin vX.Y.Z`

7. **Verify Release**
   - Monitor the GitHub Actions workflow to ensure it completes successfully
   - Verify the release appears on GitHub with the correct binaries
   - Check that the version number is correct in the release

## Post-Release Tasks

1. **Verification Steps**
   - Verify that the GitHub Actions workflow completed successfully
   - Check that the release is available on the GitHub Releases page
   - Verify that the binaries are available for download
   - Ensure the release notes in GitHub match the CHANGELOG.md entry

2. **Error Handling**
   - If any errors occur during the release process, ask for help and offer to troubleshoot
   - Common issues might include:
     - GitHub Actions workflow failures
     - Permission issues when pushing to the repository
     - Tag conflicts if the version already exists
