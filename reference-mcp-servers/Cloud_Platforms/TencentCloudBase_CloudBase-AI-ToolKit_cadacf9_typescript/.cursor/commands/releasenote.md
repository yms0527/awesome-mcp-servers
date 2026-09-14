---
name: releasenote
description: Generate and publish release note using gh CLI
---

# Release Note Generator Command

## Function
Automatically generate and publish a user-friendly release note in Chinese by analyzing git commit history between versions.

**Brand Name**: Use "CloudBase MCP" (NOT "CloudBase AI Toolkit") in all release notes.

## Trigger Condition
When user inputs `/releasenote`

## Behavior

### Step 1: Version Detection
1. Get the latest tag: `git tag --sort=-v:refname | head -1`
2. Get the previous release tag: `gh release list --limit 1 --json tagName`
3. If no previous release exists, use the initial commit as baseline

### Step 2: Commit Analysis
1. Get all commits between versions: `git log <previous_tag>..<latest_tag> --oneline --no-merges`
2. Parse commit messages following conventional-changelog format:
   - `feat`: New features (新功能)
   - `fix`: Bug fixes (问题修复)
   - `docs`: Documentation changes (文档更新)
   - `perf`: Performance improvements (性能优化)
   - `refactor`: Code refactoring (代码重构)
   - `style`: Style changes (样式调整)
   - `test`: Test additions/updates (测试更新)
   - `chore`: Maintenance tasks (maintenance - 不在 release note 中显示)
   - `build`: Build system changes (构建优化)
   - `ci`: CI configuration changes (maintenance - 不在 release note 中显示)

### Step 3: Generate Release Note Content

**Format Guidelines:**
- Use Chinese language
- Focus on user-facing changes and benefits
- Group by feature categories (e.g., IDE 支持、环境管理、开发工具、文档和用户体验、数据库、云函数、AI 能力等)
- Weaken technical implementation details
- Exclude maintenance-related commits (chore, ci, internal refactoring)
- Highlight breaking changes if any
- Use friendly, non-technical language where possible
- Add emoji for better readability (optional but recommended for sections)

**Structure:**
```markdown
# CloudBase MCP v{VERSION}

## 🎉 新功能

### {Category 1}
- {User-friendly description of feature 1}
- {User-friendly description of feature 2}

### {Category 2}
- ...

## 🐛 问题修复

- {User-friendly description of bug fix 1}
- {User-friendly description of bug fix 2}

## 📚 文档更新

- {Documentation improvements}

## ⚡ 性能优化

- {Performance improvements}

## 🔧 其他改进

- {Other improvements}
```

### Step 4: Interactive Confirmation
1. Display the generated release note content
2. Ask user to review and confirm:
   - "请查看以下 Release Note 内容，是否需要修改？"
   - Options: "确认发布" / "需要修改" / "取消"
3. If user chooses "需要修改", allow editing before proceeding

### Step 5: Publish Release
1. Create release using gh CLI:
   ```bash
   gh release create {tag} \
     --title "CloudBase MCP v{VERSION}" \
     --notes "{generated_content}" \
     --verify-tag
   ```
2. Display success message with release URL
3. Remind user to update related documentation if needed

## Content Translation Rules

**Commit Type to Chinese:**
- feat → 新功能
- fix → 问题修复
- docs → 文档更新
- perf → 性能优化
- refactor → 代码优化 (only if user-visible impact)
- style → 样式调整
- test → 测试改进 (usually skip)
- build → 构建优化

**Common Phrases:**
- "add" → "新增"
- "update" → "优化" / "更新"
- "fix" → "修复"
- "improve" → "改进"
- "support" → "支持"
- "remove" → "移除"
- "deprecate" → "废弃"

**Category Examples:**
- IDE Support → IDE 支持
- Environment Management → 环境管理
- Development Tools → 开发工具
- Documentation → 文档和用户体验
- Database → 数据库功能
- Cloud Functions → 云函数
- AI Capabilities → AI 能力
- Authentication → 身份认证
- Storage → 云存储
- Hosting → 静态托管

## Quality Checklist
- [ ] All user-facing changes are included
- [ ] Content is written in Chinese
- [ ] Technical jargon is minimized
- [ ] Changes are grouped by logical categories
- [ ] Maintenance commits are excluded
- [ ] Breaking changes are highlighted
- [ ] Release URL is provided after publishing

## Example Workflow

```bash
# User triggers command
/releasenote

# AI executes:
1. Detect: v2.8.0 (latest) vs v2.7.7 (previous)
2. Analyze: 15 commits found
   - 8 feat commits → 新功能
   - 4 fix commits → 问题修复
   - 2 docs commits → 文档更新
   - 1 chore commit → (exclude)
3. Generate release note in Chinese with brand name "CloudBase MCP"
4. Show preview and ask for confirmation
5. Publish using gh CLI
6. Display release URL
```

## Notes
- Always use `--no-merges` to exclude merge commits
- Preserve commit scope information for better categorization
- If emoji in commit message exists, keep it in the description
- For breaking changes, add a prominent "⚠️ 重要变更" section at the top
- Consider adding "升级指南" section if breaking changes exist
