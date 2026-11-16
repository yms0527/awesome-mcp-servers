import os
import requests
from mcp.server.fastmcp import FastMCP

# Initialize the MCP server with a descriptive name and optional version
mcp = FastMCP("MailchimpServer")

# --- Configuration & Authentication ---
# Fetch Mailchimp API credentials from environment (for security, avoid hardcoding)
MAILCHIMP_API_KEY = os.environ.get("MAILCHIMP_API_KEY", "<YOUR_API_KEY>")
MAILCHIMP_DC     = os.environ.get("MAILCHIMP_DC", "<YOUR_DC>")
# The data center (DC) is typically the substring after the '-' in the API key, e.g. "us21"
# If not set explicitly, try to derive it from the API key
if MAILCHIMP_DC == "<YOUR_DC>" and MAILCHIMP_API_KEY and "-" in MAILCHIMP_API_KEY:
    MAILCHIMP_DC = MAILCHIMP_API_KEY.split('-')[-1]

# Base URL for Mailchimp Marketing API
BASE_URL = f"https://{MAILCHIMP_DC}.api.mailchimp.com/3.0"

# A helper to perform Mailchimp API requests with proper authentication
def mailchimp_request(method: str, endpoint: str, **kwargs):
    """Make an HTTP request to Mailchimp API and return the response object."""
    url = BASE_URL + endpoint
    # Mailchimp uses HTTP Basic auth where username can be anything and password is the API key
    auth = ("anystring", MAILCHIMP_API_KEY)
    try:
        response = requests.request(method, url, auth=auth, **kwargs)
    except requests.RequestException as e:
        # Network or connection error
        raise Exception(f"Failed to connect to Mailchimp API: {e}")
    # If the response status indicates an error, raise an exception with details
    if response.status_code >= 400:
        # Try to extract error message from Mailchimp's response JSON if available
        error_detail = ""
        try:
            err_json = response.json()
            # Mailchimp API errors often have keys like 'detail' or 'title' for error messages
            error_detail = err_json.get("detail") or err_json.get("title") or str(err_json)
        except ValueError:
            error_detail = response.text or "Unknown error"
        raise Exception(f"Mailchimp API error {response.status_code}: {error_detail}")
    return response

# --- MCP Tool Definitions ---

@mcp.tool()
def list_campaigns() -> list:
    """Retrieve all email campaigns in the Mailchimp account (returns basic info for each campaign)."""
    # Call Mailchimp API to list campaigns
    resp = mailchimp_request("GET", "/campaigns")
    data = resp.json()
    campaigns = []
    for camp in data.get("campaigns", []):
        campaigns.append({
            "id": camp.get("id"),
            "name": camp.get("settings", {}).get("title") or camp.get("settings", {}).get("subject_line"),
            "status": camp.get("status"),
            "emails_sent": camp.get("emails_sent")
        })
    return campaigns

@mcp.tool()
def create_campaign(list_id: str, subject: str, from_name: str, reply_to: str) -> dict:
    """Create a new email campaign in Mailchimp (returns the new campaign's ID and details)."""
    # Prepare the campaign payload (using 'regular' campaign type)
    payload = {
        "type": "regular",
        "recipients": {"list_id": list_id},
        "settings": {
            "subject_line": subject,
            "from_name": from_name,
            "reply_to": reply_to
        }
    }
    resp = mailchimp_request("POST", "/campaigns", json=payload)
    campaign_info = resp.json()
    # Return key details of the created campaign (id and status)
    return {"id": campaign_info.get("id"), "status": campaign_info.get("status", "created")}

@mcp.tool()
def send_campaign(campaign_id: str) -> str:
    """Send a campaign that has been created (campaign must be ready to send)."""
    # Hitting the send action endpoint for the specified campaign
    mailchimp_request("POST", f"/campaigns/{campaign_id}/actions/send")
    # If successful (no exception raised), Mailchimp will have queued/sent the campaign
    return f"Campaign {campaign_id} has been sent."

@mcp.tool()
def list_automations() -> list:
    """List all classic automation workflows in the Mailchimp account."""
    resp = mailchimp_request("GET", "/automations")
    data = resp.json()
    automations = []
    for auto in data.get("automations", []):
        automations.append({
            "id": auto.get("id"),
            "name": auto.get("settings", {}).get("title") or auto.get("create_time"),  # title if present
            "status": auto.get("status"),
            "emails_sent": auto.get("emails_sent")
        })
    return automations

@mcp.tool()
def start_automation(workflow_id: str) -> str:
    """Start all emails in a specified automation workflow (activating the automation)."""
    mailchimp_request("POST", f"/automations/{workflow_id}/actions/start-all-emails")
    return f"Automation workflow {workflow_id} started."

# We could add more tools for other operations (pause automation, add subscribers, etc.) following the same pattern.

if __name__ == "__main__":
    # Run the MCP server. This will listen for incoming MCP client connections (stdio by default).
    print("Starting Mailchimp MCP server... (press Ctrl+C to stop)")
    mcp.run()

