def test_search():
    from search import process_search_query
    res = process_search_query("What is in the document?")
    assert isinstance(res.result, str)
