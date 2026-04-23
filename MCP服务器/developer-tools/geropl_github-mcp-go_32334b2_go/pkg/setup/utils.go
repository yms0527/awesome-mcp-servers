package setup

import (
	"encoding/json"
	"fmt"
	"io"
	"maps"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"slices"
	"strings"
)

// FindConfigDir returns the path to the configuration directory for the specified tool
func FindConfigDir(tool string) (string, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("failed to get user home directory: %w", err)
	}

	var configDir string
	switch strings.ToLower(tool) {
	case "cline":
		switch runtime.GOOS {
		case "darwin":
			configDir = filepath.Join(homeDir, "Library", "Application Support", "Code", "User", "globalStorage", "saoudrizwan.claude-dev", "settings")
		case "linux":
			configDir = filepath.Join(homeDir, ".vscode-server", "data", "User", "globalStorage", "saoudrizwan.claude-dev", "settings")
		case "windows":
			configDir = filepath.Join(homeDir, "AppData", "Roaming", "Code", "User", "globalStorage", "saoudrizwan.claude-dev", "settings")
		default:
			return "", fmt.Errorf("unsupported OS: %s", runtime.GOOS)
		}
	case "roo-code":
		switch runtime.GOOS {
		case "darwin":
			configDir = filepath.Join(homeDir, "Library", "Application Support", "Code", "User", "globalStorage", "rooveterinaryinc.roo-cline", "settings")
		case "linux":
			configDir = filepath.Join(homeDir, ".vscode-server", "data", "User", "globalStorage", "rooveterinaryinc.roo-cline", "settings")
		case "windows":
			configDir = filepath.Join(homeDir, "AppData", "Roaming", "Code", "User", "globalStorage", "rooveterinaryinc.roo-cline", "settings")
		default:
			return "", fmt.Errorf("unsupported OS: %s", runtime.GOOS)
		}
	case "claude-desktop":
		switch runtime.GOOS {
		case "darwin":
			configDir = filepath.Join(homeDir, "Library", "Application Support", "Claude")
		case "linux":
			configDir = filepath.Join(homeDir, ".config", "Claude")
		case "windows":
			configDir = filepath.Join(homeDir, "AppData", "Roaming", "Claude")
		default:
			return "", fmt.Errorf("unsupported OS: %s", runtime.GOOS)
		}
	default:
		return "", fmt.Errorf("unsupported tool: %s", tool)
	}

	// Create the config directory if it doesn't exist
	if err := os.MkdirAll(configDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create config directory: %w", err)
	}

	return configDir, nil
}

// CheckBinary checks if the github-mcp-go binary is already on the path
func CheckBinary(mcpServersDir string) (string, bool) {
	// Try to find the binary on the path
	path, err := exec.LookPath("github-mcp-go")
	if err == nil {
		fmt.Printf("Found github-mcp-go binary at %s\n", path)
		return path, true
	}

	binaryPath := filepath.Join(mcpServersDir, "github-mcp-go")
	if runtime.GOOS == "windows" {
		binaryPath += ".exe"
	}

	if _, err := os.Stat(binaryPath); err == nil {
		fmt.Printf("Found github-mcp-go binary at %s\n", binaryPath)
		return binaryPath, true
	}

	return binaryPath, false
}

// CopySelfToBinaryPath copies the current executable to the specified path
func CopySelfToBinaryPath(binaryPath string) error {
	// Get the path to the current executable
	execPath, err := os.Executable()
	if err != nil {
		return fmt.Errorf("failed to get executable path: %w", err)
	}

	// Check if the destination is the same as the source
	absExecPath, _ := filepath.Abs(execPath)
	absDestPath, _ := filepath.Abs(binaryPath)
	if absExecPath == absDestPath {
		return nil // Already in the right place
	}

	// Copy the file
	sourceFile, err := os.Open(execPath)
	if err != nil {
		return fmt.Errorf("failed to open source file: %w", err)
	}
	defer sourceFile.Close()

	err = os.MkdirAll(filepath.Dir(binaryPath), 0755)
	if err != nil {
		return fmt.Errorf("failed to create destination directory: %w", err)
	}

	destFile, err := os.Create(binaryPath)
	if err != nil {
		return fmt.Errorf("failed to create destination file: %w", err)
	}
	defer destFile.Close()

	if _, err := io.Copy(destFile, sourceFile); err != nil {
		return fmt.Errorf("failed to copy file: %w", err)
	}

	// Make the binary executable
	if runtime.GOOS != "windows" {
		if err := os.Chmod(binaryPath, 0755); err != nil {
			return fmt.Errorf("failed to make binary executable: %w", err)
		}
	}

	fmt.Printf("github-mcp-go binary installed successfully at %s\n", binaryPath)
	return nil
}

// ProcessAutoApproveFlag processes the auto-approve flag and returns a list of tools to auto-approve
func ProcessAutoApproveFlag(autoApprove string, readOnlyTools map[string]bool) []string {
	autoApproveTools := map[string]bool{}
	// Split comma-separated list
	for _, tool := range strings.Split(autoApprove, ",") {
		trimmedTool := strings.TrimSpace(tool)
		if trimmedTool == "allow-read-only" {
			// Get the list of read-only tools
			for k := range readOnlyTools {
				autoApproveTools[k] = true
			}
		} else if trimmedTool != "" {
			autoApproveTools[trimmedTool] = true
		}
	}

	return slices.Collect(maps.Keys(autoApproveTools))
}

func UpdateSettingsFile(settingsPath string, serverConfig map[string]interface{}) error {
	// Read existing settings or create new ones
	settings, err := readSettingsFile(settingsPath)
	if err != nil {
		return fmt.Errorf("failed to read settings: %w", err)
	}

	// Update the settings
	mcpServers, ok := settings["mcpServers"].(map[string]interface{})
	if !ok {
		mcpServers = map[string]interface{}{}
		settings["mcpServers"] = mcpServers
	}
	mcpServers["github"] = serverConfig

	// Write the settings to the file
	if err := writeSettingsFile(settingsPath, settings); err != nil {
		return fmt.Errorf("failed to write settings: %w", err)
	}

	return nil
}

// readSettingsFile reads the MCP settings file and returns the parsed JSON
func readSettingsFile(settingsPath string) (map[string]interface{}, error) {
	var settings map[string]interface{}

	// Check if the settings file already exists
	if _, err := os.Stat(settingsPath); err == nil {
		// Read the existing settings
		data, err := os.ReadFile(settingsPath)
		if err != nil {
			return nil, fmt.Errorf("failed to read existing settings: %w", err)
		}

		// Parse the existing settings
		if err := json.Unmarshal(data, &settings); err != nil {
			return nil, fmt.Errorf("failed to parse existing settings: %w", err)
		}
	} else {
		// Create a new settings object
		settings = map[string]interface{}{
			"mcpServers": map[string]interface{}{},
		}
	}

	return settings, nil
}

// writeSettingsFile writes the settings to the specified file
func writeSettingsFile(settingsPath string, settings map[string]interface{}) error {
	// Write the settings to the file
	data, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal settings: %w", err)
	}

	if err := os.WriteFile(settingsPath, data, 0644); err != nil {
		return fmt.Errorf("failed to write settings: %w", err)
	}

	return nil
}
