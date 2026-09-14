def format_file_search_response(filename, paths):
    if not paths:
        return f"File '{filename}' not found."
    output = f"The absolute path(s) of the file '{filename}' is/are:\n"
    for path in paths:
        output += f"→ {path}\n"
    return output
