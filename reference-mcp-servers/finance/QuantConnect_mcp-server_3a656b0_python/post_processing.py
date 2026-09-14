path = 'src/models.py'

# Read the file content.
with open(path, 'r', encoding='utf-8') as file:
    lines = file.readlines()

# Add the extra import (after `from __future__` to avoid errors).
lines.insert(5, 'from pydantic import RootModel, ConfigDict\n')
content = ''.join(lines)

# Perform string replacements.
content = content.replace('__root__', 'RootModel').replace('ResponseModel', 'Response')

# Replace
# ```
#    class Config:
#        extra = Extra.forbid
# ```
# with 
# `model_config = ConfigDict(extra='forbid')`
# to avoid warnings when running pytest.
content = content.replace('class Config:', "model_config = ConfigDict(extra='forbid')")\
    .replace('    extra = Extra.forbid', '')

# Save the new file content.
with open(path, 'w', encoding='utf-8') as file:
    file.write(content)
