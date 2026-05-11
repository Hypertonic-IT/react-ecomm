const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === '.agent' || file === 'build' || file === 'uploads') continue;
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else {
            const ext = path.extname(fullPath);
            if (['.js', '.jsx', '.html', '.json', '.md', '.env'].includes(ext) || file === '.env') {
                try {
                    let content = fs.readFileSync(fullPath, 'utf8');
                    let updated = content.replace(/Kayaroop/g, 'Kayaroop').replace(/kayaroop/g, 'kayaroop').replace(/KAYAROOP/g, 'KAYAROOP');
                    if (content !== updated) {
                        fs.writeFileSync(fullPath, updated);
                        console.log('Updated:', fullPath);
                    }
                } catch (e) {
                    // ignore read errors for non-text files
                }
            }
        }
    }
}

console.log('Starting branding replacement...');
replaceInDir(__dirname);
console.log('Branding replacement complete.');
