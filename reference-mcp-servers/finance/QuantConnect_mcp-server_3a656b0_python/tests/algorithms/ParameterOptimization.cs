#region imports
    using QuantConnect;
    using QuantConnect.Algorithm;
    using QuantConnect.Indicators;
    using QuantConnect.Data;
    using QuantConnect.Securities.Equity;
#endregion
public class ParameterOptimizationTestAlgorithm : QCAlgorithm
{
    private Equity _equity;
    private SimpleMovingAverage _smaSlow;
    private SimpleMovingAverage _smaFast;

    public override void Initialize()
    {
        SetStartDate(2010, 1, 1);
        SetEndDate(2025, 1, 1);
        
        _equity = AddEquity("SPY", Resolution.Daily);
        Settings.AutomaticIndicatorWarmUp = true;
        _smaSlow = SMA(_equity.Symbol, GetParameter("sma_slow", 21));
        _smaFast = SMA(_equity.Symbol, GetParameter("sma_fast", 5)); 
    }

    public override void OnData(Slice data)
    {
        if (!_equity.Holdings.IsLong && _smaFast > _smaSlow)
        {
            SetHoldings(_equity.Symbol, 1);
            return;
        }
        if (!_equity.Holdings.IsShort && _smaFast < _smaSlow)
        {
            SetHoldings(_equity.Symbol, -1);
        }
    }
}
