# _initialize_terminal(connection) 🛠️

Initializes the MetaTrader 5 terminal for a new session.

## Parameters
- **connection**: The connection object with initialization details.

## Returns
- **bool**: `True` if initialization is successful, `False` otherwise.

## Raises
- **InitializationError**: If initialization fails after retries.

## How it works
1. Ensures cooldown before initializing.
2. Attempts initialization with retries and jitter.
3. Handles errors gracefully.

## Fun Fact ⚡
This function gets your MetaTrader engine running—start your trading engines!
