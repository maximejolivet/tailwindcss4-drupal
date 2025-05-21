import {defineConfig, loadEnv} from "vite";
import tailwindcss from "@tailwindcss/vite";
import liveReload from "vite-plugin-live-reload";
import updateJs from './plugins/update-js.config.mjs';
import path from "path";
import fs from 'fs';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, path.resolve(__dirname, "../../../.."), "");

  function excludeReloadStyles() {
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

  return {
    plugins: [
      tailwindcss(),
      liveReload(__dirname + "/**/*.(php|inc|includes|twig)"),
      updateJs(),
      excludeReloadStyles(),
    ],

    publicDir: "src",
    build: {
      assetsInlineLimit: 0, // Do not inline any dist (like base64 images)
      emptyOutDir: false, // Avoid deleting the output directory before build
      manifest: false, // Generate a manifest.json for hashed dist
      outDir: "dist", // Output build folder (used instead of default "dist")
      rollupOptions: {
        input: {
          // Explicit entrypoint for Tailwind CSS (this will include tailwind.css in the build)
          tailwind: path.resolve(__dirname, 'src/css/tailwind.css'),
        },
        output: {
          assetFileNames: ({name}) => {
            if (/\.(css)$/.test(name ?? '')) { return 'css/[name][extname]'; } // CSS files in /css/
            if (/\.(js)$/.test(name ?? '')) { return 'js/[name][extname]'; } // JS files go in /js/
            if (/\.(png|jpe?g|gif|svg)$/.test(name ?? '')) { return 'images/[name][extname]'; } // Images in /images/
            if (/\.(woff2?|ttf|eot)$/.test(name ?? '')) { return 'fonts/[name][extname]'; } // Fonts in /fonts/
            return '[name][extname]'; // Default fallback
          },
          sourcemap: mode === "development"
        },
      },
    },

    server: {
      host: true, // Listen on all interfaces
      https: { // Enable HTTPS with self-signed certificate
        key: fs.readFileSync('./plugins/https_key/localhost-key.pem'),
        cert: fs.readFileSync('./plugins/https_key/localhost.pem'),
      },
      origin: env.VITE_SERVER_ORIGIN, // Dev server origin for HMR
      cors: true, // laAllow cross-origin requests
      strictPort: false, // Don’t fail if port is already taken
      port: env.VITE_SERVER_PORT, // Dev server port
      hmr: {
        host: env.VITE_SERVER_HOST, // Host for Hot Module Replacement
        protocol: 'wss', // Use WebSocket protocol for HMR
      },
      allowedHosts: [".lndo.site"], // Allow specific dev domains (e.g. Lando)
    },
  };
});
