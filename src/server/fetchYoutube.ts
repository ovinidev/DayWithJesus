import type { FeedRequest, FetchFeed } from './respondToHomilyRequest.js'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'

const MAX_BODY_CHARS = 4_000_000
const SUCCESS_CACHE_MS = 60_000

const successCache = new Map<string, { expires: number; body: string }>()

export const fetchYoutube: FetchFeed = async (
  url: string,
  request?: FeedRequest
) => {
  const key = `${url}\n${request?.headers?.Cookie ?? ''}`
  const cached = successCache.get(key)
  if (cached && cached.expires > Date.now()) {
    return { status: 200, body: cached.body }
  }

  const response = await fetch(url, {
    headers: {
      Accept: 'text/html,application/atom+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9',
      'User-Agent': USER_AGENT,
      ...request?.headers
    },
    signal: AbortSignal.timeout(6_000)
  })
  const body = await response.text()
  if (body.length > MAX_BODY_CHARS) return { status: 502, body: '' }
  if (response.status === 200) {
    successCache.set(key, { expires: Date.now() + SUCCESS_CACHE_MS, body })
  }
  return { status: response.status, body }
}
