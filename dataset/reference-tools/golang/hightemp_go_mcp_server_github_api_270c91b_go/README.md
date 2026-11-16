# go_mcp_server_github_api

MCP server for working with GitHub repository via API.

Server url: `http://localhost:8893/sse`

## Run

SSE mode:
```bash
go run main.go -t sse -h 0.0.0.0 -p 8893
```

Stdio mode:
```bash
go run main.go -t stdio
```

## Available Tools

- `github_repo_info`: Get repository information
- `github_list_files`: List files in repository
- `github_get_file`: Get file content
- `github_create_file`: Create a new file
- `github_update_file`: Update existing file
- `github_delete_file`: Delete file
- `github_create_branch`: Create a new branch
- `github_create_pull_request`: Create pull request
- `github_search_replace`: Replace text in a file
- `github_insert_at_line`: Insert text at a specific line in a file
- `github_append_to_file`: Append text to the end of a file