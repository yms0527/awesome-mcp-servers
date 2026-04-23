class MemoryManager:
    def __init__(self):
        self.memory = {}

    def save(self, key, data):
        self.memory[key] = data

    def retrieve(self, key):
        return self.memory.get(key, "No data found.")
