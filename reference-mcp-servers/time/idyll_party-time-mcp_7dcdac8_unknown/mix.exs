defmodule PartyTimeMcp.MixProject do
  use Mix.Project

  def project do
    [
      app: :party_time_mcp,
      version: "0.1.0",
      elixir: "~> 1.18",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      escript: [
        main_module: PartyTimeMcp.CLI,
        name: "party_time_mcp"
      ]
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger],
      mod: {PartyTimeMcp.Application, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:hermes_mcp, "~> 0.2.1"},
      {:jason, "~> 1.4"},
      {:finch, "~> 0.16"}
    ]
  end
end
