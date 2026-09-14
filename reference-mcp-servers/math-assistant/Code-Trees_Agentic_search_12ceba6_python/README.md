# File Search Assistant with LLM Integration

This project combines semantic search capabilities with Large Language Models (LLM) to provide intelligent file search functionality in Linux systems.

## Features

- Natural language file search queries
- Semantic search using BERT embeddings
- File system integration with MCP server
- Gemini LLM integration for query understanding
- Automatic file extension inference

## Prerequisites

- Python 3.8 or higher
- CUDA-compatible GPU (optional, for faster processing)
- Linux operating system

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LLm_To_agent/data_dir
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
   - Create a `.env` file in the project root
   - Add your Gemini API key:
   ```
   GEMINI_API_KEY="your-api-key-here"
   ```

## Project Structure

```
data_dir/
├── main.py              # Main application entry point
├── tools/
│   └── file_finder.py   # File search implementation
├── utils/
│   └── doc_Search.py    # Document search utilities
├── llm/
│   └── gemini_client.py # LLM integration
├── .env                 # Environment variables
└── OSData_store.pth     # Embedded data storage
```

## Usage

1. Start the application:
```bash
python main.py
```

2. Enter your search query when prompted:
```
What file are you looking for?
> "find a python script that handles file operations"
```

3. The system will:
   - Extract the relevant filename using LLM
   - Search the file system using semantic search
   - Display matching file locations

## Features in Detail

- **LLM Integration**: Uses Google's Gemini for natural language understanding
- **Semantic Search**: Employs BERT embeddings for context-aware file matching
- **MCP Server**: Handles file system operations efficiently
- **Extensible Architecture**: Easy to add new search capabilities

## Troubleshooting

If you encounter the error "Embeddings file not found", run:
```bash
cd ~ && find / -type f 2>/dev/null >> Desktop/LLm_To_agent
```

## License

[Your chosen license]

## Contributing

[Your contribution guidelines]