import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Look for .env files in BOTH the current frontend folder AND the root directory
  const rootEnv = loadEnv(mode, path.resolve(__dirname, '..'), '');
  const localEnv = loadEnv(mode, __dirname, '');
  
  const rawToken = 
    localEnv.VITE_TMDB_ACCESS_TOKEN || 
    rootEnv.VITE_TMDB_ACCESS_TOKEN || 
    process.env.VITE_TMDB_ACCESS_TOKEN || 
    '';

  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(
            '</head>',
            `<script>window.__TMDB_TOKEN__ = ${JSON.stringify(rawToken)};</script></head>`
          );
        }
      }
    ],
    define: {
      'import.meta.env.VITE_TMDB_ACCESS_TOKEN': JSON.stringify(rawToken)
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        }
      }
    }
  }
})