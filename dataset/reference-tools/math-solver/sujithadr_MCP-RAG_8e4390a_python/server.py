from mcp.server.fastmcp import FastMCP
from ingestion import ingest_documents
from search import process_search_query

mcp = FastMCP("RAG")

@mcp.tool()
def ingest_tool(file_path: str) -> str:
    return ingest_documents(file_path)

@mcp.tool()
def search_tool(query: str) -> str:
    return process_search_query(query).result
