from praisonaiagents import Agent, MCP
import requests
import json
import time
import threading
import sys
import os
from difflib import SequenceMatcher
from datetime import datetime, timedelta

# Store contacts locally
CONTACTS_FILE = "contacts.json"
MESSAGE_LOG_FILE = "message_log.json"
MAX_RETRIES = 3
RETRY_DELAY = 5  # seconds

# WhatsApp bridge server configuration
WHATSAPP_BRIDGE_HOST = "http://localhost:8080"
WHATSAPP_BRIDGE_ENDPOINTS = {
    "contacts": "/api/contacts",
    "send": "/api/send",
    "receive": "/api/messages"  # New endpoint for receiving messages
}

# Store last checked message timestamp
last_check_time = None  # Changed from datetime.now() to None initially

def get_whatsapp_contacts():
    url = f"{WHATSAPP_BRIDGE_HOST}{WHATSAPP_BRIDGE_ENDPOINTS['contacts']}"
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            try:
                contacts = response.json()
                print(f"Successfully loaded {len(contacts)} contacts from WhatsApp")
                # Save contacts locally
                with open(CONTACTS_FILE, 'w') as f:
                    json.dump(contacts, f, indent=2)
                return contacts
            except json.JSONDecodeError:
                return None
        else:
            return None
    except requests.exceptions.ConnectionError:
        return None
    except Exception as e:
        return None

def load_contacts():
    # First try to get contacts from WhatsApp
    whatsapp_contacts = get_whatsapp_contacts()
    if whatsapp_contacts:
        return whatsapp_contacts
    
    # If WhatsApp contacts not available, load from local file
    if os.path.exists(CONTACTS_FILE):
        try:
            with open(CONTACTS_FILE, 'r') as f:
                contacts = json.load(f)
                print(f"Loaded {len(contacts)} contacts from local file")
                return contacts
        except:
            print("Error loading contacts from local file")
            return []
    print("No local contacts file found")
    return []

def save_contact(name, number):
    contacts = load_contacts()
    # Check if contact already exists
    for contact in contacts:
        if contact.get('number') == number:
            print(f"\nContact already exists: {contact.get('name')} - {number}")
            return
    
    contacts.append({
        "name": name,
        "number": number
    })
    with open(CONTACTS_FILE, 'w') as f:
        json.dump(contacts, f, indent=2)
    print(f"\nContact saved: {name} - {number}")

def search_contacts(query):
    contacts = load_contacts()
    if not contacts:
        return [], []
    
    # Convert query to lowercase for case-insensitive search
    query = query.lower()
    exact_matches = []
    similar_matches = []
    
    for contact in contacts:
        name = contact.get('name', '').lower()
        number = contact.get('number', '')
        
        # Check for exact substring match
        if query in name or query in number:
            exact_matches.append(contact)
        else:
            # Calculate similarity ratio for fuzzy matching
            similarity = SequenceMatcher(None, query, name).ratio()
            if similarity > 0.5:  # Threshold for similarity
                contact['similarity'] = similarity
                similar_matches.append(contact)
    
    # Sort similar matches by similarity score
    similar_matches.sort(key=lambda x: x['similarity'], reverse=True)
    return exact_matches, similar_matches[:3]  # Return top 3 similar matches

def load_message_log():
    """Load message log from file"""
    if os.path.exists(MESSAGE_LOG_FILE):
        try:
            with open(MESSAGE_LOG_FILE, 'r') as f:
                return json.load(f)
        except:
            return {"sent": [], "received": [], "failed": []}
    return {"sent": [], "received": [], "failed": []}

def save_message_log(log_data):
    """Save message log to file"""
    with open(MESSAGE_LOG_FILE, 'w') as f:
        json.dump(log_data, f, indent=2)

def log_message(message_type, contact, message, status="success"):
    """Log a message with timestamp"""
    log_data = load_message_log()
    
    entry = {
        "timestamp": datetime.now().isoformat(),
        "contact_name": contact.get('name', 'Unknown'),
        "contact_number": contact.get('number', 'Unknown'),
        "message": message,
        "status": status
    }
    
    if message_type == "sent":
        log_data["sent"].append(entry)
    elif message_type == "received":
        log_data["received"].append(entry)
    elif message_type == "failed":
        log_data["failed"].append(entry)
    
    save_message_log(log_data)
    return entry

def retry_failed_messages():
    """Retry sending failed messages"""
    log_data = load_message_log()
    failed_messages = log_data.get("failed", [])
    
    if not failed_messages:
        return
    
    print("\nRetrying failed messages...")
    still_failed = []
    
    for entry in failed_messages:
        print(f"\nRetrying message to {entry['contact_name']}: {entry['message']}")
        
        # Try to send the message again
        if send_whatsapp_message(entry['contact_number'], entry['message'], retry=False):
            print("Retry successful!")
            # Log successful retry
            log_message("sent", 
                       {"name": entry['contact_name'], "number": entry['contact_number']}, 
                       entry['message'])
        else:
            print("Retry failed.")
            still_failed.append(entry)
    
    # Update failed messages list
    log_data["failed"] = still_failed
    save_message_log(log_data)
    
    if still_failed:
        print(f"\n{len(still_failed)} messages still failed to send.")
    else:
        print("\nAll failed messages were sent successfully!")

def send_whatsapp_message(recipient, message, retry=True):
    """Send WhatsApp message with retry support"""
    # Add WhatsApp suffix if not present
    if not recipient.endswith("@s.whatsapp.net"):
        recipient = f"{recipient}@s.whatsapp.net"
    
    url = "http://localhost:8080/api/send"
    headers = {"Content-Type": "application/json"}
    data = {
        "recipient": recipient,
        "message": message
    }
    
    for attempt in range(MAX_RETRIES if retry else 1):
        try:
            print(f"\nSending message to {recipient}..." + (f" (Attempt {attempt + 1})" if attempt > 0 else ""))
            response = requests.post(url, headers=headers, json=data)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    return True
            
            if attempt < MAX_RETRIES - 1 and retry:
                print(f"Retrying in {RETRY_DELAY} seconds...")
                time.sleep(RETRY_DELAY)
            
        except Exception as e:
            if attempt < MAX_RETRIES - 1 and retry:
                print(f"Error: {str(e)}")
                print(f"Retrying in {RETRY_DELAY} seconds...")
                time.sleep(RETRY_DELAY)
            else:
                print(f"Error: {str(e)}")
    
    return False

def get_new_messages():
    """Get new messages with improved timestamp handling"""
    global last_check_time
    url = f"{WHATSAPP_BRIDGE_HOST}{WHATSAPP_BRIDGE_ENDPOINTS['receive']}"
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            messages = response.json()
            new_messages = []
            
            # Initialize last_check_time if None
            if last_check_time is None:
                if messages:
                    # Start from the most recent message
                    last_message_time = max(datetime.fromisoformat(msg['timestamp']) 
                                         for msg in messages)
                    last_check_time = last_message_time
                else:
                    last_check_time = datetime.now()
                return []  # Skip first run to avoid showing old messages
            
            # Filter messages newer than last check
            for msg in messages:
                msg_time = datetime.fromisoformat(msg['timestamp'])
                if msg_time > last_check_time:
                    new_messages.append(msg)
            
            # Update last check time to the most recent message time or current time
            if new_messages:
                last_check_time = max(datetime.fromisoformat(msg['timestamp']) 
                                    for msg in new_messages)
            else:
                last_check_time = datetime.now()
            
            return new_messages
        return []
    except Exception as e:
        print(f"\nError checking messages: {str(e)}")
        return []

def check_messages_thread(stop_event):
    """Improved message checking thread"""
    print("\nStarted monitoring for new messages...")
    
    while not stop_event.is_set():
        try:
            new_messages = get_new_messages()
            for message in new_messages:
                try:
                    sender = message.get('sender')
                    text = message.get('text', '')
                    timestamp = datetime.fromisoformat(message.get('timestamp')).strftime('%H:%M:%S')
                    
                    # Find contact name if available
                    contacts = load_contacts()
                    sender_name = sender
                    contact_info = {"number": sender.replace('@s.whatsapp.net', '')}
                    
                    for contact in contacts:
                        if contact.get('number') == contact_info["number"]:
                            sender_name = contact.get('name')
                            contact_info["name"] = sender_name
                            break
                    
                    # Log received message
                    log_message("received", contact_info, text)
                    
                    # Print incoming message with clear formatting
                    print(f"\n{'='*50}")
                    print(f"📩 New message at {timestamp}")
                    print(f"From: {sender_name}")
                    print(f"Message: {text}")
                    print(f"{'='*50}")
                    print("\nYou: ", end='', flush=True)  # Restore input prompt
                except Exception as e:
                    print(f"\nError processing message: {str(e)}")
            
            time.sleep(2)  # Check every 2 seconds
        except Exception as e:
            print(f"\nError in message checking thread: {str(e)}")
            time.sleep(2)  # Wait before retrying

def wait_for_reply(contact_number, timeout_seconds=30):
    """Wait for a reply from specific contact"""
    start_time = datetime.now()
    while (datetime.now() - start_time).seconds < timeout_seconds:
        new_messages = get_new_messages()
        for message in new_messages:
            sender = message.get('sender', '').replace('@s.whatsapp.net', '')
            if sender == contact_number:
                return message.get('text', '')
        time.sleep(1)
    return None

def ai_chat_with_goal(contact, goal):
    """Conduct an AI-driven conversation with a specific goal"""
    print(f"\nStarting AI chat with {contact['name']} to {goal}")
    conversation = []
    max_turns = 5  # Maximum conversation turns to prevent infinite loops
    turns = 0
    
    # Initial context for the AI
    context = f"""You are an AI assistant having a WhatsApp conversation to {goal}.
Keep messages natural and conversational. Be concise.
If you achieve the goal, end with: GOAL_ACHIEVED: [result]
If you can't achieve the goal after trying, end with: GOAL_FAILED: [reason]"""
    
    while turns < max_turns:
        # Get AI's next message
        prompt = f"{context}\n\nConversation so far:\n{conversation}\n\nGenerate the next message to send:"
        
        try:
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "llama3.2:latest",
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9
                    }
                },
                timeout=30
            )
            
            if response.status_code == 200:
                ai_message = response.json()["response"]
                
                # Check if AI indicates goal completion or failure
                if "GOAL_ACHIEVED:" in ai_message:
                    result = ai_message.split("GOAL_ACHIEVED:")[1].strip()
                    print(f"\nGoal achieved! Result: {result}")
                    return True, result
                
                if "GOAL_FAILED:" in ai_message:
                    reason = ai_message.split("GOAL_FAILED:")[1].strip()
                    print(f"\nGoal failed. Reason: {reason}")
                    return False, reason
                
                # Send AI's message
                print(f"\nAI -> {contact['name']}: {ai_message}")
                if send_whatsapp_message(contact['number'], ai_message):
                    conversation.append(f"AI: {ai_message}")
                    
                    # Wait for reply
                    print(f"Waiting for reply from {contact['name']}...")
                    reply = wait_for_reply(contact['number'])
                    
                    if reply:
                        print(f"{contact['name']} -> AI: {reply}")
                        conversation.append(f"User: {reply}")
                    else:
                        print("No reply received within timeout.")
                        return False, "No reply received"
                else:
                    print("Failed to send message")
                    return False, "Message sending failed"
            
            turns += 1
        except Exception as e:
            print(f"Error in AI chat: {str(e)}")
            return False, str(e)
    
    return False, "Maximum conversation turns reached"

def chat_mode():
    print("\nWelcome to WhatsApp AI Assistant!")
    print("You can chat naturally with me. I can help you:")
    print("- Send messages to contacts")
    print("- See incoming messages in real-time")
    print("- Start AI chat with goal (type 'ai chat with [contact] to [goal]')")
    print("- Retry failed messages (type 'retry failed')")
    print("- Show message history (type 'show log')")
    print("- Answer questions about WhatsApp")
    print("\nType 'exit' to quit")
    
    conversation_history = []
    last_contact = None
    
    # Start message checking thread
    stop_event = threading.Event()
    message_thread = threading.Thread(target=check_messages_thread, args=(stop_event,))
    message_thread.daemon = True  # Thread will stop when main program exits
    message_thread.start()
    
    try:
        while True:
            try:
                user_input = input("\nYou: ").strip()
                
                if user_input.lower() == 'exit':
                    stop_event.set()  # Signal thread to stop
                    print("\nGoodbye! Have a great day!")
                    sys.exit(0)
                
                # Add user message to history
                conversation_history.append(f"User: {user_input}")
                
                # Check for reply command
                if user_input.lower().startswith(('reply ', 'r ')):
                    if last_contact:
                        message = user_input[user_input.find(' '):].strip()
                        if message:
                            print(f"\nReplying to {last_contact['name']} ({last_contact['number']}): {message}")
                            if send_whatsapp_message(last_contact['number'], message):
                                print("Message sent successfully!")
                                log_message("sent", last_contact, message)
                                last_contact = last_contact
                            else:
                                print("Failed to send message.")
                                log_message("failed", last_contact, message, status="failed")
                        else:
                            print("Please include a message after 'reply' or 'r'")
                    else:
                        print("No previous contact to reply to. Please send a message to someone first.")
                    continue
                
                # Check for AI chat command
                if user_input.lower().startswith('ai chat with'):
                    try:
                        # Parse command: "ai chat with [contact] to [goal]"
                        parts = user_input[12:].split(' to ', 1)
                        if len(parts) == 2:
                            contact_name = parts[0].strip()
                            goal = parts[1].strip()
                            
                            # Search for contact
                            exact_matches, similar_matches = search_contacts(contact_name)
                            contact = None
                            
                            if exact_matches:
                                contact = exact_matches[0]
                            elif similar_matches:
                                print("\nDid you mean one of these contacts? Enter the number to select, or 'n' to cancel:")
                                for i, c in enumerate(similar_matches, 1):
                                    print(f"{i}. {c.get('name')} ({c.get('number')})")
                                
                                selection = input("Select contact (1-{0} or 'n' to cancel): ".format(len(similar_matches)))
                                if selection.lower() != 'n':
                                    try:
                                        idx = int(selection) - 1
                                        if 0 <= idx < len(similar_matches):
                                            contact = similar_matches[idx]
                                    except ValueError:
                                        print("Invalid selection")
                            
                            if contact:
                                success, result = ai_chat_with_goal(contact, goal)
                                if success:
                                    print(f"\nAI chat completed successfully: {result}")
                                else:
                                    print(f"\nAI chat failed: {result}")
                            else:
                                print(f"Could not find contact: {contact_name}")
                        else:
                            print("Please use format: ai chat with [contact] to [goal]")
                    except Exception as e:
                        print(f"Error starting AI chat: {str(e)}")
                    continue
                
                # Check if this is a message sending request
                if any(word in user_input.lower() for word in ['send', 'message', 'tell']):
                    # Extract contact name and message
                    try:
                        # Simple parsing - you might need to improve this
                        parts = user_input.lower().split('to', 1)
                        if len(parts) > 1:
                            contact_part = parts[1].split('say', 1)[0].strip()
                            message = parts[1].split('say', 1)[1].strip() if 'say' in parts[1] else "Hello"
                            
                            # Search for contact
                            exact_matches, similar_matches = search_contacts(contact_part)
                            
                            if exact_matches:
                                contact = exact_matches[0]  # Take first exact match
                                number = contact.get('number')
                                if number:
                                    print(f"\nSending message to {contact.get('name')} ({number}): {message}")
                                    if send_whatsapp_message(number, message):
                                        print("Message sent successfully!")
                                        log_message("sent", contact, message)
                                        last_contact = contact  # Update last contacted person
                                    else:
                                        print("Failed to send message.")
                                        log_message("failed", contact, message, status="failed")
                                else:
                                    print(f"Could not find number for contact: {contact_part}")
                            else:
                                print(f"\nCould not find exact match for contact: {contact_part}")
                                if similar_matches:
                                    print("Did you mean one of these contacts? Enter the number to select, or 'n' to cancel:")
                                    for i, contact in enumerate(similar_matches, 1):
                                        print(f"{i}. {contact.get('name')} ({contact.get('number')})")
                                    
                                    selection = input("Select contact (1-{0} or 'n' to cancel): ".format(len(similar_matches)))
                                    if selection.lower() != 'n':
                                        try:
                                            idx = int(selection) - 1
                                            if 0 <= idx < len(similar_matches):
                                                selected_contact = similar_matches[idx]
                                                number = selected_contact.get('number')
                                                if number:
                                                    print(f"\nSending message to {selected_contact.get('name')} ({number}): {message}")
                                                    if send_whatsapp_message(number, message):
                                                        print("Message sent successfully!")
                                                        log_message("sent", selected_contact, message)
                                                        last_contact = selected_contact  # Update last contacted person
                                                    else:
                                                        print("Failed to send message.")
                                                        log_message("failed", selected_contact, message, status="failed")
                                                else:
                                                    print("Selected contact has no number.")
                                            else:
                                                print("Invalid selection.")
                                        except ValueError:
                                            print("Invalid input. Please enter a number or 'n'.")
                                    else:
                                        print("Message sending cancelled.")
                                else:
                                    print("No similar contacts found.")
                        else:
                            print("Please specify who to send the message to.")
                    except Exception as e:
                        print(f"Error processing message: {str(e)}")
                        print("Please try again with format: 'send message to [name] say [message]'")
                    continue
                
                # Check for show log command
                if user_input.lower() == 'show log':
                    log_data = load_message_log()
                    print("\n=== Message Log ===")
                    
                    print("\nSent Messages:")
                    for msg in log_data.get("sent", []):
                        print(f"[{msg['timestamp']}] To {msg['contact_name']}: {msg['message']}")
                    
                    print("\nReceived Messages:")
                    for msg in log_data.get("received", []):
                        print(f"[{msg['timestamp']}] From {msg['contact_name']}: {msg['message']}")
                    
                    print("\nFailed Messages:")
                    for msg in log_data.get("failed", []):
                        print(f"[{msg['timestamp']}] To {msg['contact_name']}: {msg['message']}")
                    
                    continue
                
                # Check for retry failed messages command
                if user_input.lower() == 'retry failed':
                    retry_failed_messages()
                    continue
                
                # For non-message requests, use Ollama
                context = "\n".join(conversation_history[-5:])
                prompt = f"""You are a helpful WhatsApp assistant. Here's the conversation history:
{context}

Please respond naturally and help with WhatsApp tasks. If the user asks about sending messages, remind them to use the format:
'send message to [name] say [message]'

For all other conversations, respond normally."""

                try:
                    response = requests.post(
                        "http://localhost:11434/api/generate",
                        json={
                            "model": "llama3.2:latest",
                            "prompt": prompt,
                            "stream": False,
                            "options": {
                                "temperature": 0.7,
                                "top_p": 0.9
                            }
                        },
                        timeout=30
                    )
                    
                    if response.status_code == 200:
                        ai_response = response.json()["response"]
                        print(f"\nAI: {ai_response}")
                        conversation_history.append(f"AI: {ai_response}")
                    else:
                        print(f"\nError: Ollama API returned status code {response.status_code}")
                        print(f"Response: {response.text}")
                except requests.exceptions.ConnectionError:
                    print("\nError: Could not connect to Ollama. Please make sure Ollama is running.")
                except requests.exceptions.Timeout:
                    print("\nError: Request to Ollama timed out. Please try again.")
                except Exception as e:
                    print(f"\nError: {str(e)}")
            
            except Exception as e:
                print(f"\nError: {str(e)}")
    except KeyboardInterrupt:
        stop_event.set()  # Signal thread to stop
        print("\nGoodbye! Have a great day!")
        sys.exit(0)

if __name__ == "__main__":
    chat_mode()