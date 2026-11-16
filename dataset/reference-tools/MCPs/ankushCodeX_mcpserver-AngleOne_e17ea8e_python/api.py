import sys
sys.path.append(r'E:\\Ankush\\Python\\Cognetive-AI\\AngelOne\\venv\\Lib\\site-packages')
from SmartApi import SmartConnect
import pyotp
from logzero import logger
import os
from dotenv import load_dotenv
from typing import Any
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("angelone-mcp")

# Load environment variables from .env file
load_dotenv()


@mcp.tool()
def get_historical_data(
    exchange: str,
    symboltoken: str,
    interval: str,
    fromdate: str,
    todate: str
) -> Any:
    """
    Get historical candlestick data from Angel One API.

    Args:
        exchange: The exchange code (e.g., "NSE").
        symboltoken: The symbol token for the stock.
        interval: The time interval for the data (e.g., "ONE_MINUTE", "ONE_HOUR", "ONE_DAY").
        fromdate: Start date and time in "YYYY-MM-DD HH:MM" format.
        todate: End date and time in "YYYY-MM-DD HH:MM" format.
    
    Returns: 
        Historical data as a dictionary or None if an error occurs.
    """
    
    # Get historical data
    params = {
        "exchange": exchange,
        "symboltoken": symboltoken,
        "interval": interval,
        "fromdate": fromdate,
        "todate": todate
    }
    
    try:
        historical_data = smart_api.getCandleData(params)
        return historical_data
    except Exception as e:
        logger.exception(f"Historic Api failed: {e}")
        return None
    
@mcp.tool()
def get_optionGreek_data(
    symboltoken: str,
    expirydate: str,
) -> Any:
    """
    Get historical candlestick data from Angel One API.

    Args:
        symboltoken: The symbol token for the stock.
        expirydate: The expiry specific for which the option data is required
        
    Returns: 
        Greek data as a dictionary or None if an error occurs.
    """
    
    # Get historical data
    params = {
        "name": symboltoken,
        "expirydate": expirydate
    }
    
    try:
        historical_data = smart_api.optionGreek(params)
        return historical_data
    except Exception as e:
        logger.exception(f"Historic Api failed: {e}")
        return None
    

@mcp.tool()
def get_historical_data_multiple_stocks(
    exchange: str,
    symboltokens: list[str],
    interval: str,
    fromdate: str,
    todate: str
) -> Any:
    """
    Get historical candlestick data for multiple stocks from Angel One API.

    Args:
        exchange: The exchange code (e.g., "NSE").
        symboltokens: The list of symbol tokens for the stocks.
        interval: The time interval for the data (e.g., "ONE_MINUTE", "ONE_HOUR", "ONE_DAY").
        fromdate: Start date and time in "YYYY-MM-DD HH:MM" format.
        todate: End date and time in "YYYY-MM-DD HH:MM" format.
    
    Returns:
        Historical data as a dictionary or None if an error occurs.
    """
    
    # Call get_historical_data for each symbol token in parallel
    results = []
    for symboltoken in symboltokens:
        params = {
            "exchange": exchange,
            "symboltoken": symboltoken,
            "interval": interval,
            "fromdate": fromdate,
            "todate": todate
        }
        
        try:
            historical_data = smart_api.getCandleData(params)
            results.append(historical_data)
        except Exception as e:
            logger.exception(f"Historic Api failed for {symboltoken}: {e}")
            results.append(None)
    return results

@mcp.tool()
def get_portfolio():
    """
    Get portfolio data from the Angel One API.

    Returns:
        Portfolio data as a dictionary or None if an error occurs.
    """
    try:
        return smart_api.allholding()
    except Exception as e:
        logger.exception(f"Portfolio Api failed: {e}")
        return None

@mcp.tool()    
def get_positional_data():
    """
    Get positional data from the Angel One API.

    Returns:
        positional data as a dictionary or None if an error occurs.
    """
    try:
        return smart_api.position()
    except Exception as e:
        logger.exception(f"positon Api failed: {e}")
        return None

@mcp.tool()    
def get_trade_book():
    """
    Get Trade Book from the Angel One API.

    Returns:
        Trade Book as a dictionary or None if an error occurs.
    """
    try:
        return smart_api.tradeBook()
    except Exception as e:
        logger.exception(f"TradeBook Api failed: {e}")
        return None

def initialize_api(api_key):
    """Initialize the SmartAPI connection with the API key"""
    return SmartConnect(api_key)


def generate_totp(token):
    """Generate TOTP from the provided token"""
    try:
        return pyotp.TOTP(token).now()
    except Exception as e:
        logger.error("Invalid Token: The provided token is not valid.")
        raise e

def login(smart_api, client_id, password, totp, correlation_id=None):
    """Login to the Angel One API and return the session data"""
    if correlation_id:
        data = smart_api.generateSession(client_id, password, totp)
    else:
        data = smart_api.generateSession(client_id, password, totp)
    
    if data['status'] == False:
        logger.error(data)
        return None
    
    return data['data']


def setup_session(smart_api, session_data):
    """Setup session using the tokens from login"""
    auth_token = session_data['jwtToken']
    refresh_token = session_data['refreshToken']
    
    # Get feed token
    feed_token = smart_api.getfeedToken()
    
    # Get user profile
    profile = smart_api.getProfile(refresh_token)
    
    # Generate token (refresh)
    smart_api.generateToken(refresh_token)
    
    return {
        'auth_token': auth_token,
        'refresh_token': refresh_token,
        'feed_token': feed_token,
        'profile': profile
    }


def get_historical_data(smart_api, params):
    """Get historical candlestick data"""
    try:
        return smart_api.getCandleData(params)
    except Exception as e:
        logger.exception(f"Historic Api failed: {e}")
        return None


def logout(smart_api, client_id):
    """Logout from the API"""
    try:
        result = smart_api.terminateSession(client_id)
        logger.info("Logout Successful")
        return result
    except Exception as e:
        logger.exception(f"Logout failed: {e}")
        return None


def main():
    """Main function to demonstrate API workflow"""
    # Get credentials from environment variables
    api_key = ""
    client_id = ""
    password = ""
    token = ""
    
    # Initialize API
    global smart_api
    smart_api = initialize_api(api_key)
    
    # Generate TOTP
    totp = generate_totp(token)
    
    # Login and get session data
    session_data = login(smart_api, client_id, password, totp, correlation_id="abcde")
    if not session_data:
        return
    
    # Setup session with tokens
    session_info = setup_session(smart_api, session_data)
    
    

if __name__ == "__main__":
    try:
        main()
        mcp.run(transport='stdio')
    except Exception as e:
        logger.exception(f"An error occurred: {e}")
    finally:
        # mcp.close()
        logout(smart_api, os.environ.get('CLIENT_ID'))
        logger.info("MCP closed.")