import asyncio
import base64
import os
import pytest
from mcp_yahoo_finance.visualization import (
    generate_market_sentiment_dashboard,
    generate_portfolio_tracking,
    generate_stock_analysis
)

@pytest.mark.asyncio
async def test_visualizations(examples_dir):
    """Test the visualization functions and save example outputs."""
    print("Starting visualization tests...")
    
    # Test market sentiment dashboard
    print("Generating market sentiment dashboard...")
    dashboard_base64 = generate_market_sentiment_dashboard()
    dashboard_path = os.path.join(examples_dir, "market_sentiment.png")
    with open(dashboard_path, "wb") as f:
        f.write(base64.b64decode(dashboard_base64))
    print(f"✅ Market sentiment dashboard saved to {dashboard_path}")
    
    # Test portfolio tracking
    print("Generating portfolio tracking report...")
    portfolio_base64 = generate_portfolio_tracking()
    portfolio_path = os.path.join(examples_dir, "portfolio.png")
    with open(portfolio_path, "wb") as f:
        f.write(base64.b64decode(portfolio_base64))
    print(f"✅ Portfolio tracking report saved to {portfolio_path}")
    
    # Test stock technical analysis
    print("Generating stock technical analysis...")
    analysis_base64 = generate_stock_analysis()
    analysis_path = os.path.join(examples_dir, "analysis.png")
    with open(analysis_path, "wb") as f:
        f.write(base64.b64decode(analysis_base64))
    print(f"✅ Stock technical analysis saved to {analysis_path}")
    
    print("All visualization tests completed!")
    
    # Verify files were created
    assert os.path.isfile(dashboard_path), "Market sentiment dashboard was not created"
    assert os.path.isfile(portfolio_path), "Portfolio tracking report was not created"
    assert os.path.isfile(analysis_path), "Stock technical analysis was not created"

# Allow running the test directly
if __name__ == "__main__":
    # Create examples directory if running standalone
    examples_dir = os.path.join(os.path.dirname(__file__), "examples")
    os.makedirs(examples_dir, exist_ok=True)
    
    # Run the test function with the examples directory
    asyncio.run(test_visualizations(examples_dir)) 