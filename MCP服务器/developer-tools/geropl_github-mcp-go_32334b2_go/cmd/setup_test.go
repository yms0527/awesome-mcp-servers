package cmd

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
	"testing"

	"github.com/google/go-cmp/cmp"
)

// Define expectation types
type fileExpectation struct {
	path      string
	content   string
	mustExist bool
}

type expectations struct {
	files     map[string]fileExpectation
	errors    []string
	exitCode  int
}

// testCase represents a single test case for the setup command
type testCase struct {
	name              string
	toolParam         string
	writeAccess       bool
	autoApprove       string
	preExistingConfig string // JSON content to write to config file before running setup
	expect            expectations
}

// TestSetupCommand tests the setup command with various combinations of parameters
func TestSetupCommand(t *testing.T) {
	// Build the binary
	binaryPath, err := buildBinary()
	if err != nil {
		t.Fatalf("Failed to build binary: %v", err)
	}
	defer os.RemoveAll(filepath.Dir(binaryPath))

	// Define test cases
	testCases := []testCase{
		{
			name:        "Cline Only",
			toolParam:   "cline",
			writeAccess: true,
			autoApprove: "allow-read-only",
			expect: expectations{
				files: map[string]fileExpectation{
					"cline": {
						path:      "home/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json",
						mustExist: true,
						content: `{
							"mcpServers": {
								"github": {
									"args": ["serve", "--write-access=true"],
									"autoApprove": ["search_repositories", "search_code", "search_issues", "search_commits", "get_file_contents", "get_issue", "list_issues", "list_issue_comments", "get_pull_request", "get_pull_request_diff", "get_commit", "list_commits", "compare_commits", "get_commit_status", "list_commit_comments", "list_branches", "get_branch", "list_workflows", "get_workflow", "list_workflow_runs", "get_workflow_run", "download_workflow_run_logs", "list_workflow_jobs", "get_workflow_job"],
									"disabled": false
								}
							}
						}`,
					},
				},
				exitCode: 0,
			},
		},
		{
			name:        "Roo Code Only",
			toolParam:   "roo-code",
			writeAccess: true,
			autoApprove: "allow-read-only",
			expect: expectations{
				files: map[string]fileExpectation{
					"roo-code": {
						path:      "home/.vscode-server/data/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json",
						mustExist: true,
						content: `{
							"mcpServers": {
								"github": {
									"args": ["serve", "--write-access=true"],
									"autoApprove": ["search_repositories", "search_code", "search_issues", "search_commits", "get_file_contents", "get_issue", "list_issues", "list_issue_comments", "get_pull_request", "get_pull_request_diff", "get_commit", "list_commits", "compare_commits", "get_commit_status", "list_commit_comments", "list_branches", "get_branch", "list_workflows", "get_workflow", "list_workflow_runs", "get_workflow_run", "download_workflow_run_logs", "list_workflow_jobs", "get_workflow_job"],
									"disabled": false
								}
							}
						}`,
					},
				},
				exitCode: 0,
			},
		},
		{
			name:        "Claude Desktop Only",
			toolParam:   "claude-desktop",
			writeAccess: true,
			autoApprove: "allow-read-only",
			expect: expectations{
				files: map[string]fileExpectation{
					"claude-desktop": {
						path:      "home/.config/Claude/claude_desktop_config.json",
						mustExist: true,
						content: `{
							"mcpServers": {
								"github": {
									"args": ["serve", "--write-access=true"],
									"autoApprove": ["search_repositories", "search_code", "search_issues", "search_commits", "get_file_contents", "get_issue", "list_issues", "list_issue_comments", "get_pull_request", "get_pull_request_diff", "get_commit", "list_commits", "compare_commits", "get_commit_status", "list_commit_comments", "list_branches", "get_branch", "list_workflows", "get_workflow", "list_workflow_runs", "get_workflow_run", "download_workflow_run_logs", "list_workflow_jobs", "get_workflow_job"],
									"disabled": false
								}
							}
						}`,
					},
				},
				exitCode: 0,
			},
		},
		{
			name:        "Multiple Tools",
			toolParam:   "cline,roo-code",
			writeAccess: true,
			autoApprove: "allow-read-only",
			expect: expectations{
				files: map[string]fileExpectation{
					"cline": {
						path:      "home/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json",
						mustExist: true,
						content: `{
							"mcpServers": {
								"github": {
									"args": ["serve", "--write-access=true"],
									"autoApprove": ["search_repositories", "search_code", "search_issues", "search_commits", "get_file_contents", "get_issue", "list_issues", "list_issue_comments", "get_pull_request", "get_pull_request_diff", "get_commit", "list_commits", "compare_commits", "get_commit_status", "list_commit_comments", "list_branches", "get_branch", "list_workflows", "get_workflow", "list_workflow_runs", "get_workflow_run", "download_workflow_run_logs", "list_workflow_jobs", "get_workflow_job"],
									"disabled": false
								}
							}
						}`,
					},
					"roo-code": {
						path:      "home/.vscode-server/data/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json",
						mustExist: true,
						content: `{
							"mcpServers": {
								"github": {
									"args": ["serve", "--write-access=true"],
									"autoApprove": ["search_repositories", "search_code", "search_issues", "search_commits", "get_file_contents", "get_issue", "list_issues", "list_issue_comments", "get_pull_request", "get_pull_request_diff", "get_commit", "list_commits", "compare_commits", "get_commit_status", "list_commit_comments", "list_branches", "get_branch", "list_workflows", "get_workflow", "list_workflow_runs", "get_workflow_run", "download_workflow_run_logs", "list_workflow_jobs", "get_workflow_job"],
									"disabled": false
								}
							}
						}`,
					},
				},
				exitCode: 0,
			},
		},
		{
			name:        "Multiple Tools with Spaces",
			toolParam:   "cline, roo-code",
			writeAccess: true,
			autoApprove: "allow-read-only",
			expect: expectations{
				files: map[string]fileExpectation{
					"cline": {
						path:      "home/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json",
						mustExist: true,
						content: `{
							"mcpServers": {
								"github": {
									"args": ["serve", "--write-access=true"],
									"autoApprove": ["search_repositories", "search_code", "search_issues", "search_commits", "get_file_contents", "get_issue", "list_issues", "list_issue_comments", "get_pull_request", "get_pull_request_diff", "get_commit", "list_commits", "compare_commits", "get_commit_status", "list_commit_comments", "list_branches", "get_branch", "list_workflows", "get_workflow", "list_workflow_runs", "get_workflow_run", "download_workflow_run_logs", "list_workflow_jobs", "get_workflow_job"],
									"disabled": false
								}
							}
						}`,
					},
					"roo-code": {
						path:      "home/.vscode-server/data/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json",
						mustExist: true,
						content: `{
							"mcpServers": {
								"github": {
									"args": ["serve", "--write-access=true"],
									"autoApprove": ["search_repositories", "search_code", "search_issues", "search_commits", "get_file_contents", "get_issue", "list_issues", "list_issue_comments", "get_pull_request", "get_pull_request_diff", "get_commit", "list_commits", "compare_commits", "get_commit_status", "list_commit_comments", "list_branches", "get_branch", "list_workflows", "get_workflow", "list_workflow_runs", "get_workflow_run", "download_workflow_run_logs", "list_workflow_jobs", "get_workflow_job"],
									"disabled": false
								}
							}
						}`,
					},
				},
				exitCode: 0,
			},
		},
		{
			name:        "All Tools",
			toolParam:   "cline,roo-code,claude-desktop",
			writeAccess: true,
			autoApprove: "allow-read-only",
			expect: expectations{
				files: map[string]fileExpectation{
					"cline": {
						path:      "home/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json",
						mustExist: true,
						content: `{
							"mcpServers": {
								"github": {
									"args": ["serve", "--write-access=true"],
									"autoApprove": ["search_repositories", "search_code", "search_issues", "search_commits", "get_file_contents", "get_issue", "list_issues", "list_issue_comments", "get_pull_request", "get_pull_request_diff", "get_commit", "list_commits", "compare_commits", "get_commit_status", "list_commit_comments", "list_branches", "get_branch", "list_workflows", "get_workflow", "list_workflow_runs", "get_workflow_run", "download_workflow_run_logs", "list_workflow_jobs", "get_workflow_job"],
									"disabled": false
								}
							}
						}`,
					},
					"roo-code": {
						path:      "home/.vscode-server/data/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json",
						mustExist: true,
						content: `{
							"mcpServers": {
								"github": {
									"args": ["serve", "--write-access=true"],
									"autoApprove": ["search_repositories", "search_code", "search_issues", "search_commits", "get_file_contents", "get_issue", "list_issues", "list_issue_comments", "get_pull_request", "get_pull_request_diff", "get_commit", "list_commits", "compare_commits", "get_commit_status", "list_commit_comments", "list_branches", "get_branch", "list_workflows", "get_workflow", "list_workflow_runs", "get_workflow_run", "download_workflow_run_logs", "list_workflow_jobs", "get_workflow_job"],
									"disabled": false
								}
							}
						}`,
					},
					"claude-desktop": {
						path:      "home/.config/Claude/claude_desktop_config.json",
						mustExist: true,
						content: `{
							"mcpServers": {
								"github": {
									"args": ["serve", "--write-access=true"],
									"autoApprove": ["search_repositories", "search_code", "search_issues", "search_commits", "get_file_contents", "get_issue", "list_issues", "list_issue_comments", "get_pull_request", "get_pull_request_diff", "get_commit", "list_commits", "compare_commits", "get_commit_status", "list_commit_comments", "list_branches", "get_branch", "list_workflows", "get_workflow", "list_workflow_runs", "get_workflow_run", "download_workflow_run_logs", "list_workflow_jobs", "get_workflow_job"],
									"disabled": false
								}
							}
						}`,
					},
				},
				exitCode: 0,
			},
		},
		{
			name:        "Preserve Other Servers and Top-Level Config",
			toolParam:   "cline",
			writeAccess: true,
			autoApprove: "allow-read-only",
			preExistingConfig: `{
				"mcpServers": {
					"github": {
						"command": "/old/path/to/binary",
						"args": ["serve", "--write-access=false"],
						"customArray": ["item1", "item2", "item3"],
						"customObject": {
							"nested": ["array", "values"],
							"setting": true
						},
						"autoApprove": ["old_tool1", "old_tool2"]
					},
					"weather-server": {
						"command": "/path/to/weather",
						"args": ["--api-key", "secret"],
						"customArrays": ["forecast", "alerts", "historical"],
						"nestedConfig": {
							"regions": ["us", "eu", "asia"],
							"features": {
								"realtime": true,
								"alerts": ["storm", "heat", "cold"]
							}
						}
					},
					"database-server": {
						"command": "/usr/local/bin/db-mcp",
						"env": {
							"DB_HOST": "localhost",
							"DB_POOLS": ["read", "write", "analytics"]
						},
						"complexShape": {
							"connections": [
								{"name": "primary", "pools": ["read", "write"]},
								{"name": "secondary", "pools": ["read"]}
							]
						}
					}
				},
				"globalSettings": {
					"theme": "dark",
					"features": ["feature1", "feature2"],
					"customArrays": {
						"plugins": ["plugin1", "plugin2"],
						"themes": ["dark", "light", "auto"]
					}
				},
				"userPreferences": {
					"notifications": ["error", "warning"],
					"layout": {
						"panels": ["left", "right", "bottom"],
						"sizes": [200, 300, 150]
					}
				}
			}`,
			expect: expectations{
				files: map[string]fileExpectation{
					"cline": {
						path:      "home/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json",
						mustExist: true,
						content: `{
							"mcpServers": {
								"github": {
									"args": ["serve", "--write-access=true"],
									"autoApprove": ["search_repositories", "search_code", "search_issues", "search_commits", "get_file_contents", "get_issue", "list_issues", "list_issue_comments", "get_pull_request", "get_pull_request_diff", "get_commit", "list_commits", "compare_commits", "get_commit_status", "list_commit_comments", "list_branches", "get_branch", "list_workflows", "get_workflow", "list_workflow_runs", "get_workflow_run", "download_workflow_run_logs", "list_workflow_jobs", "get_workflow_job"],
									"disabled": false
								},
								"weather-server": {
									"command": "/path/to/weather",
									"args": ["--api-key", "secret"],
									"customArrays": ["forecast", "alerts", "historical"],
									"nestedConfig": {
										"regions": ["us", "eu", "asia"],
										"features": {
											"realtime": true,
											"alerts": ["storm", "heat", "cold"]
										}
									}
								},
								"database-server": {
									"command": "/usr/local/bin/db-mcp",
									"env": {
										"DB_HOST": "localhost",
										"DB_POOLS": ["read", "write", "analytics"]
									},
									"complexShape": {
										"connections": [
											{"name": "primary", "pools": ["read", "write"]},
											{"name": "secondary", "pools": ["read"]}
										]
									}
								}
							},
							"globalSettings": {
								"theme": "dark",
								"features": ["feature1", "feature2"],
								"customArrays": {
									"plugins": ["plugin1", "plugin2"],
									"themes": ["dark", "light", "auto"]
								}
							},
							"userPreferences": {
								"notifications": ["error", "warning"],
								"layout": {
									"panels": ["left", "right", "bottom"],
									"sizes": [200, 300, 150]
								}
							}
						}`,
					},
				},
				exitCode: 0,
			},
		},
		{
			name:        "Invalid Tool",
			toolParam:   "invalid-tool",
			writeAccess: true,
			autoApprove: "allow-read-only",
			expect: expectations{
				errors:   []string{"unsupported tool: invalid-tool"},
				exitCode: 1,
			},
		},
		{
			name:        "Mixed Valid and Invalid Tools",
			toolParam:   "cline,invalid-tool",
			writeAccess: true,
			autoApprove: "allow-read-only",
			expect: expectations{
				files: map[string]fileExpectation{
					"cline": {
						path:      "home/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json",
						mustExist: true,
						content: `{
							"mcpServers": {
								"github": {
									"args": ["serve", "--write-access=true"],
									"autoApprove": ["search_repositories", "search_code", "search_issues", "search_commits", "get_file_contents", "get_issue", "list_issues", "list_issue_comments", "get_pull_request", "get_pull_request_diff", "get_commit", "list_commits", "compare_commits", "get_commit_status", "list_commit_comments", "list_branches", "get_branch", "list_workflows", "get_workflow", "list_workflow_runs", "get_workflow_run", "download_workflow_run_logs", "list_workflow_jobs", "get_workflow_job"],
									"disabled": false
								}
							}
						}`,
					},
				},
				errors:   []string{"unsupported tool: invalid-tool"},
				exitCode: 1,
			},
		},
	}

	// Run each test case
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Create a temporary directory
			rootDir, err := os.MkdirTemp("", "github-mcp-go-test-*")
			if err != nil {
				t.Fatalf("Failed to create temp dir: %v", err)
			}
			defer os.RemoveAll(rootDir)

			// Set up the directory structure
			homeDir := filepath.Join(rootDir, "home")

			// Copy the binary to the temp directory
			tempBinaryPath := filepath.Join(rootDir, "github-mcp-go")
			if err := copyFile(binaryPath, tempBinaryPath); err != nil {
				t.Fatalf("Failed to copy binary: %v", err)
			}
			if err := os.Chmod(tempBinaryPath, 0755); err != nil {
				t.Fatalf("Failed to make binary executable: %v", err)
			}

			// Set the HOME environment variable
			oldHome := os.Getenv("HOME")
			os.Setenv("HOME", homeDir)
			defer os.Setenv("HOME", oldHome)

			// Set the GITHUB_PERSONAL_ACCESS_TOKEN environment variable
			oldToken := os.Getenv("GITHUB_PERSONAL_ACCESS_TOKEN")
			os.Setenv("GITHUB_PERSONAL_ACCESS_TOKEN", "test-token")
			defer os.Setenv("GITHUB_PERSONAL_ACCESS_TOKEN", oldToken)

			// Create pre-existing config file if specified
			if tc.preExistingConfig != "" {
				err := createPreExistingConfig(t, rootDir, tc.toolParam, tc.preExistingConfig)
				if err != nil {
					t.Fatalf("Failed to create pre-existing config: %v", err)
				}
			}

			// Build the command
			args := []string{"setup", "--tool=" + tc.toolParam}
			if tc.writeAccess {
				args = append(args, "--write-access=true")
			}
			if tc.autoApprove != "" {
				args = append(args, "--auto-approve="+tc.autoApprove)
			}

			// Execute the command
			cmd := exec.Command(tempBinaryPath, args...)
			var stdout, stderr bytes.Buffer
			cmd.Stdout = &stdout
			cmd.Stderr = &stderr
			err = cmd.Run()

			// Check exit code
			exitCode := 0
			if err != nil {
				if exitError, ok := err.(*exec.ExitError); ok {
					exitCode = exitError.ExitCode()
				} else {
					t.Fatalf("Failed to run command: %v", err)
				}
			}

			// Verify exit code
			if exitCode != tc.expect.exitCode {
				t.Errorf("Expected exit code %d, got %d", tc.expect.exitCode, exitCode)
			}

			// Verify expected files
			verifyFileExpectations(t, rootDir, tc.expect.files)

			// Verify expected errors in output
			output := stdout.String() + stderr.String()
			for _, expectedError := range tc.expect.errors {
				if !strings.Contains(strings.ToLower(output), strings.ToLower(expectedError)) {
					t.Errorf("Expected output to contain '%s', got: %s", expectedError, output)
				}
			}
		})
	}
}

// Helper function to verify file expectations
func verifyFileExpectations(t *testing.T, rootDir string, fileExpects map[string]fileExpectation) {
	for tool, expect := range fileExpects {
		filePath := filepath.Join(rootDir, expect.path)

		// Check if file exists
		_, err := os.Stat(filePath)
		if os.IsNotExist(err) {
			if expect.mustExist {
				t.Errorf("Expected file %s was not created for %s", filePath, tool)
			}
			continue
		}

		// File exists, verify content if expected
		if expect.content != "" {
			actualContent, err := os.ReadFile(filePath)
			if err != nil {
				t.Fatalf("Failed to read configuration file %s: %v", filePath, err)
			}

			// Parse both expected and actual content as JSON for comparison
			var expectedJSON, actualJSON map[string]interface{}
			
			if err := json.Unmarshal([]byte(expect.content), &expectedJSON); err != nil {
				t.Fatalf("Failed to parse expected JSON for %s: %v", tool, err)
			}
			
			if err := json.Unmarshal(actualContent, &actualJSON); err != nil {
				t.Fatalf("Failed to parse actual JSON in file %s: %v", filePath, err)
			}
			
			// Process the JSON objects to make them comparable
			normalizeJSON(expectedJSON)
			normalizeJSON(actualJSON)
			
			// Compare the JSON objects
			if diff := cmp.Diff(expectedJSON, actualJSON); diff != "" {
				t.Errorf("File content mismatch for %s (-want +got):\n%s", tool, diff)
			}
		}
	}
}

// normalizeJSON processes a JSON object to make it comparable
// by removing fields that may vary and sorting arrays
func normalizeJSON(jsonObj map[string]interface{}) {
	if mcpServers, ok := jsonObj["mcpServers"].(map[string]interface{}); ok {
		if github, ok := mcpServers["github"].(map[string]interface{}); ok {
			// Remove the command field since it contains the full path
			delete(github, "command")
			
			// Remove the env field since it contains the API key
			delete(github, "env")
			
			// Sort the autoApprove array
			if autoApprove, ok := github["autoApprove"].([]interface{}); ok {
				// Convert to strings and sort
				strSlice := make([]string, len(autoApprove))
				for i, v := range autoApprove {
					strSlice[i] = v.(string)
				}
				
				// Sort the strings
				sort.Strings(strSlice)
				
				// Convert back to []interface{}
				sortedSlice := make([]interface{}, len(strSlice))
				for i, v := range strSlice {
					sortedSlice[i] = v
				}
				
				// Replace the original array with the sorted one
				github["autoApprove"] = sortedSlice
			}
		}
	}
}

// Helper function to build the binary
func buildBinary() (string, error) {
	// Create a temporary directory for the binary
	tempDir, err := os.MkdirTemp("", "github-mcp-go-build-*")
	if err != nil {
		return "", fmt.Errorf("failed to create temp dir: %w", err)
	}

	// Get the project root directory (parent of cmd directory)
	currentDir, err := os.Getwd()
	if err != nil {
		os.RemoveAll(tempDir)
		return "", fmt.Errorf("failed to get current directory: %w", err)
	}
	
	// Ensure we're building from the project root
	projectRoot := filepath.Dir(currentDir)
	if filepath.Base(currentDir) != "cmd" {
		// If we're already in the project root, use the current directory
		projectRoot = currentDir
	}
	
	fmt.Printf("Building binary from project root: %s\n", projectRoot)
	
	// Build the binary
	binaryPath := filepath.Join(tempDir, "github-mcp-go")
	cmd := exec.Command("go", "build", "-o", binaryPath)
	cmd.Dir = projectRoot // Set the working directory to the project root
	
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	
	if err := cmd.Run(); err != nil {
		os.RemoveAll(tempDir)
		return "", fmt.Errorf("failed to build binary: %w\nstdout: %s\nstderr: %s",
			err, stdout.String(), stderr.String())
	}

	// Verify the binary exists and is executable
	info, err := os.Stat(binaryPath)
	if err != nil {
		os.RemoveAll(tempDir)
		return "", fmt.Errorf("failed to stat binary: %w", err)
	}
	
	if info.Size() == 0 {
		os.RemoveAll(tempDir)
		return "", fmt.Errorf("binary file is empty")
	}

	// Make sure the binary is executable
	if err := os.Chmod(binaryPath, 0755); err != nil {
		os.RemoveAll(tempDir)
		return "", fmt.Errorf("failed to make binary executable: %w", err)
	}

	fmt.Printf("Successfully built binary at %s (size: %d bytes)\n", binaryPath, info.Size())
	return binaryPath, nil
}

// Helper function to copy a file
func copyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return fmt.Errorf("failed to open source file: %w", err)
	}
	defer sourceFile.Close()

	destFile, err := os.Create(dst)
	if err != nil {
		return fmt.Errorf("failed to create destination file: %w", err)
	}
	defer destFile.Close()

	if _, err := io.Copy(destFile, sourceFile); err != nil {
		return fmt.Errorf("failed to copy file: %w", err)
	}

	return nil
}

// Helper function to create pre-existing config files for testing
func createPreExistingConfig(t *testing.T, rootDir, toolParam, configContent string) error {
	// Parse the tool parameter to handle multiple tools
	tools := strings.Split(toolParam, ",")
	
	for _, tool := range tools {
		tool = strings.TrimSpace(tool)
		if tool == "" {
			continue
		}

		// Determine the config file path for each tool
		var configPath string
		switch tool {
		case "cline":
			configPath = filepath.Join(rootDir, "home", ".vscode-server", "data", "User", "globalStorage", "saoudrizwan.claude-dev", "settings", "cline_mcp_settings.json")
		case "roo-code":
			configPath = filepath.Join(rootDir, "home", ".vscode-server", "data", "User", "globalStorage", "rooveterinaryinc.roo-cline", "settings", "cline_mcp_settings.json")
		case "claude-desktop":
			configPath = filepath.Join(rootDir, "home", ".config", "Claude", "claude_desktop_config.json")
		default:
			// For unsupported tools, we don't create config files
			continue
		}

		// Create the directory structure
		if err := os.MkdirAll(filepath.Dir(configPath), 0755); err != nil {
			return fmt.Errorf("failed to create config directory for %s: %w", tool, err)
		}

		// Write the pre-existing config content
		if err := os.WriteFile(configPath, []byte(configContent), 0644); err != nil {
			return fmt.Errorf("failed to write pre-existing config for %s: %w", tool, err)
		}
	}

	return nil
}
