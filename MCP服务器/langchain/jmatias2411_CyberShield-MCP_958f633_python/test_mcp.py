"""
CyberShield MCP Tool Tester
Interfaz Streamlit simple para ejecutar herramientas del servidor MCP sin usar agentes IA.

usa streamlit y requests para interactuar con el servidor MCP.
comando a ejecutar : streamlit run test_mcp.py
"""

import streamlit as st
import requests

BASE_URL = "http://localhost:4242/tools"

# Mapear herramientas con sus endpoints y si requieren parámetro
tools = {
    "listar procesos": {"endpoint": "list_processes", "param": None},
    "hacer ping": {"endpoint": "ping", "param": "host"},
    "bloquear IP": {"endpoint": "block_ip", "param": "ip"},
    "bloquear puerto": {"endpoint": "block_port", "param": "port"},
    "desbloquear IP": {"endpoint": "unblock_ip", "param": "ip"},
    "desbloquear puerto": {"endpoint": "unblock_port", "param": "port"},
    "diagnóstico del sistema": {"endpoint": "system_diagnostic", "param": None},
    "escanear red": {"endpoint": "scan_network", "param": "base_ip"},
}

st.set_page_config(page_title="CyberShield MCP Tool Tester", page_icon="🛠️")
st.title("🛠️ CyberShield MCP Tool Tester")
st.write("Selecciona una herramienta y ejecútala contra el servidor MCP.")

selected_tool = st.selectbox("Selecciona una herramienta:", list(tools.keys()))
param_info = tools[selected_tool]["param"]
user_input = ""

if param_info:
    user_input = st.text_input(f"Ingresá el valor para '{param_info}':")

if st.button("Ejecutar herramienta"):
    endpoint = tools[selected_tool]["endpoint"]
    params = {param_info: user_input} if param_info else None
    try:
        response = requests.get(f"{BASE_URL}/{endpoint}", params=params)
        response.raise_for_status()
        result = response.json().get("result", "Sin resultado")
    except Exception as e:
        result = f"❌ Error al ejecutar herramienta: {e}"
    st.markdown("### Resultado:")
    st.code(result)
