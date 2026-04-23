# GitHub Actions + PyPI 发布配置总结

本文档总结了 mcp-playwright 项目的完整 CI/CD 设置。

## 📋 已完成的配置

### 1. 项目结构
```
mcp-playwright/
├── .github/workflows/
│   ├── ci.yml           # 持续集成
│   └── publish.yml      # 发布到 PyPI
├── scripts/
│   └── release.py       # 发布脚本
├── mcp_playwright/      # 主包
├── pyproject.toml       # 项目配置
├── MANIFEST.in          # 包含文件配置
├── README.md            # 项目说明
├── RELEASE.md           # 发布指南
└── PUBLISH_SETUP.md     # 本文档
```

### 2. GitHub Actions 工作流

#### CI 工作流 (`.github/workflows/ci.yml`)
- 在每次推送和 PR 时触发
- 测试 Python 3.10、3.11、3.12
- 运行代码质量检查：black、isort、mypy、ruff
- 运行测试套件
- 验证包构建

#### 发布工作流 (`.github/workflows/publish.yml`)
- 在推送 `v*` 标签时触发
- 构建源码分发包和 wheel 包
- 发布到 TestPyPI（所有推送）
- 发布到正式 PyPI（仅标签推送）
- 创建 GitHub Release

### 3. PyPI 配置

#### Trusted Publisher 设置
使用 GitHub Actions OIDC，无需 API 密钥：

**PyPI 配置：**
- 仓库所有者：`ma-pony`
- 仓库名称：`mcp-playwright`
- 工作流文件名：`publish.yml`
- 环境名称：`pypi`

**TestPyPI 配置：**
- 同上，环境名称：`testpypi`

## 🚀 使用指南

### 方式一：使用发布脚本（推荐）

```bash
# 递增补丁版本 (0.1.1 -> 0.1.2)
python scripts/release.py patch

# 递增次版本 (0.1.1 -> 0.2.0)
python scripts/release.py minor

# 递增主版本 (0.1.1 -> 1.0.0)
python scripts/release.py major

# 设置特定版本
python scripts/release.py 1.0.0-rc1
```

脚本会自动：
1. 更新 `pyproject.toml` 和 `__init__.py` 中的版本号
2. 运行测试验证
3. 构建包验证
4. 提交更改
5. 创建并推送标签
6. 触发 GitHub Actions 发布流程

### 方式二：手动发布

```bash
# 1. 更新版本号
# 编辑 pyproject.toml 和 mcp_playwright/__init__.py

# 2. 提交更改
git add pyproject.toml mcp_playwright/__init__.py
git commit -m "🔖 发布版本 v0.1.2"

# 3. 创建并推送标签
git tag v0.1.2
git push origin main
git push origin v0.1.2
```

## 📦 发布流程详解

### 1. 触发条件
- **CI 测试**：每次推送/PR
- **TestPyPI 发布**：每次推送到任何分支
- **正式 PyPI 发布**：推送 `v*` 标签时

### 2. 发布步骤
1. **构建验证**：确保包能正确构建
2. **测试发布**：先发布到 TestPyPI
3. **正式发布**：发布到正式 PyPI
4. **创建 Release**：自动创建 GitHub Release

### 3. 版本管理
遵循 [语义版本](https://semver.org/lang/zh-CN/) 规范：
- `v0.1.0` → `v0.1.1`：补丁版本（bug修复）
- `v0.1.1` → `v0.2.0`：次版本（新功能）
- `v0.2.0` → `v1.0.0`：主版本（重大变更）

## 🔧 PyPI 仓库设置

### 1. 创建 PyPI 项目
1. 访问 [PyPI](https://pypi.org)
2. 注册账户
3. 创建新项目：`mcp-playwright`

### 2. 配置 Trusted Publisher
1. 进入项目设置
2. 选择 "Publishing" → "Add a new pending publisher"
3. 填写：
   - PyPI project name: `mcp-playwright`
   - Owner: `ma-pony`
   - Repository name: `mcp-playwright`
   - Workflow name: `publish.yml`
   - Environment name: `pypi`

### 3. GitHub 环境设置
在 GitHub 仓库设置中创建环境：

**pypi 环境：**
- 用于正式发布
- 建议设置保护规则，仅允许 main 分支
- 可设置审核要求

**testpypi 环境：**
- 用于测试发布
- 无需保护规则

## 🧪 测试发布

### 本地测试构建
```bash
# 清理并重新构建
rm -rf dist/
uv build

# 验证包
uv run twine check dist/*

# 测试安装
pip install dist/mcp_playwright-*.whl --force-reinstall
```

### TestPyPI 测试
```bash
# 从 TestPyPI 安装测试
pip install -i https://test.pypi.org/simple/ mcp-playwright
```

## 🚨 故障排除

### 常见问题

1. **版本冲突**
   - 确保版本号是新的
   - PyPI 不允许重复上传相同版本

2. **权限问题**
   - 检查 Trusted Publisher 配置
   - 确认 GitHub 环境设置正确

3. **包格式问题**
   - 检查 `pyproject.toml` 配置
   - 运行 `twine check` 验证

4. **依赖问题**
   - 确保所有依赖都在 `pyproject.toml` 中声明
   - 测试在干净环境中安装

### 调试步骤

1. **检查 GitHub Actions 日志**
   - 查看具体错误信息
   - 检查每个步骤的输出

2. **本地复现**
   - 在本地运行相同的命令
   - 检查环境差异

3. **手动发布测试**
   - 使用 `twine upload` 手动上传
   - 验证包配置

## 📊 监控和维护

### 发布状态检查
- [GitHub Actions](https://github.com/ma-pony/mcp-playwright/actions)
- [PyPI 项目页面](https://pypi.org/project/mcp-playwright/)
- [TestPyPI 项目页面](https://test.pypi.org/project/mcp-playwright/)

### 定期维护
- 检查依赖更新
- 更新 GitHub Actions 版本
- 监控发布成功率
- 响应用户反馈

## 🔗 参考资源

- [PyPI Trusted Publishers](https://docs.pypi.org/trusted-publishers/)
- [GitHub Actions for Python](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-python)
- [Python Packaging User Guide](https://packaging.python.org/)
- [uv Documentation](https://docs.astral.sh/uv/)

---

✅ **配置完成**：项目已配置完整的 CI/CD 流程，可以开始自动化发布！
