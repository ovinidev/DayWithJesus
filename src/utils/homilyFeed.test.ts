import { describe, expect, it } from 'vitest'
import {
  lookupHomily,
  parseHomilyLookup,
  parseLiturgicalDateQuery,
  parsePlaylistPage,
  parseYoutubeFeed,
  type FeedEntry,
  type LiturgicalDate
} from '@/utils/homilyFeed'

const date = (value: string): LiturgicalDate => {
  const parsed = parseLiturgicalDateQuery(value)
  if (!parsed) throw new Error(`invalid fixture date ${value}`)
  return parsed
}

const feed = (entries: string[]) => `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
${entries.join('\n')}
</feed>`

const entry = (input: {
  id: string
  title: string
  published: string
  description?: string
}) => `<entry>
  <yt:videoId>${input.id}</yt:videoId>
  <title>${input.title}</title>
  <published>${input.published}</published>
  <media:group>
    <media:title>${input.title}</media:title>
    <media:description>${input.description ?? ''}</media:description>
    <media:thumbnail url="https://i.ytimg.com/vi/${input.id}/hqdefault.jpg" width="480" height="360"/>
  </media:group>
</entry>`

const entriesFrom = (xml: string): FeedEntry[] => {
  const parsed = parseYoutubeFeed(xml)
  if (!parsed) throw new Error('fixture feed did not parse')
  return parsed
}

const lookup = (xml: string, liturgicalDate: string, now: string) =>
  lookupHomily({
    entries: entriesFrom(xml),
    date: date(liturgicalDate),
    now: new Date(now)
  })

const lockup = (id: string, title: string, label: string) => ({
  lockupViewModel: {
    contentId: id,
    metadata: {
      lockupMetadataViewModel: {
        title: { content: title },
        metadata: {
          contentMetadataViewModel: {
            metadataRows: [
              {
                metadataParts: [{ text: { content: 'Padre Adriano Zandoná' } }]
              },
              { metadataParts: [{ text: { content: label } }] }
            ]
          }
        }
      }
    }
  }
})

const playlistPage = (items: { id: string; title: string; label: string }[]) =>
  `<!doctype html><script>var ytInitialData = ${JSON.stringify({
    contents: items.map((item) => lockup(item.id, item.title, item.label))
  })};</script>`

describe('homily date matching', () => {
  const now = '2026-10-28T12:00:00.000Z'

  it('uses the São Paulo calendar day of the publish instant', () => {
    const xml = feed([
      entry({
        id: 'ZoHnRzQ60gQ',
        title: 'O grão de mostarda',
        published: '2026-10-28T02:30:00.000Z'
      })
    ])

    expect(lookup(xml, '2026-10-27', now)).toMatchObject({
      kind: 'found',
      video: { videoId: 'ZoHnRzQ60gQ', title: 'O grão de mostarda' }
    })
    expect(lookup(xml, '2026-10-28', now)).toEqual({
      kind: 'missing',
      reason: 'not_published'
    })
  })

  it('treats midnight in São Paulo as that liturgical day', () => {
    const xml = feed([
      entry({
        id: '8OeXYWHvTJQ',
        title: 'Subiu à montanha para orar',
        published: '2026-10-28T03:00:00.000Z'
      })
    ])

    expect(lookup(xml, '2026-10-28', now)).toMatchObject({
      kind: 'found',
      video: { videoId: '8OeXYWHvTJQ' }
    })
    expect(lookup(xml, '2026-10-27', now)).toMatchObject({
      kind: 'missing'
    })
  })

  it('lets a date written in the title override the publish day', () => {
    const xml = feed([
      entry({
        id: '8OeXYWHvTJQ',
        title: 'Homilia 28/10/2026',
        published: '2026-10-27T15:00:00.000Z'
      })
    ])

    expect(lookup(xml, '2026-10-28', now)).toMatchObject({
      kind: 'found',
      video: { videoId: '8OeXYWHvTJQ', title: 'Homilia 28/10/2026' }
    })
    expect(lookup(xml, '2026-10-27', now)).toMatchObject({ kind: 'missing' })
  })

  it('reads a liturgical date written in the description', () => {
    const xml = feed([
      entry({
        id: '8OeXYWHvTJQ',
        title: 'Subiu à montanha para orar',
        description: 'Homilia de 28 de outubro de 2026',
        published: '2026-10-27T15:00:00.000Z'
      })
    ])

    expect(lookup(xml, '2026-10-28', now)).toMatchObject({
      kind: 'found',
      video: { videoId: '8OeXYWHvTJQ' }
    })
    expect(lookup(xml, '2026-10-27', now)).toMatchObject({ kind: 'missing' })
  })

  it('prefers the daily homily over the rosary published the same day', () => {
    const xml = feed([
      entry({
        id: 'ZoHnRzQ60gQ',
        title: 'O grão de mostarda',
        published: '2026-10-27T03:00:00.000Z'
      }),
      entry({
        id: 'aaaaaaaaaaa',
        title: 'Santo Terço - Mistérios Dolorosos',
        published: '2026-10-27T12:00:00.000Z'
      })
    ])

    expect(lookup(xml, '2026-10-27', now)).toMatchObject({
      kind: 'found',
      video: { videoId: 'ZoHnRzQ60gQ' }
    })
  })

  it('does not offer a premiere that has not started', () => {
    const xml = feed([
      entry({
        id: 'ZoHnRzQ60gQ',
        title: 'O grão de mostarda',
        published: '2026-10-27T03:00:00.000Z'
      }),
      entry({
        id: '8OeXYWHvTJQ',
        title: 'Subiu à montanha para orar',
        published: '2026-10-29T03:00:00.000Z'
      })
    ])

    expect(lookup(xml, '2026-10-29', now)).toEqual({
      kind: 'missing',
      reason: 'not_published'
    })
    expect(lookup(xml, '2026-10-28', now)).toEqual({
      kind: 'missing',
      reason: 'not_published'
    })
  })

  it('reports dates older than the feed window instead of a wrong video', () => {
    const xml = feed([
      entry({
        id: 'ZoHnRzQ60gQ',
        title: 'O grão de mostarda',
        published: '2026-10-27T03:00:00.000Z'
      })
    ])

    expect(lookup(xml, '2026-10-01', now)).toEqual({
      kind: 'missing',
      reason: 'outside_feed'
    })
  })

  it('decodes feed text and skips entries without a video id', () => {
    const parsed = parseYoutubeFeed(
      feed([
        entry({
          id: 'nope',
          title: 'Ignored',
          published: '2026-10-27T03:00:00.000Z'
        }),
        entry({
          id: 'ZoHnRzQ60gQ',
          title: 'Cura &amp; paz',
          published: '2026-10-27T03:00:00.000Z'
        })
      ])
    )

    expect(parsed).toEqual([
      expect.objectContaining({
        videoId: 'ZoHnRzQ60gQ',
        title: 'Cura & paz',
        thumbnailUrl: 'https://i.ytimg.com/vi/ZoHnRzQ60gQ/hqdefault.jpg'
      })
    ])
  })

  it('rejects a document that is not an Atom feed', () => {
    expect(parseYoutubeFeed('<html><title>Error 404</title></html>')).toBeNull()
  })
})

describe('playlist page fallback', () => {
  const now = new Date('2026-10-28T01:00:00.000Z')
  const html = playlistPage([
    {
      id: 'bbbbbbbbbbb',
      title: 'Homilia antiga demais para esta amostra',
      label: 'há 10 dias'
    },
    {
      id: 'ccccccccccc',
      title: 'Mulher, estás livre da tua doença',
      label: 'há 1 dia'
    },
    {
      id: 'ZoHnRzQ60gQ',
      title: 'O grão de mostarda',
      label: 'há 22 h'
    },
    {
      id: '8OeXYWHvTJQ',
      title: 'Subiu à montanha para orar',
      label: 'Estreia em 28/10/2026, 00:00'
    }
  ])

  const parsed = parsePlaylistPage(html, now)
  if (!parsed) throw new Error('playlist fixture did not parse')

  const find = (liturgicalDate: string) =>
    lookupHomily({ entries: parsed, date: date(liturgicalDate), now })

  it('dates published homilies from the next São Paulo premiere', () => {
    expect(find('2026-10-27')).toMatchObject({
      kind: 'found',
      video: { videoId: 'ZoHnRzQ60gQ', title: 'O grão de mostarda' }
    })
    expect(find('2026-10-26')).toMatchObject({
      kind: 'found',
      video: { videoId: 'ccccccccccc' }
    })
  })

  it('keeps a scheduled premiere unpublished until its São Paulo start', () => {
    expect(find('2026-10-28')).toEqual({
      kind: 'missing',
      reason: 'not_published'
    })
  })

  it('does not assign a coarse relative label to the wrong day', () => {
    expect(find('2026-10-18')).toEqual({
      kind: 'missing',
      reason: 'outside_feed'
    })
    expect(parsed.some((item) => item.videoId === 'bbbbbbbbbbb')).toBe(false)
  })
})

describe('homily response parsing', () => {
  it('accepts a found video and rejects a non-YouTube thumbnail', () => {
    expect(
      parseHomilyLookup({
        kind: 'found',
        video: {
          videoId: 'ZoHnRzQ60gQ',
          title: 'O grão de mostarda',
          thumbnailUrl: 'https://i.ytimg.com/vi/ZoHnRzQ60gQ/hqdefault.jpg'
        }
      })
    ).toMatchObject({ kind: 'found', video: { videoId: 'ZoHnRzQ60gQ' } })

    expect(() =>
      parseHomilyLookup({
        kind: 'found',
        video: {
          videoId: 'ZoHnRzQ60gQ',
          title: 'O grão de mostarda',
          thumbnailUrl: 'javascript:alert(1)'
        }
      })
    ).toThrow(/inválida/)
  })

  it('rejects a calendar date that does not exist', () => {
    expect(parseLiturgicalDateQuery('2026-02-31')).toBeNull()
    expect(parseLiturgicalDateQuery(['2026-10-27'])).toBe('2026-10-27')
  })
})
