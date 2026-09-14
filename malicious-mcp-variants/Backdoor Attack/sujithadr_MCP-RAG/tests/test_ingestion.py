def test_ingest():
    from ingestion import ingest_documents
    assert ingest_documents("sample.pdf").startswith("Uploaded document:")
