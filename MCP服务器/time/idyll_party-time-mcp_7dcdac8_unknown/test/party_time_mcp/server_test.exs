defmodule PartyTimeMcp.ServerTest do
  use ExUnit.Case
  require Logger
  import ExUnit.CaptureIO
  doctest PartyTimeMcp.Server

  @moduledoc """
  Tests for the PartyTimeMcp.Server module.
  """

  test "server handles get-time tool call" do
    # Create a mock request for get-time
    request = %{
      "jsonrpc" => "2.0",
      "id" => "test-1",
      "method" => "tools/call",
      "params" => %{
        "name" => "get-time",
        "arguments" => %{}
      }
    }

    # Encode the request
    {:ok, json_request} = Jason.encode(request)

    # Capture the output when we feed the request to the server
    output =
      capture_io([input: json_request <> "\n", capture_prompt: false], fn ->
        # Start a server process that will read from the captured input
        server_pid =
          spawn(fn ->
            # Process a single line of input
            case IO.read(:line) do
              data when is_binary(data) ->
                PartyTimeMcp.Server.handle_message(data, nil)

              _ ->
                :ok
            end
          end)

        # Wait for the server to process the input
        Process.sleep(100)

        # Kill the server process
        Process.exit(server_pid, :normal)
      end)

    # Parse the response
    {:ok, decoded} = Jason.decode(String.trim(output))

    # Verify the response structure
    assert decoded["jsonrpc"] == "2.0"
    assert decoded["id"] == "test-1"
    assert is_map(decoded["result"])
    assert is_list(decoded["result"]["content"])
    assert decoded["result"]["isError"] == false

    # Verify the content
    [content] = decoded["result"]["content"]
    assert content["type"] == "text"
    assert content["text"] == "It's Party Time"
  end

  test "handle_message with initialize request" do
    # Create a test process to receive responses
    test_pid = self()

    # Create an initialize request
    request = %{
      "jsonrpc" => "2.0",
      "id" => "test-init",
      "method" => "initialize",
      "params" => %{
        "protocolVersion" => "2024-11-05",
        "capabilities" => %{},
        "clientInfo" => %{
          "name" => "test-client",
          "version" => "0.1.0"
        }
      }
    }

    # Encode the request
    request_json = Jason.encode!(request)

    # Process the request with our server
    PartyTimeMcp.Server.handle_message(request_json, test_pid)

    # Wait for the initialize response
    assert_receive {:response, response_json}, 1000

    # Decode the response
    response = Jason.decode!(response_json)

    # Verify the response structure
    assert response["jsonrpc"] == "2.0"
    assert response["id"] == "test-init"
    assert is_map(response["result"])
    assert is_map(response["result"]["capabilities"])
    assert is_map(response["result"]["serverInfo"])
    assert response["result"]["protocolVersion"] == "2024-11-05"

    # Wait for the server/initialized notification
    assert_receive {:response, notification_json}, 1000

    # Decode the notification
    notification = Jason.decode!(notification_json)

    # Verify the notification structure
    assert notification["jsonrpc"] == "2.0"
    assert notification["method"] == "server/initialized"
    assert notification["id"] == nil
  end

  test "handle_message with notifications/initialized message" do
    # Create a test process to receive responses
    test_pid = self()

    # Create a notifications/initialized message
    request = %{
      "jsonrpc" => "2.0",
      "method" => "notifications/initialized"
    }

    # Encode the request
    request_json = Jason.encode!(request)

    # Process the request with our server
    PartyTimeMcp.Server.handle_message(request_json, test_pid)

    # No response is expected for notifications
    refute_receive {:response, _}, 500
  end

  test "handle_message with tools/list request" do
    # Create a test process to receive responses
    test_pid = self()

    # Create a tools/list request
    data =
      Jason.encode!(%{
        "jsonrpc" => "2.0",
        "id" => "test-1",
        "method" => "tools/list"
      })

    # Process the request with our server
    PartyTimeMcp.Server.handle_message(data, test_pid)

    # Wait for the response
    assert_receive {:response, response}, 1000

    # Decode the response
    decoded_response = Jason.decode!(response)

    # Verify the response structure
    assert decoded_response["jsonrpc"] == "2.0"
    assert decoded_response["id"] == "test-1"
    assert is_map(decoded_response["result"])
    assert is_list(decoded_response["result"]["tools"])

    # Verify the tool details
    tools = decoded_response["result"]["tools"]
    assert length(tools) == 1

    [tool] = tools
    assert tool["name"] == "get-time"
    assert tool["description"] == "Get the current time"
    assert is_map(tool["inputSchema"])
  end

  test "handle_message with tools/call request" do
    # Create a test process to receive responses
    test_pid = self()

    # Create a tools/call request for get-time
    data =
      Jason.encode!(%{
        "jsonrpc" => "2.0",
        "id" => "test-2",
        "method" => "tools/call",
        "params" => %{
          "name" => "get-time",
          "arguments" => %{}
        }
      })

    # Process the request with our server
    PartyTimeMcp.Server.handle_message(data, test_pid)

    # Wait for the response
    assert_receive {:response, response}, 1000

    # Decode the response
    decoded_response = Jason.decode!(response)

    # Verify the response structure
    assert decoded_response["jsonrpc"] == "2.0"
    assert decoded_response["id"] == "test-2"
    assert is_map(decoded_response["result"])
    assert is_list(decoded_response["result"]["content"])
    assert decoded_response["result"]["isError"] == false

    # Verify the content
    [content] = decoded_response["result"]["content"]
    assert content["type"] == "text"
    assert content["text"] == "It's Party Time"
  end
end
