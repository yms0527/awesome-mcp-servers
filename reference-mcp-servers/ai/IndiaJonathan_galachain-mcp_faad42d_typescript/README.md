# GalaConnect MCP Server

This is a Model Context Protocol (MCP) server that provides access to Galascan APIs. Currently, it supports the following tools:

- `galaconnect_chain_coin_info_all`: Retrieves comprehensive data for all coins in the Gala ecosystem.
- `galaconnect_burned_today`: Retrieves data on tokens burned today in the Gala ecosystem.
- `galaconnect_all_transactions`: Retrieves recent transactions from the Gala blockchain.
- `galaconnect_coin_info`: Retrieves detailed information about various cryptocurrencies including Gala ecosystem coins.
- `galaconnect_circulating_supply_metrics`: Retrieves metrics about the circulating supply in the Gala ecosystem.

## Installation

```bash
npm install
npm run build
```

## Usage

To use this server with Claude:

```
<use_tools name="galaconnect_chain_coin_info_all" />
<use_tools name="galaconnect_burned_today" />
<use_tools name="galaconnect_all_transactions" />
<use_tools name="galaconnect_coin_info" />
<use_tools name="galaconnect_circulating_supply_metrics" />
```

When calling the galaconnect_all_transactions tool, you can specify a limit parameter to control the number of transactions returned:

```
You can use the galaconnect_all_transactions tool with a limit of 5 transactions.
```

## Tools

### galaconnect_chain_coin_info_all

Retrieves comprehensive data for all coins in the Gala ecosystem.

**Input:**
No parameters required.

**Output:**
JSON object containing detailed information about all Gala ecosystem coins, with each coin having the following metrics:
- Symbol and supply information
- Transaction volume and number of holders
- Mint and burn metrics (all-time and last 24h)
- Current price and price change percentage (24h)
- Circulating supply and market capitalization
- Timestamps for last updates

### galaconnect_burned_today

Retrieves data on tokens burned today in the Gala ecosystem.

**Input:**
No parameters required.

**Output:**
JSON array containing tokens burned today with the following information:
- `burned`: The amount of tokens burned today
- `token`: The token symbol

### galaconnect_all_transactions

Retrieves recent transactions from the Gala blockchain.

**Input:**
- `limit` (optional): Maximum number of transactions to return. Defaults to 20 if not specified.

**Output:**
JSON array containing detailed information about recent transactions, including:
- `TransactionHash`: Unique identifier for the transaction
- `Method`: Operation performed (e.g., MintToken, TransferToken, BurnTokens)
- `Channel`: The blockchain channel used for the transaction
- `Block`: Block number where the transaction was recorded
- `SecondsAgo`: Time elapsed since the transaction occurred
- `CreatedAt`: Timestamp when the transaction was created
- `FromWallet`: Source wallet address
- `ToWallet`: Destination wallet address
- `Amount`: Quantity and token symbol transferred
- `token_path`: Complete path information for the token
- `Fee`: Transaction fee amount
- `is_nft`: Flag indicating if the transaction involves an NFT (1) or not (0)

### galaconnect_coin_info

Retrieves information about various cryptocurrencies including Gala ecosystem coins.

**Input:**
No parameters required.

**Output:**
JSON array containing detailed information about cryptocurrencies, with each coin having the following metrics:
- `id`: Unique identifier for the coin
- `symbol`: Trading symbol for the coin (e.g., "gala", "usdt")
- `name`: Full name of the cryptocurrency
- `image`: URL to the coin's logo image
- `current_price`: Current trading price in USD
- `market_cap`: Total market capitalization
- `market_cap_rank`: Ranking based on market cap
- `fully_diluted_valuation`: Valuation if all coins were in circulation
- `total_volume`: 24-hour trading volume
- `high_24h`/`low_24h`: Highest and lowest prices in the last 24 hours
- `price_change_24h`: Absolute price change in the last 24 hours
- `price_change_percentage_24h`: Percentage price change in the last 24 hours
- `market_cap_change_24h`: Change in market cap in the last 24 hours
- `market_cap_change_percentage_24h`: Percentage change in market cap
- Supply information: `circulating_supply`, `total_supply`, `max_supply`
- All-time high/low data: `ath`, `atl`, `ath_date`, `atl_date`, `ath_change_percentage`, `atl_change_percentage`
- `last_updated`: Timestamp of when the data was last updated

### galaconnect_circulating_supply_metrics

Retrieves metrics about the circulating supply in the Gala ecosystem.

**Input:**
No parameters required.

**Output:**
JSON array containing information about circulating supply metrics:
- `gc_mint_allowance`: The current mint allowance for Gala Chain
- `gc_balance`: The current balance on Gala Chain
- `eth_circulating_supply`: The current circulating supply on Ethereum

## Development

This server connects to the Galascan API at `http://galascan.gala.com/api/chain-coin-info-all` to retrieve comprehensive coin information.

To run the server in development mode:

```bash
npm run watch
```

## Configuration

To configure this MCP server in Cursor or similar environments:

```json
"galaconnect": {
  "command": "docker",
  "args": [
    "run",
    "--rm",
    "-i",
    "galaconnect-mcp"
  ],
  "env": {}
}
```

You can build the Docker image with:

```bash
docker build -t galaconnect-mcp -f Dockerfile .
```

This MCP server operates over stdio (standard input/output) rather than a network port, making it suitable for direct integration with LLM platforms that support the Model Context Protocol. 