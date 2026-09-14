defmodule PartyTimeMcp.CLI do
  @moduledoc """
  Command-line interface for the Party Time MCP server.
  """

  def main(_args) do
    # Start the application
    {:ok, _} = Application.ensure_all_started(:party_time_mcp)

    # Keep the process running until stdin is closed
    Process.sleep(:infinity)
  end
end
