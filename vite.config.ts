import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import pkg from './package.json' with { type: 'json' }

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
    // Versão do package.json, a mesma da tag vX.Y.Z e da imagem Docker.
    define: { __APP_VERSION__: JSON.stringify(pkg.version) },
    resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
    build: {
      rolldownOptions: {
        output: {
          // O worker do MapLibre é .mjs, extensão que o mime.types do nginx não conhece: sem tipo JavaScript, o
          // navegador recusa o worker. Sair como .js resolve, e o nome novo também descarta a cópia ruim já em cache.
          assetFileNames: ({ names }) => (names[0]?.endsWith('.mjs') ? 'assets/[name]-[hash].js' : 'assets/[name]-[hash][extname]'),
        },
      },
    },
    server: { proxy: engineProxy },
    preview: { proxy: engineProxy },
  }
})
