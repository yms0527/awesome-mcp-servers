def main():
    print("Hello from mcp server Tutorial")

if  __name__ == "__main__":
    main()
#  to run this "> uv init .    uv add "mcp[cli]",   uv run mcp install main.py "
from mcp.server.fastmcp import FastMCP
import os
import httpx
# server.py
mcp = FastMCP("Demo")


@mcp.tool()


def add(a: int, b: int) -> int:
    return a+b

@mcp.tool()
def subtract(a: int, b: int) -> int:
    """Subtract the second number from the first."""
    return a - b

@mcp.tool()
def multiply(a: int, b: int) -> int:
    """Multiply two numbers."""
    return a * b

@mcp.tool()
def divide(a: float, b: float) -> float:
    """Divide the first number by the second. Raises error on division by zero."""
    if b == 0:
        raise ValueError("Division by zero")
    return a / b

@mcp.tool()
async def get_exchange_rate(from_currency: str, to_currency: str) -> str:
    """Fetch current exchange rate from one currency to another."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.exchangerate-api.com/v4/latest/{from_currency}"
        )
        rates = response.json().get("rates", {})
        rate = rates.get(to_currency)
        if rate:
            return f"1 {from_currency} = {rate} {to_currency}"
        return "Unable to fetch exchange rate."

@mcp.resource("greeting://{name}")
def get_greeting(name:str) -> str:
    return f"hello, {name}!"
Notes_file = os.path.join(os.path.dirname(__file__), "notes.txt")

def ensure_file():
    if not os.path.exists(Notes_file):
        with open(Notes_file, 'w') as file:
            file.write("")

@mcp.tool()
def add_note(message: str) -> str:
    """
    Append a new note to the sticky note file

    :param message(str): The note content to be added
    :return:
                str: Shows a messages meaning that the note was added
    """
    ensure_file()
    with open(Notes_file, 'a')as file:
        file.write(message +"\n")
    return "Note saved"


@mcp.tool()


def read_notes():
    ensure_file()
    with open(Notes_file, 'r') as file:
       content = file.read().strip()
    return content or "No notes yet"


@mcp.resource("notes://latest_notes")


def get_latest_note() -> str:
    ensure_file()
    with open(Notes_file, 'r') as file:
        line = file.readline()
    return line[-1].strip() if line else "No notes yet"

@mcp.prompt()

def note_summary() -> str:
    """
    Generate prompt that asks AI to summeriaze all current notes
    :return:
            str: It should all the notes in a summerized form otherwise it returns a message
    """
    ensure_file()
    with open(Notes_file, 'r') as file:
        summary = file.read().strip()
    if not summary:
        return "Nothing to summerize"
    return f"Summerize the notes: {summary}"

@mcp.prompt()

def calculator_prompt(a: float, b: float, operation: str) -> str:
    """Prompt for a calculation and return the result."""
    if operation == "add":
        return f"The result of adding {a} and {b} is {add(a, b)}"
    elif operation == "subtract":
        return f"The result of subtracting {b} from {a} is {subtract(a, b)}"
    elif operation == "multiply":
        return f"The result of multiplying {a} and {b} is {multiply(a, b)}"
    elif operation == "divide":
        try:
            return f"The result of dividing {a} by {b} is {divide(a, b)}"
        except ValueError as e:
            return str(e)
    else:
        return "Invalid operation. Please choose add, subtract, multiply, or divide."
