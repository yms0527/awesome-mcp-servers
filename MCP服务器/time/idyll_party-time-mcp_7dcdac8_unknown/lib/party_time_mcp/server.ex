defmodule PartyTimeMcp.Server do
  @moduledoc """
  The PartyTimeMcp.Server module implements an MCP (Machine Conversation Protocol) server
  that responds to JSON-RPC requests over stdin/stdout.

  This server provides a single tool:
  - `get-time`: Returns "It's Party Time" when called

  The server follows the MCP protocol specification, handling:
  - initialize: Responds with server capabilities
  - tools/list: Lists available tools
  - tools/call: Executes a tool and returns the result
  - Error handling for unknown methods or invalid requests

  It can be used with any MCP client, including Claude Desktop.
  """

  use GenServer
  require Logger

  # Public API

  @doc """
  Starts the server process.

  Returns `{:ok, pid}` if successful, `{:error, reason}` otherwise.
  """
  def start_link(_opts \\ []) do
    # Disable console logging to avoid interfering with JSON output
    Logger.configure(level: :none)

    # Print startup message to stderr
    IO.puts(:stderr, "Party Time MCP server running. Press Ctrl+C to exit.")

    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  @doc """
  Handles an incoming JSON-RPC message.

  Takes a JSON string and a response_pid. If response_pid is nil,
  responses will be sent to stdout. Otherwise, responses will be sent
  to the specified process with {:response, json_response} message.

  Returns `:ok`.
  """
  def handle_message(message, response_pid) do
    # Parse the JSON message
    case Jason.decode(message) do
      {:ok, decoded} ->
        # Handle the message based on the method
        handle_jsonrpc(decoded, response_pid)

      {:error, _reason} ->
        # Send an error response for invalid JSON
        error_response = %{
          "jsonrpc" => "2.0",
          "id" => nil,
          "error" => %{
            "code" => -32700,
            "message" => "Parse error"
          }
        }

        send_response(Jason.encode!(error_response), response_pid)
    end

    :ok
  end

  # GenServer callbacks

  @impl true
  def init(_) do
    register_tool_handlers()
    {:ok, %{}}
  end

  @impl true
  def handle_info({:response, response}, state) do
    # Forward the response to stdout
    send_response(response, nil)
    {:noreply, state}
  end

  @impl true
  def handle_info(_msg, state) do
    {:noreply, state}
  end

  # Private functions

  @doc false
  defp register_tool_handlers do
    # Register the get-time tool
    :ok
  end

  @doc false
  defp handle_jsonrpc(%{"method" => "initialize", "id" => id}, response_pid) do
    # Create the response with server capabilities
    response = %{
      "jsonrpc" => "2.0",
      "id" => id,
      "result" => %{
        "capabilities" => %{
          "tools" => %{
            "execution" => %{
              "type" => "sync"
            }
          }
        },
        "serverInfo" => %{
          "name" => "PartyTimeMcp",
          "version" => "1.0.0"
        },
        "protocolVersion" => "2024-11-05"
      }
    }

    # Send the response
    send_response(Jason.encode!(response), response_pid)

    # Send initialized notification
    notification = %{
      "jsonrpc" => "2.0",
      "method" => "server/initialized"
    }

    send_response(Jason.encode!(notification), response_pid)
  end

  @doc false
  defp handle_jsonrpc(%{"method" => "notifications/initialized"}, _response_pid) do
    # This is a notification from the client that it has received our server/initialized notification
    # No response is needed for notifications
    :ok
  end

  @doc false
  defp handle_jsonrpc(%{"method" => "tools/list"} = request, response_pid) do
    id = request["id"]

    # Create the response with the list of tools
    response = %{
      "jsonrpc" => "2.0",
      "id" => id,
      "result" => %{
        "tools" => [
          %{
            "name" => "get-time",
            "description" => "Get the current time",
            "inputSchema" => %{
              "type" => "object",
              "properties" => %{}
            }
          }
        ]
      }
    }

    # Send the response
    send_response(Jason.encode!(response), response_pid)
  end

  @doc false
  defp handle_jsonrpc(%{"method" => "tools/call", "params" => params} = request, response_pid) do
    id = request["id"]
    tool_name = params["name"]
    _arguments = params["arguments"] || %{}

    # Handle the tool call based on the tool name
    case tool_name do
      "get-time" ->
        # Create the response for the get-time tool
        response = %{
          "jsonrpc" => "2.0",
          "id" => id,
          "result" => %{
            "content" => [
              %{
                "type" => "text",
                "text" => "It's Party Time"
              }
            ],
            "isError" => false
          }
        }

        # Send the response
        send_response(Jason.encode!(response), response_pid)

      _ ->
        # Send an error response for unknown tool
        error_response = %{
          "jsonrpc" => "2.0",
          "id" => id,
          "error" => %{
            "code" => -32601,
            "message" => "Tool not found: #{tool_name}"
          }
        }

        send_response(Jason.encode!(error_response), response_pid)
    end
  end

  @doc false
  defp handle_jsonrpc(%{"method" => method} = request, response_pid) do
    id = request["id"]

    # Send an error response for unknown method
    error_response = %{
      "jsonrpc" => "2.0",
      "id" => id,
      "error" => %{
        "code" => -32601,
        "message" => "Method not found: #{method}"
      }
    }

    send_response(Jason.encode!(error_response), response_pid)
  end

  @doc false
  defp handle_jsonrpc(request, response_pid) do
    id = request["id"]

    # Send an error response for invalid request
    error_response = %{
      "jsonrpc" => "2.0",
      "id" => id,
      "error" => %{
        "code" => -32600,
        "message" => "Invalid Request"
      }
    }

    send_response(Jason.encode!(error_response), response_pid)
  end

  @doc false
  defp send_response(response, nil) do
    # Only output the JSON to stdout, nothing else
    IO.write(:stdio, response <> "\n")
  end

  @doc false
  defp send_response(response, response_pid) do
    # Send the response to the specified process
    send(response_pid, {:response, response})
  end
end
