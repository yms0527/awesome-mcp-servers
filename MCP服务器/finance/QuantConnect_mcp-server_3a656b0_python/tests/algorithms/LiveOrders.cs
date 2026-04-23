#region imports
    using QuantConnect;
    using QuantConnect.Algorithm;
    using QuantConnect.Data;
    using QuantConnect.Securities.Crypto;
#endregion
public class JumpingFluorescentYellowBaboon : QCAlgorithm
{
    private Crypto _btc;
    public override void Initialize()
    {
        _btc = AddCrypto("BTCUSD", Resolution.Second);
    }

    public override void OnData(Slice data)
    {
        if (!Portfolio.Invested)
        {
            SetHoldings(_btc.Symbol, 1);
        }
    }
}
