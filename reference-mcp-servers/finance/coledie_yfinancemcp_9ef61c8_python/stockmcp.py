"""
Equity Research MCP Server
A comprehensive MCP server for equity researchers with fundamental analysis,
technical indicators, financial statements, and peer comparison tools.

### Made with Claude
"""

from fastmcp import FastMCP
import yfinance as yf
import pandas as pd
import numpy as np
from typing import Dict, List
from concurrent.futures import ThreadPoolExecutor

# Initialize FastMCP server
mcp = FastMCP("equity-research-server")

# Thread pool for concurrent operations
executor = ThreadPoolExecutor(max_workers=10)

@mcp.tool()
def get_stock_overview(symbol: str) -> Dict:
    """
    Get comprehensive overview of a stock including price, volume, market cap, and key metrics.
    
    Args:
        symbol: Stock ticker symbol (e.g., 'AAPL')
    
    Returns:
        Dictionary with stock overview data
    """
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        hist = ticker.history(period="1d")
        
        if hist.empty:
            return {"error": f"No data found for symbol {symbol}"}
        
        current_price = float(hist['Close'].iloc[-1])
        
        return {
            "symbol": symbol,
            "company_name": info.get('longName', 'N/A'),
            "sector": info.get('sector', 'N/A'),
            "industry": info.get('industry', 'N/A'),
            "current_price": current_price,
            "previous_close": info.get('previousClose', 'N/A'),
            "open": float(hist['Open'].iloc[-1]),
            "day_high": float(hist['High'].iloc[-1]),
            "day_low": float(hist['Low'].iloc[-1]),
            "volume": int(hist['Volume'].iloc[-1]),
            "avg_volume": info.get('averageVolume', 'N/A'),
            "market_cap": info.get('marketCap', 'N/A'),
            "pe_ratio": info.get('trailingPE', 'N/A'),
            "forward_pe": info.get('forwardPE', 'N/A'),
            "dividend_yield": info.get('dividendYield', 'N/A'),
            "52_week_high": info.get('fiftyTwoWeekHigh', 'N/A'),
            "52_week_low": info.get('fiftyTwoWeekLow', 'N/A'),
            "beta": info.get('beta', 'N/A'),
            "eps": info.get('trailingEps', 'N/A'),
            "book_value": info.get('bookValue', 'N/A'),
            "price_to_book": info.get('priceToBook', 'N/A'),
            "debt_to_equity": info.get('debtToEquity', 'N/A'),
            "return_on_equity": info.get('returnOnEquity', 'N/A'),
            "return_on_assets": info.get('returnOnAssets', 'N/A'),
            "profit_margin": info.get('profitMargins', 'N/A'),
            "operating_margin": info.get('operatingMargins', 'N/A')
        }
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def get_financial_statements(symbol: str, statement_type: str = "all", period: str = "annual") -> Dict:
    """
    Get financial statements (income statement, balance sheet, cash flow).
    
    Args:
        symbol: Stock ticker symbol
        statement_type: 'income', 'balance', 'cashflow', or 'all'
        period: 'annual' or 'quarterly'
    
    Returns:
        Dictionary with financial statement data
    """
    try:
        ticker = yf.Ticker(symbol)
        result = {}
        
        if period == "annual":
            if statement_type in ["income", "all"]:
                income = ticker.financials
                if income is not None and not income.empty:
                    result["income_statement"] = income.to_dict()
            
            if statement_type in ["balance", "all"]:
                balance = ticker.balance_sheet
                if balance is not None and not balance.empty:
                    result["balance_sheet"] = balance.to_dict()
            
            if statement_type in ["cashflow", "all"]:
                cashflow = ticker.cashflow
                if cashflow is not None and not cashflow.empty:
                    result["cash_flow"] = cashflow.to_dict()
        else:  # quarterly
            if statement_type in ["income", "all"]:
                income = ticker.quarterly_financials
                if income is not None and not income.empty:
                    result["income_statement"] = income.to_dict()
            
            if statement_type in ["balance", "all"]:
                balance = ticker.quarterly_balance_sheet
                if balance is not None and not balance.empty:
                    result["balance_sheet"] = balance.to_dict()
            
            if statement_type in ["cashflow", "all"]:
                cashflow = ticker.quarterly_cashflow
                if cashflow is not None and not cashflow.empty:
                    result["cash_flow"] = cashflow.to_dict()
        
        # Convert Timestamp keys to strings for JSON serialization
        for statement in result:
            if isinstance(result[statement], dict):
                result[statement] = {
                    str(k): v for k, v in result[statement].items()
                }
        
        return result if result else {"error": "No financial data available"}
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def get_historical_prices(symbol: str, period: str = "1y", interval: str = "1d") -> Dict:
    """
    Get historical price data for a stock.
    
    Args:
        symbol: Stock ticker symbol
        period: Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
        interval: Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)
    
    Returns:
        Dictionary with historical price data
    """
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period, interval=interval)
        
        if hist.empty:
            return {"error": "No historical data available"}
        
        # Calculate basic statistics
        returns = hist['Close'].pct_change().dropna()
        
        data = {
            "symbol": symbol,
            "period": period,
            "interval": interval,
            "data_points": len(hist),
            "start_date": str(hist.index[0]),
            "end_date": str(hist.index[-1]),
            "price_data": hist[['Open', 'High', 'Low', 'Close', 'Volume']].to_dict('records'),
            "statistics": {
                "mean_return": float(returns.mean()),
                "std_deviation": float(returns.std()),
                "sharpe_ratio": float(returns.mean() / returns.std() * np.sqrt(252)) if returns.std() != 0 else 0,
                "max_drawdown": float((hist['Close'] / hist['Close'].cummax() - 1).min()),
                "total_return": float((hist['Close'].iloc[-1] / hist['Close'].iloc[0] - 1))
            }
        }
        
        # Convert timestamps to strings
        data["price_data"] = [
            {**record, "Date": str(hist.index[i])} 
            for i, record in enumerate(data["price_data"])
        ]
        
        return data
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def calculate_technical_indicators(symbol: str, period: str = "3mo", indicators: List[str] = None) -> Dict:
    """
    Calculate technical indicators for a stock.
    
    Args:
        symbol: Stock ticker symbol
        period: Time period for historical data
        indicators: List of indicators to calculate (default: all)
                   Options: sma, ema, rsi, macd, bollinger, volume_profile, atr, obv
    
    Returns:
        Dictionary with technical indicator values
    """
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period)
        
        if hist.empty:
            return {"error": "No historical data available"}
        
        if indicators is None:
            indicators = ["sma", "ema", "rsi", "macd", "bollinger", "atr", "obv"]
        
        result = {
            "symbol": symbol,
            "period": period,
            "current_price": float(hist['Close'].iloc[-1]),
            "indicators": {}
        }
        
        close_prices = hist['Close']
        high_prices = hist['High']
        low_prices = hist['Low']
        volume = hist['Volume']
        
        # Simple Moving Averages
        if "sma" in indicators:
            result["indicators"]["sma"] = {
                "sma_20": float(close_prices.rolling(window=20).mean().iloc[-1]),
                "sma_50": float(close_prices.rolling(window=50).mean().iloc[-1]) if len(close_prices) >= 50 else None,
                "sma_200": float(close_prices.rolling(window=200).mean().iloc[-1]) if len(close_prices) >= 200 else None
            }
        
        # Exponential Moving Averages
        if "ema" in indicators:
            result["indicators"]["ema"] = {
                "ema_12": float(close_prices.ewm(span=12).mean().iloc[-1]),
                "ema_26": float(close_prices.ewm(span=26).mean().iloc[-1]),
                "ema_50": float(close_prices.ewm(span=50).mean().iloc[-1]) if len(close_prices) >= 50 else None
            }
        
        # RSI (Relative Strength Index)
        if "rsi" in indicators:
            delta = close_prices.diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))
            result["indicators"]["rsi"] = float(rsi.iloc[-1])
        
        # MACD
        if "macd" in indicators:
            ema_12 = close_prices.ewm(span=12).mean()
            ema_26 = close_prices.ewm(span=26).mean()
            macd_line = ema_12 - ema_26
            signal_line = macd_line.ewm(span=9).mean()
            macd_histogram = macd_line - signal_line
            
            result["indicators"]["macd"] = {
                "macd_line": float(macd_line.iloc[-1]),
                "signal_line": float(signal_line.iloc[-1]),
                "histogram": float(macd_histogram.iloc[-1])
            }
        
        # Bollinger Bands
        if "bollinger" in indicators:
            sma_20 = close_prices.rolling(window=20).mean()
            std_20 = close_prices.rolling(window=20).std()
            upper_band = sma_20 + (2 * std_20)
            lower_band = sma_20 - (2 * std_20)
            
            result["indicators"]["bollinger_bands"] = {
                "upper_band": float(upper_band.iloc[-1]),
                "middle_band": float(sma_20.iloc[-1]),
                "lower_band": float(lower_band.iloc[-1]),
                "band_width": float((upper_band - lower_band).iloc[-1]),
                "percent_b": float((close_prices.iloc[-1] - lower_band.iloc[-1]) / (upper_band.iloc[-1] - lower_band.iloc[-1]))
            }
        
        # Average True Range (ATR)
        if "atr" in indicators:
            high_low = high_prices - low_prices
            high_close = abs(high_prices - close_prices.shift())
            low_close = abs(low_prices - close_prices.shift())
            true_range = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
            atr = true_range.rolling(window=14).mean()
            result["indicators"]["atr"] = float(atr.iloc[-1])
        
        # On-Balance Volume (OBV)
        if "obv" in indicators:
            obv = (volume * (~close_prices.diff().le(0) * 2 - 1)).cumsum()
            result["indicators"]["obv"] = float(obv.iloc[-1])
        
        return result
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def compare_stocks(symbols: List[str], metrics: List[str] = None, period: str = "1y") -> Dict:
    """
    Compare multiple stocks across various metrics.
    
    Args:
        symbols: List of stock ticker symbols
        metrics: List of metrics to compare (default: key metrics)
        period: Time period for performance comparison
    
    Returns:
        Dictionary with comparative analysis
    """
    try:
        if metrics is None:
            metrics = ["price", "pe_ratio", "market_cap", "dividend_yield", "beta", 
                      "profit_margin", "return_on_equity", "debt_to_equity", "ytd_return"]
        
        comparison = {"symbols": symbols, "metrics": {}}
        
        for symbol in symbols:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            hist = ticker.history(period=period)
            
            if not hist.empty:
                ytd_return = (hist['Close'].iloc[-1] / hist['Close'].iloc[0] - 1) * 100
            else:
                ytd_return = None
            
            for metric in metrics:
                if metric not in comparison["metrics"]:
                    comparison["metrics"][metric] = {}
                
                if metric == "ytd_return":
                    comparison["metrics"][metric][symbol] = ytd_return
                elif metric == "price":
                    comparison["metrics"][metric][symbol] = info.get('currentPrice', 
                                                                    hist['Close'].iloc[-1] if not hist.empty else None)
                else:
                    comparison["metrics"][metric][symbol] = info.get(
                        metric.replace("_", "").lower(), 
                        info.get(metric, None)
                    )
        
        # Add rankings for each metric
        for metric in comparison["metrics"]:
            values = comparison["metrics"][metric]
            if all(v is not None for v in values.values()):
                sorted_symbols = sorted(values.items(), key=lambda x: x[1] if x[1] is not None else float('-inf'), reverse=True)
                comparison["metrics"][metric]["ranking"] = [s[0] for s in sorted_symbols]
        
        return comparison
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def get_analyst_recommendations(symbol: str) -> Dict:
    """
    Get analyst recommendations and price targets for a stock.
    
    Args:
        symbol: Stock ticker symbol
    
    Returns:
        Dictionary with analyst recommendations
    """
    try:
        ticker = yf.Ticker(symbol)
        recommendations = ticker.recommendations
        info = ticker.info
        
        result = {
            "symbol": symbol,
            "current_price": info.get('currentPrice', info.get('regularMarketPrice')),
            "target_price": {
                "mean": info.get('targetMeanPrice'),
                "low": info.get('targetLowPrice'),
                "high": info.get('targetHighPrice'),
                "median": info.get('targetMedianPrice')
            },
            "number_of_analysts": info.get('numberOfAnalystOpinions'),
            "recommendation_mean": info.get('recommendationMean'),
            "recommendation_key": info.get('recommendationKey')
        }
        
        if recommendations is not None and not recommendations.empty:
            # Get recent recommendations
            recent_recs = recommendations.tail(10)
            result["recent_recommendations"] = []
            
            for idx, row in recent_recs.iterrows():
                rec = {
                    "date": str(idx),
                    "firm": row.get('Firm', 'N/A'),
                    "to_grade": row.get('To Grade', 'N/A'),
                    "from_grade": row.get('From Grade', 'N/A'),
                    "action": row.get('Action', 'N/A')
                }
                result["recent_recommendations"].append(rec)
        
        return result
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def get_insider_transactions(symbol: str) -> Dict:
    """
    Get insider trading transactions for a stock.
    
    Args:
        symbol: Stock ticker symbol
    
    Returns:
        Dictionary with insider transaction data
    """
    try:
        ticker = yf.Ticker(symbol)
        insider_transactions = ticker.insider_transactions
        insider_holders = ticker.insider_holders
        
        result = {
            "symbol": symbol,
            "transactions": [],
            "holders": []
        }
        
        if insider_transactions is not None and not insider_transactions.empty:
            for _, row in insider_transactions.iterrows():
                transaction = {
                    "date": str(row.get('Date', 'N/A')),
                    "insider": row.get('Insider', 'N/A'),
                    "position": row.get('Position', 'N/A'),
                    "transaction": row.get('Transaction', 'N/A'),
                    "shares": row.get('Shares', 'N/A'),
                    "value": row.get('Value', 'N/A')
                }
                result["transactions"].append(transaction)
        
        if insider_holders is not None and not insider_holders.empty:
            for _, row in insider_holders.iterrows():
                holder = {
                    "name": row.get('Name', 'N/A'),
                    "position": row.get('Position', 'N/A'),
                    "shares": row.get('Shares', 'N/A'),
                    "date_reported": str(row.get('Date Reported', 'N/A')),
                    "percent_held": row.get('% Held', 'N/A')
                }
                result["holders"].append(holder)
        
        return result
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def get_earnings_calendar(symbol: str) -> Dict:
    """
    Get earnings calendar and historical earnings data.
    
    Args:
        symbol: Stock ticker symbol
    
    Returns:
        Dictionary with earnings information
    """
    try:
        ticker = yf.Ticker(symbol)
        earnings = ticker.earnings_history
        calendar = ticker.calendar
        info = ticker.info
        
        result = {
            "symbol": symbol,
            "next_earnings_date": info.get('nextEarningsDate'),
            "earnings_history": [],
            "quarterly_earnings": {}
        }
        
        if earnings is not None and not earnings.empty:
            for _, row in earnings.iterrows():
                earning = {
                    "date": str(row.get('Date', 'N/A')),
                    "eps_estimate": row.get('EPS Estimate', 'N/A'),
                    "eps_actual": row.get('EPS Actual', 'N/A'),
                    "surprise": row.get('Surprise(%)', 'N/A')
                }
                result["earnings_history"].append(earning)
        
        if calendar is not None and not calendar.empty:
            result["calendar"] = calendar.to_dict()
        
        # Get quarterly earnings
        quarterly_earnings = ticker.quarterly_earnings
        if quarterly_earnings is not None and not quarterly_earnings.empty:
            result["quarterly_earnings"] = quarterly_earnings.to_dict()
        
        return result
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def get_options_chain(symbol: str, expiration_date: str = None) -> Dict:
    """
    Get options chain data for a stock.
    
    Args:
        symbol: Stock ticker symbol
        expiration_date: Specific expiration date (YYYY-MM-DD) or None for all
    
    Returns:
        Dictionary with options chain data
    """
    try:
        ticker = yf.Ticker(symbol)
        expirations = ticker.options
        
        result = {
            "symbol": symbol,
            "expiration_dates": list(expirations),
            "options_data": {}
        }
        
        if expiration_date:
            if expiration_date in expirations:
                opt = ticker.option_chain(expiration_date)
                result["options_data"][expiration_date] = {
                    "calls": opt.calls.to_dict('records'),
                    "puts": opt.puts.to_dict('records')
                }
            else:
                return {"error": f"Invalid expiration date. Available dates: {expirations}"}
        else:
            # Get options for next 3 expiration dates
            for exp_date in expirations[:3]:
                opt = ticker.option_chain(exp_date)
                result["options_data"][exp_date] = {
                    "calls": opt.calls.to_dict('records'),
                    "puts": opt.puts.to_dict('records')
                }
        
        return result
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def calculate_dcf_valuation(
    symbol: str, 
    growth_rate: float = None, 
    discount_rate: float = 0.10, 
    terminal_growth: float = 0.03,
    years: int = 5
) -> Dict:
    """
    Calculate DCF (Discounted Cash Flow) valuation for a stock.
    
    Args:
        symbol: Stock ticker symbol
        growth_rate: Expected annual growth rate (None to use historical average)
        discount_rate: Discount rate (WACC)
        terminal_growth: Terminal growth rate
        years: Number of years to project
    
    Returns:
        Dictionary with DCF valuation analysis
    """
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        cashflow = ticker.cashflow
        
        if cashflow is None or cashflow.empty:
            return {"error": "No cash flow data available"}
        
        # Get free cash flow
        if 'Free Cash Flow' in cashflow.index:
            fcf = cashflow.loc['Free Cash Flow'].iloc[0]
        else:
            # Calculate FCF = Operating Cash Flow - Capital Expenditure
            operating_cf = cashflow.loc['Total Cash From Operating Activities'].iloc[0]
            capex = abs(cashflow.loc['Capital Expenditures'].iloc[0]) if 'Capital Expenditures' in cashflow.index else 0
            fcf = operating_cf - capex
        
        # Calculate historical growth rate if not provided
        if growth_rate is None:
            fcf_history = []
            for i in range(min(3, len(cashflow.columns))):
                if 'Free Cash Flow' in cashflow.index:
                    fcf_val = cashflow.loc['Free Cash Flow'].iloc[i]
                else:
                    operating_cf = cashflow.loc['Total Cash From Operating Activities'].iloc[i]
                    capex = abs(cashflow.loc['Capital Expenditures'].iloc[i]) if 'Capital Expenditures' in cashflow.index else 0
                    fcf_val = operating_cf - capex
                fcf_history.append(fcf_val)
            
            if len(fcf_history) > 1:
                growth_rates = [(fcf_history[i] / fcf_history[i+1] - 1) for i in range(len(fcf_history)-1)]
                growth_rate = sum(growth_rates) / len(growth_rates)
                growth_rate = min(max(growth_rate, -0.5), 0.5)  # Cap between -50% and 50%
            else:
                growth_rate = 0.05  # Default 5%
        
        # Project future cash flows
        projected_fcf = []
        for year in range(1, years + 1):
            fcf_projected = fcf * ((1 + growth_rate) ** year)
            projected_fcf.append(fcf_projected)
        
        # Calculate terminal value
        terminal_fcf = projected_fcf[-1] * (1 + terminal_growth)
        terminal_value = terminal_fcf / (discount_rate - terminal_growth)
        
        # Discount all cash flows to present value
        pv_fcf = []
        for year, fcf_val in enumerate(projected_fcf, 1):
            pv = fcf_val / ((1 + discount_rate) ** year)
            pv_fcf.append(pv)
        
        pv_terminal = terminal_value / ((1 + discount_rate) ** years)
        
        # Calculate enterprise value and equity value
        enterprise_value = sum(pv_fcf) + pv_terminal
        
        # Get shares outstanding and calculate fair value per share
        shares_outstanding = info.get('sharesOutstanding', 0)
        if shares_outstanding == 0:
            shares_outstanding = info.get('floatShares', 0)
        
        if shares_outstanding > 0:
            fair_value_per_share = enterprise_value / shares_outstanding
            current_price = info.get('currentPrice', info.get('regularMarketPrice', 0))
            upside = ((fair_value_per_share - current_price) / current_price) * 100 if current_price > 0 else 0
        else:
            fair_value_per_share = None
            upside = None
        
        return {
            "symbol": symbol,
            "current_price": info.get('currentPrice', info.get('regularMarketPrice')),
            "shares_outstanding": shares_outstanding,
            "current_fcf": fcf,
            "growth_rate_used": growth_rate,
            "discount_rate": discount_rate,
            "terminal_growth_rate": terminal_growth,
            "projected_fcf": projected_fcf,
            "present_value_fcf": pv_fcf,
            "terminal_value": terminal_value,
            "present_value_terminal": pv_terminal,
            "enterprise_value": enterprise_value,
            "fair_value_per_share": fair_value_per_share,
            "upside_potential": upside,
            "valuation": "Undervalued" if upside and upside > 0 else "Overvalued" if upside and upside < 0 else "Fair Value"
        }
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def screen_stocks(
    min_market_cap: float = None,
    max_market_cap: float = None,
    min_pe: float = None,
    max_pe: float = None,
    min_div_yield: float = None,
    sector: str = None,
    limit: int = 20
) -> Dict:
    """
    Screen stocks based on fundamental criteria.
    
    Args:
        min_market_cap: Minimum market capitalization
        max_market_cap: Maximum market capitalization
        min_pe: Minimum P/E ratio
        max_pe: Maximum P/E ratio
        min_div_yield: Minimum dividend yield
        sector: Specific sector to filter
        limit: Maximum number of results
    
    Returns:
        Dictionary with screened stocks
    """
    try:
        # For demonstration, we'll use a predefined list of popular stocks
        # In production, this would connect to a screening API
        sample_stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 
                        'JPM', 'JNJ', 'V', 'PG', 'UNH', 'HD', 'MA', 'DIS', 
                        'NFLX', 'PYPL', 'ADBE', 'CRM', 'NKE']
        
        screened_stocks = []
        
        for symbol in sample_stocks[:limit]:
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                
                # Apply filters
                market_cap = info.get('marketCap', 0)
                pe_ratio = info.get('trailingPE', 0)
                div_yield = info.get('dividendYield', 0)
                stock_sector = info.get('sector', '')
                
                # Check criteria
                if min_market_cap and market_cap < min_market_cap:
                    continue
                if max_market_cap and market_cap > max_market_cap:
                    continue
                if min_pe and pe_ratio < min_pe:
                    continue
                if max_pe and pe_ratio > max_pe:
                    continue
                if min_div_yield and div_yield < min_div_yield:
                    continue
                if sector and stock_sector != sector:
                    continue
                
                screened_stocks.append({
                    "symbol": symbol,
                    "name": info.get('longName', 'N/A'),
                    "sector": stock_sector,
                    "market_cap": market_cap,
                    "pe_ratio": pe_ratio,
                    "dividend_yield": div_yield,
                    "price": info.get('currentPrice', info.get('regularMarketPrice')),
                    "52_week_change": info.get('52WeekChange')
                })
            except:
                continue
        
        return {
            "criteria": {
                "min_market_cap": min_market_cap,
                "max_market_cap": max_market_cap,
                "min_pe": min_pe,
                "max_pe": max_pe,
                "min_div_yield": min_div_yield,
                "sector": sector
            },
            "results_count": len(screened_stocks),
            "stocks": screened_stocks
        }
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def get_sector_performance(period: str = "1mo") -> Dict:
    """
    Get sector performance comparison.
    
    Args:
        period: Time period for performance calculation
    
    Returns:
        Dictionary with sector performance data
    """
    try:
        # Define sector ETFs
        sector_etfs = {
            "Technology": "XLK",
            "Healthcare": "XLV",
            "Financials": "XLF",
            "Consumer Discretionary": "XLY",
            "Communication Services": "XLC",
            "Industrials": "XLI",
            "Consumer Staples": "XLP",
            "Energy": "XLE",
            "Utilities": "XLU",
            "Real Estate": "XLRE",
            "Materials": "XLB"
        }
        
        sector_performance = {}
        
        for sector, etf_symbol in sector_etfs.items():
            try:
                ticker = yf.Ticker(etf_symbol)
                hist = ticker.history(period=period)
                
                if not hist.empty:
                    start_price = hist['Close'].iloc[0]
                    end_price = hist['Close'].iloc[-1]
                    performance = ((end_price - start_price) / start_price) * 100
                    
                    # Calculate additional metrics
                    high = hist['High'].max()
                    low = hist['Low'].min()
                    avg_volume = hist['Volume'].mean()
                    volatility = hist['Close'].pct_change().std() * np.sqrt(252) * 100  # Annualized
                    
                    sector_performance[sector] = {
                        "etf_symbol": etf_symbol,
                        "performance": round(performance, 2),
                        "start_price": round(start_price, 2),
                        "end_price": round(end_price, 2),
                        "period_high": round(high, 2),
                        "period_low": round(low, 2),
                        "avg_volume": int(avg_volume),
                        "volatility": round(volatility, 2),
                        "price_change": round(end_price - start_price, 2)
                    }
            except Exception as e:
                sector_performance[sector] = {"error": str(e)}
        
        # Sort sectors by performance
        sorted_sectors = sorted(
            [(k, v) for k, v in sector_performance.items() if "performance" in v],
            key=lambda x: x[1]["performance"],
            reverse=True
        )
        
        # Calculate market average (S&P 500)
        try:
            spy = yf.Ticker("SPY")
            spy_hist = spy.history(period=period)
            if not spy_hist.empty:
                spy_performance = ((spy_hist['Close'].iloc[-1] - spy_hist['Close'].iloc[0]) / spy_hist['Close'].iloc[0]) * 100
            else:
                spy_performance = 0
        except:
            spy_performance = 0
        
        result = {
            "period": period,
            "date_range": {
                "start": str(hist.index[0]) if not hist.empty else None,
                "end": str(hist.index[-1]) if not hist.empty else None
            },
            "market_performance": round(spy_performance, 2),
            "sector_data": sector_performance,
            "rankings": [{"rank": i+1, "sector": s[0], "performance": s[1]["performance"]} 
                        for i, s in enumerate(sorted_sectors)],
            "best_performing": sorted_sectors[0] if sorted_sectors else None,
            "worst_performing": sorted_sectors[-1] if sorted_sectors else None,
            "above_market": [s[0] for s in sorted_sectors if s[1]["performance"] > spy_performance],
            "below_market": [s[0] for s in sorted_sectors if s[1]["performance"] <= spy_performance]
        }
        
        return result
    except Exception as e:
        return {"error": str(e)}

# Run the server
if __name__ == "__main__":
    # FastMCP handles the server running
    mcp.run()
