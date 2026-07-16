import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const rootPath = path.resolve(__dirname, '..');
  
  // 1. Load variables from physical .env files in the root folder
  const env = loadEnv(mode, rootPath, '');
  
  // 2. Fall back to process.env (system shell) if the physical file doesn't have it
  const rawToken = 
    env.VITE_TMDB_ACCESS_TOKEN || 
    process.env.VITE_TMDB_ACCESS_TOKEN || 
    env.TMDB_ACCESS_TOKEN || 
    process.env.TMDB_ACCESS_TOKEN || 
    '';

  return {
    envDir: rootPath,

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
    }
  }
})