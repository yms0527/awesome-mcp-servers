#region imports
    using QuantConnect.Data;
#endregion

public class BacktestInitTestAlgorithm : QCAlgorithm
{
    public override void Initialize()
    {
        AddEquity("SPY", Resolution.Day);
    }
}
