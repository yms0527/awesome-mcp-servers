package cmd

import (
	"os"

	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"

	"github.com/geropl/github-mcp-go/pkg/github"
	"github.com/geropl/github-mcp-go/pkg/tools"
)

var (
	verbose bool
)

// serveCmd represents the serve command
var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start the GitHub MCP server",
	Long: `Start the GitHub MCP server.

This command starts the GitHub MCP server, which provides tools for interacting with the GitHub API through the MCP protocol.`,
	Run: func(cmd *cobra.Command, args []string) {
		// Initialize logger
		logger := logrus.New()
		if verbose {
			logger.SetLevel(logrus.DebugLevel)
		}
		logger.SetFormatter(&logrus.TextFormatter{
			FullTimestamp: true,
		})

		// Check for GitHub token
		token := os.Getenv("GITHUB_PERSONAL_ACCESS_TOKEN")
		if token == "" {
			logger.Fatal("GITHUB_PERSONAL_ACCESS_TOKEN environment variable is required")
		}

		// Create GitHub client
		githubClient := github.NewClient(token, logger)

		// Create MCP server
		serverName := "github-mcp-server"
		serverVersion := "0.4.0"
		s := tools.NewServer(serverName, serverVersion, githubClient, logger, writeAccess)

		if writeAccess {
			logger.Info("Write access is enabled for remote operations")
		} else {
			logger.Info("Write access is disabled for remote operations")
		}

		// Register tools
		logger.Info("Registering tools...")
		tools.RegisterTools(s)
		logger.Info("Tools registered successfully")

		// Start the stdio server
		logger.Info("Starting GitHub MCP server...")
		if err := s.Serve(); err != nil {
			logger.WithError(err).Fatal("Server error")
		}
	},
}

func init() {
	rootCmd.AddCommand(serveCmd)

	// Add flags to the serve command
	serveCmd.Flags().BoolVarP(&verbose, "verbose", "v", false, "Enable verbose logging")
	serveCmd.Flags().BoolVar(&writeAccess, "write-access", false, "Enable write access for remote operations")
}
