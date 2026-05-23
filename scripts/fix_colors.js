const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, '../src/components/tools/modules');
const files = fs.readdirSync(modulesDir)
  .filter(f => f.endsWith('.tsx'))
  .map(f => path.join(modulesDir, f));

// Add specific other files
files.push(path.join(__dirname, '../src/app/page.tsx'));
files.push(path.join(__dirname, '../src/components/tools/ToolLayout.tsx'));
files.push(path.join(__dirname, '../src/components/CommandMenu.tsx'));

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace non-standard colors
  content = content.replace(/\bbg-zinc-150\b/g, 'bg-zinc-100');
  content = content.replace(/\btext-zinc-650\b/g, 'text-zinc-600');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

console.log('Fixed non-standard tailwind colors in all files.');
