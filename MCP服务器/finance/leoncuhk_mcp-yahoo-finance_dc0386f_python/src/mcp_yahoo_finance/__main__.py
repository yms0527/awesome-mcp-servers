import asyncio
from mcp_yahoo_finance.server import serve

def main():
    asyncio.run(serve())

if __name__ == "__main__":
    main()
