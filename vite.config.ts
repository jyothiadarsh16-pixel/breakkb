import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

// Plugin to ensure /sw.js is explicitly served with correct javascript content-type
function serveServiceWorkerPlugin(): Plugin {
  return {
    name: 'serve-sw-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/sw.js') {
          const swPath = path.resolve(__dirname, 'public/sw.js');
          if (fs.existsSync(swPath)) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            res.setHeader('Service-Worker-Allowed', '/');
            res.setHeader('Cache-Control', 'no-cache');
            return fs.createReadStream(swPath).pipe(res);
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      serveServiceWorkerPlugin(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
