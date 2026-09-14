ExUnit.start()

defmodule PartyTimeMcp.TestHelpers do
  @moduledoc """
  Helper functions for testing the PartyTimeMcp server.
  """

  import ExUnit.Assertions

  @doc """
  Creates a mock transport process that will forward messages to the test process.
  """
  def create_mock_transport(test_process) do
    spawn_link(fn -> mock_transport_loop(test_process) end)
  end

  @doc """
  Loop function for the mock transport process.
  """
  def mock_transport_loop(test_process) do
    receive do
      message ->
        # Forward the message to the test process
        send(test_process, {:mock_transport_message, message})
        mock_transport_loop(test_process)
    end
  end

  @doc """
  Sends a JSON-RPC request to the server and waits for a response.
  """
  def send_request_and_get_response(server, request) do
    # Send the request to the server
    send(server, {:response, Jason.encode!(request)})

    # Wait for the response
    response =
      receive do
        {:mock_transport_message, msg} -> msg
      after
        1000 -> flunk("No response received from server")
      end

    # Parse and return the response
    {:ok, decoded} = Jason.decode(response)
    decoded
  end
end
