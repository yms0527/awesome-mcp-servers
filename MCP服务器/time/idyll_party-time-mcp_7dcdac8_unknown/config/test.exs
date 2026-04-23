import Config

# Configure the application for tests
config :party_time_mcp, :transport, :mock

# Print only warnings and errors during test
config :logger, level: :warning
