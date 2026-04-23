import os

# Define the directory structure
directories = [
    "src",
    "src/tools",
    "src/utils",
    "src/middleware",
    "tests",
    "tests/tools",
    "docs",
    "examples"
]

# Define files to create
files = [
    ".gitignore",
    "README.md",
    "requirements.txt",
    "setup.py",
    "src/__init__.py",
    "src/server.py",
    "src/config.py",
    "src/tools/__init__.py",
    "src/tools/arithmetic_tools.py",
    "src/tools/greeting_tools.py",
    "src/tools/date_tools.py",
    "src/tools/conversion_tools.py",
    "src/tools/weather_tools.py",
    "src/utils/__init__.py",
    "src/utils/logging_utils.py",
    "src/utils/validation_utils.py",
    "src/middleware/__init__.py",
    "src/middleware/auth_middleware.py",
    "src/middleware/rate_limiter.py",
    "tests/__init__.py",
    "tests/test_server.py",
    "tests/tools/__init__.py",
    "tests/tools/test_arithmetic_tools.py",
    "tests/tools/test_greeting_tools.py",
    "tests/tools/test_weather_tools.py",
    "docs/API.md",
    "docs/tools.md",
    "examples/basic_usage.py",
    "examples/custom_tool_example.py"
]

# Create directories
for directory in directories:
    os.makedirs(directory, exist_ok=True)
    print(f"Created directory: {directory}")

# Create empty files
for file in files:
    with open(file, 'w') as f:
        pass
    print(f"Created file: {file}")

print("Project structure created successfully!")