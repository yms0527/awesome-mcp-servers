Create an env and install the dependencies:

```bash
uv venv
source .venv/bin/activate
uv pip install -r pyproject.toml
```
Don't forget: add your API Keys to .env

# Run the weather server in a separate terminal
python mcp/weather_server.py

# Adjust the path to the math server in agent.py

# Run the agent
python agent.py
