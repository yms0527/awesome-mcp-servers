#!/bin/bash

# バージョン番号を引数として受け取る
VERSION=$1

if [ -z "$VERSION" ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 v1.0.0"
    exit 1
fi

echo "🔍 Running local CI checks before release..."

# Check if we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Warning: You are not on the main branch (current: $CURRENT_BRANCH)"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: There are uncommitted changes. Please commit or stash them first."
    git status --short
    exit 1
fi

# Check if we can reach crates.io
echo "🌐 Checking crates.io connectivity..."
if ! curl -s --max-time 10 https://crates.io >/dev/null; then
    echo "❌ Error: Cannot reach crates.io. Please check your internet connection."
    exit 1
fi

# 前回のタグを取得
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

# リリースノートを生成
generate_release_notes() {
    local from_tag="$1"
    local to_ref="HEAD"
    local notes=""

    if [ -z "$from_tag" ]; then
        notes="## 🎉 Initial Release"
    else
        notes="## 🚀 Changes since $from_tag\n\n"
        
        # コミットを分類してリリースノートを生成
        notes+="### ✨ New Features\n"
        notes+=$(git log "$from_tag..$to_ref" --pretty=format:"- %s" --grep="^feat:" || echo "None")
        notes+="\n\n### 🐛 Bug Fixes\n"
        notes+=$(git log "$from_tag..$to_ref" --pretty=format:"- %s" --grep="^fix:" || echo "None")
        notes+="\n\n### 📚 Documentation\n"
        notes+=$(git log "$from_tag..$to_ref" --pretty=format:"- %s" --grep="^docs:" || echo "None")
        notes+="\n\n### 🔧 Maintenance\n"
        notes+=$(git log "$from_tag..$to_ref" --pretty=format:"- %s" --grep="^chore:" || echo "None")
    fi

    echo -e "$notes"
}

# Cargoにログインしているか確認
if ! cargo login --help &>/dev/null; then
    echo "Error: Please login to crates.io first using 'cargo login'"
    echo "You can find your API token at https://crates.io/me"
    exit 1
fi

# Cargo.tomlのバージョンを更新
# sed -i "s/^version = .*/version = \"${VERSION#v}\"/" Cargo.toml
# mac os では
sed -i '' "s/^version = .*/version = \"${VERSION#v}\"/" Cargo.toml

# Run comprehensive CI checks locally
echo "🔧 Running formatting check..."
cargo fmt --check || {
    echo "❌ Code formatting issues found. Running cargo fmt to fix..."
    cargo fmt || exit 1
    echo "✅ Code formatted. Please review changes and commit them."
    exit 1
}
echo "✅ Code formatting is correct"

echo "🔍 Running clippy linting..."
cargo clippy --all-targets --all-features -- -D warnings || {
    echo "❌ Clippy linting failed. Please fix the issues above."
    exit 1
}
echo "✅ Clippy linting passed"

echo "🧪 Running unit tests..."
cargo test || {
    echo "❌ Tests failed. Please fix the failing tests."
    exit 1
}
echo "✅ All tests passed"

echo "🔨 Running release build check..."
cargo build --release || {
    echo "❌ Release build failed. Please fix the build issues."
    exit 1
}
echo "✅ Release build successful"

echo "📋 Checking for security advisories..."
if command -v cargo-audit >/dev/null 2>&1; then
    cargo audit || {
        echo "⚠️  Security advisories found. Please review and address them."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    }
    echo "✅ Security audit passed"
else
    echo "⚠️  cargo-audit not installed. Skipping security audit."
    echo "   Install with: cargo install cargo-audit"
fi

# cargo updateを実行してCargo.lockを更新
echo "📦 Updating dependencies..."
cargo update || exit 1

# 変更をコミット
git add Cargo.toml Cargo.lock
git commit -m "chore: bump version to $VERSION"

# Cargoのパッケージを作成（dry-run で検証）
echo "📦 Creating Cargo package..."
cargo package --allow-dirty || {
    echo "❌ Package creation failed. Please fix the issues above."
    exit 1
}
echo "✅ Package created successfully"

# リリースノートを生成
RELEASE_NOTES=$(generate_release_notes "$LAST_TAG")

# gitタグを作成
git tag -a "$VERSION" -m "Release $VERSION"

# GitHubリリースを作成
gh release create "$VERSION" \
    --title "Release $VERSION" \
    --notes "$RELEASE_NOTES" \
    --draft \
    target/package/*

# crates.ioにパブリッシュ
echo "Publishing to crates.io..."
cargo publish --allow-dirty || {
    echo "Failed to publish to crates.io"
    exit 1
}

# リモートにプッシュ
git push origin main
git push origin "$VERSION"

echo "🎉 Release $VERSION completed successfully!"
echo ""
echo "✅ Summary of actions performed:"
echo "  - ✓ Ran all local CI checks (format, lint, test, build, security)"
echo "  - ✓ Updated version to $VERSION in Cargo.toml"
echo "  - ✓ Updated dependencies in Cargo.lock"
echo "  - ✓ Created commit with version bump"
echo "  - ✓ Created GitHub release with auto-generated notes"
echo "  - ✓ Published to crates.io"
echo "  - ✓ Pushed tags to origin"
echo ""
echo "🔗 Next steps:"
echo "  - Review the GitHub release at: https://github.com/nwiizo/tfmcp/releases/tag/$VERSION"
echo "  - Check the crates.io publication at: https://crates.io/crates/tfmcp"

