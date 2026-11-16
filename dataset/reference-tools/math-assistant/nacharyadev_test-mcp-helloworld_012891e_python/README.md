Run standalone FastAPI server: ```uvicorn server:app --reload --port 3000```


Run MCP directly (without installing in Claude Desktop):   
```mcp dev server.py``` 
Go to http://localhost:5173       
Select Transport type STDIO     
Command: ```python```       
Arguments: ```server.py```      