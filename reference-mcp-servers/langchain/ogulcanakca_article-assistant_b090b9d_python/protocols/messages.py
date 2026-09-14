# protocols/messages.py

from pydantic import BaseModel, Field
from typing import Any, Dict, Optional, Union
from datetime import datetime

class A2APayloadAssignTask(BaseModel):
    """A2A payload for assigning a task."""
    task_type: str = Field(..., description="Type of the sub-task (e.g., research, send_email, write_article_draft, summarize).") 
    parameters: Dict[str, Any] = Field(default_factory=dict, description="Parameters required for the sub-task.")

class A2APayloadTaskStatusUpdate(BaseModel):
    """A2A payload for updating task status."""
    status: str = Field(..., description="Current status of the task (e.g., pending, processing, completed, failed, requires_clarification).")
    progress: Optional[int] = Field(None, description="Progress percentage (optional).")
    message: Optional[str] = Field(None, description="Short message about the status (optional).")

class A2APayloadTaskResult(BaseModel):
    """A2A payload for task result."""
    status: str = Field(..., description="Final status (completed, failed, requires_clarification).") 
    result: Optional[Dict[str, Any]] = Field(None, description="Result data if status is 'completed'.")
    error: Optional[Dict[str, Any]] = Field(None, description="Error details if status is 'failed'.")
    question: Optional[str] = Field(None, description="Question if status is 'requires_clarification'.")

class A2AMessage(BaseModel):
    """Base A2A message model."""
    task_id: str = Field(..., description="Unique ID of the main task.")
    message_id: str = Field(..., description="Unique ID of this specific message.")
    sender_agent_id: str = Field(..., description="ID of the sending agent.")
    receiver_agent_id: str = Field(..., description="ID of the receiving agent.")
    message_type: str = Field(..., description="Type of the message (e.g., assign_task, task_status_update, task_result, error, requires_clarification).")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC timestamp of when the message was sent.")
    payload: Union[
        A2APayloadAssignTask,
        A2APayloadTaskStatusUpdate,
        A2APayloadTaskResult,
        Dict[str, Any] 
    ] = Field(default_factory=dict, description="Payload content depending on message type.")
    context: Dict[str, Any] = Field(default_factory=dict, description="Optional contextual information.")

class MCPToolParameters(BaseModel):
    """Base model for tool parameters - specific tools will inherit from this."""
    pass

class CreativeLLMGenerateParameters(MCPToolParameters):
    """Parameters for the Creative LLM generate_text tool."""
    prompt: str = Field(..., description="The prompt for text generation.")
    model: Optional[str] = Field(None, description="Specific LLM model to use.")
    max_tokens: Optional[int] = Field(5000, description="Maximum number of tokens to generate.")
    temperature: Optional[float] = Field(0.7, description="Sampling temperature for generation.")

class CloudStorageUploadParameters(MCPToolParameters):
    """Parameters for the Cloud Storage upload_file tool."""
    bucket_name: str = Field(..., description="The name of the Google Cloud Storage bucket.")
    destination_blob_name: str = Field(..., description="The path and name of the file in the bucket.")
    source_file_content: str = Field(..., description="The content of the file to upload (as a string).")

class CloudStorageDownloadParameters(MCPToolParameters):
     """Parameters for the Cloud Storage download_file tool."""
     bucket_name: str = Field(..., description="The name of the Google Cloud Storage bucket.")
     source_blob_name: str = Field(..., description="The path and name of the file in the bucket.")

class CloudStorageDeleteParameters(MCPToolParameters):
     """Parameters for the Cloud Storage delete_file tool."""
     bucket_name: str = Field(..., description="The name of the Google Cloud Storage bucket.")
     blob_name: str = Field(..., description="The path and name of the file in the bucket.")

class MCPToolCall(BaseModel):
    """Request model for calling an MCP tool."""
    tool_name: str = Field(..., description="Name of the tool to call.")
    task_id: Optional[str] = Field(None, description="Optional ID of the main task related to this tool call.")
    parameters: Union[
        CreativeLLMGenerateParameters,
        CloudStorageUploadParameters,
        CloudStorageDownloadParameters,
        CloudStorageDeleteParameters,
        Dict[str, Any]
    ] = Field(default_factory=dict, description="Parameters for the tool.")


class MCPToolResult(BaseModel):
    """Model for the result of an MCP tool call."""
    status: str = Field(..., description="Status of the tool call (success, failure).")
    result: Optional[Dict[str, Any]] = Field(None, description="Result data if status is 'success'.")
    error: Optional[Dict[str, Any]] = Field(None, description="Error details if status is 'failure'.")