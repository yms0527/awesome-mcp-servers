"""
Analysis & Valuation Tools

Tools for stock analysis and valuation:
- Analyst forecasts and price targets
- Consensus recommendations
- EPS and revenue forecasts
- Revision trends and upgrades/downgrades
"""

import yfinance as yf
from typing import Dict, Any, List
import json
import pandas as pd
from datetime import datetime, timedelta
import logging
import requests
import os

from models import (
    MCPTool, MCPToolInputSchema, AnalystForecasts, PriceTarget,
    Recommendations, EPSForecasts, EPSForecast, RevenueForecasts, 
    RevenueForecast, ForecastRevisionTrend, AnalystForecastsData,
    GrowthProjections, GrowthProjectionsData, GrowthMetric,
    GrowthProjectionPeriod, GrowthProjectionMultiYear, GrowthSummary,
    ValuationInsights, ValuationInsightsData, ValuationMultiples,
    SectorComparison, ValuationScore, HistoricalContext
)


def get_analysis_tools() -> List[MCPTool]:
    """Return list of analysis and valuation tools"""
    return [
        MCPTool(
            name="get_analyst_forecasts",
            title="Analyst Targets & EPS Forecasts",
            description="Retrieve analyst price targets (high/low/mean), consensus ratings (Buy/Hold/Sell), and future EPS forecasts. Essential for understanding market sentiment and professional analyst expectations for investment decision making.",
            inputSchema=MCPToolInputSchema(
                type="object",
                properties={
                    "symbol": {
                        "type": "string",
                        "description": "Stock ticker symbol (e.g., 'AAPL' for Apple, 'MSFT' for Microsoft, 'GOOGL' for Google)"
                    }
                },
                required=["symbol"]
            )
        ),
        MCPTool(
            name="get_growth_projections",
            title="Forward Growth Projections",
            description="Provide forward growth projections for revenue, earnings (EPS), and free cash flow based on analyst estimates and company projections. Includes 1-year estimates, 3-year and 5-year CAGR projections with cumulative growth rates.",
            inputSchema=MCPToolInputSchema(
                type="object",
                properties={
                    "symbol": {
                        "type": "string",
                        "description": "Stock ticker symbol (e.g., 'AAPL' for Apple, 'MSFT' for Microsoft, 'GOOGL' for Google)"
                    }
                },
                required=["symbol"]
            )
        ),
        MCPTool(
            name="get_valuation_insights",
            title="Relative & Forward Valuation Analysis",
            description="Provide comprehensive valuation analysis including current and forward multiples (P/E, PEG, P/B, P/S, EV/EBITDA), sector comparison, valuation score with qualitative assessment, and historical context for investment decision-making.",
            inputSchema=MCPToolInputSchema(
                type="object",
                properties={
                    "symbol": {
                        "type": "string",
                        "description": "Stock ticker symbol (e.g., 'AAPL' for Apple, 'MSFT' for Microsoft, 'GOOGL' for Google)"
                    }
                },
                required=["symbol"]
            )
        ),
    ]


def get_analyst_forecasts(arguments: Dict[str, Any]) -> str:
    """
    Get analyst forecasts including price targets, consensus ratings, and EPS forecasts
    using Alpha Vantage API combined with yfinance for comprehensive data
    
    Args:
        arguments: Dictionary containing 'symbol' key
    
    Returns:
        JSON string with analyst forecasts data or error message
    """
    try:
        symbol = arguments.get("symbol", "").upper().strip()
        
        if not symbol:
            return json.dumps({
                "error": "Symbol is required",
                "symbol": None
            })
        
        # Get yfinance data first (most reliable for analyst data)
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            current_price = info.get('regularMarketPrice') or info.get('currentPrice')
            
            if not current_price:
                # Try to get current price from history
                hist = ticker.history(period="1d")
                if not hist.empty:
                    current_price = float(hist['Close'].iloc[-1])
            
        except Exception as yf_error:
            return json.dumps({
                "error": f"Error fetching data from yfinance for '{symbol}': {str(yf_error)}. Please verify the ticker symbol.",
                "symbol": symbol
            })
        
        # Initialize components
        price_target = PriceTarget()
        recommendations = Recommendations()
        eps_forecasts_data = EPSForecasts()
        revenue_forecasts = RevenueForecasts()
        revision_trend = ForecastRevisionTrend()
        
        # Parse price targets from yfinance
        target_mean = info.get('targetMeanPrice')
        target_high = info.get('targetHighPrice')
        target_low = info.get('targetLowPrice')
        
        if target_mean:
            price_target.mean = round(float(target_mean), 2)
            if current_price and current_price > 0:
                upside = ((target_mean - current_price) / current_price) * 100
                price_target.upside_potential = round(upside, 1)
        
        if target_high:
            price_target.high = round(float(target_high), 2)
        if target_low:
            price_target.low = round(float(target_low), 2)
        
        # Parse analyst recommendations from yfinance
        try:
            rec_summary = ticker.recommendations_summary
            if rec_summary is not None and not rec_summary.empty:
                # Get most recent recommendations
                latest_rec = rec_summary.iloc[0]
                
                recommendations.strong_buy = int(latest_rec.get('strongBuy', 0)) if pd.notna(latest_rec.get('strongBuy')) else None
                recommendations.buy = int(latest_rec.get('buy', 0)) if pd.notna(latest_rec.get('buy')) else None
                recommendations.hold = int(latest_rec.get('hold', 0)) if pd.notna(latest_rec.get('hold')) else None
                recommendations.sell = int(latest_rec.get('sell', 0)) if pd.notna(latest_rec.get('sell')) else None
                recommendations.strong_sell = int(latest_rec.get('strongSell', 0)) if pd.notna(latest_rec.get('strongSell')) else None
                
                # Calculate consensus
                rec_mean = info.get('recommendationMean')
                if rec_mean:
                    if rec_mean <= 1.5:
                        recommendations.consensus = "Strong Buy"
                    elif rec_mean <= 2.5:
                        recommendations.consensus = "Buy"
                    elif rec_mean <= 3.5:
                        recommendations.consensus = "Hold"
                    elif rec_mean <= 4.5:
                        recommendations.consensus = "Sell"
                    else:
                        recommendations.consensus = "Strong Sell"
                
        except Exception as rec_error:
            logging.warning(f"Could not fetch recommendations for {symbol}: {rec_error}")
        
        # Get Alpha Vantage data for additional EPS information
        api_key = os.getenv("ALPHAVANTAGE_KEY") or os.getenv("ALPHA_VANTAGE_API_KEY")
        alpha_earnings = {}
        
        if api_key:
            try:
                base_url = "https://www.alphavantage.co/query"
                earnings_params = {
                    "function": "EARNINGS",
                    "symbol": symbol,
                    "apikey": api_key
                }
                
                earnings_response = requests.get(base_url, params=earnings_params, timeout=30)
                earnings_response.raise_for_status()
                alpha_earnings = earnings_response.json()
                
                if "Error Message" in alpha_earnings or "Note" in alpha_earnings:
                    alpha_earnings = {}
                    
            except Exception:
                alpha_earnings = {}
        
        # Parse EPS forecasts (combine yfinance and Alpha Vantage data)
        current_year_eps = EPSForecast()
        next_year_eps = EPSForecast()
        
        # Try to get current year EPS estimate from Alpha Vantage
        if alpha_earnings and "annualEarnings" in alpha_earnings:
            annual_earnings = alpha_earnings["annualEarnings"]
            if annual_earnings and len(annual_earnings) >= 2:
                try:
                    latest_year = float(annual_earnings[0].get("reportedEPS", 0))
                    prev_year = float(annual_earnings[1].get("reportedEPS", 0))
                    
                    current_year_eps.estimate = latest_year
                    current_year_eps.previous = prev_year
                    
                    if prev_year > 0:
                        surprise = ((latest_year - prev_year) / prev_year) * 100
                        current_year_eps.surprise = round(surprise, 1)
                    
                    # Calculate growth rate and next year estimate
                    if latest_year > 0 and prev_year > 0:
                        growth_rate = ((latest_year - prev_year) / prev_year) * 100
                        next_year_eps.growth_rate = round(growth_rate, 1)
                        next_year_eps.estimate = round(latest_year * (1 + growth_rate/100), 2)
                        
                except (ValueError, TypeError, IndexError):
                    pass
        
        # Add EPS data to forecasts
        if current_year_eps.estimate or current_year_eps.previous or current_year_eps.surprise:
            eps_forecasts_data.current_year = current_year_eps
        if next_year_eps.estimate or next_year_eps.growth_rate:
            eps_forecasts_data.next_year = next_year_eps
        
        # Get revenue forecasts from yfinance info if available
        total_revenue = info.get('totalRevenue')
        revenue_growth = info.get('revenueGrowth')
        
        if total_revenue:
            current_rev = RevenueForecast()
            current_rev.estimate = int(total_revenue)
            if revenue_growth:
                current_rev.growth_rate = round(float(revenue_growth) * 100, 1)
                
                # Estimate next year revenue
                next_rev = RevenueForecast()
                next_rev.estimate = int(total_revenue * (1 + revenue_growth))
                next_rev.growth_rate = round(float(revenue_growth) * 100, 1)
                revenue_forecasts.next_year = next_rev
                
            revenue_forecasts.current_year = current_rev
        
        # Parse upgrades/downgrades for revision trends
        try:
            upgrades_downgrades = ticker.upgrades_downgrades
            if upgrades_downgrades is not None and not upgrades_downgrades.empty:
                # Count upgrades vs downgrades in recent period (last 90 days)
                recent_date = datetime.now() - timedelta(days=90)
                recent_changes = upgrades_downgrades[upgrades_downgrades.index >= recent_date]
                
                if not recent_changes.empty:
                    upgrade_actions = ['up', 'upgrade', 'raise', 'buy', 'outperform', 'overweight']
                    downgrade_actions = ['down', 'downgrade', 'lower', 'sell', 'underperform', 'underweight']
                    
                    upgrades = 0
                    downgrades = 0
                    
                    for _, row in recent_changes.iterrows():
                        action = str(row.get('Action', '')).lower()
                        to_grade = str(row.get('ToGrade', '')).lower()
                        
                        if any(term in action or term in to_grade for term in upgrade_actions):
                            upgrades += 1
                        elif any(term in action or term in to_grade for term in downgrade_actions):
                            downgrades += 1
                    
                    revision_trend.upgrades = upgrades
                    revision_trend.downgrades = downgrades
                    
                    if upgrades > downgrades:
                        revision_trend.net_trend = "Positive"
                    elif downgrades > upgrades:
                        revision_trend.net_trend = "Negative"
                    else:
                        revision_trend.net_trend = "Neutral"
        
        except Exception as trend_error:
            logging.warning(f"Could not fetch revision trends for {symbol}: {trend_error}")
        
        # Create the complete analyst forecasts response
        analyst_data = AnalystForecastsData(
            price_target=price_target,
            recommendations=recommendations,
            eps_forecasts=eps_forecasts_data,
            revenue_forecasts=revenue_forecasts,
            forecast_revision_trend=revision_trend
        )
        
        forecasts = AnalystForecasts(
            symbol=symbol,
            analyst_forecasts=analyst_data,
            last_updated=datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
        )
        
        return forecasts.model_dump_json(indent=2)
        
    except Exception as e:
        return json.dumps({
            "error": f"Error fetching analyst forecasts for '{symbol}': {str(e)}",
            "symbol": symbol
        })


def get_growth_projections(arguments: Dict[str, Any]) -> str:
    """
    Get forward growth projections for revenue, EPS, and free cash flow
    using yfinance growth estimates, revenue estimates, and earnings estimates
    
    Args:
        arguments: Dictionary containing 'symbol' key
    
    Returns:
        JSON string with growth projections data or error message
    """
    try:
        symbol = arguments.get("symbol", "").upper().strip()
        
        if not symbol:
            return json.dumps({
                "error": "Symbol is required",
                "symbol": None
            })
        
        # Get yfinance ticker
        try:
            ticker = yf.Ticker(symbol)
            
            # Get growth estimates (provides LTG - long term growth)
            growth_estimates = ticker.growth_estimates
            
            # Get revenue estimates (provides current year and next year estimates)
            revenue_estimates = ticker.revenue_estimate
            
            # Get earnings estimates (provides current year and next year EPS)
            earnings_estimates = ticker.earnings_estimate
            
            # Get basic info for additional data
            info = ticker.info
            
        except Exception as yf_error:
            return json.dumps({
                "error": f"Error fetching data from yfinance for '{symbol}': {str(yf_error)}. Please verify the ticker symbol.",
                "symbol": symbol
            })
        
        # Initialize growth metrics
        revenue_metric = GrowthMetric()
        eps_metric = GrowthMetric()
        fcf_metric = GrowthMetric()
        
        # Parse revenue projections
        if revenue_estimates is not None and not revenue_estimates.empty:
            try:
                # Get next year revenue estimate and growth
                next_year_data = revenue_estimates.loc['+1y']
                current_year_data = revenue_estimates.loc['0y']
                
                if pd.notna(next_year_data.get('avg')) and pd.notna(current_year_data.get('avg')):
                    next_year_revenue = float(next_year_data['avg'])
                    current_year_revenue = float(current_year_data['avg'])
                    
                    # Calculate next year growth rate
                    growth_rate = ((next_year_revenue - current_year_revenue) / current_year_revenue) * 100
                    
                    revenue_metric.next_year = GrowthProjectionPeriod(
                        estimate=next_year_revenue,
                        growth_rate=round(growth_rate, 1)
                    )
                    
                    # Use growth from info if available for long-term projections
                    revenue_growth = info.get('revenueGrowth')
                    if revenue_growth:
                        annual_growth = float(revenue_growth) * 100
                        
                        # Calculate 3-year and 5-year projections
                        three_year_cagr = annual_growth * 0.9  # Slightly lower for longer term
                        five_year_cagr = annual_growth * 0.8   # Even more conservative
                        
                        revenue_metric.next_3_years = GrowthProjectionMultiYear(
                            cumulative_growth=round(((1 + three_year_cagr/100)**3 - 1) * 100, 1),
                            cagr=round(three_year_cagr, 1)
                        )
                        
                        revenue_metric.next_5_years = GrowthProjectionMultiYear(
                            cumulative_growth=round(((1 + five_year_cagr/100)**5 - 1) * 100, 1),
                            cagr=round(five_year_cagr, 1)
                        )
                        
            except Exception as rev_error:
                logging.warning(f"Could not parse revenue estimates for {symbol}: {rev_error}")
        
        # Parse EPS projections
        if earnings_estimates is not None and not earnings_estimates.empty:
            try:
                # Get next year EPS estimate and growth
                next_year_eps_data = earnings_estimates.loc['+1y']
                current_year_eps_data = earnings_estimates.loc['0y']
                
                if pd.notna(next_year_eps_data.get('avg')) and pd.notna(current_year_eps_data.get('avg')):
                    next_year_eps = float(next_year_eps_data['avg'])
                    current_year_eps = float(current_year_eps_data['avg'])
                    
                    # Calculate next year growth rate
                    eps_growth_rate = ((next_year_eps - current_year_eps) / current_year_eps) * 100
                    
                    eps_metric.next_year = GrowthProjectionPeriod(
                        estimate=round(next_year_eps, 2),
                        growth_rate=round(eps_growth_rate, 1)
                    )
                    
                    # Use earnings growth or calculate from LTG
                    earnings_growth = info.get('earningsGrowth')
                    ltg = None
                    
                    # Get LTG (Long Term Growth) from growth_estimates
                    if growth_estimates is not None and not growth_estimates.empty:
                        try:
                            if 'LTG' in growth_estimates.index:
                                ltg_data = growth_estimates.loc['LTG']
                                if pd.notna(ltg_data.get('stockTrend')):
                                    ltg = float(ltg_data['stockTrend']) * 100
                        except Exception:
                            pass
                    
                    # Use available growth rate for projections
                    base_growth = ltg or (earnings_growth * 100 if earnings_growth else eps_growth_rate)
                    
                    if base_growth and base_growth > 0:
                        three_year_eps_cagr = base_growth * 0.95  # Slightly conservative
                        five_year_eps_cagr = base_growth * 0.9    # More conservative
                        
                        eps_metric.next_3_years = GrowthProjectionMultiYear(
                            cumulative_growth=round(((1 + three_year_eps_cagr/100)**3 - 1) * 100, 1),
                            cagr=round(three_year_eps_cagr, 1)
                        )
                        
                        eps_metric.next_5_years = GrowthProjectionMultiYear(
                            cumulative_growth=round(((1 + five_year_eps_cagr/100)**5 - 1) * 100, 1),
                            cagr=round(five_year_eps_cagr, 1)
                        )
                        
            except Exception as eps_error:
                logging.warning(f"Could not parse EPS estimates for {symbol}: {eps_error}")
        
        # Estimate Free Cash Flow projections (based on revenue growth as proxy)
        # FCF is typically correlated with revenue growth but more volatile
        if revenue_metric.next_year and revenue_metric.next_year.growth_rate:
            try:
                # Get current FCF from info if available
                current_fcf = info.get('freeCashflow')
                if current_fcf and current_fcf > 0:
                    # Assume FCF grows at similar rate to revenue but slightly more volatile
                    fcf_growth_rate = revenue_metric.next_year.growth_rate * 1.1
                    
                    next_year_fcf = current_fcf * (1 + fcf_growth_rate/100)
                    
                    fcf_metric.next_year = GrowthProjectionPeriod(
                        estimate=int(next_year_fcf),
                        growth_rate=round(fcf_growth_rate, 1)
                    )
                    
                    # Use base revenue growth for longer projections
                    if revenue_metric.next_3_years and revenue_metric.next_5_years:
                        three_year_fcf_cagr = revenue_metric.next_3_years.cagr * 0.95
                        five_year_fcf_cagr = revenue_metric.next_5_years.cagr * 0.9
                        
                        fcf_metric.next_3_years = GrowthProjectionMultiYear(
                            cumulative_growth=round(((1 + three_year_fcf_cagr/100)**3 - 1) * 100, 1),
                            cagr=round(three_year_fcf_cagr, 1)
                        )
                        
                        fcf_metric.next_5_years = GrowthProjectionMultiYear(
                            cumulative_growth=round(((1 + five_year_fcf_cagr/100)**5 - 1) * 100, 1),
                            cagr=round(five_year_fcf_cagr, 1)
                        )
                        
            except Exception as fcf_error:
                logging.warning(f"Could not estimate FCF projections for {symbol}: {fcf_error}")
        
        # Create summary
        revenue_5y_cagr = revenue_metric.next_5_years.cagr if revenue_metric.next_5_years else None
        eps_5y_cagr = eps_metric.next_5_years.cagr if eps_metric.next_5_years else None
        fcf_5y_cagr = fcf_metric.next_5_years.cagr if fcf_metric.next_5_years else None
        
        # Determine overall growth outlook
        growth_rates = [rate for rate in [revenue_5y_cagr, eps_5y_cagr, fcf_5y_cagr] if rate is not None]
        
        if growth_rates:
            avg_growth = sum(growth_rates) / len(growth_rates)
            if avg_growth > 15:
                outlook = "Very Positive"
            elif avg_growth > 8:
                outlook = "Positive"
            elif avg_growth > 3:
                outlook = "Moderate"
            elif avg_growth > 0:
                outlook = "Conservative"
            else:
                outlook = "Challenging"
        else:
            outlook = "Data Limited"
        
        summary = GrowthSummary(
            expected_cagr_revenue_5y=revenue_5y_cagr,
            expected_cagr_eps_5y=eps_5y_cagr,
            expected_cagr_fcf_5y=fcf_5y_cagr,
            overall_growth_outlook=outlook
        )
        
        # Create the complete growth projections response
        growth_data = GrowthProjectionsData(
            revenue=revenue_metric if revenue_metric.next_year else None,
            eps=eps_metric if eps_metric.next_year else None,
            free_cash_flow=fcf_metric if fcf_metric.next_year else None
        )
        
        projections = GrowthProjections(
            symbol=symbol,
            growth_projections=growth_data,
            summary=summary,
            last_updated=datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
        )
        
        return projections.model_dump_json(indent=2)
        
    except Exception as e:
        return json.dumps({
            "error": f"Error fetching growth projections for '{symbol}': {str(e)}",
            "symbol": symbol
        })


def get_valuation_insights(arguments: Dict[str, Any]) -> str:
    """
    Get comprehensive valuation insights including current/forward multiples,
    sector comparison, valuation score, and historical context using yfinance and Alpha Vantage
    
    Args:
        arguments: Dictionary containing 'symbol' key
    
    Returns:
        JSON string with valuation insights data or error message
    """
    try:
        symbol = arguments.get("symbol", "").upper().strip()
        
        if not symbol:
            return json.dumps({
                "error": "Symbol is required",
                "symbol": None
            })
        
        # Get yfinance data
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
        except Exception as yf_error:
            return json.dumps({
                "error": f"Error fetching data from yfinance for '{symbol}': {str(yf_error)}. Please verify the ticker symbol.",
                "symbol": symbol
            })
        
        # Initialize components
        multiples = ValuationMultiples()
        sector_comparison = SectorComparison()
        valuation_score = ValuationScore()
        historical_context = HistoricalContext()
        
        # Parse current valuation multiples from yfinance
        multiples.pe_trailing = info.get('trailingPE')
        multiples.pe_forward = info.get('forwardPE')
        multiples.pb_ratio = info.get('priceToBook')
        multiples.ps_ratio = info.get('priceToSalesTrailing12Months')
        multiples.ev_ebitda = info.get('enterpriseToEbitda')
        
        # Calculate PEG ratio if we have the data
        pe_forward = multiples.pe_forward or multiples.pe_trailing
        earnings_growth = info.get('earningsGrowth')
        
        if pe_forward and earnings_growth and earnings_growth > 0:
            # Convert earnings growth from decimal to percentage
            growth_rate = earnings_growth * 100
            multiples.peg_ratio = round(pe_forward / growth_rate, 2)
        
        # Get Alpha Vantage data for additional insights
        api_key = os.getenv("ALPHAVANTAGE_KEY") or os.getenv("ALPHA_VANTAGE_API_KEY")
        alpha_overview = {}
        
        if api_key:
            try:
                base_url = "https://www.alphavantage.co/query"
                overview_params = {
                    "function": "OVERVIEW",
                    "symbol": symbol,
                    "apikey": api_key
                }
                
                overview_response = requests.get(base_url, params=overview_params, timeout=30)
                overview_response.raise_for_status()
                alpha_overview = overview_response.json()
                
                if "Error Message" in alpha_overview or "Note" in alpha_overview:
                    alpha_overview = {}
                    
            except Exception:
                alpha_overview = {}
        
        # Parse sector information and comparison
        sector = info.get('sector')
        industry = info.get('industry')
        
        # Use Alpha Vantage data to enhance multiples if available
        if alpha_overview:
            if not multiples.pe_trailing and alpha_overview.get('PERatio') != 'None':
                try:
                    multiples.pe_trailing = float(alpha_overview.get('PERatio', 0))
                except (ValueError, TypeError):
                    pass
                    
            if not multiples.pb_ratio and alpha_overview.get('PriceToBookRatio') != 'None':
                try:
                    multiples.pb_ratio = float(alpha_overview.get('PriceToBookRatio', 0))
                except (ValueError, TypeError):
                    pass
                    
            if not multiples.ev_ebitda and alpha_overview.get('EVToEBITDA') != 'None':
                try:
                    multiples.ev_ebitda = float(alpha_overview.get('EVToEBITDA', 0))
                except (ValueError, TypeError):
                    pass
        
        # Sector comparison - Use industry averages as proxies
        # These are rough estimates for common sectors
        sector_multiples = {
            'Technology': {'pe': 28.0, 'peg': 1.4},
            'Healthcare': {'pe': 24.0, 'peg': 1.3},
            'Consumer Cyclical': {'pe': 22.0, 'peg': 1.2},
            'Consumer Defensive': {'pe': 20.0, 'peg': 1.1},
            'Financial Services': {'pe': 12.0, 'peg': 1.0},
            'Industrials': {'pe': 18.0, 'peg': 1.2},
            'Energy': {'pe': 15.0, 'peg': 1.1},
            'Utilities': {'pe': 16.0, 'peg': 1.0},
            'Real Estate': {'pe': 14.0, 'peg': 1.1},
            'Materials': {'pe': 16.0, 'peg': 1.2},
            'Communication Services': {'pe': 25.0, 'peg': 1.3}
        }
        
        if sector in sector_multiples:
            sector_comparison.sector_pe = sector_multiples[sector]['pe']
            sector_comparison.sector_peg = sector_multiples[sector]['peg']
            
            # Calculate percentiles vs sector
            if multiples.pe_trailing:
                if multiples.pe_trailing < sector_comparison.sector_pe:
                    sector_comparison.percentile_vs_sector_pe = 25  # Below average
                elif multiples.pe_trailing < sector_comparison.sector_pe * 1.1:
                    sector_comparison.percentile_vs_sector_pe = 45  # Slightly below
                elif multiples.pe_trailing < sector_comparison.sector_pe * 1.3:
                    sector_comparison.percentile_vs_sector_pe = 65  # Above average
                else:
                    sector_comparison.percentile_vs_sector_pe = 85  # Well above average
            
            if multiples.peg_ratio:
                if multiples.peg_ratio < sector_comparison.sector_peg * 0.8:
                    sector_comparison.percentile_vs_sector_peg = 20  # Very attractive
                elif multiples.peg_ratio < sector_comparison.sector_peg:
                    sector_comparison.percentile_vs_sector_peg = 35  # Below average
                elif multiples.peg_ratio < sector_comparison.sector_peg * 1.2:
                    sector_comparison.percentile_vs_sector_peg = 55  # Around average
                else:
                    sector_comparison.percentile_vs_sector_peg = 75  # Above average
        
        # Calculate valuation score (0-100 scale)
        score_components = []
        reasoning_parts = []
        
        # PEG ratio scoring (most important)
        if multiples.peg_ratio:
            if multiples.peg_ratio < 0.8:
                score_components.append(90)
                reasoning_parts.append("PEG ratio below 0.8 suggests strong value")
            elif multiples.peg_ratio < 1.0:
                score_components.append(80)
                reasoning_parts.append("PEG ratio below 1 indicates good value vs growth")
            elif multiples.peg_ratio < 1.5:
                score_components.append(60)
                reasoning_parts.append("PEG ratio suggests fair valuation")
            elif multiples.peg_ratio < 2.0:
                score_components.append(40)
                reasoning_parts.append("PEG ratio indicates potential overvaluation")
            else:
                score_components.append(20)
                reasoning_parts.append("High PEG ratio suggests overvaluation")
        
        # PE ratio scoring
        if multiples.pe_forward and sector_comparison.sector_pe:
            pe_ratio_score = max(20, min(80, 100 - ((multiples.pe_forward / sector_comparison.sector_pe - 1) * 100)))
            score_components.append(pe_ratio_score)
            if multiples.pe_forward < sector_comparison.sector_pe:
                reasoning_parts.append("Forward P/E below sector median")
            else:
                reasoning_parts.append("Forward P/E above sector median")
        
        # Calculate final score
        if score_components:
            final_score = int(sum(score_components) / len(score_components))
            valuation_score.score = final_score
            
            # Determine label
            if final_score >= 80:
                valuation_score.label = "Significantly Undervalued"
            elif final_score >= 65:
                valuation_score.label = "Slightly Undervalued"
            elif final_score >= 50:
                valuation_score.label = "Fairly Valued"
            elif final_score >= 35:
                valuation_score.label = "Slightly Overvalued"
            else:
                valuation_score.label = "Significantly Overvalued"
            
            # Create reasoning
            valuation_score.reasoning = ". ".join(reasoning_parts) + f" suggesting the stock is {valuation_score.label.lower()}."
        
        # Historical context (simplified - using 5-year averages where available)
        # Note: This would ideally use historical P/E data, but yfinance doesn't provide this easily
        # We'll use current vs trailing as a proxy
        if multiples.pe_forward and multiples.pe_trailing:
            pe_change = multiples.pe_forward - multiples.pe_trailing
            historical_context.current_vs_5y_avg_pe = round(pe_change, 1)
        
        # Create the complete valuation insights response
        insights_data = ValuationInsightsData(
            multiples=multiples,
            sector_comparison=sector_comparison,
            valuation_score=valuation_score,
            historical_context=historical_context
        )
        
        insights = ValuationInsights(
            symbol=symbol,
            valuation_insights=insights_data,
            last_updated=datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
        )
        
        return insights.model_dump_json(indent=2)
        
    except Exception as e:
        return json.dumps({
            "error": f"Error fetching valuation insights for '{symbol}': {str(e)}",
            "symbol": symbol
        })