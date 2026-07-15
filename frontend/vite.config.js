import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const rootPath = path.resolve(__dirname, '..');
  // Try to load env variables from the root folder
  const env = loadEnv(mode, rootPath, '');
  // Try to grab the token regardless of whether it has the VITE_ prefix or not
  const rawToken = env.VITE_TMDB_ACCESS_TOKEN || env.TMDB_ACCESS_TOKEN || '';

  return {

    envDir: rootPath, // Set the envDir to the root path to ensure .env is loaded correctly

    plugins: [
      react(), 
      tailwindcss(),
      // This custom plugin forces the token into the window object of index.html
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
      // Keep this fallback just in case
      'import.meta.env.VITE_TMDB_ACCESS_TOKEN': JSON.stringify(rawToken)
    }
  }
})