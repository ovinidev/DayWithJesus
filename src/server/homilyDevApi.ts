import type { Plugin } from 'vite'
import { fetchYoutube } from './fetchYoutube.js'
import { respondToHomilyRequest } from './respondToHomilyRequest.js'

export const homilyVideoDevApi = (): Plugin => ({
  name: 'homily-video-dev-api',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const rawUrl = req.url ?? ''
      const path = rawUrl.split('?')[0]
      if (path !== '/api/homily-video') {
        next()
        return
      }

      const url = new URL(rawUrl, 'http://127.0.0.1')
      void respondToHomilyRequest({
        dateParam: url.searchParams.get('date'),
        fetchFeed: fetchYoutube
      })
        .then((result) => {
          res.statusCode = result.statusCode
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.setHeader('Cache-Control', result.cacheControl)
          res.end(JSON.stringify(result.body))
        })
        .catch(() => {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.setHeader('Cache-Control', 'no-store')
          res.end(JSON.stringify({ kind: 'unavailable' }))
        })
    })
  }
})
