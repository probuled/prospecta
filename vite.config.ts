import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// O motor de scraping (gosom/google-maps-scraper) não envia cabeçalhos CORS,
// então o navegador fala com ele através deste proxy em /engine.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const engineProxy = {
    '/engine': {
      target: env.SCRAPER_URL ?? 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (p: string) => p.replace(/^\/engine/, ''),
    },
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
    server: { proxy: engineProxy },
    preview: { proxy: engineProxy },
  }
})
