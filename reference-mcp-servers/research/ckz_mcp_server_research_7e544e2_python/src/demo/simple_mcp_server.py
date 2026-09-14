#!/usr/bin/env python3
"""
Simple MCP (Message Coordination Protocol) Server Demo
"""

import json
import logging
import os
import uuid
from datetime import datetime
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('mcp-server')

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

# In-memory storage for messages and clients
messages = []
clients = {}

# HTML template for the monitoring dashboard
DASHBOARD_HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>MCP Server Dashboard</title>
    <meta http-equiv="refresh" content="5">
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        .client { margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>MCP Server Dashboard</h1>
        <h2>Active Clients ({{ clients|length }})</h2>
        {% for client_id, client in clients.items() %}
        <div class="client">
            <h3>Client: {{ client_id }}</h3>
            <p>Last seen: {{ client.last_seen }}</p>
            <p>Status: {{ client.status }}</p>
        </div>
        {% endfor %}
        
        <h2>Message History ({{ messages|length }})</h2>
        <table>
            <thead>
                <tr>
                    <th>Time</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Message Type</th>
                    <th>Content</th>
                </tr>
            </thead>
            <tbody>
                {% for msg in messages %}
                <tr>
                    <td>{{ msg.timestamp }}</td>
                    <td>{{ msg.sender }}</td>
                    <td>{{ msg.recipient }}</td>
                    <td>{{ msg.message_type }}</td>
                    <td>{{ msg.content }}</td>
                </tr>
                {% endfor %}
            </tbody>
        </table>
    </div>
</body>
</html>
"""

@app.route('/')
def dashboard():
    """Render the monitoring dashboard"""
    return render_template_string(DASHBOARD_HTML, messages=messages, clients=clients)

@app.route('/api/register', methods=['POST'])
def register_client():
    """Register a new client with the MCP server"""
    data = request.json
    client_id = data.get('client_id', str(uuid.uuid4()))
    
    clients[client_id] = {
        'status': 'active',
        'last_seen': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'capabilities': data.get('capabilities', []),
    }
    
    logger.info(f"Client registered: {client_id}")
    return jsonify({
        'status': 'success',
        'client_id': client_id,
        'message': 'Client registered successfully'
    })

@app.route('/api/message', methods=['POST'])
def process_message():
    """Process an incoming message"""
    data = request.json
    
    # Validate required fields
    required_fields = ['sender', 'message_type']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'status': 'error',
                'message': f'Missing required field: {field}'
            }), 400
    
    # Create message record
    message = {
        'id': str(uuid.uuid4()),
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'sender': data['sender'],
        'recipient': data.get('recipient', 'broadcast'),
        'message_type': data['message_type'],
        'content': data.get('content', {}),
    }
    
    # Update client's last seen timestamp
    if message['sender'] in clients:
        clients[message['sender']]['last_seen'] = message['timestamp']
    
    # Store the message
    messages.append(message)
    
    # Log the message
    logger.info(f"Message received: {message['id']} - Type: {message['message_type']}")
    
    # Process message based on type
    if message['message_type'] == 'heartbeat':
        # Just acknowledge heartbeats
        return jsonify({
            'status': 'success',
            'message': 'Heartbeat acknowledged'
        })
    
    elif message['message_type'] == 'data':
        # Process data message
        # In a real implementation, this would trigger actions based on the data
        logger.info(f"Data message content: {message['content']}")
        
        return jsonify({
            'status': 'success',
            'message': 'Data received and processed'
        })
    
    elif message['message_type'] == 'command':
        # Process command message
        # In a real implementation, this would execute commands
        logger.info(f"Command message: {message['content']}")
        
        # Simulate command execution
        result = {
            'command_id': message['id'],
            'status': 'executed',
            'result': 'Command executed successfully'
        }
        
        return jsonify({
            'status': 'success',
            'result': result
        })
    
    # Default response for other message types
    return jsonify({
        'status': 'success',
        'message': 'Message received'
    })

@app.route('/api/clients', methods=['GET'])
def get_clients():
    """Get a list of all registered clients"""
    return jsonify({
        'status': 'success',
        'clients': clients
    })

@app.route('/api/messages', methods=['GET'])
def get_messages():
    """Get message history"""
    return jsonify({
        'status': 'success',
        'messages': messages
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    # Use debug mode only in development
    debug_mode = os.environ.get('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)