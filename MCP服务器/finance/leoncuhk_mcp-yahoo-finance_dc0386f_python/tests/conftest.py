"""
Configuration file for pytest.
"""
import os
import pytest
import sys
from pathlib import Path

# Ensure src directory is in Python path for tests
src_path = str(Path(__file__).parent.parent / "src")
if src_path not in sys.path:
    sys.path.insert(0, src_path)

@pytest.fixture
def examples_dir():
    """Return the path to the examples directory."""
    examples_path = os.path.join(os.path.dirname(__file__), "examples")
    os.makedirs(examples_path, exist_ok=True)
    return examples_path 