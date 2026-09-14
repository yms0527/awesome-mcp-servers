# Building MCP Servers with Claude

This readme documents key requirements and patterns for the Postman API MCP server handlers.

## Official Tutorial

Visit [modelcontextprotocol.io/tutorials/building-mcp-with-llms](https://modelcontextprotocol.io/tutorials/building-mcp-with-llms) for a comprehensive guide covering:

- Documentation preparation
- Server development workflow
- Implementation best practices
- Testing and deployment steps


## Handler Requirements

### Prompt Handler
- Prompt IDs must be used in snake_case format (e.g., 'create_collection', not 'Create Collection')
- Input validation is performed using TypeScript type guards
- Each prompt has a defined input schema and generates appropriate messages

### Resource Handler
- Handles direct resource URIs in the format: `postman://{resource-type}`
- Resource types are fixed strings without parameters (e.g., 'workspaces', 'collections')
- Direct resources provide top-level API data (e.g., list of all workspaces)

### Resource Template Handler
- Handles parameterized URIs in the format: `postman://{resource-type}/{id}/[sub-resource]`
- Supports nested resources (e.g., workspace collections, API versions)
- Template parameters are validated before making API requests

## URI Formats

### Direct Resources (ResourceHandler)
```
postman://workspaces          # List all workspaces
postman://collections         # List all collections
postman://environments        # List all environments
```

### Templated Resources (ResourceTemplateHandler)
```
postman://workspaces/{id}/collections     # Collections in a workspace
postman://apis/{id}/versions              # Versions of an API
postman://collections/{id}/requests       # Requests in a collection
```

## Essential Resources

- [MCP Specification](https://modelcontextprotocol.io)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Python SDK](https://github.com/modelcontextprotocol/python-sdk)

For implementation examples and detailed guidance, refer to the [official tutorial](https://modelcontextprotocol.io/tutorials/building-mcp-with-llms).
