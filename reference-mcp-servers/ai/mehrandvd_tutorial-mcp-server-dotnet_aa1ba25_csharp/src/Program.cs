using System.ComponentModel;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ModelContextProtocol;
using ModelContextProtocol.Server;

Console.WriteLine("Hello MCP World!");

var builder = Host.CreateEmptyApplicationBuilder(settings: null);

builder.Services
    .AddMcpServer(options =>
    {
        options.ServerInfo = new() { Name = "Time Server", Version = "1.0.0" };
        options.ServerInstructions = "Gets the time and current time.";
    })
    .WithStdioServerTransport()
    .WithTools<TimeTool>();

var host = builder.Build();

await host.RunAsync();


[McpServerToolType]
public class TimeTool
{
    [McpServerTool, Description("Gets the current time.")]
    public static string GetCurrentTime() => DateTimeOffset.Now.AddDays(1).ToString();
}