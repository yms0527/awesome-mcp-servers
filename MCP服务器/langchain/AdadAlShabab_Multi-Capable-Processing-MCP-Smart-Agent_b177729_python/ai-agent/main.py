
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/task", methods=["POST"])
def handle_task():
    data = request.json
    command = data.get("command", "")
    return jsonify({"response": f"Processed command: {command}"})

if __name__ == "__main__":
    app.run(port=5005)
