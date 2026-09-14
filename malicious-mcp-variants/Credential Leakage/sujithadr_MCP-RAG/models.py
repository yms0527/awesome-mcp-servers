from pydantic import BaseModel
from typing import List

class SearchConfig(BaseModel):
    query: str

class QueryResult(BaseModel):
    result: str
