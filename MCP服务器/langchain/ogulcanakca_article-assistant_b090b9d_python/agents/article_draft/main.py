# agents/article_draft/main.py

from fastapi import FastAPI, HTTPException
from protocols.messages import A2AMessage, A2APayloadAssignTask, A2APayloadTaskResult, A2APayloadTaskStatusUpdate
import uuid
import os
from typing import Dict, Any, Optional

from langchain_core.prompts import ChatPromptTemplate

from langchain_anthropic import ChatAnthropic

from tools.generate_text_tool import generate_text_tool_instance 
from tools.upload_file_tool import upload_file_tool_instance   
from langchain.agents import AgentExecutor, create_tool_calling_agent

import requests
import config
import re

app = FastAPI(title="Article Draft Agent")

anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")

llm = None 
agent_executor = None 

llm = ChatAnthropic(model="claude-3-haiku-20240307", temperature=0.7, anthropic_api_key=anthropic_api_key)
tools = [generate_text_tool_instance, upload_file_tool_instance] 

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a helpful article draft writing assistant.
    You receive requests to write articles on specific topics and save them to Google Cloud Storage.
    Use the available tools to first generate the article content and then upload it.
    When generating the article, aim for a reasonable length and informative style based on the topic and instructions.
    After successfully uploading the article, respond with the public URL of the saved file.
    If you encounter any issues during generation or uploading, report the error clearly."""),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}")
])
agent = create_tool_calling_agent(llm, tools, prompt)

agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, return_intermediate_steps=True)

async def send_a2a_result_to_task_manager(
    task_id: str,
    original_message_id: str,
    status: str,
    result_data: Optional[Dict[str, Any]] = None,
    error_data: Optional[Dict[str, Any]] = None,
    question_data: Optional[str] = None
):
    """
    Sends an A2A task result message back to the Task Manager Agent.
    """
    message_id = str(uuid.uuid4())

    payload = A2APayloadTaskResult(
        status=status,
        result=result_data,
        error=error_data,
        question=question_data
    )

    a2a_message = A2AMessage(
        task_id=task_id,
        message_id=message_id,
        sender_agent_id="article_draft_agent", 
        receiver_agent_id="task_manager_agent",
        message_type="task_result",
        payload=payload.model_dump()
    )

    response = requests.post(
        config.TASK_MANAGER_RESULT_URL,
        json=a2a_message.model_dump(mode='json')
    )
    response.raise_for_status()

@app.get("/")
async def read_root():
    status_msg = f"Agent Executor initialized: {bool(agent_executor)}."
    return {"message": f"Article Draft Agent is running. {status_msg}"}


@app.post("/a2a/message", response_model=Dict[str, Any])
async def receive_a2a_message(message: A2AMessage):
    """
    Receives an A2A message from another agent and processes it using AgentExecutor.
    Handles 'write_article_draft' task type.
    """

    if not agent_executor:
        await send_a2a_result_to_task_manager(
            task_id=message.task_id,
            original_message_id=message.message_id,
            status="failed",
            error_data={"code": "AGENT_NOT_INITIALIZED", "message": "Article Draft Agent Executor failed to initialize."}
        )
        raise HTTPException(status_code=500, detail="Agent Executor is not initialized.")


    if message.message_type == "assign_task":
        if not isinstance(message.payload, A2APayloadAssignTask):
             return {"status": "error", "message_id": message.message_id, "detail": "Invalid payload for assign_task message."}

        if message.payload.task_type == "write_article_draft":
            topic = message.payload.parameters.get("topic")
            style = message.payload.parameters.get("style", "standard informative") 

            if not topic:
                 await send_a2a_result_to_task_manager(
                     task_id=message.task_id,
                     original_message_id=message.message_id,
                     status="failed",
                     error_data={"code": "MISSING_PARAMETER", "message": "Article topic is missing."}
                 )
                 return {"status": "error", "message_id": message.message_id, "detail": "Article topic is missing."}

            bucket_name = os.getenv("CLOUD_STORAGE_BUCKET_NAME")
            if not bucket_name:
                 await send_a2a_result_to_task_manager(
                     task_id=message.task_id,
                     original_message_id=message.message_id,
                     status="failed",
                     error_data={"code": "CONFIG_ERROR", "message": "Cloud Storage bucket name is not configured."}
                 )
                 raise HTTPException(status_code=500, detail="Cloud Storage bucket name is not configured.")
            file_name = f"{topic.replace(' ', '_').replace('/', '_').lower()}-{str(uuid.uuid4())[:8]}.md"

            user_input = f"""You are a helpful article draft writing assistant.
            Your goal is to write a comprehensive article draft on the given topic and then save it to Google Cloud Storage.

            Here is the topic for the article: "{topic}"
            Write it in a {style} style.
            Aim for a length of at least 2500 words, but do not exceed 5000 words.
            Don't forget to write in detail and mention technical information as requested.

            After you have finished writing the complete article draft (ensure it is the full content), you MUST perform the following steps sequentially using the available tools:

            1. **Identify the full, complete text content of the article draft you have written.**
            2. **Save the article draft to Google Cloud Storage using the 'upload_file' tool.**
               The 'upload_file' tool has the following parameters:
               - bucket_name: The name of the Google Cloud Storage bucket where the file should be saved. Use the exact value '{bucket_name}'.
               - destination_blob_name: The desired path and name of the file in the bucket. Use the exact value '{file_name}'.
               - source_file_content: **Use the full, complete text content of the article draft from step 1 as the value for this parameter.** This is crucial - pass the entire article text here.

            After successfully calling the 'upload_file' tool and confirming the upload result, report the public URL returned by the 'upload_file' tool as your FINAL ANSWER.
            Do NOT include any other text in your final answer besides the public URL.
            If you encounter any issues during generation or uploading, report the error clearly and stop.
            """
            try:
                agent_outcome = await agent_executor.ainvoke({"input": user_input})
                final_result_data = {"raw_output": agent_outcome.get("output", "No output from agent.")}
                final_status = "failed" 
                error_data = None 
                saved_url = None 

                output_content = agent_outcome.get("output")

                combined_text = ""
                if isinstance(output_content, str):
                    combined_text = output_content.strip()
                elif isinstance(output_content, list):
                    text_parts = [item.get('text', '') for item in output_content if isinstance(item, dict) and 'text' in item]
                    combined_text = " ".join(text_parts).strip()

                if not combined_text and agent_outcome.get("intermediate_steps"):
                    last_step = agent_outcome["intermediate_steps"][-1]
                    if isinstance(last_step, tuple) and len(last_step) > 1:
                        if hasattr(last_step[1], 'content'): 
                            raw_last_response = last_step[1].content
                            combined_text = raw_last_response 
                        elif isinstance(last_step[1], str): 
                            raw_last_response = last_step[1]
                            combined_text = raw_last_response 

                final_result_data["final_text_response"] = combined_text 
                
                url_match = re.search(r'https?://[^\s]+', combined_text) 

                if url_match:
                    saved_url = url_match.group(0)
                    saved_url = saved_url.split('[]')[0]
                    final_result_data["saved_url"] = saved_url
                    final_status = "completed"
                elif combined_text:
                    error_data = {"code": "URL_NOT_FOUND_IN_OUTPUT", "message": "Agent Executor finished, text generated, but no URL found in the output."}
                else:
                    error_data = {"code": "EMPTY_AGENT_OUTPUT", "message": "Agent Executor finished, but the output was empty or not text."}
                await send_a2a_result_to_task_manager(
                    task_id=message.task_id,
                    original_message_id=message.message_id,
                    status=final_status, # completed veya failed
                    result_data=final_result_data if final_status == "completed" else final_result_data,
                    error_data=error_data if final_status == "failed" else None )

                return {"status": "processing", "message_id": message.message_id, "detail": "Article draft task received and processing started by AgentExecutor, result sent to Task Manager."}

            except Exception as e:
                await send_a2a_result_to_task_manager(
                    task_id=message.task_id,
                    original_message_id=message.message_id,
                    status="failed",
                    error_data={"code": "AGENT_RUNTIME_ERROR", "message": f"Unexpected error during AgentExecutor runtime: {e}"}
                )
                raise HTTPException(status_code=500, detail=f"Unexpected error during AgentExecutor runtime: {e}")

        else:
            await send_a2a_result_to_task_manager(
                task_id=message.task_id,
                original_message_id=message.message_id,
                status="failed",
                error_data={"code": "UNKNOWN_TASK_TYPE", "message": f"Unknown task type received by Article Draft Agent: {message.payload.task_type}"}
            )
            return {"status": "error", "message_id": message.message_id, "detail": f"Unknown task type: {message.payload.task_type}"}


    elif message.message_type == "task_status_update":
        if not isinstance(message.payload, A2APayloadTaskStatusUpdate):
             return {"status": "error", "message_id": message.message_id, "detail": "Invalid payload for task_status_update message."}
        return {"status": "ack", "message_id": message.message_id, "detail": "Status update received."}

    elif message.message_type == "task_result":
        return {"status": "ack", "message_id": message.message_id, "detail": "Task result received (but not processed)."}

    elif message.message_type == "error":
         return {"status": "ack", "message_id": message.message_id, "detail": "Error message received (but not processed)."}

    else:
        return {"status": "error", "message_id": message.message_id, "detail": f"Unknown message type: {message.message_type}"}