import yaml
from jinja2 import Template
import openai
from config import settings
from models import SearchConfig, QueryResult
from groundx import GroundX

def process_search_query(query: str) -> QueryResult:
    with open("prompts.yaml", "r") as f:
        prompt_data = yaml.safe_load(f)

    prompt_template = Template(prompt_data["template"])
    config = SearchConfig(query=query)

    groundx = GroundX(api_key=settings.GROUNDEX_API_KEY)
    results = groundx.search(query)

    filled_prompt = prompt_template.render(query=query, context=results.snippets)
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": filled_prompt}],
        api_key=settings.OPENAI_API_KEY
    )
    return QueryResult(result=response.choices[0].message["content"])
