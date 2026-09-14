# ui/streamlit/app.py

import streamlit as st
import requests
import time
import os
import json
import anthropic

TASK_MANAGER_HOST = os.getenv("TASK_MANAGER_HOST", "task-manager")
TASK_MANAGER_PORT = os.getenv("TASK_MANAGER_PORT", "80")
TASK_MANAGER_URL = f"http://{TASK_MANAGER_HOST}:{TASK_MANAGER_PORT}"
POLLING_INTERVAL_SEC = 3

def call_supervisor_llm(task_type: str, user_inputs: dict):
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return {'status': 'error', 'error_message': 'ANTHROPIC_API_KEY environment variable not set.'}

    client = anthropic.Anthropic(api_key=api_key)
    input_topic = user_inputs.get('topic', '')
    input_style = user_inputs.get('style')

    system_prompt = """
    You are a Supervisor AI assistant. Your task is to validate and preprocess user inputs for downstream tasks (article writing or research).
    Follow these steps precisely:
    1.  Receive user input containing 'task_type', 'topic', and optionally 'style'.
    2.  Remove any punctuation marks.
    3.  Check the 'topic':
        a. If it's empty, nonsensical gibberish (like 'asfdfgasg'), or looks like source code instead of a topic, reject it.
        b. Check for harmful content (violence, hate speech, illegal activities, etc.). If found, reject it.
    4.  Identify the language of the 'topic' and 'style' (if provided).
    5.  If the language of 'topic' or 'style' is not English, translate it accurately to English.
    6.  After validation and translation (if necessary), structure your response ONLY as a JSON object.
    7.  The JSON object MUST have one of the following structures:
        - On success: {"status": "approved", "processed_input": {"topic": "<english_topic>", "style": "<english_style_or_original_if_none>"}}
        - On rejection: {"status": "rejected", "error_message": "<clear_reason_for_rejection>"}

    Do not include any text outside the JSON object in your response.
    Ensure the 'style' field is included in 'processed_input' even if the original input 'style' was null or empty (use the original value in that case). If translation occurs, provide the translated style.
    """

    user_message_content = f"""
    Validate and preprocess the following input:
    Task Type: {task_type}
    Topic: {input_topic}
    Style: {input_style if input_style is not None else 'Not provided'}
    """
    try:
        message = client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=4095,
            temperature=0.1,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_message_content}
            ]
        )
        response_text = message.content[0].text
        try:
            parsed_response = json.loads(response_text.strip())
            if 'status' not in parsed_response or \
               ('status' == 'approved' and 'processed_input' not in parsed_response) or \
               ('status' == 'rejected' and 'error_message' not in parsed_response):
                 raise ValueError("Supervisor response missing required fields.")
            return parsed_response
        except json.JSONDecodeError:
            return {'status': 'error', 'error_message': 'Supervisor LLM response was not valid JSON.'}
        except ValueError as ve:
             return {'status': 'error', 'error_message': f'Supervisor LLM response validation error: {ve}'}
    except anthropic.APIConnectionError as e:
        return {'status': 'error', 'error_message': f'Supervisor API connection error: {e}'}
    except anthropic.RateLimitError as e:
        return {'status': 'error', 'error_message': f'Supervisor rate limit exceeded: {e}'}
    except anthropic.APIStatusError as e:
        return {'status': 'error', 'error_message': f'Supervisor API error: {e.status_code} - {e.message}'}
    except Exception as e:
        return {'status': 'error', 'error_message': f'An unexpected error occurred during supervision: {e}'}


st.set_page_config(page_title="Task Assistant", layout="centered")
st.title("📝 Task Assistant")
st.caption("Create an article draft or do web research.")

st.session_state.setdefault('processing', False)
st.session_state.setdefault('current_task_id', None)
st.session_state.setdefault('last_task_status_data', None)
st.session_state.setdefault('display_message', None)
st.session_state.setdefault('last_task_type', None)
st.session_state.setdefault('article_content', None)
st.session_state.setdefault('research_summary', None)

st.divider()

if st.button("🔄 New Task / Reset"):
    st.session_state.processing = False
    st.session_state.current_task_id = None
    st.session_state.last_task_status_data = None
    st.session_state.display_message = "Ready to start a new task."
    st.session_state.last_task_type = None
    st.session_state.article_content = None
    st.session_state.research_summary = None
    st.rerun()
st.divider()

st.subheader("📄 Create Article Draft")
with st.form("article_form", clear_on_submit=True):
    article_topic = st.text_input("Topic:", placeholder="E.g.: Future of IoT", key="article_topic")
    article_style = st.text_input("Style (Optional):", value="standard informative", key="article_style")
    article_button_disabled = st.session_state.processing
    article_submitted = st.form_submit_button("Create", disabled=article_button_disabled)

    if article_submitted:
        if not article_topic:
            st.warning("Please enter a topic.")
        else:
            user_inputs = {'topic': article_topic, 'style': article_style if article_style else None}
            supervisor_response = call_supervisor_llm(task_type="article", user_inputs=user_inputs)

            if supervisor_response.get("status") == "approved":
                processed_inputs = supervisor_response.get("processed_input", {})
                processed_topic = processed_inputs.get("topic")
                processed_style = processed_inputs.get("style")

                if not processed_topic:
                     st.error("Supervisor approved but processed topic is empty. Please try again.")
                else:
                    st.session_state.last_task_status_data = None
                    st.session_state.display_message = None
                    st.session_state.article_content = None
                    st.session_state.research_summary = None
                    st.session_state.processing = True
                    st.session_state.current_task_id = None
                    st.session_state.last_task_type = "article"

                    trigger_url = f"{TASK_MANAGER_URL}/trigger_article_task"
                    params = {"topic": processed_topic}
                    if processed_style:
                        params["style"] = processed_style

                    try:
                        response = requests.post(trigger_url, params=params, timeout=15)
                        response.raise_for_status()
                        response_data = response.json()
                        if response_data.get("task_id"):
                            st.session_state.current_task_id = response_data["task_id"]
                            st.session_state.display_message = f"⏳ Article task started! ID: {st.session_state.current_task_id}. Waiting for result..."
                        else:
                            st.session_state.display_message = f"❌ Could not get task_id from Task Manager. Response: {response_data}"
                            st.session_state.processing = False
                    except requests.exceptions.RequestException as e:
                        st.session_state.display_message = f"❌ Could not communicate with Task Manager: {e}"
                        st.session_state.processing = False
                    except Exception as e:
                         st.session_state.display_message = f"❌ An unexpected error occurred after supervisor approval: {e}"
                         st.session_state.processing = False
            elif supervisor_response.get("status") == "rejected":
                error_msg = supervisor_response.get('error_message', 'Input rejected by supervisor.')
                st.error(f"Input Rejected: {error_msg}")
            else:
                error_msg = supervisor_response.get('error_message', 'Failed to validate input.')
                st.error(f"Validation Error: {error_msg}")


st.subheader("🔎 Brainstorming")
with st.form("research_form", clear_on_submit=True):
    research_topic = st.text_input("Research Topic:", placeholder="E.g.: Latest advancements in quantum computing", key="research_topic")
    research_button_disabled = st.session_state.processing
    research_submitted = st.form_submit_button("Research", disabled=research_button_disabled)

    if research_submitted:
        if not research_topic:
            st.warning("Please enter a research topic.")
        else:
            user_inputs = {'topic': research_topic}
            supervisor_response = call_supervisor_llm(task_type="research", user_inputs=user_inputs)

            if supervisor_response.get("status") == "approved":
                processed_inputs = supervisor_response.get("processed_input", {})
                processed_topic = processed_inputs.get("topic")

                if not processed_topic:
                     st.error("Supervisor approved but processed topic is empty. Please try again.")
                else:
                    st.session_state.last_task_status_data = None
                    st.session_state.display_message = None
                    st.session_state.article_content = None
                    st.session_state.research_summary = None
                    st.session_state.processing = True
                    st.session_state.current_task_id = None
                    st.session_state.last_task_type = "research"

                    trigger_url = f"{TASK_MANAGER_URL}/trigger_research_task"
                    params = {"topic": processed_topic}

                    try:
                        response = requests.post(trigger_url, params=params, timeout=15)
                        response.raise_for_status()
                        response_data = response.json()
                        if response_data.get("task_id"):
                             st.session_state.current_task_id = response_data["task_id"]
                             st.session_state.display_message = f"⏳ Research task started! ID: {st.session_state.current_task_id}. Waiting for result..."
                        else:
                             st.session_state.display_message = f"❌ Could not get task_id from Task Manager. Response: {response_data}"
                             st.session_state.processing = False
                    except requests.exceptions.RequestException as e:
                        st.session_state.display_message = f"❌ Could not communicate with Task Manager: {e}"
                        st.session_state.processing = False
                    except Exception as e:
                         st.session_state.display_message = f"❌ An unexpected error occurred after supervisor approval: {e}"
                         st.session_state.processing = False
            elif supervisor_response.get("status") == "rejected":
                error_msg = supervisor_response.get('error_message', 'Input rejected by supervisor.')
                st.error(f"Input Rejected: {error_msg}")
            else:
                error_msg = supervisor_response.get('error_message', 'Failed to validate input.')
                st.error(f"Validation Error: {error_msg}")


polling_rerun_needed = False
if st.session_state.processing and st.session_state.current_task_id:
    status_url = f"{TASK_MANAGER_URL}/tasks/{st.session_state.current_task_id}/status"
    status_container = st.empty()
    try:
        if not st.session_state.display_message or "waiting" in st.session_state.display_message or "Checking" in st.session_state.display_message:
             status_container.info(f"🔄 Checking task status (ID: {st.session_state.current_task_id})...")

        status_response = requests.get(status_url, timeout=10)

        if status_response.status_code == 404:
              st.session_state.display_message = "⏳ Task Manager hasn't recognized the task yet, retrying..."
              polling_rerun_needed = True
        else:
            status_response.raise_for_status()
            response_json = status_response.json()
            st.session_state.last_task_status_data = response_json
            status = st.session_state.last_task_status_data.get("status")

            if status == "completed":
                st.session_state.processing = False
                result_data = st.session_state.last_task_status_data.get("result")

                if st.session_state.last_task_type == "article":
                    saved_url = result_data.get("saved_url") if result_data else None
                    if saved_url:
                        try:
                            content_response = requests.get(saved_url, timeout=15)
                            content_response.raise_for_status()
                            content_response.encoding = content_response.apparent_encoding or 'utf-8'
                            markdown_content = content_response.text
                            st.session_state.article_content = markdown_content
                            st.session_state.display_message = f"🎉 Article task completed! Content is shown below."
                        except requests.exceptions.RequestException as e:
                            st.session_state.display_message = f"⚠️ Article task completed but content ({saved_url}) could not be retrieved: {e}"
                            st.session_state.article_content = f"**Error:** Content could not be retrieved from '{saved_url}'.\n\n{e}"
                        except Exception as e:
                             st.session_state.display_message = f"❌ Error processing article content: {e}"
                             st.session_state.article_content = f"**Error:** Error processing content.\n\n{e}"
                    else:
                        st.session_state.display_message = "⚠️ Article task completed but result URL not found."
                        st.session_state.article_content = None

                elif st.session_state.last_task_type == "research":
                    summary = result_data.get("summary") if result_data else None
                    if summary:
                         st.session_state.display_message = f"🎉 Research task completed! Summary is shown below."
                         st.session_state.research_summary = summary
                    else:
                         st.session_state.display_message = "⚠️ Research task completed but summary not found."
                         st.session_state.research_summary = None
                else:
                     st.session_state.display_message = f"🎉 Task ({st.session_state.last_task_type}) completed."
                     st.session_state.article_content = None
                     st.session_state.research_summary = None

            elif status == "failed":
                st.session_state.processing = False
                error_data = st.session_state.last_task_status_data.get("error")
                error_msg = error_data.get("message") if error_data else "Unknown error."
                st.session_state.display_message = f"❌ Task failed! Details: {error_msg}"
                st.session_state.article_content = None
                st.session_state.research_summary = None

            elif status == "requires_clarification":
                st.session_state.processing = False
                question_data = st.session_state.last_task_status_data.get("question")
                question_text = question_data.get("text") if question_data else "Clarification needed..."
                st.session_state.display_message = f"🤔 Task needs additional information: {question_text}"
                st.session_state.article_content = None
                st.session_state.research_summary = None

            elif status in ["processing", "queued", "running"]:
                status_detail = st.session_state.last_task_status_data.get("detail", "")
                progress_message = f"⏳ Task is in '{status}' state... "
                if status_detail:
                    progress_message += f"({status_detail}) "
                progress_message += f"(ID: {st.session_state.current_task_id})"
                st.session_state.display_message = progress_message
                polling_rerun_needed = True

            else:
                st.session_state.processing = False
                st.session_state.display_message = f"❓ Unknown task status: {status}"
                st.session_state.article_content = None
                st.session_state.research_summary = None

    except requests.exceptions.Timeout:
        st.session_state.display_message = f"⏳ Status query timed out, retrying... (ID: {st.session_state.current_task_id})"
        polling_rerun_needed = True
    except requests.exceptions.RequestException as e:
        st.session_state.display_message = f"❌ Could not query task status: {e}"
        st.session_state.processing = False
        st.session_state.article_content = None
        st.session_state.research_summary = None
    except Exception as e:
        st.session_state.display_message = f"❌ Error processing status: {e}"
        st.session_state.processing = False
        st.session_state.article_content = None
        st.session_state.research_summary = None
    finally:
        # NameError'u önlemek için kontrol ekleyelim
        if 'status_container' in locals() and not polling_rerun_needed and \
           not (st.session_state.display_message and ("❌" in st.session_state.display_message or "⚠️" in st.session_state.display_message)):
            status_container.empty()


    if polling_rerun_needed:
        time.sleep(POLLING_INTERVAL_SEC)
        st.rerun()

st.markdown("---")
st.subheader("Result / Status")

if st.session_state.display_message:
    if "🎉" in st.session_state.display_message:
        st.success(st.session_state.display_message)
    elif "❌" in st.session_state.display_message:
        st.error(st.session_state.display_message)
        if st.session_state.last_task_status_data and st.session_state.last_task_status_data.get('error'):
            with st.expander("Error Details (JSON):"):
                st.json(st.session_state.last_task_status_data['error'])
    elif "⚠️" in st.session_state.display_message:
        st.warning(st.session_state.display_message)
        if st.session_state.last_task_status_data and st.session_state.last_task_status_data.get('result'):
             pass # Uyarı durumunda sonucu ayrıca göstermiyoruz
    elif "🤔" in st.session_state.display_message:
        st.warning(st.session_state.display_message)
        if st.session_state.last_task_status_data and st.session_state.last_task_status_data.get('question'):
            with st.expander("Agent's Question (JSON):"):
                st.json(st.session_state.last_task_status_data['question'])
    elif "⏳" in st.session_state.display_message:
        if st.session_state.processing:
             st.info(st.session_state.display_message)
        else:
             st.info(st.session_state.display_message)
    else:
        st.info(st.session_state.display_message)

elif not st.session_state.processing:
     st.info("Use the forms above to start a new task.")

if st.session_state.article_content:
    st.markdown("---")
    st.markdown("### Article Draft Content:")
    st.markdown(st.session_state.article_content, unsafe_allow_html=False)

    if st.session_state.last_task_status_data and st.session_state.last_task_status_data.get('result'):
         saved_url = st.session_state.last_task_status_data['result'].get("saved_url")
         if saved_url and "Error:" not in st.session_state.article_content:
               link_part = f"<a href='{saved_url}' target='_blank'>{saved_url}</a>"
               st.markdown(f"<small>File URL: {link_part}</small>", unsafe_allow_html=True)

elif st.session_state.research_summary:
     st.markdown("---")
     st.markdown("### Brainstorming Summary:")
     st.text_area("", st.session_state.research_summary, height=250, disabled=True, label_visibility="collapsed")


st.markdown("---")
st.caption(f"Task Manager URL: {TASK_MANAGER_URL}")