# MCP based Math Drawing Client

The Math Drawing Client (`talk2mcp_math_draw_client.py`) is a Python application that combines mathematical computations with visual drawing capabilities. It uses the Gemini AI model to process mathematical queries and generate appropriate responses.

## Features

### Currently Implemented Features
- Integration with Gemini AI for mathematical problem-solving
- Drawing capabilities for visual representation of mathematical results
- Iterative problem-solving approach (max 9 iterations)
- Support for basic mathematical operations and ASCII value calculations
- Automatic drawing of results on a canvas
- Basic error handling and recovery
- Simple canvas operations
- Basic text placement
- Timeout handling for operations (10-second timeout for LLM operations)
- Session management
- Tool execution with parameter validation

## Server Requirements
1. MCP Server Setup:
   - Python 3.x environment
   - MCP server package installed
   - Required server dependencies:
     - `mcp` package
     - `google-generativeai` for AI integration
     - `python-dotenv` for environment management

2. Server Configuration:
   - Port configuration (default: 8080)
   - Memory allocation for mathematical operations
   - Canvas size settings (default: 1920x1080)
   - Maximum concurrent connections
   - Timeout settings for operations

3. Server Tools:
   - Mathematical computation engine
   - Drawing canvas manager
   - Tool execution handler
   - Session manager
   - Error handling system

## Prerequisites
- Python 3.x
- Required Python packages:
  - `python-dotenv`
  - `google-generativeai`
  - `mcp` package

## Environment Setup
1. Create a `.env` file in the project root
2. Add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## Server Setup
1. Install server dependencies:
   ```bash
   pip install mcp google-generativeai python-dotenv
   ```

2. Configure server settings in `config.json`:
   ```json
   {
     "server": {
       "port": 8080,
       "max_connections": 10,
       "timeout": 30,
       "canvas": {
         "width": 1920,
         "height": 1080
       }
     }
   }
   ```

3. Start the MCP server:
   ```bash
   python example2-3_server.py
   ```

## Available Tools

### Currently Implemented Tools
1. Mathematical Operations:
   - Basic arithmetic operations (add, subtract, multiply, divide)
   - Advanced mathematical functions (exponential, logarithmic)
   - ASCII value calculations
   - String manipulation and conversion
   - Array operations
   - Prime number calculations
   - Factorial computations
   - Fibonacci sequence generation

2. Drawing Tools:
   - Rectangle drawing with custom dimensions
   - Basic text placement with formatting
   - Canvas clearing and reset
   - Coordinate-based drawing
   - Simple color selection
   - Basic layer management

### Planned Future Tools
1. Enhanced Mathematical Operations
2. Advanced Drawing Features:
3. Analysis Tools:
4. Utility Tools:

## Installation
1. Clone the repository
2. Install required packages:
   ```bash
   pip install python-dotenv google-generativeai mcp
   ```
3. Set up your environment variables as described above

## Usage
1. Start the MCP server (see Server Setup section)
2. Ensure the server is running and accessible
3. Run the client:
   ```bash
   python talk2mcp_math_draw_client.py
   ```

## Server-Client Communication
1. Connection Protocol:
   - Client establishes connection with server
   - Authentication handshake
   - Tool list synchronization
   - Session initialization

2. Data Flow:
   - Client sends mathematical queries
   - Server processes requests
   - Results are returned to client
   - Drawing commands are executed
   - Status updates are communicated

3. Error Handling:
   - Connection retry mechanism
   - Session recovery
   - Tool execution fallback
   - Resource cleanup

## Example Queries
1. Basic Mathematical Drawing:
```
Calculate the sum of ASCII values for the word "HELLO" and draw it inside a rectangle at the center of the canvas.
```

2. Complex Mathematical Visualization:
```
Find the exponential values of first 5 prime numbers, sum them up, and display the result in a blue rectangle at coordinates (500, 300).
```

3. Multiple Operations:
```
Convert the word "MATH" to ASCII values, calculate their sum, find the square root, and display the result in a red rectangle with white text.
```

4. Advanced Drawing:
```
Draw a rectangle at (200, 200) with width 400 and height 300, then place the result of (2^10 + 3^5) inside it with centered text.
```

## How It Works
1. The client connects to the MCP server using stdio communication
2. It processes mathematical queries using the Gemini AI model
3. Results are automatically drawn on a canvas
4. The system uses an iterative approach (max 9 iterations) to solve complex problems
5. Results are displayed in a visually appealing format
6. Each operation is validated against tool schemas
7. Error handling and timeout mechanisms are in place

## Error Handling
The client includes robust error handling for:
- API timeouts (10-second timeout for LLM operations)
- Invalid inputs
- Connection issues
- Tool execution errors
- Drawing tool failures
- Parameter validation errors
- Session management issues

## Contributing
Feel free to submit issues and enhancement requests.

## License
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.



## Troubleshooting
1. Common Issues:
   - Connection timeout
   - Drawing tool failures
   - Memory issues
   - Performance problems
   - Authentication errors

2. Solutions:
   - Check server status
   - Verify network connectivity
   - Clear cache and temporary files
   - Update dependencies
   - Check system resources

## Performance Tips
1. Optimization:
   - Use appropriate canvas size
   - Limit concurrent operations
   - Clear unused resources
   - Monitor memory usage
   - Use efficient algorithms

2. Best Practices:
   - Regular backups
   - System updates
   - Resource monitoring
   - Error logging
   - Performance testing
