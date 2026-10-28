import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

interface VercelRewrite {
  source: string
  destination: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const readRewrites = (value: unknown): VercelRewrite[] => {
  if (!isRecord(value) || !Array.isArray(value.rewrites)) {
    throw new Error('vercel.json has no rewrites')
  }
  return value.rewrites.map((item) => {
    if (
      !isRecord(item) ||
      typeof item.source !== 'string' ||
      typeof item.destination !== 'string'
    ) {
      throw new Error('invalid rewrite')
    }
    return { source: item.source, destination: item.destination }
  })
}

const config = {
  rewrites: readRewrites(
    JSON.parse(readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8'))
  )
}

// path-to-regexp@6, the matcher Vercel documents for rewrite sources,
// compiles "/:path((?!api/)(?!.*\\.).*)" to this expression.
const matchesRewrite = (source: string, pathname: string): boolean => {
  const custom = source.match(/^\/:path\((.*)\)$/)
  if (!custom?.[1]) return false
  return new RegExp(`^(?:\\/(${custom[1]}))[\\/#\\?]?$`, 'i').test(pathname)
}

describe('SPA fallback rewrite', () => {
  const rewrite = config.rewrites[0]

  it('sends client routes to index.html', () => {
    for (const path of [
      '/',
      '/santos',
      '/missa',
      '/oracoes',
      '/terco',
      '/santos/'
    ]) {
      expect(matchesRewrite(rewrite.source, path)).toBe(true)
    }
    expect(rewrite.destination).toBe('/index.html')
  })

  it('leaves API routes and static files to the filesystem', () => {
    for (const path of [
      '/api/saints',
      '/api/homily-video',
      '/assets/index-abc.js',
      '/favicon.svg',
      '/sw.js',
      '/manifest.webmanifest',
      '/registerSW.js',
      '/pwa-192x192.png',
      '/workbox-3105ea8d.js'
    ]) {
      expect(matchesRewrite(rewrite.source, path)).toBe(false)
    }
  })
})
