const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.match(/import.*\{.*use(State|Effect|Ref|Context|Callback|Memo|Router|Pathname|SearchParams|Params|Session).*}/) || content.match(/import\s+.*\s+from\s+['"](next-auth\/react|next\/navigation)['"]/)) {
        if (!content.trim().startsWith("'use client'") && !content.trim().startsWith('"use client"')) {
          fs.writeFileSync(fullPath, "'use client';\n" + content);
          console.log('Added use client to ' + fullPath);
        }
      }
    }
  }
}

processDir(path.join(__dirname, 'src/app'));
processDir(path.join(__dirname, 'src/components'));
