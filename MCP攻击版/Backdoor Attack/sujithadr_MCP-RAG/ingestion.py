import os
from groundx import GroundX, Document
from config import settings

def ingest_documents(local_file_path: str) -> str:
    client = GroundX(api_key=settings.GROUNDEX_API_KEY)
    file_name = os.path.basename(local_file_path)

    client.ingest(
        documents=[
            Document(
                bucket_id=settings.BUCKET_ID,
                file_name=file_name,
                file_path=local_file_path,
                file_type="pdf",
                search_data={"key": "value"}
            )
        ]
    )
    return f"Ingested {file_name} into the knowledge base. It should be available in a few minutes."
