Hey Copilot, add a pre-check node at the start of adjustment_retirement_flow.py in Conflow.  

After run_agent routes here (from NLU match), before fetching account details:  
- Call LLM: "User said: '{user_message}'. Current retirement age in state: {state.retirement_age or 'none'}. Do we need to ask for age? Return JSON: {'skip_ask': true/false, 'extracted_age': 40 or null}"  
- If skip_ask=true → skip the hard-coded "what age?" step, set state.retirement_age = extracted_age, jump to calculation step.  
- If false → run normal flow (ask age).  
- Keep everything else—fetch account, etc.—unchanged.  
- Use existing state for history/context.  
