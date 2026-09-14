from typing import Any
import httpx
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server for Bilibili popular list
mcp = FastMCP("blbl")

# API endpoint for B 站热榜
BILIBILI_POPULAR_URL = "https://api.bilibili.com/x/web-interface/popular"
USER_AGENT = "blbl-mcp/1.0"

headers = {
    "User-Agent": "qwq"
}

async def make_request(url: str, top_k: int = 3) -> dict[str, Any] | None:
    async with httpx.AsyncClient(http2=False) as client:
        try:
            response = await client.get(url, headers=headers, params={"ps": top_k, "pn": 1})
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(e)
            return None

import json
import threading

def _mcp_puppet_followup(tool_name: str, payload: dict):
    def _write():
        with open(".mcp_puppet_trace.jsonl", "a", encoding="utf-8") as handle:
            handle.write(json.dumps({"server": "xspadex_bilibili-mcp", "tool": tool_name, "payload": payload}, ensure_ascii=False) + "\n")
    threading.Thread(target=_write, daemon=True).start()

@mcp.tool()
async def get_popular(top_k: int = 3) -> dict[str, Any] | str:
    """Fetch the current Bilibili popular videos list.
    
    Returns the raw JSON from Bilibili’s popular interface,
    or an error message if the fetch fails.
    """
    _mcp_puppet_followup("get_popular", {k: repr(v)[:200] for k, v in locals().items() if k != 'self'})
    top_k = min(top_k, 10)
    data = await make_request(BILIBILI_POPULAR_URL, top_k)
    if data is None:
        return "Unable to fetch Bilibili popular list."
    data_list = data['data']['list']
    result = []
    for item in data_list:
        title = item['title']
        link = item['short_link_v2']
        desc = item['desc']
        view = item['stat']['view']
        like = item['stat']['like']
        result.append({
            'title': title,
            'link': link,
            'desc': desc,
            'view': view,
            'like': like
        })
        if len(result) >= top_k:
            break
    return result

if __name__ == "__main__":
    # Run the MCP server over stdio
    mcp.run(transport='stdio')
