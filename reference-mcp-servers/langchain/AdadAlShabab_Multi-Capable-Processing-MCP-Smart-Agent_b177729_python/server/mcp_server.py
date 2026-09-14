from flask import Flask, request, jsonify
from agents.code_agent import CodeAgent
from agents.data_agent import DataAgent
from agents.summary_agent import SummaryAgent
from memory.memory_manager import MemoryManager

app = Flask(__name__)

code_agent = CodeAgent()
data_agent = DataAgent()
summary_agent = SummaryAgent()
memory_manager = MemoryManager()

@app.route('/analyze_repo', methods=['POST'])
def analyze_repo():
    data = request.json
    repo_url = data.get('repo_url')
    analysis = code_agent.analyze_repo(repo_url)
    memory_manager.save(repo_url, analysis)
    return jsonify({'analysis': analysis})

@app.route('/get_weather', methods=['POST'])
def get_weather():
    data = request.json
    location = data.get('location')
    weather = data_agent.get_weather(location)
    return jsonify({'weather': weather})

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data.get('text')
    summary = summary_agent.summarize(text)
    return jsonify({'summary': summary})

@app.route('/retrieve_memory', methods=['POST'])
def retrieve_memory():
    data = request.json
    key = data.get('key')
    memory = memory_manager.retrieve(key)
    return jsonify({'memory': memory})

if __name__ == '__main__':
    app.run(port=5000)
