package cmd

import (
	"fmt"
	"os"

	"github.com/geropl/github-mcp-go/pkg/setup"
	"github.com/geropl/github-mcp-go/pkg/tools"
	"github.com/spf13/cobra"
)

var (
	autoApprove string
	tool        string
)

// setupCmd represents the setup command
var setupCmd = &cobra.Command{
	Use:   "setup",
	Short: "Set up the GitHub MCP server for use with an AI assistant",
	Long: `Set up the GitHub MCP server for use with an AI assistant.

This command sets up the GitHub MCP server for use with an AI assistant by installing the binary and configuring the AI assistant to use it.

The --auto-approve flag can be used to specify which tools should be auto-approved. It takes a comma-separated list of tool names. "allow-read-only" is a special value to auto-approve all read-only tools.
The --write-access flag enables write access for remote operations. This allows tools that modify remote repositories to be used.
The --tool flag specifies which AI assistant tool(s) to set up for. It takes a comma-separated list of tool names (e.g., cline, roo-code, claude-desktop).`,
	Run: func(cmd *cobra.Command, args []string) {
		// Install the binary
		binaryPath, err := setup.InstallBinary()
		if err != nil {
			fmt.Printf("Error installing binary: %v\n", err)
			os.Exit(1)
		}

		token := os.Getenv("GITHUB_PERSONAL_ACCESS_TOKEN")
		if token == "" {
			fmt.Println("GITHUB_PERSONAL_ACCESS_TOKEN environment variable is required")
			os.Exit(1)
		}

		// Set up the tool-specific configuration
		options := setup.SetupOptions{
			BinaryPath:  binaryPath,
			Token:       token,
			AutoApprove: autoApprove,
			Tool:        tool,
			WriteAccess: writeAccess,
		}

		// Set up the tools
		errors := setup.SetupMultiple(options, tools.GetReadOnlyToolNames())
		if len(errors) > 0 {
			// Print a summary of errors
			fmt.Println("\nSetup completed with errors:")
			for _, err := range errors {
				fmt.Printf("- %v\n", err)
			}
			os.Exit(1)
		}

		fmt.Println("\nSetup completed successfully!")
	},
}

func init() {
	rootCmd.AddCommand(setupCmd)

	// Add flags to the setup command
	setupCmd.Flags().StringVar(&autoApprove, "auto-approve", "", "Comma-separated list of tools to auto-approve, or 'allow-read-only' to auto-approve all read-only tools. 'allow-read-only' is a special value to auto-approve all read-only tools")
	setupCmd.Flags().StringVar(&tool, "tool", "cline", "The AI assistant tool(s) to set up for (comma-separated, e.g., cline, roo-code, claude-desktop)")
	setupCmd.Flags().BoolVar(&writeAccess, "write-access", false, "Enable write access for remote operations")
}
