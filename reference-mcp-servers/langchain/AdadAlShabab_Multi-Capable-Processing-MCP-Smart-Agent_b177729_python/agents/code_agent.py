from tools.github_tool import GitHubTool

class CodeAgent:
    def __init__(self):
        self.github_tool = GitHubTool()

    def analyze_repo(self, repo_url):
        repo_data = self.github_tool.fetch_repo_data(repo_url)
        analysis = f"Repository {repo_url} has {len(repo_data['files'])} files."
        return analysis
