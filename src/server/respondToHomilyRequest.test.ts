import { describe, expect, it } from 'vitest'
import {
  HOMILY_PLAYLIST_FEED_URL,
  HOMILY_PLAYLIST_PAGE_URL
} from '@/utils/homilyFeed'
import {
  respondToHomilyRequest,
  type FetchFeed
} from '@/server/respondToHomilyRequest'

const now = new Date('2026-10-28T01:00:00.000Z')
const sleep = async () => {}

const atom = (
  id: string,
  published: string
) => `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <yt:videoId>${id}</yt:videoId>
    <title>O grão de mostarda</title>
    <published>${published}</published>
    <media:group>
      <media:thumbnail url="https://i.ytimg.com/vi/${id}/hqdefault.jpg" width="480" height="360"/>
    </media:group>
  </entry>
</feed>`

const playlistHtml = `<!doctype html><script>var ytInitialData = ${JSON.stringify(
  {
    contents: [
      {
        lockupViewModel: {
          contentId: 'ZoHnRzQ60gQ',
          metadata: {
            lockupMetadataViewModel: {
              title: { content: 'O grão de mostarda' },
              metadata: {
                contentMetadataViewModel: {
                  metadataRows: [
                    { metadataParts: [{ text: { content: 'há 22 h' } }] }
                  ]
                }
              }
            }
          }
        }
      },
      {
        lockupViewModel: {
          contentId: '8OeXYWHvTJQ',
          metadata: {
            lockupMetadataViewModel: {
              title: { content: 'Subiu à montanha para orar' },
              metadata: {
                contentMetadataViewModel: {
                  metadataRows: [
                    {
                      metadataParts: [
                        { text: { content: 'Estreia em 28/10/2026, 00:00' } }
                      ]
                    }
                  ]
                }
              }
            }
          }
        }
      }
    ]
  }
)};</script>`

describe('homily video request', () => {
  it('returns the playlist feed video without opening the playlist page', async () => {
    const calls: string[] = []
    const fetchFeed: FetchFeed = async (url) => {
      calls.push(url)
      if (url === HOMILY_PLAYLIST_FEED_URL) {
        return {
          status: 200,
          body: atom('ZoHnRzQ60gQ', '2026-10-27T03:00:00.000Z')
        }
      }
      throw new Error(`unexpected ${url}`)
    }

    const result = await respondToHomilyRequest({
      dateParam: '2026-10-27',
      now,
      fetchFeed,
      sleep
    })

    expect(result.statusCode).toBe(200)
    expect(result.cacheControl).toContain('max-age=3600')
    expect(result.body).toMatchObject({
      kind: 'found',
      video: { videoId: 'ZoHnRzQ60gQ' }
    })
    expect(calls).toEqual([HOMILY_PLAYLIST_FEED_URL])
  })

  it('reads the playlist page when the RSS feed is unavailable', async () => {
    const pageHeaders: Record<string, string>[] = []
    let feedAttempts = 0
    const fetchFeed: FetchFeed = async (url, request) => {
      if (url.includes('feeds/videos.xml')) {
        feedAttempts += 1
        return { status: 404, body: 'missing' }
      }
      if (url === HOMILY_PLAYLIST_PAGE_URL) {
        pageHeaders.push(request?.headers ?? {})
        return { status: 200, body: playlistHtml }
      }
      throw new Error(`unexpected ${url}`)
    }

    const result = await respondToHomilyRequest({
      dateParam: ['2026-10-27'],
      now,
      fetchFeed,
      sleep
    })

    expect(result.body).toMatchObject({
      kind: 'found',
      video: { videoId: 'ZoHnRzQ60gQ' }
    })
    expect(feedAttempts).toBe(1)
    expect(pageHeaders[0]?.Cookie).toContain('America.Sao_Paulo')
  })

  it('keeps a short cache when the homily is not published yet', async () => {
    const fetchFeed: FetchFeed = async (url) => {
      if (url === HOMILY_PLAYLIST_FEED_URL) {
        return {
          status: 200,
          body: atom('8OeXYWHvTJQ', '2026-10-28T03:00:00.000Z')
        }
      }
      throw new Error(`unexpected ${url}`)
    }

    const result = await respondToHomilyRequest({
      dateParam: '2026-10-28',
      now,
      fetchFeed,
      sleep
    })

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({ kind: 'missing', reason: 'not_published' })
    expect(result.cacheControl).toContain('max-age=60')
  })

  it('caches an old miss for longer and rejects an impossible date before fetching', async () => {
    const fetchFeed: FetchFeed = async (url) => {
      if (url === HOMILY_PLAYLIST_FEED_URL) {
        return {
          status: 200,
          body: atom('ZoHnRzQ60gQ', '2026-10-27T03:00:00.000Z')
        }
      }
      throw new Error(`unexpected ${url}`)
    }

    const old = await respondToHomilyRequest({
      dateParam: '2026-09-01',
      now,
      fetchFeed,
      sleep
    })
    expect(old.body).toEqual({ kind: 'missing', reason: 'outside_feed' })
    expect(old.cacheControl).toContain('max-age=3600')

    let called = false
    const invalid = await respondToHomilyRequest({
      dateParam: '2026-02-31',
      now,
      fetchFeed: async () => {
        called = true
        return { status: 500, body: '' }
      },
      sleep
    })
    expect(invalid).toMatchObject({
      statusCode: 400,
      cacheControl: 'no-store',
      body: { kind: 'invalid_date' }
    })
    expect(called).toBe(false)
  })

  it('reports the feed unavailable when every source fails', async () => {
    const result = await respondToHomilyRequest({
      dateParam: '2026-10-27',
      now,
      fetchFeed: async () => {
        throw new Error('network down')
      },
      sleep
    })

    expect(result).toMatchObject({
      statusCode: 503,
      cacheControl: 'no-store',
      body: { kind: 'unavailable' }
    })
  })
})
