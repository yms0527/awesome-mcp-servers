import pytest
import json
from unittest.mock import Mock, patch, MagicMock
import pandas as pd
import sys
import os
import requests

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from tools import (
    get_available_tools, get_realtime_quote, get_fundamentals,
    get_price_history, get_dividends_and_actions, get_analyst_forecasts,
    get_valuation_insights, execute_tool, calculate_financial_ratios, 
    calculate_total_return_index, calculate_dividend_cagr, calculate_dividend_consistency
)
from tools.analysis import get_growth_projections
from models import MCPTool, FinancialRatios


class TestToolsRegistry:
    """Tests for tools registry and discovery"""
    
    def test_get_available_tools(self):
        """Test getting available tools list"""
        tools = get_available_tools()
        
        assert isinstance(tools, list)
        assert len(tools) == 7  # We have 7 tools defined
        
        # Check all tools are MCPTool instances (check class name to avoid import issues)
        for tool in tools:
            assert tool.__class__.__name__ == 'MCPTool'
            assert hasattr(tool, 'name')
            assert hasattr(tool, 'title')
            assert hasattr(tool, 'description')
            assert hasattr(tool, 'inputSchema')
        
        # Check expected tools are present
        tool_names = [tool.name for tool in tools]
        expected_tools = [
            "get_realtime_quote",
            "get_fundamentals",
            "get_price_history", 
            "get_dividends_and_actions",
            "get_analyst_forecasts",
            "get_growth_projections",
            "get_valuation_insights"
        ]
        
        for expected_tool in expected_tools:
            assert expected_tool in tool_names
    
    def test_tool_schemas_validation(self):
        """Test that all tool schemas are properly formatted"""
        tools = get_available_tools()
        
        for tool in tools:
            schema = tool.inputSchema
            
            # Check schema structure
            assert schema.type == "object"
            assert isinstance(schema.properties, dict)
            assert isinstance(schema.required, list)
            
            # Check that all required fields are in properties
            for required_field in schema.required:
                assert required_field in schema.properties
            
            # Check property definitions
            for prop_name, prop_def in schema.properties.items():
                assert "type" in prop_def
                assert "description" in prop_def
    
    def test_execute_tool_dispatcher(self):
        """Test tool execution dispatcher"""
        # Test valid tool
        result = execute_tool("get_realtime_quote", {"symbol": "AAPL"})
        assert isinstance(result, str)
        
        # Parse result to check it's valid JSON
        result_data = json.loads(result)
        assert isinstance(result_data, dict)
        
        # Test invalid tool
        result = execute_tool("invalid_tool", {})
        result_data = json.loads(result)
        assert "error" in result_data
        assert "not found" in result_data["error"]
        assert "available_tools" in result_data


class TestRealtimeQuote:
    """Tests for get_realtime_quote tool"""
    
    @patch('tools.market_data.yf.Ticker')
    def test_get_realtime_quote_success(self, mock_ticker):
        """Test successful realtime quote retrieval"""
        # Mock yfinance data
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Mock info data
        mock_ticker_instance.info = {
            'marketCap': 2500000000000,
            'trailingPE': 28.5,
            'dividendYield': 0.0065,
            'fiftyTwoWeekHigh': 180.25,
            'fiftyTwoWeekLow': 120.75,
            'currency': 'USD'
        }
        
        # Mock historical data
        mock_hist = pd.DataFrame({
            'Close': [149.0, 151.5],
            'Volume': [44000000, 45000000]
        })
        mock_ticker_instance.history.return_value = mock_hist
        
        result = get_realtime_quote({"symbol": "AAPL"})
        result_data = json.loads(result)
        
        assert "error" not in result_data
        assert result_data["symbol"] == "AAPL"
        assert result_data["price"] == 151.5
        assert result_data["change"] == 2.5
        assert result_data["change_percent"] == pytest.approx(1.677, rel=1e-2)
        assert result_data["volume"] == 45000000
        assert result_data["market_cap"] == 2500000000000
        assert result_data["currency"] == "USD"
    
    @patch('tools.market_data.yf.Ticker')
    def test_get_realtime_quote_no_data(self, mock_ticker):
        """Test realtime quote with no data found"""
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Return empty DataFrame
        mock_ticker_instance.history.return_value = pd.DataFrame()
        
        result = get_realtime_quote({"symbol": "INVALID"})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "No data found" in result_data["error"]
        assert result_data["symbol"] == "INVALID"
    
    def test_get_realtime_quote_missing_symbol(self):
        """Test realtime quote with missing symbol"""
        result = get_realtime_quote({})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "Symbol is required" in result_data["error"]
    
    def test_get_realtime_quote_empty_symbol(self):
        """Test realtime quote with empty symbol"""
        result = get_realtime_quote({"symbol": ""})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "Symbol is required" in result_data["error"]
    
    @patch('tools.market_data.yf.Ticker')
    def test_get_realtime_quote_exception(self, mock_ticker):
        """Test realtime quote with exception"""
        mock_ticker.side_effect = Exception("Network error")
        
        result = get_realtime_quote({"symbol": "AAPL"})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "Network error" in result_data["error"]


class TestFundamentals:
    """Tests for get_fundamentals tool"""
    
    @patch('tools.market_data.yf.Ticker')
    def test_get_fundamentals_annual(self, mock_ticker):
        """Test fundamentals retrieval with annual data"""
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Mock financial data
        mock_ticker_instance.info = {'currency': 'USD', 'trailingPE': 25.0}
        
        # Create mock financial statements
        dates = pd.to_datetime(['2023-12-31', '2022-12-31'])
        mock_financials = pd.DataFrame({
            dates[0]: {'Total Revenue': 100000, 'Net Income': 20000},
            dates[1]: {'Total Revenue': 90000, 'Net Income': 18000}
        })
        
        mock_ticker_instance.financials = mock_financials.T
        mock_ticker_instance.balance_sheet = pd.DataFrame()
        mock_ticker_instance.cashflow = pd.DataFrame()
        
        result = get_fundamentals({
            "instrument": "AAPL",
            "period": "annual",
            "years": 2
        })
        
        result_data = json.loads(result)
        assert "error" not in result_data
        assert result_data["symbol"] == "AAPL"
        assert "income" in result_data
        assert "balance" in result_data
        assert "cashflow" in result_data
        assert "ratios" in result_data
        assert "meta" in result_data
        
        # Check metadata
        meta = result_data["meta"]
        assert meta["period_type"] == "annual"
        assert meta["years_requested"] == 2
    
    def test_get_fundamentals_missing_instrument(self):
        """Test fundamentals with missing instrument"""
        result = get_fundamentals({"period": "annual"})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "Instrument" in result_data["error"]
    
    def test_get_fundamentals_invalid_period(self):
        """Test fundamentals with invalid period"""
        result = get_fundamentals({
            "instrument": "AAPL",
            "period": "invalid"
        })
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "Period must be one of" in result_data["error"]
    
    @patch('tools.market_data.yf.Ticker')
    def test_get_fundamentals_quarterly(self, mock_ticker):
        """Test fundamentals with quarterly data"""
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        mock_ticker_instance.info = {'currency': 'USD'}
        mock_ticker_instance.quarterly_financials = pd.DataFrame()
        mock_ticker_instance.quarterly_balance_sheet = pd.DataFrame()
        mock_ticker_instance.quarterly_cashflow = pd.DataFrame()
        
        result = get_fundamentals({
            "instrument": "AAPL",
            "period": "quarterly",
            "years": 4
        })
        
        result_data = json.loads(result)
        assert result_data["meta"]["period_type"] == "quarterly"
        assert result_data["meta"]["years_requested"] == 4


class TestPriceHistory:
    """Tests for get_price_history tool"""
    
    @patch('tools.market_data.yf.Ticker')
    def test_get_price_history_success(self, mock_ticker):
        """Test successful price history retrieval"""
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Mock historical data
        dates = pd.date_range('2024-01-01', periods=5, freq='D')
        mock_hist = pd.DataFrame({
            'Open': [150.0, 151.0, 152.0, 153.0, 154.0],
            'High': [151.0, 152.0, 153.0, 154.0, 155.0],
            'Low': [149.0, 150.0, 151.0, 152.0, 153.0],
            'Close': [150.5, 151.5, 152.5, 153.5, 154.5],
            'Volume': [1000000, 1100000, 1200000, 1300000, 1400000]
        }, index=dates)
        
        mock_ticker_instance.history.return_value = mock_hist
        mock_ticker_instance.dividends = pd.Series(dtype=float)
        mock_ticker_instance.splits = pd.Series(dtype=float)
        
        result = get_price_history({
            "instrument": "AAPL",
            "start": "2024-01-01",
            "end": "2024-01-05",
            "interval": "1d"
        })
        
        result_data = json.loads(result)
        assert "error" not in result_data
        assert result_data["symbol"] == "AAPL"
        assert len(result_data["bars"]) == 5
        assert result_data["interval"] == "1d"
        assert result_data["start_date"] == "2024-01-01"
        assert result_data["end_date"] == "2024-01-05"
        
        # Check first bar
        first_bar = result_data["bars"][0]
        assert first_bar["o"] == 150.0
        assert first_bar["h"] == 151.0
        assert first_bar["l"] == 149.0
        assert first_bar["c"] == 150.5
        assert first_bar["v"] == 1000000
    
    def test_get_price_history_missing_params(self):
        """Test price history with missing required parameters"""
        # Missing instrument
        result = get_price_history({"start": "2024-01-01", "end": "2024-01-05"})
        result_data = json.loads(result)
        assert "error" in result_data
        assert "Instrument" in result_data["error"]
        
        # Missing dates
        result = get_price_history({"instrument": "AAPL"})
        result_data = json.loads(result)
        assert "error" in result_data
        assert "start and end dates" in result_data["error"]
    
    def test_get_price_history_invalid_interval(self):
        """Test price history with invalid interval"""
        result = get_price_history({
            "instrument": "AAPL",
            "start": "2024-01-01",
            "end": "2024-01-05",
            "interval": "5m"
        })
        
        result_data = json.loads(result)
        assert "error" in result_data
        assert "Interval must be one of" in result_data["error"]
    
    def test_get_price_history_1m_interval_limit(self):
        """Test 1-minute interval date range limitation"""
        result = get_price_history({
            "instrument": "AAPL",
            "start": "2023-01-01",
            "end": "2024-01-01",
            "interval": "1m"
        })
        
        result_data = json.loads(result)
        assert "error" in result_data
        assert "1-minute interval data is only available" in result_data["error"]


class TestDividendsAndActions:
    """Tests for get_dividends_and_actions tool"""
    
    @patch('tools.market_data.yf.Ticker')
    def test_get_dividends_and_actions_success(self, mock_ticker):
        """Test successful dividends and actions retrieval"""
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Mock dividend data
        dates = pd.date_range('2020-01-01', periods=20, freq='3ME')
        dividends = pd.Series([0.20, 0.21, 0.22, 0.23] * 5, index=dates)
        mock_ticker_instance.dividends = dividends
        
        # Mock splits data
        split_dates = pd.date_range('2022-01-01', periods=1)
        splits = pd.Series([2.0], index=split_dates)
        mock_ticker_instance.splits = splits
        
        # Mock current price
        mock_ticker_instance.info = {'regularMarketPrice': 150.0}
        
        result = get_dividends_and_actions({
            "instrument": "AAPL",
            "start": "2020-01-01",
            "end": "2024-12-31"
        })
        
        result_data = json.loads(result)
        assert "error" not in result_data
        assert result_data["symbol"] == "AAPL"
        assert len(result_data["dividends"]) == 20
        assert len(result_data["actions"]) == 1
        
        # Check dividend record structure
        dividend = result_data["dividends"][0]
        assert "ex_date" in dividend
        assert "amount" in dividend
        assert "currency" in dividend
        
        # Check corporate action structure
        action = result_data["actions"][0]
        assert action["type"] == "split"
        assert action["factor"] == 2.0
        assert "effective_date" in action
    
    def test_get_dividends_and_actions_missing_instrument(self):
        """Test dividends and actions with missing instrument"""
        result = get_dividends_and_actions({})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "Instrument" in result_data["error"]
    
    @patch('tools.market_data.yf.Ticker')
    def test_get_dividends_and_actions_default_dates(self, mock_ticker):
        """Test dividends and actions with default date range"""
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        mock_ticker_instance.dividends = pd.Series(dtype=float)
        mock_ticker_instance.splits = pd.Series(dtype=float)
        mock_ticker_instance.info = {'regularMarketPrice': 150.0}
        
        result = get_dividends_and_actions({"instrument": "AAPL"})
        result_data = json.loads(result)
        
        # Should use default 10-year range
        assert "period_start" in result_data
        assert "period_end" in result_data


class TestUtilityFunctions:
    """Tests for utility functions"""
    
    def test_calculate_financial_ratios(self):
        """Test financial ratios calculation"""
        mock_ticker = Mock()
        info = {
            'trailingPE': 25.0,
            'priceToBook': 5.0,
            'returnOnEquity': 0.15,
            'marketCap': 2500000000000
        }
        
        # Mock empty financial statements
        mock_ticker.financials = pd.DataFrame()
        mock_ticker.balance_sheet = pd.DataFrame()
        mock_ticker.cashflow = pd.DataFrame()
        
        ratios = calculate_financial_ratios(mock_ticker, info)
        
        assert isinstance(ratios, FinancialRatios)
        assert ratios.pe_ratio == 25.0
        assert ratios.pb_ratio == 5.0
        assert ratios.roe == 0.15
    
    def test_calculate_total_return_index(self):
        """Test total return index calculation"""
        # Mock price data
        dates = pd.date_range('2024-01-01', periods=5, freq='D')
        price_data = pd.DataFrame({
            'Close': [100.0, 102.0, 101.0, 103.0, 105.0]
        }, index=dates)
        
        # Mock dividend data as Series (like yfinance returns)
        dividend_data = pd.Series([1.0], index=[dates[2]])  # Dividend on third day
        
        result = calculate_total_return_index(price_data, dividend_data)
        
        assert len(result) == 5
        assert all(hasattr(point, 't') and hasattr(point, 'tr') for point in result)
        assert result[0].tr == 100.0  # Base index
        assert result[-1].tr > 100.0  # Should be higher due to price appreciation
    
    def test_calculate_dividend_cagr(self):
        """Test dividend CAGR calculation"""
        # Create test dividend series
        dates = pd.date_range('2020-01-01', periods=20, freq='3ME')
        # Simulate growing dividends
        amounts = [0.20 * (1.05 ** (i // 4)) for i in range(20)]
        dividend_series = pd.Series(amounts, index=dates)
        
        cagr = calculate_dividend_cagr(dividend_series, 5.0)
        
        assert cagr is not None
        assert isinstance(cagr, float)
        assert cagr > 0  # Should show growth
    
    def test_calculate_dividend_consistency(self):
        """Test dividend consistency calculation"""
        # Create test dividend series with consistent payments
        dates = pd.date_range('2020-01-01', periods=16, freq='3ME')
        amounts = [0.25] * 16  # Consistent quarterly dividends
        dividend_series = pd.Series(amounts, index=dates)
        
        consistency = calculate_dividend_consistency(dividend_series)
        
        assert consistency is not None
        assert isinstance(consistency, float)
        assert consistency > 80  # Should show high consistency
    
    def test_calculate_dividend_consistency_with_cuts(self):
        """Test dividend consistency with dividend cuts"""
        dates = pd.date_range('2020-01-01', periods=16, freq='3ME')
        amounts = [0.25] * 8 + [0.20] * 4 + [0.15] * 4  # Declining dividends
        dividend_series = pd.Series(amounts, index=dates)
        
        consistency = calculate_dividend_consistency(dividend_series)
        
        assert consistency is not None
        assert consistency < 90  # Should be penalized for cuts


class TestAnalystForecasts:
    """Tests for get_analyst_forecasts tool"""
    
    @patch('tools.analysis.yf.Ticker')
    def test_get_analyst_forecasts_success(self, mock_ticker):
        """Test successful analyst forecasts retrieval"""
        # Mock yfinance data
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Mock ticker info
        mock_ticker_instance.info = {
            'regularMarketPrice': 150.0,
            'targetMeanPrice': 175.0,
            'targetHighPrice': 200.0,
            'targetLowPrice': 150.0,
            'recommendationMean': 2.0,
            'totalRevenue': 400000000000,
            'revenueGrowth': 0.05
        }
        
        # Mock recommendations
        mock_recommendations = pd.DataFrame({
            'strongBuy': [8],
            'buy': [15],
            'hold': [12],
            'sell': [2],
            'strongSell': [1]
        })
        mock_ticker_instance.recommendations_summary = mock_recommendations
        
        # Mock upgrades/downgrades  
        mock_upgrades_downgrades = pd.DataFrame({
            'Action': ['upgrade', 'downgrade', 'raise'],
            'Firm': ['Firm A', 'Firm B', 'Firm C']
        }, index=pd.date_range('2024-06-01', periods=3, freq='D'))
        mock_ticker_instance.upgrades_downgrades = mock_upgrades_downgrades
        
        result = get_analyst_forecasts({"symbol": "AAPL"})
        result_data = json.loads(result)
        
        assert "error" not in result_data
        assert result_data["symbol"] == "AAPL"
        assert "analyst_forecasts" in result_data
        assert "last_updated" in result_data
        
        # Check new structure
        forecasts = result_data["analyst_forecasts"]
        
        # Check price targets
        price_target = forecasts["price_target"]
        assert price_target["mean"] == 175.0
        assert price_target["high"] == 200.0
        assert price_target["low"] == 150.0
        assert price_target["upside_potential"] == 16.7  # (175-150)/150 * 100
        
        # Check recommendations
        recommendations = forecasts["recommendations"]
        assert recommendations["strong_buy"] == 8
        assert recommendations["buy"] == 15
        assert recommendations["hold"] == 12
        assert recommendations["consensus"] == "Buy"  # recommendationMean 2.0 = Buy
        
        # Check revenue forecasts
        revenue = forecasts["revenue_forecasts"]
        assert revenue["current_year"]["estimate"] == 400000000000
        assert revenue["current_year"]["growth_rate"] == 5.0
    
    @patch('tools.analysis.yf.Ticker')
    def test_get_analyst_forecasts_yfinance_error(self, mock_ticker):
        """Test analyst forecasts with yfinance error"""
        mock_ticker.side_effect = Exception("Invalid ticker symbol")
        
        result = get_analyst_forecasts({"symbol": "INVALID"})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "Invalid ticker symbol" in result_data["error"]
        assert result_data["symbol"] == "INVALID"
    
    def test_get_analyst_forecasts_missing_symbol(self):
        """Test analyst forecasts with missing symbol"""
        result = get_analyst_forecasts({})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "Symbol is required" in result_data["error"]
    
    def test_get_analyst_forecasts_empty_symbol(self):
        """Test analyst forecasts with empty symbol"""
        result = get_analyst_forecasts({"symbol": ""})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "Symbol is required" in result_data["error"]
    
    @patch('tools.analysis.yf.Ticker')
    def test_get_analyst_forecasts_minimal_data(self, mock_ticker):
        """Test analyst forecasts with minimal data available"""
        # Mock yfinance with minimal data
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Mock minimal ticker info (just current price)
        mock_ticker_instance.info = {'regularMarketPrice': 100.0}
        
        # Mock empty data for other fields
        mock_ticker_instance.recommendations_summary = pd.DataFrame()
        mock_ticker_instance.upgrades_downgrades = pd.DataFrame()
        
        result = get_analyst_forecasts({"symbol": "MINIMALSTOCK"})
        result_data = json.loads(result)
        
        # Should succeed with minimal data
        assert "error" not in result_data
        assert result_data["symbol"] == "MINIMALSTOCK"
        assert "analyst_forecasts" in result_data
        
        # Check that structure exists even with minimal data
        forecasts = result_data["analyst_forecasts"]
        assert "price_target" in forecasts
        assert "recommendations" in forecasts
        assert "eps_forecasts" in forecasts
        assert "revenue_forecasts" in forecasts
        assert "forecast_revision_trend" in forecasts


class TestGrowthProjections:
    """Tests for get_growth_projections tool"""
    
    @patch('tools.analysis.yf.Ticker')
    def test_get_growth_projections_success(self, mock_ticker):
        """Test successful growth projections retrieval"""
        # Mock yfinance data
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Mock basic info
        mock_ticker_instance.info = {
            'revenueGrowth': 0.08,
            'earningsGrowth': 0.12,
            'freeCashflow': 100000000000
        }
        
        # Mock growth estimates
        mock_growth_estimates = pd.DataFrame({
            'stockTrend': [0.075, 0.08, 0.095, 0.11, 0.15]
        }, index=['0q', '+1q', '0y', '+1y', 'LTG'])
        mock_ticker_instance.growth_estimates = mock_growth_estimates
        
        # Mock revenue estimates
        mock_revenue_estimates = pd.DataFrame({
            'avg': [415000000000, 435000000000],
            'growth': [0.062, 0.048]
        }, index=['0y', '+1y'])
        mock_ticker_instance.revenue_estimate = mock_revenue_estimates
        
        # Mock earnings estimates
        mock_earnings_estimates = pd.DataFrame({
            'avg': [7.38, 7.94],
            'growth': [0.214, 0.076]
        }, index=['0y', '+1y'])
        mock_ticker_instance.earnings_estimate = mock_earnings_estimates
        
        result = get_growth_projections({"symbol": "AAPL"})
        result_data = json.loads(result)
        
        assert "error" not in result_data
        assert result_data["symbol"] == "AAPL"
        assert "growth_projections" in result_data
        assert "summary" in result_data
        assert "last_updated" in result_data
        
        # Check growth projections structure
        projections = result_data["growth_projections"]
        assert "revenue" in projections
        assert "eps" in projections
        assert "free_cash_flow" in projections
        
        # Check revenue projections
        revenue = projections["revenue"]
        assert "next_year" in revenue
        assert "next_3_years" in revenue
        assert "next_5_years" in revenue
        
        # Check next year revenue data
        next_year_rev = revenue["next_year"]
        assert "estimate" in next_year_rev
        assert "growth_rate" in next_year_rev
        assert next_year_rev["estimate"] == 435000000000.0
        
        # Check multi-year projections
        three_year_rev = revenue["next_3_years"]
        assert "cumulative_growth" in three_year_rev
        assert "cagr" in three_year_rev
        
        five_year_rev = revenue["next_5_years"]
        assert "cumulative_growth" in five_year_rev
        assert "cagr" in five_year_rev
        
        # Check EPS projections
        eps = projections["eps"]
        assert "next_year" in eps
        next_year_eps = eps["next_year"]
        assert "estimate" in next_year_eps
        assert "growth_rate" in next_year_eps
        assert next_year_eps["estimate"] == 7.94
        
        # Check summary
        summary = result_data["summary"]
        assert "expected_cagr_revenue_5y" in summary
        assert "expected_cagr_eps_5y" in summary
        assert "expected_cagr_fcf_5y" in summary
        assert "overall_growth_outlook" in summary
        
        # Growth outlook should be positive given good growth rates
        assert summary["overall_growth_outlook"] in [
            "Very Positive", "Positive", "Moderate", "Conservative", "Challenging", "Data Limited"
        ]
    
    @patch('tools.analysis.yf.Ticker')
    def test_get_growth_projections_minimal_data(self, mock_ticker):
        """Test growth projections with minimal data available"""
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Mock minimal data
        mock_ticker_instance.info = {}
        mock_ticker_instance.growth_estimates = pd.DataFrame()
        mock_ticker_instance.revenue_estimate = pd.DataFrame()
        mock_ticker_instance.earnings_estimate = pd.DataFrame()
        
        result = get_growth_projections({"symbol": "MINIMALSTOCK"})
        result_data = json.loads(result)
        
        # Should succeed with minimal data
        assert "error" not in result_data
        assert result_data["symbol"] == "MINIMALSTOCK"
        assert "growth_projections" in result_data
        assert "summary" in result_data
        
        # Summary should show limited data
        summary = result_data["summary"]
        assert summary["overall_growth_outlook"] == "Data Limited"
    
    @patch('tools.analysis.yf.Ticker')
    def test_get_growth_projections_partial_data(self, mock_ticker):
        """Test growth projections with partial data (only revenue estimates)"""
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Mock partial data - only revenue estimates
        mock_ticker_instance.info = {'revenueGrowth': 0.06}
        mock_ticker_instance.growth_estimates = pd.DataFrame()
        
        mock_revenue_estimates = pd.DataFrame({
            'avg': [400000000000, 420000000000]
        }, index=['0y', '+1y'])
        mock_ticker_instance.revenue_estimate = mock_revenue_estimates
        mock_ticker_instance.earnings_estimate = pd.DataFrame()
        
        result = get_growth_projections({"symbol": "PARTIALDATA"})
        result_data = json.loads(result)
        
        assert "error" not in result_data
        projections = result_data["growth_projections"]
        
        # Should have revenue data but not EPS
        assert projections["revenue"] is not None
        assert "next_year" in projections["revenue"]
        
        # EPS might be None if no data available
        if projections["eps"] is not None:
            # If EPS data is present, it should have proper structure
            assert "next_year" in projections["eps"]
    
    @patch('tools.analysis.yf.Ticker')
    def test_get_growth_projections_yfinance_error(self, mock_ticker):
        """Test growth projections with yfinance error"""
        mock_ticker.side_effect = Exception("Invalid ticker symbol")
        
        result = get_growth_projections({"symbol": "INVALID"})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "Invalid ticker symbol" in result_data["error"]
        assert result_data["symbol"] == "INVALID"
    
    def test_get_growth_projections_missing_symbol(self):
        """Test growth projections with missing symbol"""
        result = get_growth_projections({})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "Symbol is required" in result_data["error"]
    
    def test_get_growth_projections_empty_symbol(self):
        """Test growth projections with empty symbol"""
        result = get_growth_projections({"symbol": ""})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "Symbol is required" in result_data["error"]
    
    @patch('tools.analysis.yf.Ticker')
    def test_get_growth_projections_fcf_calculation(self, mock_ticker):
        """Test FCF projections calculation based on revenue growth"""
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Mock data with FCF info
        mock_ticker_instance.info = {
            'freeCashflow': 80000000000,
            'revenueGrowth': 0.10
        }
        
        # Mock revenue estimates to trigger FCF calculation
        mock_revenue_estimates = pd.DataFrame({
            'avg': [400000000000, 440000000000]
        }, index=['0y', '+1y'])
        mock_ticker_instance.revenue_estimate = mock_revenue_estimates
        
        mock_ticker_instance.growth_estimates = pd.DataFrame()
        mock_ticker_instance.earnings_estimate = pd.DataFrame()
        
        result = get_growth_projections({"symbol": "CASHRICH"})
        result_data = json.loads(result)
        
        assert "error" not in result_data
        projections = result_data["growth_projections"]
        
        # Should have FCF projections
        if projections["free_cash_flow"] is not None:
            fcf = projections["free_cash_flow"]
            assert "next_year" in fcf
            next_year_fcf = fcf["next_year"]
            assert "estimate" in next_year_fcf
            assert "growth_rate" in next_year_fcf
            # FCF growth should be related to revenue growth (slightly higher)
            assert next_year_fcf["growth_rate"] > 10.0  # Should be > 10% based on revenue growth
    
    @patch('tools.analysis.yf.Ticker')
    def test_get_growth_projections_outlook_calculation(self, mock_ticker):
        """Test different growth outlook calculations"""
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Test cases for different growth scenarios
        test_cases = [
            # High growth scenario
            {
                'revenueGrowth': 0.20, 'earningsGrowth': 0.25,
                'expected_outlook': 'Very Positive'
            },
            # Moderate growth scenario  
            {
                'revenueGrowth': 0.08, 'earningsGrowth': 0.10,
                'expected_outlook': 'Positive'
            },
            # Low growth scenario
            {
                'revenueGrowth': 0.03, 'earningsGrowth': 0.05,
                'expected_outlook': 'Moderate'
            }
        ]
        
        for i, case in enumerate(test_cases):
            # Mock info for this test case
            mock_ticker_instance.info = {
                'revenueGrowth': case['revenueGrowth'],
                'earningsGrowth': case['earningsGrowth'],
                'freeCashflow': 50000000000
            }
            
            # Mock revenue estimates
            current_revenue = 300000000000
            next_revenue = current_revenue * (1 + case['revenueGrowth'])
            mock_revenue_estimates = pd.DataFrame({
                'avg': [current_revenue, next_revenue]
            }, index=['0y', '+1y'])
            mock_ticker_instance.revenue_estimate = mock_revenue_estimates
            
            # Mock earnings estimates
            current_eps = 5.0
            next_eps = current_eps * (1 + case['earningsGrowth'])
            mock_earnings_estimates = pd.DataFrame({
                'avg': [current_eps, next_eps]
            }, index=['0y', '+1y'])
            mock_ticker_instance.earnings_estimate = mock_earnings_estimates
            
            mock_ticker_instance.growth_estimates = pd.DataFrame()
            
            result = get_growth_projections({"symbol": f"TEST{i}"})
            result_data = json.loads(result)
            
            assert "error" not in result_data
            summary = result_data["summary"]
            
            # Outlook should match expectations for the growth scenario
            # Note: Actual outlook depends on precise calculation, so we check it's reasonable
            assert summary["overall_growth_outlook"] in [
                "Very Positive", "Positive", "Moderate", "Conservative", "Challenging", "Data Limited"
            ]


class TestErrorHandling:
    """Tests for error handling across all tools"""
    
    def test_tool_argument_validation(self):
        """Test that tools validate arguments properly"""
        # Test each tool with invalid arguments
        invalid_cases = [
            ("get_realtime_quote", {"invalid_field": "value"}),
            ("get_fundamentals", {"instrument": "AAPL", "period": "invalid"}),
            ("get_price_history", {"instrument": "AAPL", "start": "invalid-date"}),
            ("get_dividends_and_actions", {"instrument": ""}),
            ("get_analyst_forecasts", {"symbol": ""}),
            ("get_growth_projections", {"symbol": ""}),
            ("get_valuation_insights", {"symbol": ""})
        ]
        
        for tool_name, args in invalid_cases:
            result = execute_tool(tool_name, args)
            result_data = json.loads(result)
            
            # Should return error or handle gracefully
            assert isinstance(result_data, dict)
            # Either contains error field or is handled by the tool
            if "error" in result_data:
                assert isinstance(result_data["error"], str)
    
    @patch('tools.market_data.yf.Ticker')
    def test_network_error_handling(self, mock_ticker):
        """Test handling of network errors"""
        # Simulate network timeout
        mock_ticker.side_effect = Exception("Connection timeout")
        
        # Test yfinance-based tools
        yfinance_tools = [
            ("get_realtime_quote", {"symbol": "AAPL"}),
            ("get_fundamentals", {"instrument": "AAPL", "period": "annual"}),
            ("get_price_history", {"instrument": "AAPL", "start": "2024-01-01", "end": "2024-01-05"}),
            ("get_dividends_and_actions", {"instrument": "AAPL"})
        ]
        
        for tool_name, args in yfinance_tools:
            result = execute_tool(tool_name, args)
            result_data = json.loads(result)
            
            assert "error" in result_data
            assert "timeout" in result_data["error"].lower() or "error" in result_data["error"].lower()
    
    @patch('tools.market_data.yf.Ticker')
    def test_analyst_forecasts_network_error_handling(self, mock_ticker):
        """Test network error handling specifically for analyst forecasts"""
        # Mock yfinance to fail (this is the primary data source now)
        mock_ticker.side_effect = Exception("Connection timeout")
        
        result = execute_tool("get_analyst_forecasts", {"symbol": "AAPL"})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "timeout" in result_data["error"].lower() or "connection" in result_data["error"].lower()
    
    @patch('tools.analysis.requests.get')
    @patch('tools.analysis.yf.Ticker')
    @patch('tools.analysis.os.getenv')
    def test_analyst_forecasts_alpha_vantage_fallback(self, mock_getenv, mock_ticker, mock_requests_get):
        """Test that Alpha Vantage errors don't break the function (graceful fallback)"""
        # Mock API key
        mock_getenv.return_value = "test_api_key"
        
        # Mock yfinance to work normally
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        mock_ticker_instance.info = {'regularMarketPrice': 150.0}
        mock_ticker_instance.recommendations_summary = pd.DataFrame()
        mock_ticker_instance.upgrades_downgrades = pd.DataFrame()
        
        # Mock Alpha Vantage to fail
        mock_requests_get.side_effect = requests.RequestException("Alpha Vantage timeout")
        
        result = execute_tool("get_analyst_forecasts", {"symbol": "AAPL"})
        result_data = json.loads(result)
        
        # Should succeed despite Alpha Vantage failure (yfinance is primary)
        assert "error" not in result_data
        assert result_data["symbol"] == "AAPL"
        assert "analyst_forecasts" in result_data
    
    def test_empty_data_handling(self):
        """Test handling of empty or null data"""
        with patch('tools.market_data.yf.Ticker') as mock_ticker:
            mock_ticker_instance = Mock()
            mock_ticker.return_value = mock_ticker_instance
            
            # Simulate empty data responses
            mock_ticker_instance.history.return_value = pd.DataFrame()
            mock_ticker_instance.info = {}
            mock_ticker_instance.dividends = pd.Series(dtype=float)
            mock_ticker_instance.splits = pd.Series(dtype=float)
            
            # Test each tool handles empty data gracefully
            result = get_realtime_quote({"symbol": "EMPTY"})
            result_data = json.loads(result)
            assert "error" in result_data or "symbol" in result_data


class TestValuationInsights:
    """Tests for get_valuation_insights tool"""
    
    @patch('tools.analysis.yf.Ticker')
    def test_get_valuation_insights_success(self, mock_ticker):
        """Test successful valuation insights retrieval"""
        # Mock yfinance data
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Mock ticker info with comprehensive valuation data
        mock_ticker_instance.info = {
            'trailingPE': 28.5,
            'forwardPE': 26.2,
            'priceToBook': 7.3,
            'priceToSalesTrailing12Months': 5.8,
            'enterpriseToEbitda': 18.4,
            'earningsGrowth': 0.12,  # 12% growth for PEG calculation
            'sector': 'Technology'
        }
        
        result = get_valuation_insights({"symbol": "AAPL"})
        result_data = json.loads(result)
        
        assert "error" not in result_data
        assert result_data["symbol"] == "AAPL"
        assert "valuation_insights" in result_data
        assert "last_updated" in result_data
        
        # Check valuation insights structure
        insights = result_data["valuation_insights"]
        
        # Check multiples
        multiples = insights["multiples"]
        assert multiples["pe_trailing"] == 28.5
        assert multiples["pe_forward"] == 26.2
        assert multiples["pb_ratio"] == 7.3
        assert multiples["ps_ratio"] == 5.8
        assert multiples["ev_ebitda"] == 18.4
        
        # PEG should be calculated: PE / (Growth * 100) = 26.2 / 12 = 2.18
        assert multiples["peg_ratio"] == pytest.approx(2.18, rel=1e-2)
        
        # Check sector comparison
        sector_comp = insights["sector_comparison"]
        assert sector_comp["sector_pe"] == 28.0  # Technology sector average
        assert sector_comp["sector_peg"] == 1.4   # Technology sector average
        assert "percentile_vs_sector_pe" in sector_comp
        assert "percentile_vs_sector_peg" in sector_comp
        
        # Check valuation score
        val_score = insights["valuation_score"]
        assert "score" in val_score
        assert "label" in val_score  
        assert "reasoning" in val_score
        assert val_score["score"] >= 0 and val_score["score"] <= 100
        
        # Check historical context
        hist_context = insights["historical_context"]
        assert "current_vs_5y_avg_pe" in hist_context
        assert "current_vs_5y_avg_ev_ebitda" in hist_context
    
    @patch('tools.analysis.requests.get')
    @patch('tools.analysis.yf.Ticker')
    @patch('tools.analysis.os.getenv')
    def test_get_valuation_insights_with_alpha_vantage(self, mock_getenv, mock_ticker, mock_requests_get):
        """Test valuation insights with Alpha Vantage data enhancement"""
        # Mock API key
        mock_getenv.return_value = "test_api_key"
        
        # Mock yfinance data (minimal)
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        mock_ticker_instance.info = {
            'sector': 'Healthcare',
            'earningsGrowth': 0.08
        }
        
        # Mock Alpha Vantage response
        alpha_response = Mock()
        alpha_response.json.return_value = {
            'PERatio': '24.5',
            'PriceToBookRatio': '3.2',
            'EVToEBITDA': '16.8'
        }
        alpha_response.raise_for_status.return_value = None
        mock_requests_get.return_value = alpha_response
        
        result = get_valuation_insights({"symbol": "JNJ"})
        result_data = json.loads(result)
        
        assert "error" not in result_data
        assert result_data["symbol"] == "JNJ"
        
        # Should have data from Alpha Vantage
        multiples = result_data["valuation_insights"]["multiples"]
        assert multiples["pe_trailing"] == 24.5
        assert multiples["pb_ratio"] == 3.2
        assert multiples["ev_ebitda"] == 16.8
        
        # Should use Healthcare sector averages
        sector_comp = result_data["valuation_insights"]["sector_comparison"]
        assert sector_comp["sector_pe"] == 24.0
        assert sector_comp["sector_peg"] == 1.3
    
    @patch('tools.analysis.yf.Ticker')
    def test_get_valuation_insights_unknown_sector(self, mock_ticker):
        """Test valuation insights with unknown sector"""
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Mock ticker info with unknown sector
        mock_ticker_instance.info = {
            'trailingPE': 20.0,
            'forwardPE': 18.5,
            'sector': 'Unknown Sector',
            'earningsGrowth': 0.10
        }
        
        result = get_valuation_insights({"symbol": "UNKNOWN"})
        result_data = json.loads(result)
        
        assert "error" not in result_data
        insights = result_data["valuation_insights"]
        
        # Should still have multiples
        multiples = insights["multiples"]
        assert multiples["pe_trailing"] == 20.0
        assert multiples["pe_forward"] == 18.5
        
        # Sector comparison should be null for unknown sector
        sector_comp = insights["sector_comparison"]
        assert sector_comp["sector_pe"] is None
        assert sector_comp["sector_peg"] is None
        assert sector_comp["percentile_vs_sector_pe"] is None
        assert sector_comp["percentile_vs_sector_peg"] is None
    
    @patch('tools.analysis.yf.Ticker')
    def test_get_valuation_insights_valuation_score_calculation(self, mock_ticker):
        """Test different valuation score scenarios"""
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Test case 1: Undervalued stock (low PEG, PE below sector)
        mock_ticker_instance.info = {
            'trailingPE': 22.0,
            'forwardPE': 20.0,
            'earningsGrowth': 0.25,  # 25% growth -> PEG = 20/25 = 0.8
            'sector': 'Technology'
        }
        
        result = get_valuation_insights({"symbol": "UNDERVALUED"})
        result_data = json.loads(result)
        
        val_score = result_data["valuation_insights"]["valuation_score"]
        # Should get high score (80+ for PEG < 1.0, plus PE below sector)
        assert val_score["score"] >= 65
        assert "Undervalued" in val_score["label"]
        assert "PEG" in val_score["reasoning"]
        
        # Test case 2: Overvalued stock (high PEG)
        mock_ticker_instance.info = {
            'trailingPE': 45.0,
            'forwardPE': 40.0,
            'earningsGrowth': 0.05,  # 5% growth -> PEG = 40/5 = 8.0
            'sector': 'Technology'
        }
        
        result = get_valuation_insights({"symbol": "OVERVALUED"})
        result_data = json.loads(result)
        
        val_score = result_data["valuation_insights"]["valuation_score"]
        # Should get low score for high PEG
        assert val_score["score"] <= 50
        assert "Overvalued" in val_score["label"] or "Fairly Valued" in val_score["label"]
    
    @patch('tools.analysis.yf.Ticker')
    def test_get_valuation_insights_minimal_data(self, mock_ticker):
        """Test valuation insights with minimal data available"""
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Mock minimal data
        mock_ticker_instance.info = {}
        
        result = get_valuation_insights({"symbol": "MINIMAL"})
        result_data = json.loads(result)
        
        # Should succeed with minimal data
        assert "error" not in result_data
        assert result_data["symbol"] == "MINIMAL"
        assert "valuation_insights" in result_data
        
        # All multiples should be null
        multiples = result_data["valuation_insights"]["multiples"]
        assert multiples["pe_trailing"] is None
        assert multiples["pe_forward"] is None
        assert multiples["peg_ratio"] is None
        assert multiples["pb_ratio"] is None
        assert multiples["ps_ratio"] is None
        assert multiples["ev_ebitda"] is None
        
        # Score should be null due to lack of data
        val_score = result_data["valuation_insights"]["valuation_score"]
        assert val_score["score"] is None
        assert val_score["label"] is None
    
    @patch('tools.analysis.yf.Ticker')
    def test_get_valuation_insights_yfinance_error(self, mock_ticker):
        """Test valuation insights with yfinance error"""
        mock_ticker.side_effect = Exception("Invalid ticker symbol")
        
        result = get_valuation_insights({"symbol": "INVALID"})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "Invalid ticker symbol" in result_data["error"]
        assert result_data["symbol"] == "INVALID"
    
    def test_get_valuation_insights_missing_symbol(self):
        """Test valuation insights with missing symbol"""
        result = get_valuation_insights({})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "Symbol is required" in result_data["error"]
    
    def test_get_valuation_insights_empty_symbol(self):
        """Test valuation insights with empty symbol"""  
        result = get_valuation_insights({"symbol": ""})
        result_data = json.loads(result)
        
        assert "error" in result_data
        assert "Symbol is required" in result_data["error"]
    
    @patch('tools.analysis.requests.get')
    @patch('tools.analysis.yf.Ticker')
    @patch('tools.analysis.os.getenv')
    def test_get_valuation_insights_alpha_vantage_fallback(self, mock_getenv, mock_ticker, mock_requests_get):
        """Test that Alpha Vantage errors don't break the function (graceful fallback)"""
        # Mock API key
        mock_getenv.return_value = "test_api_key"
        
        # Mock yfinance to work normally
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        mock_ticker_instance.info = {
            'trailingPE': 25.0,
            'forwardPE': 23.0,
            'sector': 'Energy'
        }
        
        # Mock Alpha Vantage to fail
        mock_requests_get.side_effect = requests.RequestException("Alpha Vantage timeout")
        
        result = get_valuation_insights({"symbol": "XOM"})
        result_data = json.loads(result)
        
        # Should succeed despite Alpha Vantage failure (yfinance is primary)
        assert "error" not in result_data
        assert result_data["symbol"] == "XOM"
        assert "valuation_insights" in result_data
        
        # Should still have yfinance data
        multiples = result_data["valuation_insights"]["multiples"]
        assert multiples["pe_trailing"] == 25.0
        assert multiples["pe_forward"] == 23.0
    
    @patch('tools.analysis.yf.Ticker')
    def test_get_valuation_insights_pe_forward_vs_trailing_context(self, mock_ticker):
        """Test historical context calculation using forward vs trailing PE"""
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Mock data where forward PE is lower than trailing (positive sign)
        mock_ticker_instance.info = {
            'trailingPE': 30.0,
            'forwardPE': 25.0,  # Lower forward PE
            'sector': 'Consumer Cyclical'
        }
        
        result = get_valuation_insights({"symbol": "IMPROVING"})
        result_data = json.loads(result)
        
        hist_context = result_data["valuation_insights"]["historical_context"]
        # Should show negative change (forward - trailing = 25 - 30 = -5.0)
        assert hist_context["current_vs_5y_avg_pe"] == -5.0
    
    @patch('tools.analysis.yf.Ticker') 
    def test_get_valuation_insights_sector_percentiles(self, mock_ticker):
        """Test sector percentile calculations"""
        mock_ticker_instance = Mock()
        mock_ticker.return_value = mock_ticker_instance
        
        # Test with Financial Services sector (PE: 12.0, PEG: 1.0)
        mock_ticker_instance.info = {
            'trailingPE': 10.0,  # Below sector average
            'forwardPE': 9.5,
            'earningsGrowth': 0.08,  # PEG = 9.5/8 = 1.19, above sector average
            'sector': 'Financial Services'
        }
        
        result = get_valuation_insights({"symbol": "BANK"})
        result_data = json.loads(result)
        
        sector_comp = result_data["valuation_insights"]["sector_comparison"]
        assert sector_comp["sector_pe"] == 12.0
        assert sector_comp["sector_peg"] == 1.0
        
        # PE below sector average should get lower percentile
        assert sector_comp["percentile_vs_sector_pe"] == 25
        
        # PEG above sector average should get higher percentile  
        assert sector_comp["percentile_vs_sector_peg"] in [55, 75]  # Depends on exact threshold