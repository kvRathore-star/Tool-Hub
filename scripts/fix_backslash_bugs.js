const fs = require('fs');
const path = require('path');

const modulesDir = '/Users/kvsingh/99-ai-tools/src/components/tools/modules';
const files = fs.readdirSync(modulesDir);

let fixedCount = 0;

files.forEach(file => {
  if (!file.endsWith('.tsx')) return;
  
  const filePath = path.join(modulesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  const isCalculator = file.endsWith('Calculator.tsx');
  const isAiOrText = file.startsWith('Ai') || 
                     file.includes('Generator') || 
                     file.includes('Summarizer') || 
                     file.includes('Translator') || 
                     file.includes('Transcription') || 
                     file.includes('Subtitler');

  if (isCalculator) {
    // 1. Replace \$\${ with ${ (which renders as $ followed by the expression)
    // 2. Replace \${ with { (which renders as the expression only)
    let newContent = content;
    
    // Replace \$\${
    newContent = newContent.replace(/\\\$\\\${/g, '${');
    newContent = newContent.replace(/\\\$\${/g, '${');
    
    // Replace \${
    newContent = newContent.replace(/\\\${/g, '{');
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Fixed calculator: ${file}`);
      fixedCount++;
    }
  } else {
    // AI or other template literal files: Replace \${ with ${ to enable proper template string interpolation
    let newContent = content.replace(/\\\${/g, '${');
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Fixed template interpolation in: ${file}`);
      fixedCount++;
    }
  }
});

console.log(`\nSuccessfully fixed backslash bugs in ${fixedCount} files!`);
