const express = require('express');
const app = express();
const PORT = 4999;

app.get('/', (req, res) => {
    res.send('MCP server running');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});