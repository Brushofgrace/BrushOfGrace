import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', ''); // Load .env files from the project root
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.IMGUR_CLIENT_ID': JSON.stringify(env.IMGUR_CLIENT_ID),
        'process.env.XANO_API_ENDPOINT': JSON.stringify(env.XANO_API_ENDPOINT)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});