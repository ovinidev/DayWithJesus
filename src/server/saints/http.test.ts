import { describe, expect, it } from 'vitest'
import { cacheControlFor, parseWikipediaSummary } from './loadSaints'
import { saintsResponseForQuery } from './http'

describe('saints HTTP boundary', () => {
  it('rejects a day that does not exist', async () => {
    const response = await saintsResponseForQuery({
      dia: '31',
      mes: '2',
      ano: '2026'
    })

    expect(response.status).toBe(400)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(await response.json()).toEqual({
      error: 'Informe uma data válida com dia, mês e ano.'
    })
  })

  it('caches a complete day for a week on the CDN and retries a partial day quickly', () => {
    expect(cacheControlFor(true)).toBe(
      'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000'
    )
    expect(cacheControlFor(false)).toBe('public, max-age=300, s-maxage=300')
  })
})

describe('Wikipedia summary parsing', () => {
  it('keeps a Wikimedia thumbnail and the Portuguese article link', () => {
    const article = parseWikipediaSummary({
      type: 'standard',
      title: 'Carlos Borromeu',
      description: null,
      extract: 'São Carlos Borromeu foi um cardeal.',
      thumbnail: {
        source:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Carlo_Borromeo.jpg/330px-Carlo_Borromeo.jpg'
      },
      originalimage: {
        source:
          'http://upload.wikimedia.org/wikipedia/commons/9/9d/Carlo_Borromeo.jpg'
      },
      content_urls: {
        desktop: { page: 'https://pt.wikipedia.org/wiki/Carlos_Borromeu' }
      },
      wikibase_item: 'Q216946'
    })

    expect(article).toMatchObject({
      title: 'Carlos Borromeu',
      type: 'standard',
      imageUrl:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Carlo_Borromeo.jpg/330px-Carlo_Borromeo.jpg',
      pageUrl: 'https://pt.wikipedia.org/wiki/Carlos_Borromeu',
      wikibaseItem: 'Q216946',
      extract: 'São Carlos Borromeu foi um cardeal.'
    })
  })

  it('drops images and links that are not from Wikipedia', () => {
    const article = parseWikipediaSummary({
      type: 'disambiguation',
      title: 'São José (desambiguação)',
      extract: '',
      thumbnail: { source: 'https://evil.example/saint.jpg' },
      content_urls: { desktop: { page: 'https://evil.example/wiki' } },
      wikibase_item: 'not-an-id'
    })

    expect(article).toMatchObject({
      type: 'disambiguation',
      imageUrl: null,
      wikibaseItem: null,
      extract: null
    })
    expect(article?.pageUrl?.startsWith('https://pt.wikipedia.org/wiki/')).toBe(
      true
    )
    expect(article?.pageUrl).not.toContain('evil.example')
  })

  it('rejects a payload without a title', () => {
    expect(parseWikipediaSummary({ extract: 'sem título' })).toBeNull()
  })
})
