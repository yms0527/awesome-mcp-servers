# agents/researcher/main.py

from fastapi import FastAPI
from protocols.messages import A2AMessage, A2APayloadAssignTask, A2APayloadTaskResult, A2APayloadTaskStatusUpdate # StatusUpdate eklendi
import uuid
from tools.research_tool import research_tool_instance
from typing import Dict, Any, Optional
import os
import requests
import config

from langchain_core.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic
from langchain.agents import AgentExecutor, create_tool_calling_agent

app = FastAPI(title="Researcher Agent (Claude)") 
anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")


llm = ChatAnthropic(model="claude-3-haiku-20240307", temperature=0.1, anthropic_api_key=anthropic_api_key)
tools = [research_tool_instance]

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful research assistant. You receive research tasks and use the available tools to find information. Respond concisely and summarize the findings based *only* on the information provided by the tools."),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}")
])

agent = create_tool_calling_agent(llm, tools, prompt)

agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

@app.get("/")
async def read_root():
    return {"message": "Researcher Agent is running with AgentExecutor (Claude)"}

@app.post("/a2a/message", response_model=Dict[str, Any])
async def receive_a2a_message(message: A2AMessage):
    """
    Receives an A2A message from another agent and processes it using AgentExecutor (Claude).
    """
    if message.message_type == "assign_task":
        payload_data = message.payload
        payload: Optional[A2APayloadAssignTask] = None 

        try:
            if isinstance(payload_data, A2APayloadAssignTask):
                payload = payload_data
            elif isinstance(payload_data, dict):
                payload = A2APayloadAssignTask.model_validate(payload_data)
            else:
                raise TypeError(f"Unexpected payload type received for assign_task: {type(payload_data)}")

        except Exception as e:
             await send_a2a_error_to_task_manager(
                 task_id=message.task_id,
                 original_message_id=message.message_id,
                 error_message=f"Payload validation/type check failed: {e}"
             )
             return {"status": "error", "message_id": message.message_id, "detail": f"Payload validation/type check failed: {e}"}
        if payload.task_type == "research":
            topic = payload.parameters.get("topic")
            if not topic:
                await send_a2a_error_to_task_manager(
                    task_id=message.task_id,
                    original_message_id=message.message_id,
                    error_message="Research topic is missing."
                )
                return {"status": "error", "message_id": message.message_id, "detail": "Research topic is missing."}
            user_input = f"Please find information about: {topic}. Summarize the key findings based *only* on the information returned by the tools."
            try:
                agent_outcome = await agent_executor.ainvoke({"input": user_input})

                output_content = agent_outcome.get("output")
                final_result_summary = "Agent did not produce a readable summary." 

                if isinstance(output_content, str):
                    final_result_summary = output_content
                elif isinstance(output_content, list) and len(output_content) > 0:
                    first_item = output_content[0]
                    if isinstance(first_item, dict) and 'text' in first_item:
                        final_result_summary = first_item['text']
                    else: 
                        final_result_summary = str(output_content)
                elif output_content is not None: 
                    final_result_summary = str(output_content)

                if final_result_summary.strip().startswith("<result>"):
                     final_result_summary = final_result_summary.split("<result>", 1)[1]
                if final_result_summary.strip().endswith("</result>"):
                     final_result_summary = final_result_summary.rsplit("</result>", 1)[0]
                final_result_summary = final_result_summary.strip()
                
                await send_a2a_result_to_task_manager(
                    task_id=message.task_id,
                    original_message_id=message.message_id,
                    result_data={"summary": final_result_summary} 
                )

                return {"status": "ack", "message_id": message.message_id, "detail": "Research task processed and result sent to Task Manager."}

            except Exception as e:
                await send_a2a_error_to_task_manager(
                    task_id=message.task_id,
                    original_message_id=message.message_id,
                    error_message=f"Agent execution or result sending failed: {str(e)}"
                )
                return {"status": "ack_error", "message_id": message.message_id, "detail": f"Agent execution failed, error sent to Task Manager."}
        else:
             await send_a2a_error_to_task_manager(
                 task_id=message.task_id,
                 original_message_id=message.message_id,
                 error_message=f"Unknown task type received: {payload.task_type}"
             )
             return {"status": "error", "message_id": message.message_id, "detail": f"Unknown task type: {payload.task_type}"}

    elif message.message_type == "task_status_update":
         return {"status": "ack", "message_id": message.message_id, "detail": "Status update received."}
    else:
        return {"status": "error", "message_id": message.message_id, "detail": f"Unknown message type: {message.message_type}"}

async def send_a2a_response(
    task_id: str,
    original_message_id: str,
    status: str,
    result_data: Optional[Dict[str, Any]] = None,
    error_data: Optional[Dict[str, Any]] = None,
    question_data: Optional[str] = None 
):
    """Helper function to send A2A result/error messages."""
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
        sender_agent_id="researcher_agent",
        receiver_agent_id="task_manager_agent",
        message_type="task_result", 
        payload=payload.model_dump()
    )
    
    response = requests.post(
        config.TASK_MANAGER_RESULT_URL,
        json=a2a_message.model_dump(mode='json'),
        timeout=10
    )
    response.raise_for_status()


async def send_a2a_result_to_task_manager(task_id: str, original_message_id: str, result_data: Dict[str, Any]):
    """Sends a 'completed' result."""
    await send_a2a_response(
        task_id=task_id,
        original_message_id=original_message_id,
        status="completed",
        result_data=result_data
    )

async def send_a2a_error_to_task_manager(task_id: str, original_message_id: str, error_message: str, error_code: str = "AGENT_ERROR"):
    """Sends a 'failed' result."""
    await send_a2a_response(
        task_id=task_id,
        original_message_id=original_message_id,
        status="failed",
        error_data={"code": error_code, "message": error_message}
    )