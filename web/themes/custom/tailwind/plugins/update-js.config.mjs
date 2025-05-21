import { promises as fs } from 'fs';
import { normalizePath } from 'vite';
import path from 'path';

export default function updateJsFiles() {
  async function copyJsFilesToAssets() {
    // Create destination folder if it doesn't exist
    const destDir = path.join(process.cwd(), 'dist/js');
    await fs.mkdir(destDir, { recursive: true });

    const jsDir = path.join(process.cwd(), 'src/js');
    const files = await fs.readdir(jsDir);

    for (const file of files) {
      if (!file.endsWith('.js')) continue;
      try {
        // Copy the JS file
        const srcPath = path.join('src/js', file);
        const destPath = path.join('dist/js', file);
        await fs.copyFile(srcPath, destPath);
      } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', `Error while processing ${file}: ${error}`);
      }
    }
  }

  async function updateJs({ file, server }) {
    try {
      // Read the content of the .js file
      const jsContent = await fs.readFile(file, 'utf-8');

      // Determine the destination path by replacing "/src/js" with "/dist/js"
      const destinationFile = file.replace('/src/js', '/dist/js');

      // Ensure destination directory exists
      await fs.mkdir(path.dirname(destinationFile), { recursive: true });

      // Write the content to the destination file
      await fs.writeFile(destinationFile, jsContent);

      // Invalidate the module to force an update in Vite's module graph
      const jsModule = server.moduleGraph.getModuleById(normalizePath(destinationFile));
      if (jsModule) {
        server.moduleGraph.invalidateModule(jsModule);
      }

      // Send WebSocket update to clients
      server.ws.send({
        type: 'update',
        updates: [
          {
            type: 'js-update',
            path: normalizePath(destinationFile),
            timestamp: Date.now(),
          },
        ],
      });

      console.log('\x1b[32m%s\x1b[0m', `🚀 Hot update of: ${file} -> ${destinationFile}`);
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', `Error while processing ${file}: ${error}`);
    }
    return [];
  }

  return {
    name: 'update-js-files',
    enforce: 'pre',
    buildStart() {
      // Copy JS files during build start
      return copyJsFilesToAssets();
    },
    async handleHotUpdate({ file, server }) {
      if (file.includes('/src/js') && file.endsWith('.js')) {
        await updateJs({ file, server });
      }
    },
  };
}