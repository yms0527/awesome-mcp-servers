#region imports
    using QuantConnect;
    using QuantConnect.Algorithm;
#endregion

public class LiveChartTestAlgorithm : QCAlgorithm
{
    public override void Initialize()
    {
        var symbol = AddCrypto("BTCUSD", Resolution.Second).Symbol;
        PlotIndicator("SMA", SMA(symbol, 10));
    }
}
