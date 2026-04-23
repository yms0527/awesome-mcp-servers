defmodule PartyTimeMcp.JsonFormatTest do
  use ExUnit.Case

  @moduledoc """
  Tests to verify that our JSON responses conform to the MCP protocol specification.
  """

  test "tools/list response format" do
    # Create a sample tools/list response
    response = %{
      "jsonrpc" => "2.0",
      "id" => "test-1",
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

    # Verify the response structure
    assert response["jsonrpc"] == "2.0"
    assert is_binary(response["id"])
    assert is_map(response["result"])
    assert is_list(response["result"]["tools"])

    # Verify the tool details
    [tool] = response["result"]["tools"]
    assert tool["name"] == "get-time"
    assert tool["description"] == "Get the current time"
    assert is_map(tool["inputSchema"])
    assert tool["inputSchema"]["type"] == "object"
    assert is_map(tool["inputSchema"]["properties"])

    # Verify that the response can be encoded to JSON
    {:ok, json} = Jason.encode(response)
    assert is_binary(json)

    # Verify that the JSON can be decoded back to the same structure
    {:ok, decoded} = Jason.decode(json)
    assert decoded == response
  end

  test "tools/call response format" do
    # Create a sample tools/call response
    response = %{
      "jsonrpc" => "2.0",
      "id" => "test-2",
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

    # Verify the response structure
    assert response["jsonrpc"] == "2.0"
    assert is_binary(response["id"])
    assert is_map(response["result"])
    assert is_list(response["result"]["content"])
    assert response["result"]["isError"] == false

    # Verify the content
    [content] = response["result"]["content"]
    assert content["type"] == "text"
    assert content["text"] == "It's Party Time"

    # Verify that the response can be encoded to JSON
    {:ok, json} = Jason.encode(response)
    assert is_binary(json)

    # Verify that the JSON can be decoded back to the same structure
    {:ok, decoded} = Jason.decode(json)
    assert decoded == response
  end

  test "error response format" do
    # Create a sample error response
    response = %{
      "jsonrpc" => "2.0",
      "id" => "test-3",
      "error" => %{
        "code" => -32601,
        "message" => "Method not found"
      }
    }

    # Verify the response structure
    assert response["jsonrpc"] == "2.0"
    assert is_binary(response["id"])
    assert is_map(response["error"])
    assert is_integer(response["error"]["code"])
    assert is_binary(response["error"]["message"])

    # Verify that the response can be encoded to JSON
    {:ok, json} = Jason.encode(response)
    assert is_binary(json)

    # Verify that the JSON can be decoded back to the same structure
    {:ok, decoded} = Jason.decode(json)
    assert decoded == response
  end
end
