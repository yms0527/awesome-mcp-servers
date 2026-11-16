import sys
import os
import logging
from mcp.server import FastMCP
from mcp.server.stdio import stdio_server
import ssl
import socket
import datetime
from urllib.parse import urlparse

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("mcp_server.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("cert_expiry_checker")

# Log startup information
logger.info("Starting Certificate Expiry Checker MCP Server")
logger.info(f"Python version: {sys.version}")
logger.info(f"Current working directory: {os.getcwd()}")

try:
    # Initialize the MCP server
    app = FastMCP()
    logger.info("FastMCP initialized successfully")

    @app.tool("check_certificate")
    def check_certificate(url: str) -> dict:
        """
        Check the SSL certificate expiry for a given URL.
        
        Args:
            url: The URL to check (e.g., https://www.google.com/)
            
        Returns:
            Dictionary containing certificate information including expiry date, days remaining, and status
        """
        logger.info(f"Checking certificate for URL: {url}")
        try:
            # Parse the URL to extract hostname
            parsed_url = urlparse(url)
            hostname = parsed_url.netloc
            
            # If hostname is empty, try using the path (for cases where user enters domain without protocol)
            if not hostname:
                hostname = parsed_url.path
                logger.info(f"No netloc found, using path as hostname: {hostname}")
            
            # Remove port if present
            hostname = hostname.split(':')[0]
            
            # Default port for HTTPS
            port = 443
            
            logger.info(f"Connecting to {hostname}:{port} to check certificate")
            # Create SSL context
            context = ssl.create_default_context()
            
            # Connect to the server and get certificate
            with socket.create_connection((hostname, port)) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    
                    # Extract expiry date
                    expiry_date_str = cert['notAfter']
                    expiry_date = datetime.datetime.strptime(expiry_date_str, "%b %d %H:%M:%S %Y %Z")
                    
                    # Calculate days remaining
                    days_remaining = (expiry_date - datetime.datetime.now()).days
                    
                    # Determine status based on days remaining
                    if days_remaining > 60:
                        status = "valid"  # Green
                    elif days_remaining >= 30:
                        status = "warning"  # Yellow
                    else:
                        status = "expired"  # Red
                    
                    result = {
                        "url": url,
                        "hostname": hostname,
                        "expiry_date": expiry_date.strftime("%Y-%m-%d"),
                        "days_remaining": days_remaining,
                        "status": status
                    }
                    logger.info(f"Certificate check result: {result}")
                    return result
        
        except Exception as e:
            logger.error(f"Error checking certificate: {str(e)}", exc_info=True)
            return {
                "url": url,
                "hostname": hostname if 'hostname' in locals() else "Unknown",
                "expiry_date": "Error",
                "days_remaining": -1,
                "status": "error",
                "error": str(e)
            }

    @app.tool("check_multiple_certificates")
    def check_multiple_certificates(urls: list) -> dict:
        """
        Check SSL certificate expiry for multiple URLs.
        
        Args:
            urls: List of URLs to check (e.g., ["https://www.google.com/", "https://www.microsoft.com/"])
            
        Returns:
            Dictionary containing results for each URL with certificate information
        """
        logger.info(f"Checking multiple certificates for URLs: {urls}")
        results = []
        for url in urls:
            result = check_certificate(url)
            results.append(result)
        
        return {"results": results}

    @app.resource("https://cert-expiry-checker.example/certificate-report")
    def certificate_report() -> str:
        """
        Generate a report of certificate expiry for predefined URLs.
        
        Returns:
            HTML report showing certificate expiry status for monitored URLs
        """
        logger.info("Generating certificate report")
        # Predefined URLs to check
        urls = [
            "https://www.google.com/",
            "https://www.microsoft.com/en-in/"
        ]
        
        # Check certificates
        results = []
        for url in urls:
            result = check_certificate(url)
            results.append(result)
        
        # Generate HTML report
        html = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Certificate Expiry Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .report-title { text-align: center; margin-bottom: 20px; }
                .cert-item { 
                    padding: 15px; 
                    margin-bottom: 10px; 
                    border-radius: 5px; 
                }
                .valid { background-color: #d4edda; border-left: 5px solid #28a745; }
                .warning { background-color: #fff3cd; border-left: 5px solid #ffc107; }
                .expired { background-color: #f8d7da; border-left: 5px solid #dc3545; }
                .error { background-color: #f5f5f5; border-left: 5px solid #6c757d; }
                .timestamp { text-align: center; color: #6c757d; font-size: 0.9rem; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="report-title">
                <h1>Certificate Expiry Report</h1>
                <p>SSL certificate expiry status for monitored websites</p>
            </div>
        """
        
        for result in results:
            status_class = result["status"]
            html += f"""
            <div class="cert-item {status_class}">
                <h3>{result["hostname"]}</h3>
                <p><strong>URL:</strong> {result["url"]}</p>
            """
            
            if result["status"] == "error":
                html += f"<p><strong>Error:</strong> {result.get('error', 'Unknown error')}</p>"
            else:
                html += f"""
                <p><strong>Expiry Date:</strong> {result["expiry_date"]}</p>
                <p><strong>Days Remaining:</strong> {result["days_remaining"]}</p>
                <p><strong>Status:</strong> {result["status"].capitalize()}</p>
                """
            
            html += "</div>"
        
        html += f"""
            <div class="timestamp">
                <p>Last updated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </div>
        </body>
        </html>
        """
        
        return html

    if __name__ == "__main__":
        logger.info("Starting MCP server with stdio transport")
        try:
            # Run the MCP server using stdio_server function
            stdio_server(app)
            logger.info("MCP server started successfully")
            
            # Keep the process alive to maintain stdio connection
            import time
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            logger.info("Server stopped by user")
            sys.exit(0)
        except Exception as e:
            logger.error(f"Error starting MCP server: {str(e)}", exc_info=True)
            sys.exit(1)

except Exception as e:
    logger.error(f"Initialization error: {str(e)}", exc_info=True)
    sys.exit(1)
