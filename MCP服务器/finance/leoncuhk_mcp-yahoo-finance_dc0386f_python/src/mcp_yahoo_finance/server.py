import json
from typing import Any, Literal

import pandas as pd
from mcp.server.fastmcp import FastMCP
from mcp.types import ImageContent, TextContent
from requests import Session
from yfinance import Ticker

from mcp_yahoo_finance.visualization import (
    generate_market_sentiment_dashboard,
    generate_portfolio_tracking,
    generate_stock_analysis
)

# Remove instantiations from here
# mcp_instance = FastMCP()
# yf_instance = YahooFinance()

class YahooFinance:
    def __init__(self, session: Session | None = None, verify: bool = True) -> None:
        self.session = session or Session()
        self.session.verify = verify

    def get_current_stock_price(self, symbol: str) -> str:
        """Get the current stock price based on stock symbol.

        Args:
            symbol (str): Stock symbol in Yahoo Finance format.
        """
        stock = Ticker(ticker=symbol, session=self.session).info
        current_price = stock.get(
            "regularMarketPrice", stock.get("currentPrice", "N/A")
        )
        return (
            f"{current_price:.4f}"
            if current_price
            else f"Couldn't fetch {symbol} current price"
        )

    def get_stock_price_by_date(self, symbol: str, date: str) -> str:
        """Get the stock price for a given stock symbol on a specific date.

        Args:
            symbol (str): Stock symbol in Yahoo Finance format.
            date (str): The date in YYYY-MM-DD format.
        """
        stock = Ticker(ticker=symbol, session=self.session)
        price = stock.history(start=date, period="1d")
        return f"{price.iloc[0]['Close']:.4f}"

    def get_stock_price_date_range(
        self, symbol: str, start_date: str, end_date: str
    ) -> str:
        """Get the stock prices for a given date range for a given stock symbol.

        Args:
            symbol (str): Stock symbol in Yahoo Finance format.
            start_date (str): The start date in YYYY-MM-DD format.
            end_date (str): The end date in YYYY-MM-DD format.
        """
        stock = Ticker(ticker=symbol, session=self.session)
        prices = stock.history(start=start_date, end=end_date)
        prices.index = prices.index.astype(str)
        return f"{prices['Close'].to_json(orient='index')}"

    def get_historical_stock_prices(
        self,
        symbol: str,
        period: Literal[
            "1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"
        ] = "1mo",
        interval: Literal["1d", "5d", "1wk", "1mo", "3mo"] = "1d",
    ) -> str:
        """Get historical stock prices for a given stock symbol.

        Args:
            symbol (str): Stock symbol in Yahoo Finance format.
            period (str): The period for historical data. Defaults to "1mo".
                    Valid periods: "1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"
            interval (str): The interval beween data points. Defaults to "1d".
                    Valid intervals: "1d", "5d", "1wk", "1mo", "3mo"
        """
        stock = Ticker(ticker=symbol, session=self.session)
        prices = stock.history(period=period, interval=interval)

        if hasattr(prices.index, "date"):
            prices.index = prices.index.date.astype(str)  # type: ignore
        return f"{prices['Close'].to_json(orient='index')}"

    def get_dividends(self, symbol: str) -> str:
        """Get dividends for a given stock symbol.

        Args:
            symbol (str): Stock symbol in Yahoo Finance format.
        """
        stock = Ticker(ticker=symbol, session=self.session)
        dividends = stock.dividends

        if hasattr(dividends.index, "date"):
            dividends.index = dividends.index.date.astype(str)  # type: ignore
        return f"{dividends.to_json(orient='index')}"

    def get_income_statement(
        self, symbol: str, freq: Literal["yearly", "quarterly", "trainling"] = "yearly"
    ) -> str:
        """Get income statement for a given stock symbol.

        Args:
            symbol (str): Stock symbol in Yahoo Finance format.
            freq (str): At what frequency to get cashflow statements. Defaults to "yearly".
                    Valid freqencies: "yearly", "quarterly", "trainling"
        """
        stock = Ticker(ticker=symbol, session=self.session)
        income_statement = stock.get_income_stmt(freq=freq, pretty=True)

        if isinstance(income_statement, pd.DataFrame):
            income_statement.columns = [
                str(col.date()) for col in income_statement.columns
            ]
            return f"{income_statement.to_json()}"
        return f"{income_statement}"

    def get_cashflow(
        self, symbol: str, freq: Literal["yearly", "quarterly", "trainling"] = "yearly"
    ):
        """Get cashflow for a given stock symbol.

        Args:
            symbol (str): Stock symbol in Yahoo Finance format.
            freq (str): At what frequency to get cashflow statements. Defaults to "yearly".
                    Valid freqencies: "yearly", "quarterly", "trainling"
        """
        stock = Ticker(ticker=symbol, session=self.session)
        cashflow = stock.get_cashflow(freq=freq, pretty=True)

        if isinstance(cashflow, pd.DataFrame):
            cashflow.columns = [str(col.date()) for col in cashflow.columns]
            return f"{cashflow.to_json(indent=2)}"
        return f"{cashflow}"

    def get_earning_dates(self, symbol: str, limit: int = 12) -> str:
        """Get earning dates.


        Args:
            symbol (str): Stock symbol in Yahoo Finance format.
            limit (int): max amount of upcoming and recent earnings dates to return. Default value 12 should return next 4 quarters and last 8 quarters. Increase if more history is needed.
        """

        stock = Ticker(ticker=symbol, session=self.session)
        earning_dates = stock.get_earnings_dates(limit=limit)

        if isinstance(earning_dates, pd.DataFrame):
            earning_dates.index = earning_dates.index.date.astype(str)  # type: ignore
            return f"{earning_dates.to_json(indent=2)}"
        return f"{earning_dates}"

    def get_news(self, symbol: str) -> str:
        """Get news for a given stock symbol.

        Args:
            symbol (str): Stock symbol in Yahoo Finance format.
        """
        stock = Ticker(ticker=symbol, session=self.session)
        return json.dumps(stock.news, indent=2)
    
    def generate_market_dashboard(self, indices: str = "^GSPC,^DJI,^IXIC") -> str:
        """Generate a market sentiment dashboard with real-time index performance, fear/greed indicators.
        
        Args:
            indices (str): Comma-separated list of index symbols (default: "^GSPC,^DJI,^IXIC")
        """
        indices_list = indices.split(",")
        return generate_market_sentiment_dashboard(indices_list)

    def generate_portfolio_report(self, symbols: str = "AAPL,MSFT,GOOGL,AMZN,NVDA") -> str:
        """Generate a portfolio performance tracking report for the specified stocks.
        
        Args:
            symbols (str): Comma-separated list of stock symbols (default: "AAPL,MSFT,GOOGL,AMZN,NVDA")
        """
        symbols_list = symbols.split(",")
        return generate_portfolio_tracking(symbols_list)

    def generate_stock_technical_analysis(self, symbol: str = "TSLA") -> str:
        """Generate a deep technical analysis report for a stock, including price trends, 
        moving averages, and support/resistance levels.
        
        Args:
            symbol (str): Stock symbol in Yahoo Finance format (default: "TSLA")
        """
        return generate_stock_analysis(symbol)

# Instantiate AFTER class definition
mcp_instance = FastMCP()
yf_instance = YahooFinance()

# --- Tool Definitions using FastMCP --- #

@mcp_instance.tool()
def get_current_stock_price(symbol: str) -> str:
    """Get the current stock price based on stock symbol.

    Args:
        symbol (str): Stock symbol in Yahoo Finance format.
    """
    return yf_instance.get_current_stock_price(symbol)

@mcp_instance.tool()
def get_stock_price_by_date(symbol: str, date: str) -> str:
    """Get the stock price for a given stock symbol on a specific date.

    Args:
        symbol (str): Stock symbol in Yahoo Finance format.
        date (str): The date in YYYY-MM-DD format.
    """
    return yf_instance.get_stock_price_by_date(symbol, date)

@mcp_instance.tool()
def get_stock_price_date_range(symbol: str, start_date: str, end_date: str) -> str:
    """Get the stock prices for a given date range for a given stock symbol.

    Args:
        symbol (str): Stock symbol in Yahoo Finance format.
        start_date (str): The start date in YYYY-MM-DD format.
        end_date (str): The end date in YYYY-MM-DD format.
    """
    return yf_instance.get_stock_price_date_range(symbol, start_date, end_date)

@mcp_instance.tool()
def get_historical_stock_prices(
    symbol: str,
    period: Literal[
        "1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"
    ] = "1mo",
    interval: Literal["1d", "5d", "1wk", "1mo", "3mo"] = "1d",
) -> str:
    """Get historical stock prices for a given stock symbol.

    Args:
        symbol (str): Stock symbol in Yahoo Finance format.
        period (str): The period for historical data. Defaults to "1mo".
                Valid periods: "1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"
        interval (str): The interval beween data points. Defaults to "1d".
                Valid intervals: "1d", "5d", "1wk", "1mo", "3mo"
    """
    return yf_instance.get_historical_stock_prices(symbol, period, interval)

@mcp_instance.tool()
def get_dividends(symbol: str) -> str:
    """Get dividends for a given stock symbol.

    Args:
        symbol (str): Stock symbol in Yahoo Finance format.
    """
    return yf_instance.get_dividends(symbol)

@mcp_instance.tool()
def get_income_statement(
    symbol: str, freq: Literal["yearly", "quarterly", "trainling"] = "yearly"
) -> str:
    """Get income statement for a given stock symbol.

    Args:
        symbol (str): Stock symbol in Yahoo Finance format.
        freq (str): At what frequency to get cashflow statements. Defaults to "yearly".
                Valid freqencies: "yearly", "quarterly", "trainling"
    """
    return yf_instance.get_income_statement(symbol, freq)

@mcp_instance.tool()
def get_cashflow(
    symbol: str, freq: Literal["yearly", "quarterly", "trainling"] = "yearly"
) -> str:
    """Get cashflow for a given stock symbol.

    Args:
        symbol (str): Stock symbol in Yahoo Finance format.
        freq (str): At what frequency to get cashflow statements. Defaults to "yearly".
                Valid freqencies: "yearly", "quarterly", "trainling"
    """
    # Note: Original function didn't specify return type, assuming str
    return str(yf_instance.get_cashflow(symbol, freq))

@mcp_instance.tool()
def get_earning_dates(symbol: str, limit: int = 12) -> str:
    """Get earning dates.

    Args:
        symbol (str): Stock symbol in Yahoo Finance format.
        limit (int): max amount of upcoming and recent earnings dates to return. Default value 12 should return next 4 quarters and last 8 quarters. Increase if more history is needed.
    """
    return yf_instance.get_earning_dates(symbol, limit)

@mcp_instance.tool()
def get_news(symbol: str) -> str:
    """Get news for a given stock symbol.

    Args:
        symbol (str): Stock symbol in Yahoo Finance format.
    """
    return yf_instance.get_news(symbol)

# --- Visualization Tools (Potential adjustment needed for return type) --- #

# Note: FastMCP might handle return types differently. If images don't work,
# we might need to return ImageContent explicitly.
@mcp_instance.tool()
def generate_market_dashboard(indices: str = "^GSPC,^DJI,^IXIC") -> Any:
    """Generate a market sentiment dashboard image (base64 PNG).

    Args:
        indices (str): Comma-separated list of index symbols (default: "^GSPC,^DJI,^IXIC")
    """
    # For now, return the base64 string. May need adjustment.
    image_base64 = yf_instance.generate_market_dashboard(indices)
    # return ImageContent(type="image", image={"format": "png", "base64": image_base64})
    return image_base64

@mcp_instance.tool()
def generate_portfolio_report(symbols: str = "AAPL,MSFT,GOOGL,AMZN,NVDA") -> Any:
    """Generate a portfolio performance tracking report image (base64 PNG).

    Args:
        symbols (str): Comma-separated list of stock symbols (default: "AAPL,MSFT,GOOGL,AMZN,NVDA")
    """
    image_base64 = yf_instance.generate_portfolio_report(symbols)
    # return ImageContent(type="image", image={"format": "png", "base64": image_base64})
    return image_base64

@mcp_instance.tool()
def generate_stock_technical_analysis(symbol: str = "TSLA") -> Any:
    """Generate a deep technical analysis report image (base64 PNG).

    Args:
        symbol (str): Stock symbol in Yahoo Finance format (default: "TSLA")
    """
    image_base64 = yf_instance.generate_stock_technical_analysis(symbol)
    # return ImageContent(type="image", image={"format": "png", "base64": image_base64})
    return image_base64


def main():
    # Run the server using stdio transport
    mcp_instance.run(transport='stdio')
