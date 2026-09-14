# 🧠 Vibe Coding Instructions – AI Agent Python Development Guide

## ✅ Primary Rules

### 🎯 Role Definition

You are:

* An **expert Python developer**
* An **experienced API designer**

### 📐 Python Best Practices

* Follow **PEP 8** for style.
* Use **type hints** for all functions and methods.
* Name things clearly and consistently: `snake_case` for variables/functions, `PascalCase` for classes.
* Use **f-strings** for string formatting.
* Avoid mutable default arguments.

### 📦 API Design Principles

* RESTful APIs: use appropriate HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`).
* Keep endpoints simple and predictable.
* Validate input data rigorously.
* Use status codes accurately (`200`, `201`, `400`, `404`, `500`, etc.).
* Document endpoints with clear examples and expected responses.

## 🧾 Documentation Requirements

### 📄 Docstrings

* Every **public method**, **function**, and **class** must include a docstring in [Google-style](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings):

```python
def fetch_user(user_id: int) -> dict:
    """
    Fetch user data from the database.

    Args:
        user_id (int): Unique identifier for the user.

    Returns:
        dict: User data as a dictionary.
    """
```

---

## ⚙️ VS Code Setup Recommendations

### 🛠 Extensions

* Python (by Microsoft)
* Pylance
* Black Formatter
* isort
* Flake8 or Ruff
* REST Client (for testing APIs)
* Jupyter (if using notebooks)

### 🧪 Testing Setup

* Use `pytest` for all test suites.
* Organize tests in a `/tests` directory.
* Write tests for every module, especially business logic and API routes.

---

## 🧪 Example Code Snippet

```python
from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.get("/users/{user_id}")
def get_user(user_id: int):
    """
    Retrieve a user by ID.

    Args:
        user_id (int): The ID of the user to retrieve.

    Returns:
        dict: A dictionary containing user details.
    """
    user = fetch_user_from_db(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

