# tools/upload_file_tool.py

import logging
from typing import Type
from tools.mcp_tool_adapter import call_mcp_tool
from config import CLOUD_STORAGE_MCP_URL
from langchain_core.tools import BaseTool
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

class UploadFileInput(BaseModel):
    """Input schema for the Upload File Tool."""
    bucket_name: str = Field(description="The name of the Google Cloud Storage bucket.")
    destination_blob_name: str = Field(description="The path and name of the file in the bucket.")
    source_file_content: str = Field(description="The content of the file to upload (as a string).")

class UploadFileTool(BaseTool):
    name: str = "upload_file"
    description: str = "Useful for uploading a file (provided as string content) to Google Cloud Storage. Returns the public URL of the uploaded file."
    args_schema: Type[BaseModel] = UploadFileInput

    async def _arun(self, bucket_name: str, destination_blob_name: str, source_file_content: str) -> str:
        """Use the tool asynchronously."""
        logger.info(f"UploadFileTool._arun: Calling Cloud Storage MCP to upload to bucket '{bucket_name}', blob '{destination_blob_name}'...")

        mcp_result = call_mcp_tool(
            mcp_server_url=CLOUD_STORAGE_MCP_URL,
            tool_name="upload_file", 
            parameters={
                "bucket_name": bucket_name,
                "destination_blob_name": destination_blob_name,
                "source_file_content": source_file_content 
            },
            task_id=None
        )

        if mcp_result.status == "success" and mcp_result.result and "public_url" in mcp_result.result:
            logger.info(f"UploadFileTool._arun: MCP tool call successful. Public URL: {mcp_result.result['public_url']}")
            return mcp_result.result["public_url"] 
        else:
            logger.error(f"UploadFileTool._arun: MCP tool call failed. Error: {mcp_result.error}")
            return f"Error uploading file: {mcp_result.error.get('message', 'Unknown upload error')}"

    def _run(self, bucket_name: str, destination_blob_name: str, source_file_content: str) -> str:
        """Use the tool synchronously."""
        raise NotImplementedError("UploadFileTool does not support synchronous execution.")

upload_file_tool_instance = UploadFileTool()