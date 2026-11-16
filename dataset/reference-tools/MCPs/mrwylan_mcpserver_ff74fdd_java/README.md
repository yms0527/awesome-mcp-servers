# my own mcp server - a simple list of colors and hex values

This simple demo is based on the youtoube tutorial from dan vega.

[Dan Vega, mcp server tutorial](https://youtu.be/w5YVHG1j3Co?si=jBv4C1hch-Ub2ee4)

[See Spring Boot documentation](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-server-boot-starter-docs.html#_creating_a_spring_boot_application_with_mcp_server)

## prerequisite

To demo the running MCP server I used Claude Desktop with Developer Mode enabled.

Example Claude Desktop config for SSE transport:
````json
{
  "mcpServers": {
    "localmcp": {
      "type": "sse",
      "url": "http://localhost:8080/sse"
    }
  }
}
````

Replace the URL/port if you change the server.port.

Build and run:
- mvn clean package
- java -jar target/mymcp-0.1.0-SNAPSHOT.jar

Verify the SSE endpoint is registered:
- Start the app
- Open http://localhost:8080/actuator/mappings
- Search for an entry with path "/sse". If you changed the port, adjust the URL accordingly.

## what the mcp exposes

The server exposes a list of color name, hex value pairs. 
With this list you can interact: list all, get one, add one color entry.

## a chat, done with this demo

[Claude Chat Link](https://claude.ai/share/bc9dc8aa-3c41-49eb-988c-a2b620953883)

## inspection of the mcp endpoint

```bash
npx @modelcontextprotocol/inspector
```

This will start the inspector, open the browser where you can connect to the mcp endpoint.

