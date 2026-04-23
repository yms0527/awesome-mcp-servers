# mcp_servers/cloud_storage/main.py

from fastapi import FastAPI, HTTPException
from protocols.messages import MCPToolCall, MCPToolResult, CloudStorageUploadParameters, CloudStorageDownloadParameters, CloudStorageDeleteParameters
import logging

from google.cloud import storage
from google.api_core.exceptions import NotFound 

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Cloud Storage MCP Server")

try:
    storage_client = storage.Client()
    project_id = storage_client.project
    logger.info(f"Cloud Storage MCP Server: Google Cloud Storage client initialized for project: {project_id}.")
except Exception as e:
    logger.error(f"Cloud Storage MCP Server: Failed to initialize Google Cloud Storage client. Ensure GOOGLE_APPLICATION_CREDENTIALS is set and points to a valid key file: {e}")
    storage_client = None 
@app.get("/")
async def read_root():
    status_msg = f"Google Cloud Storage client initialized (Project: {storage_client.project})." if storage_client else "Google Cloud Storage client failed to initialize."
    return {"message": f"Cloud Storage MCP Server is running. {status_msg}"}


@app.post("/mcp/tool", response_model=MCPToolResult)
async def call_tool(tool_call: MCPToolCall):
    """
    Receives an MCP tool call and interacts with Google Cloud Storage.
    Handles 'upload_file', 'download_file', 'delete_file' tools.
    """
    logger.info(f"Received MCP Tool Call: {tool_call.model_dump_json(indent=2)}")

    if not storage_client:
        logger.error("Cloud Storage MCP: Client not initialized. Cannot perform storage operations.")
        return MCPToolResult(
            status="failure",
            error={"code": "STORAGE_NOT_INITIALIZED", "message": "Cloud Storage client is not initialized. Check server logs for credential errors."}
        )

    if tool_call.tool_name == "upload_file":
        try:
            params =  CloudStorageUploadParameters.model_validate(tool_call.parameters)
            logger.info(f"Received upload_file call for bucket '{params.bucket_name}', blob '{params.destination_blob_name}'...")
        except Exception as e:
            logger.warning(f"Invalid parameters for upload_file tool: {e}")
            return MCPToolResult(
                status="failure",
                error={"code": "INVALID_PARAMETERS", "message": f"Invalid parameters for upload_file: {e}"}
            )

        try:
            bucket = storage_client.get_bucket(params.bucket_name)
            blob = bucket.blob(params.destination_blob_name)

            file_content_bytes = params.source_file_content.encode('utf-8') 

            blob.upload_from_string(file_content_bytes, content_type='text/plain') 

            logger.info(f"Cloud Storage MCP: Successfully uploaded {params.destination_blob_name} to bucket {params.bucket_name}.")

            public_url = f"https://storage.googleapis.com/{params.bucket_name}/{params.destination_blob_name}"

            return MCPToolResult(
                status="success",
                result={"bucket": params.bucket_name, "blob": params.destination_blob_name, "public_url": public_url}
            )

        except NotFound:
            logger.error(f"Cloud Storage MCP: Bucket '{params.bucket_name}' not found during upload.")
            return MCPToolResult(
                status="failure",
                error={"code": "BUCKET_NOT_FOUND", "message": f"Cloud Storage bucket '{params.bucket_name}' not found. Make sure the bucket exists and the service account has permissions."}
            )
        except Exception as e:
            logger.error(f"Cloud Storage MCP: Error during file upload: {e}")
            return MCPToolResult(
                status="failure",
                error={"code": "UPLOAD_FAILED", "message": f"File upload failed: {e}"}
            )

    elif tool_call.tool_name == "download_file":
        try:
            params = CloudStorageDownloadParameters.model_validate(tool_call.parameters)
            logger.info(f"Received download_file call for bucket '{params.bucket_name}', blob '{params.source_blob_name}'...")
        except Exception as e:
            logger.warning(f"Invalid parameters for download_file tool: {e}")
            return MCPToolResult(
                status="failure",
                error={"code": "INVALID_PARAMETERS", "message": f"Invalid parameters for download_file: {e}"}
            )

        try:
            bucket = storage_client.get_bucket(params.bucket_name)
            blob = bucket.blob(params.source_blob_name)

            file_content_bytes = blob.download_as_bytes()
            file_content_string = file_content_bytes.decode('utf-8') 

            logger.info(f"Cloud Storage MCP: Successfully downloaded {params.source_blob_name} from bucket {params.bucket_name}.")

            return MCPToolResult(
                status="success",
                result={"bucket": params.bucket_name, "blob": params.source_blob_name, "content": file_content_string}
            )

        except NotFound:
            logger.error(f"Cloud Storage MCP: Blob '{params.source_blob_name}' not found during download in bucket '{params.bucket_name}'.")
            return MCPToolResult(
                status="failure",
                error={"code": "BLOB_NOT_FOUND", "message": f"Blob '{params.source_blob_name}' not found."}
            )
        except Exception as e:
            logger.error(f"Cloud Storage MCP: Error during file download: {e}")
            return MCPToolResult(
                status="failure",
                error={"code": "DOWNLOAD_FAILED", "message": f"File download failed: {e}"}
            )

    elif tool_call.tool_name == "delete_file":
        try:
            params = CloudStorageDeleteParameters.model_validate(tool_call.parameters)
            logger.info(f"Received delete_file call for bucket '{params.bucket_name}', blob '{params.blob_name}'...")
        except Exception as e:
            logger.warning(f"Invalid parameters for delete_file tool: {e}")
            return MCPToolResult(
                status="failure",
                error={"code": "INVALID_PARAMETERS", "message": f"Invalid parameters for delete_file: {e}"}
            )

        try:
            bucket = storage_client.get_bucket(params.bucket_name)
            blob = bucket.blob(params.blob_name)

            blob.delete()

            logger.info(f"Cloud Storage MCP: Successfully deleted {params.blob_name} from bucket {params.bucket_name}.")

            return MCPToolResult(
                status="success",
                result={"bucket": params.bucket_name, "blob": params.blob_name, "status": "deleted"}
            )

        except NotFound:
            logger.error(f"Cloud Storage MCP: Blob '{params.blob_name}' not found during deletion in bucket '{params.bucket_name}'.")
            return MCPToolResult(
                status="failure",
                error={"code": "BLOB_NOT_FOUND", "message": f"Blob '{params.blob_name}' not found."}
            )
        except Exception as e:
            logger.error(f"Cloud Storage MCP: Error during file deletion: {e}")
            return MCPToolResult(
                status="failure",
                error={"code": "DELETE_FAILED", "message": f"File deletion failed: {e}"}
            )

    else:
        logger.warning(f"Cloud Storage MCP: Received call for unknown tool: {tool_call.tool_name}")
        raise HTTPException(
            status_code=404,
            detail=MCPToolResult(
                status="failure",
                error={"code": "TOOL_NOT_FOUND", "message": f"Tool '{tool_call.tool_name}' not found."}
            ).model_dump()
        )