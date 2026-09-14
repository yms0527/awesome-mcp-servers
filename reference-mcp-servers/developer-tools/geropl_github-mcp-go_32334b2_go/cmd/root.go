package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

// Common flags
var (
	writeAccess bool
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "github-mcp-go",
	Short: "GitHub MCP Server",
	Long: `A Model Context Protocol (MCP) server for GitHub.

This server provides tools for interacting with the GitHub API through the MCP protocol.`,
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
