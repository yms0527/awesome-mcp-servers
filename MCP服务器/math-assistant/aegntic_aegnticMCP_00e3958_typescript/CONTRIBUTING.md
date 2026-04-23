# Contributing to Obsidian Elite RAG MCP Server

We welcome contributions to the Obsidian Elite RAG project! This guide will help you get started.

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** first to avoid duplicates
2. **Use the bug report template** and provide:
   - Clear description of the issue
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, Python version, etc.)
   - Relevant logs

### Suggesting Features

1. **Check the roadmap** and existing feature requests
2. **Open an issue** with the "enhancement" label
3. **Provide detailed description** of the feature and use case
4. **Consider implementation approach** if you have ideas

### Code Contributions

#### 1. Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR-USERNAME/aegntic-MCP.git
cd aegntic-MCP/obsidian-elite-rag

# Add upstream remote
git remote add upstream https://github.com/aegntic/aegntic-MCP.git

# Create development environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install in development mode
pip install -e ".[dev]"

# Install pre-commit hooks
pre-commit install
```

#### 2. Create a Feature Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

#### 3. Make Changes

- **Follow the code style** (Black formatting, type hints)
- **Write tests** for new functionality
- **Update documentation** as needed
- **Add meaningful commit messages**

#### 4. Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=obsidian_elite_rag --cov-report=html

# Run specific test file
pytest tests/test_rag_engine.py

# Run linting
black src/ tests/
mypy src/
flake8 src/ tests/
```

#### 5. Submit Pull Request

1. **Push your branch** to your fork
2. **Create a pull request** against the main branch
3. **Fill out the PR template** completely
4. **Wait for review** and address feedback

## 🏗️ Project Structure

```
obsidian-elite-rag/
├── src/obsidian_elite_rag/          # Main package
│   ├── core/                        # Core RAG components
│   │   ├── rag_engine.py           # Multi-layer RAG system
│   │   └── graphiti_adapter.py     # Graphiti integration
│   ├── server.py                   # MCP server implementation
│   ├── cli.py                      # Command-line interface
│   └── scripts/                    # Utility scripts
├── config/                         # Configuration files
├── tests/                          # Test suite
├── docs/                           # Documentation
├── templates/                      # Obsidian templates
└── scripts/                        # Setup and utility scripts
```

## 🧪 Development Guidelines

### Code Style

- **Python 3.9+** compatibility
- **Type hints** required for all functions
- **Docstrings** using Google style
- **Black** code formatting
- **Maximum line length**: 88 characters

### Testing

- **Unit tests** for all new functions
- **Integration tests** for database operations
- **Mock external dependencies** (OpenAI, Neo4j)
- **Test coverage** target: 80%+

### Documentation

- **Update README.md** for user-facing changes
- **Add docstrings** for all public functions
- **Document configuration options**
- **Provide examples** in docstrings

## 🚀 Contribution Areas

### High Priority

1. **Performance Optimization**
   - Vector search optimization
   - Graph traversal efficiency
   - Memory usage reduction

2. **Entity Recognition Enhancement**
   - Improve extraction accuracy
   - Add more entity types
   - Custom entity patterns

3. **MCP Protocol Features**
   - Additional MCP tools
   - Streaming responses
   - Batch operations

### Medium Priority

1. **User Interface**
   - Web dashboard
   - Configuration UI
   - Visualization tools

2. **Integration**
   - More vector databases
   - Alternative knowledge graphs
   - Cloud deployment options

3. **Advanced Features**
   - Multi-modal content
   - Real-time updates
   - Collaborative features

### Low Priority

1. **Documentation**
   - API reference
   - Tutorials
   - Video guides

2. **Tooling**
   - Migration scripts
   - Backup/restore tools
   - Monitoring dashboards

## 🐛 Bug Fix Process

1. **Reproduce the bug** with minimal example
2. **Add a failing test** that reproduces the issue
3. **Fix the code** while keeping the test passing
4. **Ensure no regressions** with full test suite
5. **Document the fix** if it changes behavior

## 📝 Release Process

### Version Management

- **Semantic versioning** (MAJOR.MINOR.PATCH)
- **Changelog** maintenance for all releases
- **Tag releases** in Git

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version number updated
- [ ] Changelog updated
- [ ] PyPI upload tested
- [ ] Docker image built
- [ ] Release notes prepared

## 💡 Ideas for Contributions

### Research Contributions

- **New retrieval algorithms**
- **Advanced entity recognition**
- **Knowledge graph construction techniques**
- **Performance benchmarking**

### Tool Integrations

- **Additional vector databases** (Pinecone, Weaviate)
- **Alternative knowledge graphs** (TigerGraph, Amazon Neptune)
- **Note-taking apps** (Notion, Roam Research)
- **AI platforms** (OpenAI, Anthropic, Hugging Face)

### Community Features

- **Multi-user support**
- **Sharing capabilities**
- **Collaborative knowledge building**
- **Analytics and insights**

## 🏆 Recognition

Contributors will be recognized in:

- **README.md** acknowledgments
- **Release notes** for their contributions
- **Contributor statistics** on GitHub
- **Special badges** for significant contributions

## 📞 Getting Help

- **Discord server**: [Invite link]
- **GitHub Discussions**: For questions and ideas
- **Email**: research@aegntic.ai
- **Documentation**: Check the wiki first

## 📜 Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- **Be respectful** and considerate
- **Use inclusive language**
- **Focus on constructive feedback**
- **Help others learn and grow**

## 🎉 Thank You

Thank you for contributing to the Obsidian Elite RAG project! Your contributions help advance the field of AI-powered knowledge management and make this system better for everyone.

---

**Created by:** Mattae Cooper (research@aegntic.ai)
**Organization:** Aegntic AI (https://aegntic.ai)