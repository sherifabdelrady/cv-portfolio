import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// ── Port ─────────────────────────────────────────────────────────────────────
// On Replit: PORT is injected. Locally: falls back to 5173.
const rawPort = process.env.PORT ?? '5173';
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// ── Base path ─────────────────────────────────────────────────────────────────
// On Replit: BASE_PATH is injected. Locally: defaults to "/".
const basePath = process.env.BASE_PATH ?? '/';

// ── Replit-only plugins (only loaded when REPL_ID is present) ─────────────────
const replitPlugins =
  process.env.NODE_ENV !== 'production' && process.env.REPL_ID !== undefined
    ? await Promise.all([
        import('@replit/vite-plugin-runtime-error-modal').then((m) => m.default()),
        import('@replit/vite-plugin-cartographer').then((m) =>
          m.cartographer({ root: path.resolve(import.meta.dirname, '..') }),
        ),
        import('@replit/vite-plugin-dev-banner').then((m) => m.devBanner()),
      ])
    : [];

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    ...replitPlugins,
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, '..', '..', 'attached_assets'),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    exclude: [
      '@tensorflow/tfjs',
      '@tensorflow-models/coco-ssd',
      '@tensorflow-models/mobilenet',
      '@tensorflow-models/pose-detection',
    ],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      external: ['@mediapipe/pose', '@tensorflow/tfjs-backend-webgpu'],
      output: {
        manualChunks: {
          'vendor-react':   ['react', 'react-dom'],
          'vendor-motion':  ['framer-motion'],
          'vendor-icons':   ['lucide-react'],
          'vendor-router':  ['wouter'],
          'vendor-query':   ['@tanstack/react-query'],
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: { strict: true },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
