#!/usr/bin/env node
/**
 * ツール一覧ドキュメント自動生成スクリプト
 *
 * tools/*.js からツール定義を読み取り、以下を更新:
 * - README.md のツール一覧
 * - tools.json (PHP docs用)
 *
 * 使い方: node scripts/generate-docs.js
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { homedir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// SparkSheets docs パス（ローカル開発用）
const SPARKSHEETS_DOCS_PATH = join(homedir(), 'Projects/mothership/apps/sparksheets/docs/guide/mcp');

// カテゴリ定義（表示順・日本語名・英語名）
const CATEGORIES = {
  auth: { ja: '認証', en: 'Auth', order: 1 },
  sessions: { ja: 'セッション管理', en: 'Sessions', order: 2 },
  knowledge: { ja: 'ナレッジベース', en: 'Knowledge', order: 3 },
  sheets: { ja: 'シート操作', en: 'Sheets', order: 4 },
  stats: { ja: '統計・作業時間', en: 'Stats', order: 5 },
  tasks: { ja: 'タスク管理', en: 'Tasks', order: 6 },
  spark: { ja: 'Spark連携', en: 'Spark', order: 7 },
  share: { ja: '共有・メンバー管理', en: 'Share & Members', order: 8 }
};

// ツール定義を抽出（正規表現でパース）
function extractTools(filePath, category) {
  const content = readFileSync(filePath, 'utf-8');
  const tools = [];

  // name: 'xxx' と description: 'xxx' を抽出
  const toolRegex = /{\s*name:\s*['"]([^'"]+)['"],\s*description:\s*['"]([^'"]+)['"],/g;
  let match;

  while ((match = toolRegex.exec(content)) !== null) {
    tools.push({
      name: match[1],
      description: match[2],
      category: category
    });
  }

  return tools;
}

// 全ツールを収集
function collectAllTools() {
  const allTools = [];

  for (const category of Object.keys(CATEGORIES)) {
    const filePath = join(ROOT_DIR, 'tools', `${category}.js`);
    try {
      const tools = extractTools(filePath, category);
      allTools.push(...tools);
    } catch (e) {
      console.error(`Warning: Could not read ${filePath}`);
    }
  }

  return allTools;
}

// README.md のツール一覧セクションを生成
function generateReadmeToolSection(tools) {
  const grouped = {};
  for (const tool of tools) {
    if (!grouped[tool.category]) grouped[tool.category] = [];
    grouped[tool.category].push(tool);
  }

  let md = `## Available Tools (${tools.length} tools)\n\n`;
  md += `| Category | Tools |\n`;
  md += `|----------|-------|\n`;

  const sortedCategories = Object.entries(CATEGORIES)
    .sort((a, b) => a[1].order - b[1].order);

  for (const [category, meta] of sortedCategories) {
    if (grouped[category]) {
      const toolNames = grouped[category].map(t => `\`${t.name}\``).join(', ');
      md += `| ${meta.en} | ${toolNames} |\n`;
    }
  }

  return md;
}

// README.md 日本語セクションのツール一覧を生成
function generateReadmeJaToolSection(tools) {
  const grouped = {};
  for (const tool of tools) {
    if (!grouped[tool.category]) grouped[tool.category] = [];
    grouped[tool.category].push(tool);
  }

  let md = `## 🛠️ 実装ツール一覧（${tools.length}ツール）\n\n`;

  const sortedCategories = Object.entries(CATEGORIES)
    .sort((a, b) => a[1].order - b[1].order);

  for (const [category, meta] of sortedCategories) {
    if (grouped[category]) {
      md += `### ${meta.ja}（${grouped[category].length}ツール）\n`;
      for (const tool of grouped[category]) {
        md += `- \`${tool.name}\` - ${tool.description}\n`;
      }
      md += '\n';
    }
  }

  return md;
}

// README.md を更新
function updateReadme(tools) {
  const readmePath = join(ROOT_DIR, 'README.md');
  let content = readFileSync(readmePath, 'utf-8');

  // 英語セクション更新
  const enSection = generateReadmeToolSection(tools);
  content = content.replace(
    /## Available Tools \(\d+ tools\)[\s\S]*?(?=\n## )/,
    enSection + '\n'
  );

  // 日本語セクション更新
  const jaSection = generateReadmeJaToolSection(tools);
  content = content.replace(
    /## 🛠️ 実装ツール一覧（\d+ツール）[\s\S]*?(?=\n## )/,
    jaSection
  );

  writeFileSync(readmePath, content);
  console.log(`✓ README.md updated (${tools.length} tools)`);
}

// tools.json を生成（PHP docs用）
function generateToolsJson(tools) {
  const grouped = {};

  for (const tool of tools) {
    const meta = CATEGORIES[tool.category];
    if (!grouped[tool.category]) {
      grouped[tool.category] = {
        nameJa: meta.ja,
        nameEn: meta.en,
        order: meta.order,
        tools: []
      };
    }
    grouped[tool.category].tools.push({
      name: tool.name,
      description: tool.description
    });
  }

  const output = {
    generatedAt: new Date().toISOString(),
    totalTools: tools.length,
    categories: grouped
  };

  const jsonPath = join(ROOT_DIR, 'tools.json');
  writeFileSync(jsonPath, JSON.stringify(output, null, 2));
  console.log(`✓ tools.json generated (${tools.length} tools)`);

  // SparkSheets docsにもコピー（存在する場合）
  if (existsSync(SPARKSHEETS_DOCS_PATH)) {
    const docsJsonPath = join(SPARKSHEETS_DOCS_PATH, 'tools.json');
    copyFileSync(jsonPath, docsJsonPath);
    console.log(`✓ tools.json copied to SparkSheets docs`);
  }

  return output;
}

// メイン処理
function main() {
  console.log('Generating tool documentation...\n');

  const tools = collectAllTools();
  console.log(`Found ${tools.length} tools:\n`);

  // カテゴリ別に表示
  const grouped = {};
  for (const tool of tools) {
    if (!grouped[tool.category]) grouped[tool.category] = [];
    grouped[tool.category].push(tool.name);
  }

  for (const [category, names] of Object.entries(grouped)) {
    console.log(`  ${CATEGORIES[category].ja}: ${names.join(', ')}`);
  }
  console.log('');

  // ファイル更新
  updateReadme(tools);
  generateToolsJson(tools);

  console.log('\n✅ Done! Run "npm publish" to publish updated package.');
}

main();
