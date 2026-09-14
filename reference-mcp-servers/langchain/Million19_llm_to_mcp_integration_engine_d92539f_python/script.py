import sys
import os
# Add the 'src' directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'src')))

import importlib
import llm_to_mcp_integration_engine.llm_to_mcp_integration_engine
importlib.reload(llm_to_mcp_integration_engine.llm_to_mcp_integration_engine)

import re
# Now that src is in the path, we should be able to import directly
from llm_to_mcp_integration_engine import llm_to_mcp_integration_custom

raw_llm_answer = """
Sure, let me reason this out…
3 2 3 2 3 2
7 8 7 8 7 8
2 3 2 3 2 3
8 7 8 7 8 7
3 2 3 2 3 2
7 8 7 8 7 8
Hope that helps!
"""

# 1️⃣  TRAIN-SHAPE ➜ REGEX  (6 integers per row, any number of rows ≥ 2)
ROW_LEN = 6
ROW_RE  = rf"(?:\d+\s+){{{ROW_LEN-1}}}\d+"
GRID_RE = re.compile(rf"{ROW_RE}(?:\n{ROW_RE})+")

# 2️⃣  Engine hunts through the chatter and returns the FIRST valid block
tools = [{"name": "extract_grid", "pattern": GRID_RE, "capture_group": 0}]
parsed = llm_to_mcp_integration_custom(tools, raw_llm_answer, False)

# 3️⃣  One comprehension → list-of-lists
grid = [list(map(int, r.split())) for r in parsed["extract_grid"].splitlines()]
print(grid)
