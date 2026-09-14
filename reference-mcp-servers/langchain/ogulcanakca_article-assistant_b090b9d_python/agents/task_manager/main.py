# agents/task_manager/main.py

from fastapi import FastAPI, HTTPException, status as http_status
from protocols.messages import A2AMessage, A2APayloadAssignTask, A2APayloadTaskResult
import requests
import uuid
import logging
import config 
from typing import Dict, Any, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Task Manager Agent - API")
task_statuses: Dict[str, Dict[str, Any]] = {}

@app.post("/a2a/result", response_model=Dict[str, Any])
async def receive_a2a_result(message: A2AMessage):
    logger.info(f"=== A2A RESULT RECEIVED ===")
    try:
        logger.info(f"Raw Message Body: {message.model_dump_json(indent=2)}")
    except Exception:
        logger.info(f"Raw Message (could not dump json): {message}")


    task_id = message.task_id
    if not task_id:
         logger.warning("Result message missing task_id.")
         return {"status": "ack_error", "message_id": message.message_id, "detail": "Result received but task_id missing."}

    logger.info(f"Processing result for Task ID: {task_id}")
    logger.info(f"Incoming payload type: {type(message.payload)}")
    logger.info(f"Incoming payload content: {message.payload}") 

    if message.message_type == "task_result":
        try:
            payload_data = message.payload
            if isinstance(payload_data, dict):
                 logger.info("Payload is a dict, validating with Pydantic model A2APayloadTaskResult...")
                 payload = A2APayloadTaskResult.model_validate(payload_data)
                 logger.info("Pydantic validation successful.")
            elif isinstance(payload_data, A2APayloadTaskResult):
                 logger.warning("Payload is already an A2APayloadTaskResult object (maybe internal call?). Proceeding.")
                 payload = payload_data
            else:
                 raise ValueError(f"Invalid payload type received: {type(payload_data)}")

            logger.info(f"Validated Payload Status: {payload.status}")
            current_status = task_statuses.get(task_id, {"status": "unknown", "result": None, "error": None, "question": None})
            logger.info(f"Current status before update for task {task_id}: {current_status}")

            current_status["status"] = payload.status 

            if payload.status == "completed":
                result_data = payload.result or {}
                current_status["result"] = result_data
                current_status["error"] = None
                current_status["question"] = None
                logger.info(f"Task {task_id} completed. Result data set: {result_data}")

            elif payload.status == "failed":
                error_data = payload.error or {"message": "Unknown error from agent."}
                current_status["result"] = None
                current_status["error"] = error_data
                current_status["question"] = None
                logger.error(f"Task {task_id} failed. Error data set: {error_data}")

            elif payload.status == "requires_clarification":
                question_data = payload.question or {"text": "Clarification needed, no question provided."}
                current_status["result"] = None
                current_status["error"] = None
                current_status["question"] = question_data
                logger.warning(f"Task {task_id} requires clarification. Question data set: {question_data}")
            else:
                 logger.warning(f"Received unknown task status '{payload.status}' for task {task_id}.")
                 current_status["status"] = "unknown"
                 current_status["error"] = {"message": f"Received unknown status: {payload.status}"}

            task_statuses[task_id] = current_status
            logger.info(f"--- STATUS UPDATED --- Task ID: {task_id}, New Status: {task_statuses[task_id]}")
            
            return {"status": "ack", "message_id": message.message_id, "detail": "Result received and processed."}

        except Exception as e:
             logger.exception(f"CRITICAL: Error processing task_result payload for task {task_id}. Error: {e}")
             task_statuses[task_id] = {
                 "status": "failed",
                 "result": None,
                 "error": {"message": f"Internal server error processing result payload: {str(e)}"},
                 "question": None
             }
             logger.error(f"Set task {task_id} status to FAILED due to payload processing error.")
             return {"status": "error", "message_id": message.message_id, "detail": f"Internal error processing result payload: {e}"}

    else:
        logger.warning(f"Received message type '{message.message_type}' on /a2a/result endpoint for task {task_id}. Expected 'task_result'.")
        return {"status": "error", "message_id": message.message_id, "detail": f"Unexpected message type on result endpoint: {message.message_type}"}

@app.get("/tasks/{task_id}/status", response_model=Dict[str, Any])
async def get_task_status(task_id: str):
    """
    Retrieves the current status and result (if available) for a given task ID.
    (Belirli bir görevin durumunu ve sonucunu döndürür - Polling için)
    """
    logger.debug(f"Request received for status of task_id: {task_id}")
    status_info = task_statuses.get(task_id)

    if status_info:
        logger.debug(f"Returning status for task {task_id}: {status_info}")
        return status_info
    else:
        logger.warning(f"Status requested for unknown or pending task_id: {task_id}")
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Task ID not found or not yet initialized.")


@app.post("/trigger_research_task", response_model=Dict[str, Any])
async def trigger_research_task(topic: str):
    """
    Triggers a research task. Sends message to agent and returns task_id immediately.
    (Araştırma görevini başlatır, mesajı ajana gönderir ve task_id'yi hemen döndürür)
    """
    logger.info(f"Received API request to research: {topic}")
    task_id = str(uuid.uuid4())
    message_id = str(uuid.uuid4())

    task_statuses[task_id] = {"status": "processing", "result": None, "error": None, "question": None}
    logger.info(f"Initialized status for new research task: {task_id}")

    assign_task_payload = A2APayloadAssignTask(
        task_type="research",
        parameters={"topic": topic, "language": "Turkish", "max_words": 500}
    )
    a2a_message = A2AMessage(
        task_id=task_id, message_id=message_id, sender_agent_id="task_manager_agent",
        receiver_agent_id="researcher_agent", message_type="assign_task",
        payload=assign_task_payload.model_dump()
    )

    logger.info(f"Attempting to send A2A message to Researcher Agent (Task ID: {task_id})...")
    try:
        response = requests.post(
            config.RESEARCHER_AGENT_URL,
            json=a2a_message.model_dump(mode='json'),
            timeout=5
        )
        response.raise_for_status()
        logger.info(f"Successfully POSTed message to Researcher Agent for task {task_id}. Agent responded quickly (status {response.status_code}).")

    except requests.exceptions.Timeout:
        logger.warning(f"Researcher Agent did not respond quickly to task assignment for {task_id} (timeout). Assuming message sent and proceeding.")
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to POST message to Researcher Agent for task {task_id}: {e}")
        task_statuses[task_id] = {"status": "failed", "result": None, "error": {"message": f"Failed to communicate with Researcher Agent: {e}"}, "question": None}
        raise HTTPException(status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Failed to communicate with Researcher Agent: {e}")

    logger.info(f"Returning 'processing' status and task_id {task_id} to caller immediately.")
    return {"status": "processing", "task_id": task_id, "message": "Research task assignment sent."}


@app.post("/trigger_article_task", response_model=Dict[str, Any])
async def trigger_article_task(topic: str, style: Optional[str] = None):
    """
    Triggers an article draft task. Sends message to agent and returns task_id immediately.
    (Makale taslağı görevini başlatır, mesajı ajana gönderir ve task_id'yi hemen döndürür)
    """
    logger.info(f"Received API request to write article draft for topic: {topic}, style: {style}")
    task_id = str(uuid.uuid4())
    message_id = str(uuid.uuid4())

    task_statuses[task_id] = {"status": "processing", "result": None, "error": None, "question": None}
    logger.info(f"Initialized status for new article task: {task_id}")
    parameters = {"topic": topic}
    if style is not None:
         parameters["style"] = style
    assign_task_payload = A2APayloadAssignTask(
        task_type="write_article_draft", parameters=parameters
    )
    a2a_message = A2AMessage(
        task_id=task_id, message_id=message_id, sender_agent_id="task_manager_agent",
        receiver_agent_id="article_draft_agent", message_type="assign_task",
        payload=assign_task_payload.model_dump()
    )

    logger.info(f"Attempting to send A2A message to Article Draft Agent (Task ID: {task_id})...")
    try:
        response = requests.post(
            config.ARTICLE_DRAFT_AGENT_URL,
            json=a2a_message.model_dump(mode='json'),
            timeout=5
        )
        response.raise_for_status()
        logger.info(f"Successfully POSTed message to Article Draft Agent for task {task_id}. Agent responded quickly (status {response.status_code}).")

    except requests.exceptions.Timeout:
        logger.warning(f"Article Draft Agent did not respond quickly to task assignment for {task_id} (timeout). Assuming message sent and proceeding.")
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to POST message to Article Draft Agent for task {task_id}: {e}")
        task_statuses[task_id] = {"status": "failed", "result": None, "error": {"message": f"Failed to communicate with Article Draft Agent: {e}"}, "question": None}
        raise HTTPException(status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Failed to communicate with Article Draft Agent: {e}")

    logger.info(f"Returning 'processing' status and task_id {task_id} to caller immediately.")
    return {"status": "processing", "task_id": task_id, "message": "Article draft task assignment sent."}
