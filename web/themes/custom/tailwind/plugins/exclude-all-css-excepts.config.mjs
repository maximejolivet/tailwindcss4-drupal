import path from 'path';
import fs from 'fs';

export default function excludeAllCssExcept() {
  return {
    name: "exclude-all-css-except-some",
    generateBundle() {
      const cssDir = path.resolve(__dirname, '../dist/css');
      const allowedFiles = [
        'fonts.css'
      ]; // List of files to keep

      if (fs.existsSync(cssDir)) {
        const items = fs.readdirSync(cssDir);

        for (const item of items) {
          if (allowedFiles.includes(item)) {
            continue; // Skip allowed files
          }

          const itemPath = path.join(cssDir, item);
          const stat = fs.statSync(itemPath);

          if (stat.isFile()) {
            fs.rmSync(itemPath);
            console.log(`🗑️ Deleted file: ${item}`);
          } else if (stat.isDirectory()) {
            fs.rmSync(itemPath, { recursive: true, force: true });
            console.log(`🗑️ Deleted folder: ${item}`);
          }
        }
      }
    }
  };
}