# video-transcribe-mcp

An MCP server implementation that integrates with optivus, providing video transcribe capabilities (e.g. YouTube, Facebook, Tiktok, etc.) for LLMs.

## Features

* **Video Transcribe**: Transcribe video to text
* **MCP Integration**: Works with Dive and other MCP-compatible LLMs


### With [Dive Desktop](https://github.com/OpenAgentPlatform/Dive)

1. Click "+ Add MCP Server" in Dive Desktop
2. Copy and paste this configuration:

```json
{
  "mcpServers": {
    "video-transcribe": {
      "command": "npx",
      "args": [
        "-y",
        "@demon24ru/video-transcribe-mcp"
      ]
    }
  }
}
```
3. Click "Save" to install the MCP server

## Tool Documentation

* **transcribe_video**
  * Transcribe video to text
  * Inputs:
    * `urls` (string, required): URL of the video

* **transcribe_video_file**
  * Transcribe video file to text
  * Inputs:
    * `file_path` (string, required): Path to the video file

* **transcribe_image**
  * Transcribe image to text
  * Inputs:
    * `file_path` (string, required): Path to the image file

## Usage Examples

Ask your LLM to:
```
"Transcribe this video: https://youtube.com/watch?v=..."
"Transcribe this video file: /path/to/video.mp4"
"Transcribe this image: /path/to/image.jpg"
```

## Manual Start

If needed, start the server manually:
```bash
npx @demon24ru/video-transcribe-mcp
```

## Debug

If needed, start the server in debug mode:
```bash
npm run prepare
npx @modelcontextprotocol/inspector node ./lib/index.mjs -y
```

## Requirements

* Node.js 20+
* MCP-compatible LLM service


## License

MIT

## Author

@demon24ru


