#region imports
    using System;
    using QuantConnect;
    using QuantConnect.Algorithm;
    using QuantConnect.Data;
    using QuantConnect.Orders;
    using QuantConnect.Securities.Equity;
#endregion

public class OrderPropertiesTestAlgorithm : QCAlgorithm
{
    private Equity _equity;

    public override void Initialize()
    {
        SetStartDate(2024, 1, 8);
        SetEndDate(2024, 2, 1);
        SetCash(100000);
        _equity = AddEquity("SPY", Resolution.Hour, dataNormalizationMode: DataNormalizationMode.Raw);
    }

    public override void OnData(Slice data)
    {
        if (Portfolio.Invested)
        {
            return;
        }
        string tag = "some tag";
        int quantity = 1;
        decimal limitPrice = _equity.Price + 10;

        // Test the GoodTilCanceled time in force
        LimitOrder(_equity.Symbol, quantity, limitPrice, tag, new OrderProperties {TimeInForce = TimeInForce.GoodTilCanceled});

        // Test the Day time in force
        LimitOrder(_equity.Symbol, quantity, limitPrice, tag, new OrderProperties {TimeInForce = TimeInForce.Day});

        // Test the GoodTilDate time in force
        LimitOrder(_equity.Symbol, quantity, limitPrice, tag, new OrderProperties {TimeInForce = TimeInForce.GoodTilDate(new DateTime(2025, 1, 1))});
    }
}
