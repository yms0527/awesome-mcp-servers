from pydantic import BaseModel
from typing import Any, Dict, List, Optional, Union


class JsonRpcRequest(BaseModel):
    jsonrpc: str = "2.0"
    id: Union[str, int]
    method: str
    params: Optional[Dict[str, Any]] = None


class JsonRpcResponse(BaseModel):
    jsonrpc: str = "2.0"
    id: Union[str, int]
    result: Optional[Dict[str, Any]] = None
    error: Optional[Dict[str, Any]] = None


class MCPCapabilities(BaseModel):
    tools: Dict[str, Any] = {"listChanged": False}
    resources: Dict[str, Any] = {}


class MCPServerInfo(BaseModel):
    name: str
    version: str


class MCPInitializeResult(BaseModel):
    protocolVersion: str = "2025-06-18"
    capabilities: MCPCapabilities
    serverInfo: MCPServerInfo


class MCPToolInputSchema(BaseModel):
    type: str = "object"
    properties: Dict[str, Any]
    required: List[str]


class MCPTool(BaseModel):
    name: str
    title: str
    description: str
    inputSchema: MCPToolInputSchema


class MCPToolsListResult(BaseModel):
    tools: List[MCPTool]


class MCPToolCallParams(BaseModel):
    name: str
    arguments: Dict[str, Any]


class MCPContent(BaseModel):
    type: str
    text: str


class MCPToolCallResult(BaseModel):
    content: List[MCPContent]


class StockQuote(BaseModel):
    symbol: str
    price: Optional[float] = None
    change: Optional[float] = None
    change_percent: Optional[float] = None
    volume: Optional[int] = None
    market_cap: Optional[int] = None
    pe_ratio: Optional[float] = None
    dividend_yield: Optional[float] = None
    fifty_two_week_high: Optional[float] = None
    fifty_two_week_low: Optional[float] = None
    currency: Optional[str] = "USD"


class FinancialStatement(BaseModel):
    """Base financial statement model"""
    period_ending: Optional[str]
    currency: Optional[str]
    data: Dict[str, Optional[float]]


class IncomeStatement(FinancialStatement):
    """Income statement specific fields"""
    pass


class BalanceSheet(FinancialStatement):
    """Balance sheet specific fields"""
    pass


class CashFlowStatement(FinancialStatement):
    """Cash flow statement specific fields"""
    pass


class FinancialRatios(BaseModel):
    """Financial ratios calculated from statements"""
    pe_ratio: Optional[float] = None
    pb_ratio: Optional[float] = None
    ps_ratio: Optional[float] = None
    ev_ebitda: Optional[float] = None
    roe: Optional[float] = None
    roic: Optional[float] = None
    fcf_yield: Optional[float] = None
    debt_to_equity: Optional[float] = None
    current_ratio: Optional[float] = None
    quick_ratio: Optional[float] = None
    gross_margin: Optional[float] = None
    operating_margin: Optional[float] = None
    net_margin: Optional[float] = None
    asset_turnover: Optional[float] = None
    dividend_payout_ratio: Optional[float] = None


class FundamentalsMetadata(BaseModel):
    """Metadata for fundamentals response"""
    currency: Optional[str]
    as_of: Optional[str]
    period_type: str
    years_requested: int


class StockFundamentals(BaseModel):
    """Complete fundamentals response"""
    symbol: str
    income: List[IncomeStatement]
    balance: List[BalanceSheet]
    cashflow: List[CashFlowStatement]
    ratios: FinancialRatios
    meta: FundamentalsMetadata


class PriceBar(BaseModel):
    """Individual price bar (OHLCV)"""
    t: str  # timestamp
    o: Optional[float]  # open
    h: Optional[float]  # high
    l: Optional[float]  # low
    c: Optional[float]  # close
    v: Optional[int]    # volume


class TotalReturnPoint(BaseModel):
    """Total return data point"""
    t: str              # timestamp
    tr: Optional[float] # total return index


class PriceAdjustments(BaseModel):
    """Stock adjustments information"""
    splits: Dict[str, float] = {}
    dividends: Dict[str, float] = {}
    stock_splits: Dict[str, float] = {}


class PriceHistory(BaseModel):
    """Complete price history response"""
    symbol: str
    bars: List[PriceBar]
    total_return: List[TotalReturnPoint]
    adjustments: PriceAdjustments
    tz: str
    interval: str
    start_date: str
    end_date: str


class DividendRecord(BaseModel):
    """Individual dividend record"""
    ex_date: str
    amount: float
    currency: str = "USD"


class DividendYield(BaseModel):
    """Dividend yield metrics"""
    ttm: Optional[float] = None      # Trailing twelve months yield
    five_year_avg: Optional[float] = None  # 5-year average yield


class DividendGrowth(BaseModel):
    """Dividend growth metrics"""
    cagr_5y: Optional[float] = None  # 5-year compound annual growth rate
    consistency_score: Optional[float] = None  # Regularity score (0-100)


class CorporateAction(BaseModel):
    """Corporate action record"""
    type: str  # "split", "spinoff", "merger", etc.
    effective_date: str
    factor: Optional[float] = None
    description: Optional[str] = None


class DividendsAndActions(BaseModel):
    """Complete dividends and corporate actions response"""
    symbol: str
    dividends: List[DividendRecord]
    yield_metrics: DividendYield
    growth_metrics: DividendGrowth
    actions: List[CorporateAction]
    period_start: Optional[str] = None
    period_end: Optional[str] = None


class PriceTarget(BaseModel):
    """Price target information"""
    mean: Optional[float] = None
    high: Optional[float] = None
    low: Optional[float] = None
    upside_potential: Optional[float] = None  # Percentage upside from current price


class EPSForecast(BaseModel):
    """EPS forecast for a specific period"""
    estimate: Optional[float] = None
    previous: Optional[float] = None
    surprise: Optional[float] = None
    growth_rate: Optional[float] = None


class EPSForecasts(BaseModel):
    """EPS forecasts for different periods"""
    current_year: Optional[EPSForecast] = None
    next_year: Optional[EPSForecast] = None


class RevenueForecast(BaseModel):
    """Revenue forecast for a specific period"""
    estimate: Optional[float] = None
    growth_rate: Optional[float] = None


class RevenueForecasts(BaseModel):
    """Revenue forecasts for different periods"""
    current_year: Optional[RevenueForecast] = None
    next_year: Optional[RevenueForecast] = None


class Recommendations(BaseModel):
    """Analyst recommendations breakdown"""
    strong_buy: Optional[int] = None
    buy: Optional[int] = None
    hold: Optional[int] = None
    sell: Optional[int] = None
    strong_sell: Optional[int] = None
    consensus: Optional[str] = None  # "Strong Buy", "Buy", "Hold", "Sell", "Strong Sell"


class ForecastRevisionTrend(BaseModel):
    """Forecast revision trend"""
    upgrades: Optional[int] = None
    downgrades: Optional[int] = None
    net_trend: Optional[str] = None  # "Positive", "Negative", "Neutral"


class AnalystForecastsData(BaseModel):
    """Complete analyst forecasts data structure"""
    price_target: PriceTarget
    recommendations: Recommendations
    eps_forecasts: EPSForecasts
    revenue_forecasts: RevenueForecasts
    forecast_revision_trend: ForecastRevisionTrend


class AnalystForecasts(BaseModel):
    """Complete analyst forecasts response"""
    symbol: str
    analyst_forecasts: AnalystForecastsData
    last_updated: Optional[str] = None


class GrowthProjectionPeriod(BaseModel):
    """Growth projection for a specific period"""
    estimate: Optional[float] = None
    growth_rate: Optional[float] = None


class GrowthProjectionMultiYear(BaseModel):
    """Multi-year growth projection"""
    cumulative_growth: Optional[float] = None
    cagr: Optional[float] = None


class GrowthMetric(BaseModel):
    """Growth projections for a specific metric (revenue, EPS, FCF)"""
    next_year: Optional[GrowthProjectionPeriod] = None
    next_3_years: Optional[GrowthProjectionMultiYear] = None
    next_5_years: Optional[GrowthProjectionMultiYear] = None


class GrowthProjectionsData(BaseModel):
    """All growth projections data"""
    revenue: Optional[GrowthMetric] = None
    eps: Optional[GrowthMetric] = None
    free_cash_flow: Optional[GrowthMetric] = None


class GrowthSummary(BaseModel):
    """Summary of growth projections"""
    expected_cagr_revenue_5y: Optional[float] = None
    expected_cagr_eps_5y: Optional[float] = None
    expected_cagr_fcf_5y: Optional[float] = None
    overall_growth_outlook: Optional[str] = None


class GrowthProjections(BaseModel):
    """Complete growth projections response"""
    symbol: str
    growth_projections: GrowthProjectionsData
    summary: GrowthSummary
    last_updated: Optional[str] = None


class ValuationMultiples(BaseModel):
    """Current valuation multiples"""
    pe_trailing: Optional[float] = None
    pe_forward: Optional[float] = None
    peg_ratio: Optional[float] = None
    pb_ratio: Optional[float] = None
    ps_ratio: Optional[float] = None
    ev_ebitda: Optional[float] = None


class SectorComparison(BaseModel):
    """Sector comparison metrics"""
    sector_pe: Optional[float] = None
    sector_peg: Optional[float] = None
    percentile_vs_sector_pe: Optional[int] = None
    percentile_vs_sector_peg: Optional[int] = None


class ValuationScore(BaseModel):
    """Valuation assessment score"""
    score: Optional[int] = None
    label: Optional[str] = None
    reasoning: Optional[str] = None


class HistoricalContext(BaseModel):
    """Historical valuation context"""
    current_vs_5y_avg_pe: Optional[float] = None
    current_vs_5y_avg_ev_ebitda: Optional[float] = None


class ValuationInsightsData(BaseModel):
    """Complete valuation insights data"""
    multiples: ValuationMultiples
    sector_comparison: SectorComparison
    valuation_score: ValuationScore
    historical_context: HistoricalContext


class ValuationInsights(BaseModel):
    """Complete valuation insights response"""
    symbol: str
    valuation_insights: ValuationInsightsData
    last_updated: Optional[str] = None