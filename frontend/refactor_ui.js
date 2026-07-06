const fs = require('fs');
const path = require('path');

function findFiles(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, filter, fileList);
    } else if (filter.test(filePath)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const featuresDir = path.join(__dirname, 'src/features');
const viewFiles = findFiles(featuresDir, /View\.tsx$/);

let updatedFilesCount = 0;

viewFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // 1. Remove TopNav and Sidebar imports
  content = content.replace(/import\s*\{\s*Sidebar\s*\}\s*from\s*['"]@\/components\/layout\/Sidebar['"];?\n?/g, '');
  content = content.replace(/import\s*\{\s*TopNav\s*\}\s*from\s*['"]@\/components\/layout\/TopNav['"];?\n?/g, '');

  // 2. Add DashboardLayout import if missing
  if (!content.includes('DashboardLayout')) {
    content = `import { DashboardLayout } from '@/components/layout/DashboardLayout';\n` + content;
  }

  // 3. Replace old min-h-screen layout with DashboardLayout
  const oldLayoutRegex = /<div className="min-h-screen[^>]*>\s*<Sidebar \/>\s*<div className="flex-1[^>]*>\s*<TopNav \/>/g;
  if (oldLayoutRegex.test(content)) {
    content = content.replace(oldLayoutRegex, '<DashboardLayout>');
    // we need to replace the closing </div>\n</div> with </DashboardLayout>
    // This is tricky with regex, but usually it's at the end of the return statement.
    content = content.replace(/<\/div>\s*<\/div>\s*\)\s*;/g, '</DashboardLayout>\n  );');
  }

  // 4. Replace <main ...> with <div className="space-y-6">
  content = content.replace(/<main className="flex-1[^"]*">/g, '<div className="space-y-6">');
  content = content.replace(/<\/main>/g, '</div>');

  // 5. Strip glass-panel, glass-button, border-white/10
  content = content.replace(/glass-panel/g, '');
  content = content.replace(/glass-button/g, '');
  content = content.replace(/border-white\/10/g, '');
  
  // Clean up multiple spaces in className
  content = content.replace(/className="([^"]*)"/g, (match, p1) => {
    return `className="${p1.replace(/\s+/g, ' ').trim()}"`;
  });
  // Remove className="" entirely
  content = content.replace(/ className=""/g, '');

  // 6. Fix text gradients
  content = content.replace(/bg-clip-text text-transparent bg-gradient-to-r from-\w+-\d+ to-\w+-\d+/g, 'text-foreground tracking-tight');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated: ${file}`);
    updatedFilesCount++;
  }
});

console.log(`\nRefactoring complete. Updated ${updatedFilesCount} files.`);
