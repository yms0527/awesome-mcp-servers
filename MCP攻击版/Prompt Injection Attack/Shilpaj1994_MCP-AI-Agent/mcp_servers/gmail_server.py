#!/usr/bin/env python3
"""
This is a simple Gmail MCP server.
It can send, read, trash, and mark emails as read.
"""

# Standard Library Imports
import os
import sys
import logging
import base64
from typing import Any, Union, List
from email.message import EmailMessage
from email.header import decode_header
from email.parser import BytesParser, Parser
from email.policy import default
from email import message_from_bytes
import webbrowser
import asyncio
import mimetypes
import traceback

# Third Party Imports
from mcp.server.fastmcp import FastMCP
from mcp.types import TextContent
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize MCP server
try:
    mcp = FastMCP("Gmail")
    logger.info("Gmail MCP server initialized successfully")
except Exception as e:
    logger.error(f"Error initializing MCP server: {e}")
    raise

class GmailService:
    def __init__(self, creds_file_path: str, token_path: str):
        self.creds_file_path = creds_file_path
        self.token_path = token_path
        self.scopes = ['https://www.googleapis.com/auth/gmail.modify']
        
        # Check if credential files exist
        if not os.path.exists(creds_file_path):
            logger.error(f"CRITICAL ERROR: Credentials file not found at {creds_file_path}")
            print(f"CRITICAL ERROR: Credentials file not found at {creds_file_path}")
            print("Please download credentials.json from Google Cloud Console and place it in the correct location.")
            sys.exit(1)
        
        try:
            logger.info(f"Attempting to get token from {token_path} or authorize with {creds_file_path}")
            self.token = self._get_token()
            self.service = self._get_service()
            self.user_email = self._get_user_email()
            logger.info(f"Gmail service initialized successfully for {self.user_email}")
            print(f"Gmail service initialized successfully for {self.user_email}")
        except Exception as e:
            logger.error(f"Failed to initialize Gmail service: {e}")
            print(f"Failed to initialize Gmail service: {e}")
            traceback.print_exc()
            raise

    def _get_token(self) -> Credentials:
        """Get or refresh Google API token"""

        token = None
    
        if os.path.exists(self.token_path):
            logger.info('Loading token from file')
            token = Credentials.from_authorized_user_file(self.token_path, self.scopes)

        if not token or not token.valid:
            if token and token.expired and token.refresh_token:
                logger.info('Refreshing token')
                token.refresh(Request())
            else:
                logger.info('Fetching new token')
                flow = InstalledAppFlow.from_client_secrets_file(self.creds_file_path, self.scopes)
                token = flow.run_local_server(port=0)

            with open(self.token_path, 'w') as token_file:
                token_file.write(token.to_json())
                logger.info(f'Token saved to {self.token_path}')

        return token

    def _get_service(self) -> Any:
        """Initialize Gmail API service"""
        try:
            service = build('gmail', 'v1', credentials=self.token)
            return service
        except HttpError as error:
            logger.error(f'An error occurred building Gmail service: {error}')
            raise ValueError(f'An error occurred: {error}')
    
    def _get_user_email(self) -> str:
        """Get user email address"""
        profile = self.service.users().getProfile(userId='me').execute()
        user_email = profile.get('emailAddress', '')
        return user_email
    
    async def send_email(self, recipient_id: str, subject: str, message: str, attachments: List[str] = None) -> dict:
        """
        Send an email to a recipient with optional attachments
        
        :param recipient_id: Email address of the recipient
        :param subject: Subject of the email
        :param message: Body content of the email
        :param attachments: List of file paths to attach to the email
        """
        try:
            message_obj = EmailMessage()
            message_obj.set_content(message)
            
            message_obj['To'] = recipient_id
            message_obj['From'] = self.user_email
            message_obj['Subject'] = subject

            # Add attachments if provided
            if attachments:
                # Debug the raw attachments
                print(f"DEBUG: Raw attachments: {attachments}")
                
                # Process attachments
                for i, attachment_path in enumerate(attachments):
                    # Clean up the path - remove quotes that might be included
                    if isinstance(attachment_path, str):
                        attachment_path = attachment_path.strip("'\"")
                        print(f"DEBUG: Cleaned attachment path: {attachment_path}")
                    
                    # Try multiple possible locations for the file
                    file_locations = [
                        attachment_path,  # Try as-is
                        os.path.join(os.getcwd(), attachment_path),  # Try relative to current directory
                        os.path.join(os.path.dirname(__file__), '..', attachment_path)  # Try relative to parent of server dir
                    ]
                    
                    file_found = False
                    for loc in file_locations:
                        print(f"DEBUG: Checking attachment at: {loc}")
                        if os.path.exists(loc):
                            attachment_path = loc
                            file_found = True
                            print(f"DEBUG: Found attachment at: {attachment_path}")
                            break
                    
                    if not file_found:
                        return {"status": "error", "error_message": f"Attachment file not found: {attachment_path}. Tried locations: {file_locations}"}
                    
                    # Guess the content type of the attachment
                    content_type, encoding = mimetypes.guess_type(attachment_path)
                    if content_type is None:
                        content_type = 'application/octet-stream'
                    main_type, sub_type = content_type.split('/', 1)
                    
                    # Read attachment and add to email
                    with open(attachment_path, 'rb') as fp:
                        attachment_data = fp.read()
                        filename = os.path.basename(attachment_path)
                        message_obj.add_attachment(
                            attachment_data,
                            maintype=main_type,
                            subtype=sub_type,
                            filename=filename
                        )
                        print(f"Added attachment: {filename} ({content_type})")

            encoded_message = base64.urlsafe_b64encode(message_obj.as_bytes()).decode()
            create_message = {'raw': encoded_message}
            
            # Use asyncio to run in a thread
            send_message = await asyncio.to_thread(
                self.service.users().messages().send(
                    userId="me", 
                    body=create_message
                ).execute
            )
            
            logger.info(f"Message sent: {send_message['id']}")
            return {"status": "success", "message_id": send_message["id"]}
        except HttpError as error:
            return {"status": "error", "error_message": str(error)}
        except Exception as e:
            import traceback
            logger.error(f"Error sending email: {e}\n{traceback.format_exc()}")
            return {"status": "error", "error_message": f"Error sending email: {str(e)}"}

    async def open_email(self, email_id: str) -> str:
        """Opens email in browser given ID."""
        try:
            url = f"https://mail.google.com/#all/{email_id}"
            webbrowser.open(url, new=0, autoraise=True)
            return "Email opened in browser successfully."
        except HttpError as error:
            return f"An HttpError occurred: {str(error)}"

    async def get_unread_emails(self) -> list[dict[str, str]]| str:
        """
        Retrieves unread messages from mailbox.
        Returns list of messsage IDs in key 'id'."""
        try:
            user_id = 'me'
            query = 'in:inbox is:unread category:primary'

            response = self.service.users().messages().list(userId=user_id,
                                                        q=query).execute()
            messages = []
            if 'messages' in response:
                messages.extend(response['messages'])

            while 'nextPageToken' in response:
                page_token = response['nextPageToken']
                response = self.service.users().messages().list(userId=user_id, q=query,
                                                    pageToken=page_token).execute()
                messages.extend(response['messages'])
            return messages

        except HttpError as error:
            return f"An HttpError occurred: {str(error)}"

    async def read_email(self, email_id: str) -> dict[str, str]| str:
        """Retrieves email contents including to, from, subject, and contents."""
        try:
            msg = self.service.users().messages().get(userId="me", id=email_id, format='raw').execute()
            email_metadata = {}

            # Decode the base64URL encoded raw content
            raw_data = msg['raw']
            decoded_data = base64.urlsafe_b64decode(raw_data)

            # Parse the RFC 2822 email
            mime_message = message_from_bytes(decoded_data)

            # Extract the email body
            body = None
            if mime_message.is_multipart():
                for part in mime_message.walk():
                    # Extract the text/plain part
                    if part.get_content_type() == "text/plain":
                        body = part.get_payload(decode=True).decode()
                        break
            else:
                # For non-multipart messages
                body = mime_message.get_payload(decode=True).decode()
            email_metadata['content'] = body
            
            # Extract metadata
            email_metadata['subject'] = decode_mime_header(mime_message.get('subject', ''))
            email_metadata['from'] = mime_message.get('from','')
            email_metadata['to'] = mime_message.get('to','')
            email_metadata['date'] = mime_message.get('date','')
            
            logger.info(f"Email read: {email_id}")
            
            # We want to mark email as read once we read it
            await self.mark_email_as_read(email_id)

            return email_metadata
        except HttpError as error:
            return f"An HttpError occurred: {str(error)}"
        
    async def trash_email(self, email_id: str) -> str:
        """Moves email to trash given ID."""
        try:
            self.service.users().messages().trash(userId="me", id=email_id).execute()
            logger.info(f"Email moved to trash: {email_id}")
            return "Email moved to trash successfully."
        except HttpError as error:
            return f"An HttpError occurred: {str(error)}"
        
    async def mark_email_as_read(self, email_id: str) -> str:
        """Marks email as read given ID."""
        try:
            self.service.users().messages().modify(userId="me", id=email_id, body={'removeLabelIds': ['UNREAD']}).execute()
            logger.info(f"Email marked as read: {email_id}")
            return "Email marked as read."
        except HttpError as error:
            return f"An HttpError occurred: {str(error)}"
  
# --------------------------------- Gmail MCP Server Tools ---------------------------------
@mcp.tool()
async def send_email(recipient_id: str, subject: str, message: str, attachments: List[str] = None) -> dict:
    """
    Send an email to a recipient with optional attachments

    :param recipient_id: Email address of the recipient
    :param subject: Subject of the email
    :param message: Body content of the email
    :param attachments: List of file paths to attach to the email
    """
    try:
        gmail_service = get_gmail_service()
        message_obj = EmailMessage()
        message_obj.set_content(message)
        
        message_obj['To'] = recipient_id
        message_obj['From'] = gmail_service.user_email
        message_obj['Subject'] = subject

        # Add attachments if provided
        if attachments:
            # Debug the raw attachments
            print(f"DEBUG: Raw attachments: {attachments}")
            
            # Process attachments
            for i, attachment_path in enumerate(attachments):
                # Clean up the path - remove quotes that might be included
                if isinstance(attachment_path, str):
                    attachment_path = attachment_path.strip("'\"")
                    print(f"DEBUG: Cleaned attachment path: {attachment_path}")
                
                # Try multiple possible locations for the file
                file_locations = [
                    attachment_path,  # Try as-is
                    os.path.join(os.getcwd(), attachment_path),  # Try relative to current directory
                    os.path.join(os.path.dirname(__file__), '..', attachment_path)  # Try relative to parent of server dir
                ]
                
                file_found = False
                for loc in file_locations:
                    print(f"DEBUG: Checking attachment at: {loc}")
                    if os.path.exists(loc):
                        attachment_path = loc
                        file_found = True
                        print(f"DEBUG: Found attachment at: {attachment_path}")
                        break
                
                if not file_found:
                    return {"status": "error", "error_message": f"Attachment file not found: {attachment_path}. Tried locations: {file_locations}"}
                
                # Guess the content type of the attachment
                content_type, encoding = mimetypes.guess_type(attachment_path)
                if content_type is None:
                    content_type = 'application/octet-stream'
                main_type, sub_type = content_type.split('/', 1)
                
                # Read attachment and add to email
                with open(attachment_path, 'rb') as fp:
                    attachment_data = fp.read()
                    filename = os.path.basename(attachment_path)
                    message_obj.add_attachment(
                        attachment_data,
                        maintype=main_type,
                        subtype=sub_type,
                        filename=filename
                    )
                    print(f"Added attachment: {filename} ({content_type})")

        encoded_message = base64.urlsafe_b64encode(message_obj.as_bytes()).decode()
        create_message = {'raw': encoded_message}
        
        # Use asyncio to run in a thread
        send_message = await asyncio.to_thread(
            gmail_service.service.users().messages().send(
                userId="me", 
                body=create_message
            ).execute
        )
        
        logger.info(f"Message sent: {send_message['id']}")
        return {"status": "success", "message_id": send_message["id"]}
    except HttpError as error:
        return {"status": "error", "error_message": str(error)}
    except Exception as e:
        import traceback
        logger.error(f"Error sending email: {e}\n{traceback.format_exc()}")
        return {"status": "error", "error_message": f"Error sending email: {str(e)}"}

@mcp.tool()
async def get_unread_emails() -> Union[list[dict[str, str]], str]:
    """Retrieve unread emails from inbox"""
    try:
        gmail_service = get_gmail_service()
        query = 'in:inbox is:unread category:primary'
        response = gmail_service.service.users().messages().list(
            userId='me',
            q=query
        ).execute()
        
        messages = []
        if 'messages' in response:
            messages.extend(response['messages'])

        while 'nextPageToken' in response:
            page_token = response['nextPageToken']
            response = gmail_service.service.users().messages().list(
                userId='me', 
                q=query,
                pageToken=page_token
            ).execute()
            messages.extend(response['messages'])
            
        return messages
    except HttpError as error:
        return f"An HttpError occurred: {str(error)}"

@mcp.tool()
async def read_email(email_id: str) -> Union[dict[str, str], str]:
    """Read contents of a specific email"""
    try:
        gmail_service = get_gmail_service()
        msg = gmail_service.service.users().messages().get(
            userId="me", 
            id=email_id, 
            format='raw'
        ).execute()
        
        email_metadata = {}
        raw_data = msg['raw']
        decoded_data = base64.urlsafe_b64decode(raw_data)
        mime_message = message_from_bytes(decoded_data)

        # Extract body
        if mime_message.is_multipart():
            for part in mime_message.walk():
                if part.get_content_type() == "text/plain":
                    email_metadata['content'] = part.get_payload(decode=True).decode()
                    break
        else:
            email_metadata['content'] = mime_message.get_payload(decode=True).decode()

        # Extract metadata
        email_metadata['subject'] = decode_mime_header(mime_message.get('subject', ''))
        email_metadata['from'] = mime_message.get('from', '')
        email_metadata['to'] = mime_message.get('to', '')
        email_metadata['date'] = mime_message.get('date', '')

        # Mark as read
        await mark_email_as_read(email_id)
        return email_metadata
        
    except HttpError as error:
        return f"An HttpError occurred: {str(error)}"

@mcp.tool()
async def trash_email(email_id: str) -> str:
    """Move an email to trash"""
    try:
        gmail_service = get_gmail_service()
        gmail_service.service.users().messages().trash(
            userId="me", 
            id=email_id
        ).execute()
        return "Email moved to trash successfully."
    except HttpError as error:
        return f"An HttpError occurred: {str(error)}"

@mcp.tool()
async def mark_email_as_read(email_id: str) -> str:
    """Mark an email as read"""
    try:
        gmail_service = get_gmail_service()
        gmail_service.service.users().messages().modify(
            userId="me", 
            id=email_id, 
            body={'removeLabelIds': ['UNREAD']}
        ).execute()
        return "Email marked as read."
    except HttpError as error:
        return f"An HttpError occurred: {str(error)}"

@mcp.tool()
async def open_email(email_id: str) -> str:
    """Open an email in browser"""
    try:
        url = f"https://mail.google.com/#all/{email_id}"
        webbrowser.open(url, new=0, autoraise=True)
        return "Email opened in browser successfully."
    except Exception as error:
        return f"An error occurred: {str(error)}"

# Global Gmail service instance
_gmail_service = None

def get_gmail_service() -> GmailService:
    """Get or create Gmail service instance"""
    global _gmail_service
    if _gmail_service is None:
        # Try to get paths from environment variables first
        creds_file = os.environ.get('GMAIL_CREDS_FILE')
        token_file = os.environ.get('GMAIL_TOKEN_FILE')
        
        # If not in env vars, use default paths
        if not creds_file:
            creds_file = os.path.join(os.path.dirname(__file__), 'credentials.json')
        if not token_file:
            token_file = os.path.join(os.path.dirname(__file__), 'token.json')
            
        logger.info(f"Using credentials file: {creds_file}")
        logger.info(f"Using token file: {token_file}")
        
        _gmail_service = GmailService(creds_file, token_file)
    return _gmail_service

def decode_mime_header(header_value):
    """Decode MIME encoded email headers"""
    if not header_value:
        return ""
    decoded_parts = []
    for value, charset in decode_header(header_value):
        if isinstance(value, bytes):
            if charset:
                decoded_parts.append(value.decode(charset or 'utf-8', errors='replace'))
            else:
                decoded_parts.append(value.decode('utf-8', errors='replace'))
        else:
            decoded_parts.append(value)
    return ''.join(decoded_parts)

if __name__ == "__main__":
    try:
        # print("Starting Gmail MCP server...")
        # Log all initialized tools
        logger.info(f"Available MCP tools: {[name for name, func in mcp.__dict__.items() if callable(func) and not name.startswith('_')]}")
        print(f"Available Gmail tools registered for MCP: send_email, get_unread_emails, read_email, trash_email, mark_email_as_read, open_email")
        
        # Run the server
        mcp.run()
        
        # # For testing send_email (uncomment to test)
        # import asyncio
        # asyncio.run(send_email("shilpaj@gmail.com", "Test Email", "This is a test email", ["/Users/shilpaj/Downloads/test.txt"]))
        
    except Exception as e:
        logger.error(f"Error running Gmail server: {e}")
        traceback.print_exc()
        raise