#!/bin/sh
echo '{"jsonrpc":"2.0","method":"mcp.listTools","params":{},"id":1}' | node dist/index.js
exit $? 