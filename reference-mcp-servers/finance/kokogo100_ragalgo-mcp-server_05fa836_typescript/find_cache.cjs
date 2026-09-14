const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Find npx cache location for ragalgo-mcp-server
const home = process.env.USERPROFILE || process.env.HOME;
const npmCacheDir = path.join(home, 'AppData', 'Local', 'npm_cacache');
const npxTmpDir = path.join(home, 'AppData', 'Local', 'Temp');

console.log('=== Looking for ragalgo-mcp-server npx cache ===');

// npx stores packages in a temp directory. Let's find it.
try {
    // Try to find ragalgo-mcp-server in common npx cache paths
    const searchPaths = [
        path.join(home, 'AppData', 'Local', 'Temp'),
        path.join(home, '.npm', '_npx'),
        path.join(home, 'AppData', 'Roaming', 'npm'),
        'C:\\Users\\' + path.basename(home) + '\\.npm\\_npx',
    ];

    for (const sp of searchPaths) {
        if (fs.existsSync(sp)) {
            console.log('Searching in:', sp);
            try {
                const result = execSync('find ' + sp + ' -name "package.json" -path "*ragalgo*" 2>/dev/null || dir /s /b ' + sp + ' 2>nul | findstr ragalgo', { encoding: 'utf8', timeout: 5000 });
                if (result.trim()) console.log('Found:', result.trim());
            } catch(e) {
                // ignore
            }
        }
    }

    // Also check via npx cache directory
    const npxCacheBase = path.join(home, 'AppData', 'Local', 'Temp', 'npx-cache');
    console.log('\nChecking npx-cache at:', npxCacheBase, 'exists:', fs.existsSync(npxCacheBase));
    
    // Use 'where' to find cached npx package
    try {
        const whereResult = execSync('dir /s /b "' + home + '" 2>nul | findstr "ragalgo" | findstr "package.json"', { encoding: 'utf8', timeout: 10000 });
        console.log('\nAll ragalgo package.json locations:');
        console.log(whereResult);
    } catch(e) {
        console.log('dir search completed (or no results)');
    }

} catch(e) {
    console.log('Error:', e.message);
}
