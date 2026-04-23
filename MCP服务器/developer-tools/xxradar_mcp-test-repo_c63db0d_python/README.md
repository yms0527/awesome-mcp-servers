# FastAPI Hello World Application

A simple Hello World API built with FastAPI and MCP SSE support.

## Features

- Root endpoint that returns a Hello World message
- Dynamic greeting endpoint that takes a name parameter
- OpenAI integration with GPT-4o for advanced AI-powered chat completions
- Automatic API documentation with Swagger UI

## Prerequisites

- Python 3.7+ (for local setup)
- pip (Python package installer)
- OpenAI API key (for the `/openai` endpoint)
- Docker (optional, for containerized setup)

## Setup Instructions

You can run this application either locally or using Docker.

### Local Setup

#### 1. Clone the repository

```bash
git clone https://github.com/xxradar/mcp-test-repo.git
cd mcp-test-repo
```

#### 2. Create a virtual environment (optional but recommended)

```bash
# On macOS/Linux
python -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
```

#### 3. Install dependencies

```bash
pip install -r requirements.txt
```

#### 4. Run the application

```bash
uvicorn main:app --reload
```

The application will start and be available at http://127.0.0.1:8000

Alternatively, you can run the application directly with Python:

```bash
python main.py
```

### Docker Setup

#### 1. Clone the repository

```bash
git clone https://github.com/xxradar/mcp-test-repo.git
cd mcp-test-repo
```

#### 2. Build the Docker image

```bash
docker build -t fastapi-hello-world .
```

#### 3. Run the Docker container

```bash
docker run -p 8000:8000 fastapi-hello-world
```

The application will be available at http://localhost:8000

## API Endpoints

- `GET /`: Returns a simple Hello World message
- `GET /hello/{name}`: Returns a personalized greeting with the provided name
- `GET /openai`: Returns a response from OpenAI's GPT-4o model (accepts an optional `prompt` query parameter)
- `GET /docs`: Swagger UI documentation
- `GET /redoc`: ReDoc documentation

## OpenAI Integration

The `/openai` endpoint uses OpenAI's GPT-4o model and requires an OpenAI API key to be set as an environment variable:

### Local Setup

```bash
# Set the OpenAI API key as an environment variable
export OPENAI_API_KEY=your_api_key_here

# Run the application
uvicorn main:app --reload
```

### Docker Setup

```bash
# Run the Docker container with the OpenAI API key
docker run -p 8000:8000 -e OPENAI_API_KEY=your_api_key_here fastapi-hello-world
```

## Example Usage

### Using curl

```bash
# Get Hello World message
curl http://127.0.0.1:8000/

# Get personalized greeting
curl http://127.0.0.1:8000/hello/John

# Get OpenAI chat completion with default prompt
curl http://127.0.0.1:8000/openai

# Get OpenAI chat completion with custom prompt
curl "http://127.0.0.1:8000/openai?prompt=Tell%20me%20a%20joke%20about%20programming"
```
### Using MCP
Connect to MCP Inspector
```
npx @modelcontextprotocol/inspector
```

### Using a web browser

- Open http://127.0.0.1:8000/ in your browser for the Hello World message
- Open http://127.0.0.1:8000/hello/John in your browser for a personalized greeting
- Open http://127.0.0.1:8000/openai in your browser to get a response from OpenAI with the default prompt
- Open http://127.0.0.1:8000/openai?prompt=What%20is%20FastAPI? in your browser to get a response about FastAPI
- Open http://127.0.0.1:8000/docs for the Swagger UI documentation

## Development

To make changes to the application, edit the `main.py` file. The server will automatically reload if you run it with the `--reload` flag.
