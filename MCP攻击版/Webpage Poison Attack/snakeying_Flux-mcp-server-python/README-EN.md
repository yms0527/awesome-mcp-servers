<h1 align="center">
✨ SiliconFlow FLUX MCP Server ✨
</h1>

<p align="center">
    <br> <strong>English</strong> | <a href="README.md">中文</a>
</p>

## 🚀 Project Overview

This MCP server allows language models to generate images through SiliconFlow FLUX series models. The project is built with Python, `mcp-sdk`, and `FastMCP` framework, specifically designed for **Streamable HTTP transport protocol**. It's intended to run as a standalone HTTP service, suitable for Docker containerized deployment or direct execution on physical/virtual machines.

<p align="center">
  <img src="/docs/pics/1.png" style="width: 20%; max-width: 120px;">
  <img src="/docs/pics/2.png" style="width: 20%; max-width: 120px;">
  <img src="/docs/pics/3.png" style="width: 20%; max-width: 120px;">
  <img src="/docs/pics/4.png" style="width: 20%; max-width: 120px;">
  <img src="/docs/pics/5.png" style="width: 20%; max-width: 120px;">
  <img src="/docs/pics/6.png" style="width: 20%; max-width: 120px;">
</p>

## Key Features 🌟

-   🎨 **Image Generation Tool**: Provides a core tool called `generate_image` to MCP clients.
-   🤖 **Multi-Model Support**: Allows specifying different SiliconFlow FLUX models during image generation.
-   ⚙️ **Configurable Parameters**: Supports customization of image aspect ratio, inference steps, guidance scale, and seed.
-   🔑 **API Key Rotation**: Configurable comma-separated list of SiliconFlow API keys. The server will use these keys in rotation to enhance service reliability and help manage rate limits.
-   🔧 **Smart Parameter Processing**: Enhanced parameter processing mechanism that automatically handles various parameter formats from different MCP clients, improving stability.
-   🛠️ **Environment Variable Configuration**: Convenient configuration through `.env` files or system environment variables.
-   🐳 **Docker Ready**: Includes `Dockerfile` for simplified containerized deployment.
-   📜 **Logging and Rotation**: Implements log file rotation for service monitoring and troubleshooting.

## Important Note: Language Model Compatibility 💡

This server uses an enhanced parameter processing mechanism that can automatically handle various parameter formats sent by different clients, including JSON strings, nested structures, etc. However, to ensure optimal interaction and stability, **it is strongly recommended to use large language models that can precisely follow tool calling specifications** when configuring MCP clients, including:

-   Google Gemini 2.5 series
-   OpenAI GPT-4.x (excluding nano) / O series
-   DeepSeek R1 / V3 series
-   Claude Sonnet / Haiku series

**Why is this important?**

Some older or less capable smaller models may not strictly follow the `arguments` format defined in tools when understanding and executing MCP tool calling instructions (e.g., incorrectly adding wrapper layers, missing required parameters, or incorrectly handling parameter types). This mismatch can lead to tool call failures and even server crashes in some cases.

## System Requirements ✅

-   🐍 **Python**: Version `3.11` or higher required.
-   ⚡ **`uv`**: A high-performance Python package management tool written in Rust.
    -   Installation guide: `curl -LsSf https://astral.sh/uv/install.sh | sh` (Linux/macOS) or `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"` (Windows PowerShell). Choose the appropriate command for your operating system and restart the terminal after installation to ensure the `uv` command is available.
-   🗝️ **SiliconFlow API Key**: At least one required. Please obtain from [SiliconFlow official website](https://www.siliconflow.cn/).
-   🐳 **Docker (Optional)**: Required if you plan to run this server in a container.

## Local Installation and Setup 🛠️

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/snakeying/Flux-mcp-server-python.git
    cd flux-mcp-server-python
    ```

2.  **Create and activate Python virtual environment (recommended)**:
    Using `uv`:
    ```bash
    uv venv
    source .venv/bin/activate  # Linux/macOS
    # .venv\Scripts\activate    # Windows (cmd)
    # .\.venv\Scripts\Activate.ps1 # Windows (PowerShell)
    ```

3.  **Configure API keys**:
    Copy the `.env.example` file in the project root to `.env`:
    ```bash
    cp .env.example .env
    ```
    Edit the `.env` file and fill in your SiliconFlow API keys:
    ```ini
    SILICONFLOW_API_KEYS=sk-your-key1,sk-your-key2-if-multiple

    # Optional: Override default image generation parameters
    # DEFAULT_MODEL_ID=Pro/black-forest-labs/FLUX.1-schnell
    # DEFAULT_ASPECT_RATIO="16:9"
    # DEFAULT_NUM_INFERENCE_STEPS=25
    # DEFAULT_GUIDANCE_SCALE=7.0

    # Optional: Override default server HTTP settings
    # MCP_HTTP_HOST=0.0.0.0
    # MCP_HTTP_PORT=8008 # Note: If configured here, local run command can omit --port unless overriding
    # MCP_LOG_LEVEL=INFO # Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
    ```
    -   If providing multiple API keys, separate them with commas. The server will use them in rotation.

4.  **Install dependencies and server**:
    Execute in the activated virtual environment:
    ```bash
    uv pip install -e .
    ```
    This command will install the server in editable mode, making the `flux-mcp-server` command available in the current environment.

## Running the Server Locally 🚀

After completing installation and configuration, execute in the activated virtual environment:

```bash
flux-mcp-server --host 0.0.0.0 --port 8008
```

-   To allow only local connections, replace `0.0.0.0` with `localhost` or `127.0.0.1`.
-   `8008` is the port number the server listens on, modify as needed (command line arguments override `MCP_HTTP_PORT` in `.env` file).
-   After server startup, the console will display running logs, such as `Uvicorn running on http://0.0.0.0:8008`.
-   Log files will be written to `logs/flux_mcp_server.log` in the project root directory, with size-based rotation support (default: 5MB per file, keeping 1 backup).

## Configuring MCP Client (e.g., Cherry Studio or **any client supporting CSS rendering**) 🤝

This server uses the Streamable HTTP transport protocol. Please configure your MCP client as follows:

1.  **Start the Python MCP server**: Refer to the previous section (e.g., execute `flux-mcp-server --port 8008`).
2.  In the MCP client's server configuration section:
    *   **Type**: Select `Streamable HTTP (streamableHttp)`.
    *   **URL**: Enter the access address of the running server.
        *   If server and client are on the same machine: `http://localhost:8008/mcp` (replace `8008` with the actual port the server is listening on. `/mcp` is the path typically requested by clients, and the server responds through redirection to `/mcp/` or direct handling).
        *   If the server is deployed on a different machine, use the server's IP address or hostname.
    *   **Command, Arguments, Environment Variables (specifically client configuration for this server)**: These fields should **remain empty** or not applicable. The server runs independently, and its API keys are obtained through its own environment (such as `.env` file or environment variables passed during Docker startup).

## `generate_image` Tool Usage Guide 🛠️

After the server is running and the client is configured, you can use the `generate_image` tool. Works even better with [`system prompt`](/docs/prompts/prompt_en.md)!

**Tool Parameter Details:**

-   `prompt` (string, **required**): Detailed text prompt for image generation (English recommended).
-   `model_id` (string, optional): Specify the SiliconFlow model to use.
    -   Default: `black-forest-labs/FLUX.1-schnell` (or determined by `DEFAULT_MODEL_ID` in `.env` file).
    -   Supported models: `black-forest-labs/FLUX.1-schnell`, `black-forest-labs/FLUX.1-dev`, `Pro/black-forest-labs/FLUX.1-schnell`, `LoRA/black-forest-labs/FLUX.1-dev`.
-   `aspect_ratio` (string, optional): Desired image aspect ratio.
    -   Default: `1:1` (or determined by `DEFAULT_ASPECT_RATIO` in `.env` file).
    -   Supported aspect ratio strings: `"1:1"`, `"1:2"`, `"3:2"`, `"3:4"`, `"16:9"`, `"9:16"`. The server automatically maps to API-supported pixel dimensions.
-   `num_inference_steps` (integer, optional): Number of inference steps (valid range 1-50).
    -   Default: `20` (or determined by `DEFAULT_NUM_INFERENCE_STEPS` in `.env` file).
-   `guidance_scale` (float, optional): Prompt guidance strength.
    -   Default: `7.5` (or determined by `DEFAULT_GUIDANCE_SCALE` in `.env` file).
-   `seed` (integer, optional, >=0): Random seed for reproducible results.

**Tool Output Format:**

The tool returns a multi-line string containing:
1.  An HTML `<img>` tag with `src` attribute pointing to the generated image URL, and `alt` text generated based on the input prompt.
    *   ⚠️ **Important Note**: Image URLs returned by SiliconFlow have expiration times (typically about 30 minutes). Please save images you wish to keep promptly.
2.  The actual seed value used when generating the image (if applicable).
3.  The complete prompt text used when generating the image.

## Docker Deployment Guide 🐳

1.  **Build Docker image** (execute in project root directory):
    ```bash
    docker build -t flux-mcp-server-py:latest .
    ```

2.  **Run Docker container**:

    **Method 1: Set environment variables individually with `-e` (suitable for few key variables)**
    ```bash
    docker run -d --rm \
      -p 8008:8080 \
      -e SILICONFLOW_API_KEYS="sk-your-key1,sk-your-key2" \
      -e MCP_LOG_LEVEL="INFO" \
      -v /your-host-log-directory-path:/app/logs \
      --name my_flux_mcp_service \
      flux-mcp-server-py:latest

    # Optional additional environment variables:
    # -e MCP_HTTP_HOST="0.0.0.0"  # Override default host setting
    # -e MCP_HTTP_PORT="8080"     # Override default port setting
    # -e DEFAULT_MODEL_ID="Pro/black-forest-labs/FLUX.1-schnell"  # Override default model
    ```
    **Parameter Explanation**:
    -   `-d`: Run container in background.
    -   `--rm`: Automatically remove container when it stops.
    -   `-p 8008:8080`: Map host port `8008` to container internal port `8080` (container service listens on `8080`). Clients should configure to connect to host port `8008` (e.g., `http://localhost:8008/mcp`).
    -   `-e SILICONFLOW_API_KEYS="sk-your-key1,sk-your-key2"`: **Critical**, pass API keys to container via environment variables.
    -   `-e MCP_LOG_LEVEL="INFO"`: (Optional) Set application log level.
    -   Other `-e` parameters can override default settings in code or `.env` file, such as `DEFAULT_MODEL_ID`, etc.
    -   `-v /your-host-log-directory-path:/app/logs`: **Recommended**. Mount a host directory (e.g., `/data/flux_mcp_logs`, replace with actual valid path) to container's `/app/logs` directory. This persists container-generated log files to the host. Ensure the host directory exists.
    -   `--name my_flux_mcp_service`: Assign an easy-to-manage name to the container.
    -   `flux-mcp-server-py:latest`: Your built Docker image name and tag.

    **Method 2: Pass all configurations via `--env-file` (recommended for managing multiple configuration items)**

    If you have a local `.env` file (can copy and modify from `.env.example`) and want the container to use all configurations in that file, you can use the `--env-file` flag:
    ```bash
    docker run -d --rm \
      -p 8008:8080 \
      --env-file ./.env \
      -v /your-host-log-directory-path:/app/logs \
      --name my_flux_mcp_service \
      flux-mcp-server-py:latest

    # Note: .env file should be in the current directory where docker run command is executed
    ```
    -   Using this method, Docker reads the specified `.env` file and sets each `KEY=VALUE` line as container environment variables.
    -   This is more convenient for managing multiple configuration items (such as API keys, default models, log levels, etc.) without manually specifying multiple `-e` flags in the command line.
    -   **Note**: Variables set via `--env-file` override same-named variables set by `ENV` instructions in Dockerfile, but may be overridden by subsequent `-e` flags (if used simultaneously).

## Troubleshooting and Support 🧐

-   Please check the server's console output and log information in the `logs/flux_mcp_server.log` file in the project root directory.
-   Confirm that `SILICONFLOW_API_KEYS` in the `.env` file is correctly configured and the keys are valid.
-   Ensure Python environment version is `3.11` or higher.
-   Check that `uvicorn` and other project dependencies are correctly installed in the current Python environment.
-   If connecting to the server from other devices, ensure the server was started with `--host 0.0.0.0` and network firewall allows access to the specified port.
-   For issues or questions related to the MCP protocol itself, refer to the [Model Context Protocol official documentation](https://modelcontextprotocol.io).

## License Information ⚖️

This project is licensed under the MIT License.
