import {
  HOMILY_CHANNEL_FEED_URL,
  HOMILY_PLAYLIST_FEED_URL,
  HOMILY_PLAYLIST_PAGE_URL,
  lookupHomily,
  parseLiturgicalDateQuery,
  parsePlaylistPage,
  parseYoutubeFeed,
  type FeedEntry,
  type HomilyLookup
} from '../utils/homilyFeed.js'

export interface FeedResponse {
  status: number
  body: string
}

export interface FeedRequest {
  headers?: Record<string, string>
}

export type FetchFeed = (
  url: string,
  request?: FeedRequest
) => Promise<FeedResponse>

export type HomilyHttpBody = HomilyLookup | { kind: 'invalid_date' }

export interface HomilyHttpResult {
  statusCode: number
  cacheControl: string
  body: HomilyHttpBody
}

const pause = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const isAtomFeed = (body: string): boolean =>
  body.includes('<feed') &&
  (body.includes('<entry') || body.includes('http://www.w3.org/2005/Atom'))

const readBody = async (
  fetchFeed: FetchFeed,
  url: string,
  attempts: number,
  wait: (ms: number) => Promise<void>,
  request?: FeedRequest
): Promise<string | null> => {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (attempt > 0) await wait(250)
    try {
      const response = await fetchFeed(url, request)
      if (response.status === 200 && response.body) return response.body
      if (response.status === 404) return null
    } catch {
      continue
    }
  }
  return null
}

const readEntries = async (
  fetchFeed: FetchFeed,
  now: Date,
  wait: (ms: number) => Promise<void>
): Promise<FeedEntry[] | null> => {
  const playlistFeed = await readBody(
    fetchFeed,
    HOMILY_PLAYLIST_FEED_URL,
    2,
    wait
  )
  if (playlistFeed && isAtomFeed(playlistFeed)) {
    const entries = parseYoutubeFeed(playlistFeed)
    if (entries && entries.length > 0) return entries
  }

  // The playlist RSS is the homily series. When YouTube answers 404/500, the
  // public playlist page still lists each homily. The timezone cookie makes
  // "Estreia em" a São Paulo wall time, which is the liturgical date.
  const page = await readBody(fetchFeed, HOMILY_PLAYLIST_PAGE_URL, 1, wait, {
    headers: { Cookie: 'PREF=tz=America.Sao_Paulo&hl=pt' }
  })
  if (page) {
    const entries = parsePlaylistPage(page, now)
    if (entries && entries.length > 0) return entries
  }

  const channelFeed = await readBody(
    fetchFeed,
    HOMILY_CHANNEL_FEED_URL,
    2,
    wait
  )
  if (channelFeed && isAtomFeed(channelFeed)) {
    const entries = parseYoutubeFeed(channelFeed)
    if (entries && entries.length > 0) return entries
  }

  return null
}

const cacheControlFor = (body: HomilyHttpBody): string => {
  switch (body.kind) {
    case 'found':
      return 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
    case 'missing':
      return body.reason === 'outside_feed'
        ? 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
        : 'public, max-age=60, s-maxage=120, stale-while-revalidate=300'
    case 'invalid_date':
    case 'unavailable':
      return 'no-store'
    default: {
      const unreachable: never = body
      return unreachable
    }
  }
}

const statusFor = (body: HomilyHttpBody): number => {
  switch (body.kind) {
    case 'found':
    case 'missing':
      return 200
    case 'invalid_date':
      return 400
    case 'unavailable':
      return 503
    default: {
      const unreachable: never = body
      return unreachable
    }
  }
}

const httpResult = (body: HomilyHttpBody): HomilyHttpResult => ({
  statusCode: statusFor(body),
  cacheControl: cacheControlFor(body),
  body
})

export const respondToHomilyRequest = async (input: {
  dateParam: unknown
  now?: Date
  fetchFeed: FetchFeed
  sleep?: (ms: number) => Promise<void>
}): Promise<HomilyHttpResult> => {
  const date = parseLiturgicalDateQuery(input.dateParam)
  if (!date) return httpResult({ kind: 'invalid_date' })

  const now = input.now ?? new Date()
  const entries = await readEntries(input.fetchFeed, now, input.sleep ?? pause)
  if (!entries) return httpResult({ kind: 'unavailable' })
  return httpResult(lookupHomily({ entries, date, now }))
}
