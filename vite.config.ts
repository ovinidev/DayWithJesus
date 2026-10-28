/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

interface SaintsQuery {
  dia: string | null
  mes: string | null
  ano: string | null
}

const isSaintsResponder = (
  value: unknown
): value is (query: SaintsQuery) => Promise<unknown> =>
  typeof value === 'function'

const saintsDevApi = (): Plugin => ({
  name: 'saints-dev-api',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const requestUrl = req.url ?? ''
      if (requestUrl.split('?')[0] !== '/api/saints') {
        next()
        return
      }

      if (req.method !== 'GET') {
        res.statusCode = 405
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ error: 'Método não permitido.' }))
        return
      }

      void (async () => {
        try {
          const loaded: unknown = await server.ssrLoadModule(
            '/src/server/saints/http.ts'
          )
          const respond =
            typeof loaded === 'object' &&
            loaded !== null &&
            'saintsResponseForQuery' in loaded
              ? loaded.saintsResponseForQuery
              : undefined
          if (!isSaintsResponder(respond)) {
            throw new Error('missing saints handler')
          }

          const url = new URL(requestUrl, 'http://localhost')
          const response: unknown = await respond({
            dia: url.searchParams.get('dia'),
            mes: url.searchParams.get('mes'),
            ano: url.searchParams.get('ano')
          })
          if (!(response instanceof Response)) {
            throw new Error('invalid saints response')
          }

          res.statusCode = response.status
          response.headers.forEach((value, key) => {
            res.setHeader(key, value)
          })
          res.end(await response.text())
        } catch {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(
            JSON.stringify({
              error: 'Não foi possível consultar o calendário litúrgico.'
            })
          )
        }
      })()
    })
  }
})

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    saintsDevApi(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Homilia Diária',
        short_name: 'Homilia',
        description: 'Leitura do evangelho do dia',
        lang: 'pt-BR',
        theme_color: '#1b4332',
        background_color: '#efeae2',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true
  },
  server: {
    open: true
  }
})
