import { normalizePath } from 'vite';
import fs from 'fs';
import path from 'path';

export default function updateConfig() {

  return {
    name: "exclude-css-folder",
    generateBundle() {
      const cssPath = path.resolve(__dirname, "dist/css");
      if (fs.existsSync(cssPath)) {
        fs.rmSync(cssPath, { recursive: true, force: true });
      }
    }
  };
}
