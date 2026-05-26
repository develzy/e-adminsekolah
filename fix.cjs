const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    fs.writeFileSync(filePath, content);
}

const vueFiles = [
    'src/layouts/DashboardLayout.vue',
    'src/views/Login.vue',
    'src/views/dashboard/Overview.vue',
    'src/views/dashboard/master/Schools.vue',
    'src/views/dashboard/master/Students.vue',
    'src/views/dashboard/master/Teachers.vue',
    'src/views/dashboard/ai/BankSoal.vue'
];

for (const file of vueFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        replaceInFile(filePath, [['@lucide/vue-next', 'lucide-vue-next']]);
    }
}

// Fix unused variables and TS errors
replaceInFile(path.join(__dirname, 'src/router/index.ts'), [['(to, from, next)', '(to, _from, next)']]);
replaceInFile(path.join(__dirname, 'src/views/dashboard/ai/BankSoal.vue'), [['result.value = null', 'result.value = null'], ['const result = ref<any>(null)', 'const result = ref<any[] | null>(null)']]);
replaceInFile(path.join(__dirname, 'src/views/dashboard/master/Schools.vue'), [['Plus, Search, MoreVertical, Edit, Trash2', 'Plus, Search, Edit, Trash2']]);
replaceInFile(path.join(__dirname, 'src/views/dashboard/master/Teachers.vue'), [['Plus, Search, Filter', 'Plus, Search']]);

console.log('Fixes applied.');
