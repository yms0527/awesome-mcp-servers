# get_terminal_info(connection) 🖥️

Fetches detailed information about the MetaTrader 5 terminal.

## Parameters
- **connection**: The connection object for the session.

## Returns
- **Dict**: Dictionary with terminal information (name, build, etc.).

## Raises
- **ConnectionError**: If not connected or unable to get terminal info.

## How it works
1. Checks if connected.
2. Calls MetaTrader 5 API for terminal info.
3. Returns info as a dictionary.

## Exceptions
Raises `ConnectionError` if not connected or if the API call fails.

## Fun Fact 🤓
This function is like the MetaTrader terminal’s ID card—always handy for diagnostics!
