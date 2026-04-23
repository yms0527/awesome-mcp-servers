#!/usr/bin/env python3
"""
MCP Client Demo - Connects to the MCP server and sends sample messages
"""

import json
import time
import uuid
import logging
import requests
import argparse
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('mcp-client')

class MCPClient:
    """Simple MCP Protocol Client implementation with connection management and error handling"""
    
    def __init__(self, server_url, client_id=None, capabilities=None):
        """Initialize the MCP client"""
        self.server_url = server_url
        self.client_id = client_id or str(uuid.uuid4())
        self.capabilities = capabilities or ["messaging", "heartbeat"]
        self.registered = False
        self.session = requests.Session()  # Use a session for connection pooling and efficiency
        logger.info(f"Initializing MCP Client with ID: {self.client_id}")
    
    def register(self):
        """Register the client with the MCP server"""
        endpoint = f"{self.server_url}/api/register"
        data = {
            "client_id": self.client_id,
            "capabilities": self.capabilities
        }
        
        try:
            response = self.session.post(endpoint, json=data, timeout=10)
            if response.status_code == 200:
                self.registered = True
                logger.info(f"Client registered successfully: {response.json()}")
                return True
            else:
                logger.error(f"Failed to register client: {response.text}")
                return False
        except requests.exceptions.Timeout:
            logger.error(f"Timeout while registering client")
            return False
        except Exception as e:
            logger.error(f"Error registering client: {e}")
            return False
    
    def send_message(self, message_type, content=None, recipient=None):
        """Send a message to the MCP server"""
        if not self.registered:
            logger.warning("Client not registered. Attempting to register...")
            if not self.register():
                return False
        
        endpoint = f"{self.server_url}/api/message"
        data = {
            "sender": self.client_id,
            "message_type": message_type,
        }
        
        if recipient:
            data["recipient"] = recipient
        
        if content:
            data["content"] = content
        
        try:
            response = self.session.post(endpoint, json=data, timeout=10)
            if response.status_code == 200:
                logger.info(f"Message sent successfully: {message_type}")
                logger.debug(f"Response: {response.json()}")
                return True
            else:
                logger.error(f"Failed to send message: {response.text}")
                return False
        except requests.exceptions.Timeout:
            logger.error(f"Timeout while sending message {message_type}")
            return False  
        except Exception as e:
            logger.error(f"Error sending message: {e}")
            return False
    
    def send_heartbeat(self):
        """Send a heartbeat message to the server"""
        return self.send_message("heartbeat", {
            "status": "active",
            "timestamp": datetime.now().isoformat()
        })
    
    def send_data(self, data_payload, recipient=None):
        """Send a data message to the server"""
        return self.send_message("data", data_payload, recipient)
    
    def send_command(self, command, params=None, recipient=None):
        """Send a command message to the server"""
        content = {
            "command": command,
        }
        if params:
            content["params"] = params
        
        return self.send_message("command", content, recipient)

def run_demo(server_url, duration=60, interval=5):
    """Run a demonstration of the MCP client with robust error handling"""
    client = MCPClient(server_url)
    
    # Register the client
    if not client.register():
        logger.error("Failed to register client. Exiting.")
        return
    
    # Send initial data
    client.send_data({
        "client_info": {
            "name": "Demo Client",
            "version": "1.0.0",
            "os": "Python Demo Environment"
        }
    })
    
    # Run for the specified duration
    start_time = time.time()
    counter = 0
    
    while time.time() - start_time < duration:
        try:
            # Send a heartbeat every interval
            client.send_heartbeat()
            
            # Every 3 intervals, send some sample data
            if counter % 3 == 0:
                client.send_data({
                    "sensor_readings": {
                        "temperature": 22 + (counter % 10),
                        "humidity": 45 + (counter % 20),
                        "pressure": 1013 + (counter % 30)
                    },
                    "timestamp": datetime.now().isoformat()
                })
            
            # Every 5 intervals, send a command
            if counter % 5 == 0:
                client.send_command("check_status", {
                    "verbose": True,
                    "include_metrics": True
                })
            
            # Increment counter and sleep
            counter += 1
            time.sleep(interval)
        except requests.exceptions.ConnectionError as e:
            logger.error(f"Connection error: {e}. Retrying in {interval} seconds...")
            time.sleep(interval)
        except Exception as e:
            logger.error(f"Unexpected error: {e}. Continuing...")
            time.sleep(interval)
    
    # Send final message before exiting
    client.send_data({
        "message": "Demo completed",
        "metrics": {
            "messages_sent": counter,
            "duration": time.time() - start_time
        }
    })
    
    logger.info(f"Demo completed. Sent {counter} messages over {duration} seconds.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='MCP Client Demo')
    parser.add_argument('--server', '-s', default='http://localhost:5000',
                      help='MCP Server URL (default: http://localhost:5000)')
    parser.add_argument('--duration', '-d', type=int, default=60,
                      help='Demo duration in seconds (default: 60)')
    parser.add_argument('--interval', '-i', type=int, default=5,
                      help='Interval between messages in seconds (default: 5)')
    
    args = parser.parse_args()
    
    logger.info(f"Starting MCP Client Demo with server: {args.server}")
    run_demo(args.server, args.duration, args.interval)