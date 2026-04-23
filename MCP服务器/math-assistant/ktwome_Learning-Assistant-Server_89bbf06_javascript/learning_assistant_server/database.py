from sqlmodel import SQLModel, Field, create_engine, Session, select
from datetime import datetime
import uuid, pathlib, os
from pydantic import BaseModel 

class MdDoc(SQLModel, table=True):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex, primary_key=True)
    pdf_name: str
    md_path: str                # ./data/{id}.md
    created_at: datetime = Field(default_factory=datetime.utcnow)