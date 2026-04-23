# tools/agent_response.py
from tools.processes import list_suspicious_processes
from tools.network_watch import detect_suspicious_ips
from tools.eventlog_analyzer import get_recent_failed_logins
import subprocess
from datetime import datetime
import os

LOG_FILE = "defense_log.txt"

def auto_block_ip(ip: str) -> str:
    """
    Bloquea una IP sospechosa, registra la acción con timestamp y devuelve un resumen.
    """
    try:
        # Ejecutar el bloqueo
        cmd = [
            "netsh", "advfirewall", "firewall", "add", "rule",
            f"name=Auto_Block_{ip}", "dir=in", "action=block",
            f"remoteip={ip}", "protocol=any"
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)

        # Registrar la acción
        log_entry = f"[{datetime.now()}] IP bloqueada automáticamente: {ip}\n"
        with open(LOG_FILE, "a") as log_file:
            log_file.write(log_entry)

        return result.stdout or f"IP {ip} bloqueada y registrada en log."

    except Exception as e:
        return f"Error al ejecutar auto_block_ip: {e}"

def get_defense_log() -> str:
    """
    Devuelve el contenido del log de defensa automática.
    """
    if not os.path.exists(LOG_FILE):
        return "No hay registros de defensa aún."

    with open(LOG_FILE, "r") as f:
        return f.read()

# tools/agent_response.py (añadir abajo)

def quarantine_mode() -> str:
    """
    Activa un modo de cuarentena bloqueando todos los puertos excepto ICMP y SSH (22).
    """
    try:
        rules = [
            ["netsh", "advfirewall", "set", "allprofiles", "firewallpolicy", "blockinbound,allowoutbound"],
            ["netsh", "advfirewall", "firewall", "add", "rule", "name=Allow_Ping", "protocol=icmpv4", "dir=in", "action=allow"],
            ["netsh", "advfirewall", "firewall", "add", "rule", "name=Allow_SSH", "protocol=TCP", "dir=in", "localport=22", "action=allow"]
        ]
        for rule in rules:
            subprocess.run(rule, capture_output=True, text=True)

        log_entry = f"[{datetime.now()}] ⚠️ MODO CUARENTENA ACTIVADO\n"
        with open(LOG_FILE, "a") as log_file:
            log_file.write(log_entry)

        return "Modo cuarentena activado: todo bloqueado excepto ping y SSH."
    except Exception as e:
        return f"Error al activar cuarentena: {e}"

def system_diagnostic_summary() -> str:
    """
    Realiza un diagnóstico rápido del sistema analizando procesos, red y logs de seguridad.
    Devuelve un informe resumido.
    """
    report = []
    alert = False

    # 🔍 Analizar procesos sospechosos
    procesos = list_suspicious_processes()
    if "no se detectaron" in procesos.lower():
        report.append("✅ Procesos: sin actividad sospechosa.")
    else:
        alert = True
        report.append("🚨 Procesos sospechosos detectados:\n" + procesos.strip())

    # 🌐 Analizar conexiones de red sospechosas
    conexiones = detect_suspicious_ips()
    if "no se detectaron" in conexiones.lower():
        report.append("✅ Red: sin conexiones sospechosas.")
    else:
        alert = True
        report.append("🚨 Conexiones sospechosas detectadas:\n" + conexiones.strip())

    # 🛡 Revisar eventos de fallos de login
    fallos = get_recent_failed_logins()
    if "no se encontraron" in fallos.lower():
        report.append("✅ Seguridad: sin intentos de login fallidos.")
    else:
        alert = True
        report.append("⚠️ Fallos de inicio de sesión detectados:\n" + fallos.strip())

    # Resultado general
    header = "✅ Diagnóstico general: el sistema parece estar en buen estado." if not alert \
        else "⚠️ Diagnóstico general: se han detectado eventos sospechosos. Revisión recomendada."

    return header + "\n\n" + "\n\n".join(report)