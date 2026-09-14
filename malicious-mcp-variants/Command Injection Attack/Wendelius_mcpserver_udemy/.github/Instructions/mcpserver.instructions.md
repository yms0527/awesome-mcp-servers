# Instructions for Coding an MCP Server

As an AI agent, your task is to implement a Model Context Protocol (MCP) Server. Adhere to the following guidelines to ensure your server is robust, compliant, and follows best practices.

## 1. Understand Core MCP Architecture

Before coding, internalize these concepts:

*   **Client-Server Model:** MCP operates on a client-server architecture.
    *   **Hosts:** LLM applications (e.g., Claude Desktop, IDEs) that initiate connections.
    *   **Clients:** Reside within the host, maintaining 1:1 connections with servers.
    *   **Servers (Your Role):** Provide context, tools, and prompts to clients.
*   **Protocol Layer:** Handles message framing, request/response linking, and high-level communication patterns. It uses JSON-RPC 2.0.
*   **Transport Layer:** Manages the actual communication.
    *   **Stdio Transport:** For local processes (standard input/output).
    *   **HTTP with SSE Transport:** For remote communication (Server-Sent Events for server-to-client, HTTP POST for client-to-server).
    *   Your server implementation should be transport-agnostic at the core logic level, with specific transport handling separated.
*   **Message Types:**
    *   **Requests:** Expect a response (e.g., `initialize`, `resources/list`, `resources/read`).
    *   **Results:** Successful responses to requests.
    *   **Errors:** Indicate a request failed.
    *   **Notifications:** One-way messages, no response expected (e.g., `initialized`, `notifications/resources/list_changed`).
*   **Specification:** Always refer to the latest MCP specification for detailed message formats, method names, and parameters.

## 2. Server Initialization and Lifecycle

Your server MUST correctly handle the MCP connection lifecycle:

1.  **Declaration:**
    *   Define your server's `name` (e.g., "my-awesome-mcp-server").
    *   Define your server's `version` (e.g., "1.0.0").
    *   Declare its `capabilities` (e.g., support for resources, prompts, tools). This is crucial for the client to understand what your server can do.

2.  **Initialization Handshake:**
    *   **Receive `initialize` Request:**
        *   Client sends this with its protocol version and capabilities.
        *   Your server MUST validate the client's proposed protocol version.
    *   **Send `initialize` Response:**
        *   Respond with your server's protocol version and capabilities.
        *   Capabilities should clearly state which features (resources, prompts, tools, etc.) are supported. For example: `{"capabilities": {"resources": {}}}` indicates basic resource support.
    *   **Receive `initialized` Notification:**
        *   Client sends this as an acknowledgment.
        *   After this, normal message exchange can begin.

3.  **Termination:**
    *   Implement a clean shutdown mechanism (e.g., triggered by a `close()` method or signal).
    *   Handle transport disconnections gracefully, cleaning up any resources or subscriptions.

## 3. Implementing Resource Support

Resources are a primary way to expose data to LLMs.

*   **Resource Definition:**
    *   Resources are **application-controlled**. The client (e.g., Claude Desktop) decides how and when they are used.
    *   Be prepared for clients to list resources, allow users to select them, or even have heuristics for automatic selection.
    *   For **model-controlled** data access, consider implementing Tools instead of or in addition to Resources.

*   **Resource URIs:**
    *   Identify each resource with a unique URI: `[protocol]://[host]/[path]`.
    *   The `protocol` and `path` structure is defined by your server. Choose a meaningful scheme (e.g., `file://`, `database://`, `myservice://`).

*   **Resource Types:**
    *   **Text Resources:**
        *   Content MUST be UTF-8 encoded text.
        *   Suitable for source code, logs, JSON, plain text.
    *   **Binary Resources:**
        *   Content MUST be raw binary data, base64 encoded for transport in the JSON message.
        *   Suitable for images, PDFs, audio.

*   **Resource Discovery:**
    *   **Implement `resources/list` Endpoint:**
        *   This request asks your server for a list of available direct resources.
        *   The response MUST be a list of resource objects, each containing:
            *   `uri` (string): Unique identifier.
            *   `name` (string): Human-readable name.
            *   `description` (string, optional): Further details.
            *   `mimeType` (string, optional): e.g., "text/plain", "application/pdf", "image/png".
    *   **(Optional) Implement URI Templates for Dynamic Resources:**
        *   If you have many dynamic resources (e.g., files in a user-specified directory), expose URI templates (RFC 6570) instead of listing every single one.
        *   A template object includes:
            *   `uriTemplate` (string): e.g., `file:///project/{projectId}/file/{filePath}`.
            *   `name` (string): Human-readable name for this *type* of resource.
            *   `description` (string, optional).
            *   `mimeType` (string, optional): Default MIME type for resources matching this template.
    *   **Implement `notifications/resources/list_changed` Notification:**
        *   If the list of available resources or templates changes *after* initialization (e.g., a new file is added to a monitored directory), your server SHOULD send this notification to the client. The client will then typically re-request `resources/list`.

*   **Reading Resources:**
    *   **Implement `resources/read` Endpoint:**
        *   Client sends this request with one or more resource URIs.
        *   Your server MUST respond with the content for each requested URI.
        *   The response is a list of `contents` objects, each containing:
            *   `uri` (string): The URI of the resource.
            *   `mimeType` (string, optional): MIME type of this specific content.
            *   Exactly one of:
                *   `text` (string): For text resources (UTF-8).
                *   `blob` (string): For binary resources (base64 encoded).
        *   **Note:** Your server can return multiple resource content objects in response to a single `resources/read` request for a single URI (e.g., if the URI represents a directory, the response could contain contents of multiple files within it).

*   **Resource Updates (Subscriptions - Optional but Recommended for Dynamic Content):**
    *   **Implement `resources/subscribe` Endpoint:**
        *   Client sends this request with a resource URI to monitor.
    *   **Implement `resources/unsubscribe` Endpoint:**
        *   Client sends this request with a resource URI to stop monitoring.
    *   **Send `notifications/resources/updated` Notification:**
        *   When a subscribed resource's content changes, send this notification to the client, including the `uri` of the changed resource.
        *   The client will typically then issue a new `resources/read` request for the updated content.

## 4. Implementing Other Features (Prompts, Tools, Sampling)

*   If your server supports Prompts, Tools, or Sampling, implement their respective MCP endpoints and notifications as defined in the specification.
*   **Prompts:** For reusable prompt templates and workflows.
*   **Tools:** To enable LLMs to perform actions through your server (model-controlled).
*   **Sampling:** To allow your server to request completions from the client's LLM.

## 5. Error Handling

Robust error handling is critical.

*   **Standard Error Codes:**
    *   Use standard JSON-RPC error codes (e.g., `-32700 ParseError`, `-32600 InvalidRequest`, `-32601 MethodNotFound`, `-32602 InvalidParams`, `-32603 InternalError`).
*   **Custom Error Codes:**
    *   You MAY define custom server-specific error codes in the range `-32000` to `-32099` or above.
*   **Error Responses:**
    *   When a request cannot be fulfilled, respond with a JSON-RPC error object containing `code`, `message`, and optionally `data`.
*   **Propagation:**
    *   Ensure errors are propagated correctly, whether as direct error responses to requests or through transport-level error events.
*   **Graceful Failure:**
    *   Provide clear, helpful error messages.
    *   Clean up any allocated resources on error.

## 6. General Best Practices

*   **Idempotency:** Design handlers for non-mutating requests (like `resources/read`) to be idempotent where possible.
*   **Asynchronous Operations:** Perform I/O operations (file access, network requests) asynchronously to avoid blocking the server's main loop.
*   **Input Validation:**
    *   Thoroughly validate all inputs from client requests (URIs, parameters, etc.).
    *   Check for expected types and formats.
    *   Sanitize resource paths to prevent directory traversal attacks (e.g., `../../secret_file`).
*   **Modularity:** Structure your code logically. Separate transport handling, protocol message parsing, and feature implementation.
*   **Configuration:** Allow for server configuration (e.g., paths to monitor, API keys) through environment variables or configuration files.
*   **Logging:**
    *   Implement comprehensive logging for protocol events, message flows, errors, and performance metrics.
    *   This is invaluable for debugging.
*   **Performance:**
    *   Be mindful of resource consumption, especially when reading large files or handling many concurrent requests/subscriptions.
    *   Cache frequently accessed or computationally expensive resource contents if appropriate, ensuring cache invalidation logic is sound.
    *   Consider pagination if `resources/list` could return a very large number of items.
*   **Progress Reporting (for long operations):**
    *   If an operation (e.g., reading a very large resource, complex tool execution) might take time, use MCP's progress reporting capabilities to keep the client informed.
*   **Clarity & Readability:**
    *   Use clear and descriptive names for URIs, resource names, and internal variables/functions.
    *   Include helpful comments in your code, especially for complex logic or custom URI schemes.

## 7. Security Considerations

Security is paramount.

*   **Transport Security:**
    *   If using HTTP, always use TLS (HTTPS).
    *   Validate connection origins if possible.
    *   Implement authentication/authorization mechanisms if your server exposes sensitive data or actions, especially over a network. MCP itself can be layered with existing auth protocols.
*   **Message Validation:**
    *   Validate all incoming messages rigorously against the MCP specification.
    *   Sanitize all inputs derived from messages.
    *   Check message size limits to prevent DoS.
*   **Resource Protection:**
    *   Implement access controls based on the client or authenticated user if applicable.
    *   Carefully validate resource paths and URIs to prevent unauthorized access (e.g., directory traversal).
    *   Monitor resource usage and consider rate-limiting requests to prevent abuse.
*   **Error Handling (Security):**
    *   Do NOT leak sensitive information (stack traces, internal paths, keys) in error messages sent to the client. Log detailed errors internally.
    *   Log security-relevant errors and potential malicious attempts.

## 8. Testing

*   **Unit Tests:** Test individual components and handlers.
*   **Integration Tests:** Test the full request/response flow for each implemented MCP method.
    *   Test with different transport mechanisms if you support more than one.
    *   Verify correct error handling for invalid requests or server-side issues.
    *   Check edge cases (empty resource lists, non-existent URIs, large resource content).
*   **Load Tests:** If your server is expected to handle significant load, perform load testing.
*   **MCP Inspector:** Use tools like the MCP Inspector to test and debug your server interactively.

## 9. Documentation (for Server Users/Developers)

*   If you define custom URI schemes, document them clearly.
*   Document any specific setup or configuration your server requires.
*   Provide examples of how to use your server's exposed resources or tools.

By following these instructions, you will build a compliant, robust, and secure MCP Server.