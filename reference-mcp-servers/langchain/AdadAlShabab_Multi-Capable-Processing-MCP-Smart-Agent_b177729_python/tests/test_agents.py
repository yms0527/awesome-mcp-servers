import unittest
from agents.code_agent import CodeAgent

class TestCodeAgent(unittest.TestCase):
    def test_analyze_repo(self):
        agent = CodeAgent()
        result = agent.analyze_repo("https://github.com/example/repo")
        self.assertIn("Repository", result)

if __name__ == '__main__':
    unittest.main()
