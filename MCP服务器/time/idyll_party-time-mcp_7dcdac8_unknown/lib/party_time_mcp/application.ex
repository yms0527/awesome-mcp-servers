defmodule PartyTimeMcp.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc """
  The PartyTimeMcp Application module.

  This module is responsible for starting the PartyTimeMcp server and
  setting up the supervision tree.
  """

  use Application

  # Define a module attribute at compile time to determine if we're in test mode
  @env Mix.env()

  @impl true
  def start(_type, _args) do
    # Don't start the MCP server in test mode
    children =
      if @env == :test do
        []
      else
        [
          # Start the PartyTimeMcp server
          {PartyTimeMcp.Server, []},
          # Start a task to read from stdin
          {Task, &start_stdin_reader/0}
        ]
      end

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: PartyTimeMcp.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @doc false
  defp start_stdin_reader do
    # Process input from stdin
    process_input()
  end

  @doc false
  defp process_input do
    case IO.read(:line) do
      :eof ->
        # End of input stream, exit gracefully
        System.stop(0)

      {:error, reason} ->
        # Error reading from stdin, log and exit
        require Logger
        Logger.error("Error reading from stdin: #{inspect(reason)}")
        System.stop(1)

      data when is_binary(data) ->
        # Process the input data
        PartyTimeMcp.Server.handle_message(data, nil)
        # Continue reading
        process_input()
    end
  end
end
