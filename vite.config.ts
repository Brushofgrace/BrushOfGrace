import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path'; // Import resolve for path resolution

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', ''); // Load .env files from the project root
    return {
      define: {
        // 'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY), // Redundant if GEMINI_API_KEY is used
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.IMGUR_CLIENT_ID': JSON.stringify(env.IMGUR_CLIENT_ID),
        'process.env.XANO_SAVE_ARTWORK_ENDPOINT': JSON.stringify(env.XANO_SAVE_ARTWORK_ENDPOINT),
        'process.env.XANO_GET_ARTWORKS_ENDPOINT': JSON.stringify(env.XANO_GET_ARTWORKS_ENDPOINT),
        'process.env.XANO_DELETE_ARTWORK_ENDPOINT': JSON.stringify(env.XANO_DELETE_ARTWORK_ENDPOINT),
        'process.env.UPLOAD_PASSWORD': JSON.stringify(env.UPLOAD_PASSWORD),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'index.html'),
            admin: resolve(__dirname, 'admin/index.html'),
          },
        },
      },
    };
});