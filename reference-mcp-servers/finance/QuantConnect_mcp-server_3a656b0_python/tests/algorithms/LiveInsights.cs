#region imports
    using System;
    using QuantConnect;
    using QuantConnect.Algorithm.Framework.Alphas;
    using QuantConnect.Algorithm.Framework.Portfolio;
    using QuantConnect.Algorithm;
    using QuantConnect.Data;
#endregion
public class LiveInsightsTestAlgorithm : QCAlgorithm
{
    private int _insights;
    private Symbol _symbol;

    public override void Initialize()
    {
        SetStartDate(2025, 7, 1);
        _insights = 0;
        _symbol = AddCrypto("BTCUSD", Resolution.Second).Symbol;
        SetPortfolioConstruction(new EqualWeightingPortfolioConstructionModel());
    }

    public override void OnData(Slice data)
    {
        // Only emit 10 insights.
        if (_insights++ >= 10)
        {
            return;
        }
        // Determine the direction.
        var direction = Portfolio.Invested ? InsightDirection.Flat : InsightDirection.Up;
        // Emit the insight.
        EmitInsights(Insight.Price(_symbol, TimeSpan.FromDays(1), direction));
    }
}
