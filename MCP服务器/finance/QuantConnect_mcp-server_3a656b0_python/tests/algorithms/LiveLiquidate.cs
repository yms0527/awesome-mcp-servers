#region imports

#endregion
namespace QuantConnect.Algorithm.CSharp
{
    public class LiveLiquidateTestAlgorithm : QCAlgorithm
    {

        public override void Initialize()
        {
            // Add BTCUSD, which trades 24/7, so the algorithm can fill
            // liquidation orders whenever we run the test suite.
            AddCrypto("BTCUSD", Resolution.Second);
        }
    }
}
