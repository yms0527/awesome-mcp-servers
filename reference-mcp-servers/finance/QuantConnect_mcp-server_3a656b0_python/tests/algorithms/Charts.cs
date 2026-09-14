#region imports
    using QuantConnect;
    using QuantConnect.Algorithm;
#endregion
public class ChartTestAlgorithm : QCAlgorithm
{
    public override void Initialize()
    {
        SetStartDate(2023, 1, 1);
        SetEndDate(2023, 4, 1);
        var symbol = AddEquity("SPY", Resolution.Daily).Symbol;
        PlotIndicator("SMA", SMA(symbol, 10));
    }
}
