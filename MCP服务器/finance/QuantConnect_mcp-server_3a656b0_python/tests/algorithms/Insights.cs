#region imports
    using System;
    using QuantConnect;
    using QuantConnect.Algorithm.Framework.Alphas;
    using QuantConnect.Algorithm.Framework.Portfolio;
    using QuantConnect.Algorithm;
#endregion
public class InsightTestAlgorithm : QCAlgorithm
{
    public override void Initialize()
    {
        SetStartDate(2024, 1, 8);
        SetEndDate(2024, 4, 1);
        SetCash(100000);
        AddEquity("SPY", Resolution.Daily);
        AddAlpha(
            new ConstantAlphaModel(
                InsightType.Price, InsightDirection.Up, TimeSpan.FromDays(30), 0.1, 0.2, 0.3
            )
        );
        SetPortfolioConstruction(new EqualWeightingPortfolioConstructionModel());
    }
}
