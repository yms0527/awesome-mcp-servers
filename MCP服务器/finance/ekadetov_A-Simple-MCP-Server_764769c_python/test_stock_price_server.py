import pytest
from unittest.mock import patch, MagicMock
from stock_price_server import get_stock_price, compare_stocks, get_stock_history


@patch("stock_price_server.yf.Ticker")
def test_get_stock_price_success(mock_ticker):
    # Set up mock to simulate successful price retrieval
    mock_ticker_instance = MagicMock()
    mock_data = MagicMock()
    mock_data.empty = False
    mock_data.__getitem__.return_value.iloc.__getitem__.return_value = 150.25
    mock_ticker_instance.history.return_value = mock_data
    mock_ticker.return_value = mock_ticker_instance

    # Test the function
    price = get_stock_price("AAPL")
    assert price == 150.25


@patch("stock_price_server.yf.Ticker")
def test_get_stock_price_empty_data(mock_ticker):
    # Set up mock to simulate empty data with fallback
    mock_ticker_instance = MagicMock()
    mock_data = MagicMock()
    mock_data.empty = True
    mock_ticker_instance.history.return_value = mock_data
    mock_ticker_instance.info = {"regularMarketPrice": 151.50}
    mock_ticker.return_value = mock_ticker_instance

    # Test the function
    price = get_stock_price("AAPL")
    assert price == 151.50


@patch("stock_price_server.yf.Ticker")
def test_get_stock_price_failure(mock_ticker):
    # Set up mock to simulate a failure case
    mock_ticker_instance = MagicMock()
    mock_data = MagicMock()
    mock_data.empty = True
    mock_ticker_instance.history.return_value = mock_data
    mock_ticker_instance.info = {}  # No market price available
    mock_ticker.return_value = mock_ticker_instance

    # Test the function
    price = get_stock_price("INVALID")
    assert price == -1.0


@patch("stock_price_server.get_stock_price")
def test_compare_stocks(mock_get_stock_price):
    # Set up return values for the two calls to get_stock_price
    mock_get_stock_price.side_effect = [150.25, 200.50]

    # Test comparison
    result = compare_stocks("AAPL", "GOOG")
    assert "AAPL ($150.25) is lower than GOOG ($200.50)" in result


@patch("stock_price_server.get_stock_price")
def test_compare_stocks_equal(mock_get_stock_price):
    # Test when both stocks have the same price
    mock_get_stock_price.side_effect = [150.25, 150.25]

    result = compare_stocks("AAPL", "MSFT")
    assert f"Both AAPL and MSFT have the same price ($150.25)" in result


@patch("stock_price_server.yf.Ticker")
def test_get_stock_history(mock_ticker):
    # Set up mock for historical data
    mock_ticker_instance = MagicMock()
    mock_data = MagicMock()
    mock_data.empty = False
    mock_data.to_csv.return_value = "Date,Open,High,Low,Close,Volume\n2023-04-16,150.25,152.30,149.80,151.20,12345678"
    mock_ticker_instance.history.return_value = mock_data
    mock_ticker.return_value = mock_ticker_instance

    # Test the function
    csv_data = get_stock_history("AAPL")
    assert "Date,Open,High,Low,Close,Volume" in csv_data
    assert "151.20" in csv_data


@patch("stock_price_server.yf.Ticker")
def test_get_stock_history_empty(mock_ticker):
    # Test case when no historical data is found
    mock_ticker_instance = MagicMock()
    mock_data = MagicMock()
    mock_data.empty = True
    mock_ticker_instance.history.return_value = mock_data
    mock_ticker.return_value = mock_ticker_instance

    # Test the function
    result = get_stock_history("UNKNOWN")
    assert "No historical data found" in result
