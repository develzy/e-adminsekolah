const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, search, replace) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.split(search).join(replace);
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${filePath}`);
    }
}

const files = [
    'index.html',
    'public/manifest.webmanifest',
    'src/layouts/DashboardLayout.vue',
    'src/views/Login.vue',
    'src/views/Home.vue'
];

for (const file of files) {
    replaceInFile(path.join(__dirname, file), 'EduPlatform', 'E-Admin Sekolah');
}
