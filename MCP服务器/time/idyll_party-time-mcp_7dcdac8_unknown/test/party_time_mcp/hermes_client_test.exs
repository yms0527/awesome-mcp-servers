defmodule PartyTimeMcp.HermesClientTest do
  use ExUnit.Case
  require Logger

  @moduledoc """
  Tests for the PartyTimeMcp.Server handling JSON-RPC messages.
  This ensures our server implementation is compatible with the MCP protocol.
  """

  setup do
    # Start a test process to receive responses
    test_pid = self()

    # Return the test context
    %{test_pid: test_pid}
  end

  test "server can handle initialize request", %{test_pid: test_pid} do
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

  test "server can handle notifications/initialized message", %{test_pid: test_pid} do
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

  test "server can handle tools/list request", %{test_pid: test_pid} do
    # Create a tools/list request
    request = %{
      "jsonrpc" => "2.0",
      "id" => "test-1",
      "method" => "tools/list"
    }

    # Encode the request
    request_json = Jason.encode!(request)

    # Process the request with our server
    PartyTimeMcp.Server.handle_message(request_json, test_pid)

    # Wait for the response
    assert_receive {:response, response_json}, 1000

    # Decode the response
    response = Jason.decode!(response_json)

    # Verify the response structure
    assert response["jsonrpc"] == "2.0"
    assert response["id"] == "test-1"
    assert is_map(response["result"])
    assert is_list(response["result"]["tools"])

    # Verify the tool details
    tools = response["result"]["tools"]
    assert length(tools) == 1

    [tool] = tools
    assert tool["name"] == "get-time"
    assert tool["description"] == "Get the current time"
    assert is_map(tool["inputSchema"])
  end

  test "server can handle tools/call for get-time", %{test_pid: test_pid} do
    # Create a tools/call request for get-time
    request = %{
      "jsonrpc" => "2.0",
      "id" => "test-2",
      "method" => "tools/call",
      "params" => %{
        "name" => "get-time",
        "arguments" => %{}
      }
    }

    # Encode the request
    request_json = Jason.encode!(request)

    # Process the request with our server
    PartyTimeMcp.Server.handle_message(request_json, test_pid)

    # Wait for the response
    assert_receive {:response, response_json}, 1000

    # Decode the response
    response = Jason.decode!(response_json)

    # Verify the response structure
    assert response["jsonrpc"] == "2.0"
    assert response["id"] == "test-2"
    assert is_map(response["result"])
    assert is_list(response["result"]["content"])
    assert response["result"]["isError"] == false

    # Verify the content
    [content] = response["result"]["content"]
    assert content["type"] == "text"
    assert content["text"] == "It's Party Time"
  end
end

# A mock transport module that implements the Hermes.Transport.Behaviour
defmodule MockTransport do
  @behaviour Hermes.Transport.Behaviour
  use GenServer
  require Logger

  @impl Hermes.Transport.Behaviour
  def start_link(handler) do
    # Use a unique name for each test
    name = :"mock_transport_#{:erlang.unique_integer([:positive])}"
    GenServer.start_link(__MODULE__, %{handler: handler}, name: name)
  end

  @impl GenServer
  def init(state) do
    {:ok, state}
  end

  # Implement the Hermes.Transport.Behaviour callbacks
  @impl Hermes.Transport.Behaviour
  def send_message(_message) do
    # This should never be called directly
    Logger.error("send_message/1 called directly, which is not expected")
    {:error, :not_implemented}
  end

  @impl Hermes.Transport.Behaviour
  def send_message(transport, message) do
    GenServer.cast(transport, {:send_message, message})
    :ok
  end

  @impl Hermes.Transport.Behaviour
  def shutdown(transport) do
    GenServer.stop(transport)
    :ok
  end

  # Handle the send_message cast
  @impl GenServer
  def handle_cast({:send_message, message}, %{handler: handler} = state) do
    # Send the message to the handler
    GenServer.cast(handler, {:handle_message, message})

    {:noreply, state}
  end
end

# A GenServer to handle messages from the mock transport
defmodule MockTransportHandler do
  use GenServer
  require Logger

  def start_link do
    # Use a unique name for each test
    name = :"mock_handler_#{:erlang.unique_integer([:positive])}"
    GenServer.start_link(__MODULE__, %{}, name: name)
  end

  @impl true
  def init(state) do
    {:ok, state}
  end

  @impl true
  def handle_cast({:handle_message, message}, state) do
    # Process the message with our server, passing self() as the response_pid
    PartyTimeMcp.Server.handle_message(message, self())

    {:noreply, state}
  end

  @impl true
  def handle_info({:response, response}, state) do
    # Try to find the client by its name pattern
    client_pids =
      Process.list()
      |> Enum.filter(fn pid ->
        case Process.info(pid, :registered_name) do
          {:registered_name, name} ->
            name_str = Atom.to_string(name)
            String.starts_with?(name_str, "test_")

          _ ->
            false
        end
      end)

    case client_pids do
      [client_pid | _] ->
        # Send the response to the client
        send(client_pid, {:response, response})

      [] ->
        Logger.error("Client process not found")
    end

    {:noreply, state}
  end
end
