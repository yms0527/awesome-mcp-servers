from mcp.server.fastmcp import FastMCP
import requests

mcp = FastMCP("io.livecode.ch", dependencies=["requests"])

@mcp.tool()
def run(user: str, repo: str, code: str, lib: str) -> str:
    "Run io.livecode.ch with Github repo user/repo, code main, and lib as given."
    data = {'pre': lib, 'post': '', 'code': main}
    try:
        r = requests.post(f"https://io.livecode.ch/api/run/{user}/{repo}", data = data)
        text = r.text
        if text.startswith('installation error'):
            text = "The repository is not a valid io.livecode.ch repository. Ask the user for one."
        return text
    except Exception as e:
        return f"Error: {str(e)}"

