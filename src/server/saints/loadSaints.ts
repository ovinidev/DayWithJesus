import type { SaintOfDay, SaintOfDayResponse } from '../../types/index.js'
import type { IsoDate } from '../../utils/liturgicalDate.js'
import { saintsOn } from './calendar.js'
import {
  chooseWikipediaPage,
  formatPatrons,
  parsePortugueseLabels,
  parseWikidataEntity,
  saintQueriesFor,
  stripRoleSuffix,
  type SaintLookup,
  type WikiPageCandidate
} from './matchSaint.js'

const USER_AGENT =
  'DayWithJesus/1.0 (https://day-with-jesus.vercel.app; santo-do-dia)'

const IMAGE_HOSTS = ['upload.wikimedia.org', 'thumb.wikimedia.org']

const FETCH_TIMEOUT_MS = 4000

export interface WikipediaArticle extends WikiPageCandidate {
  imageUrl: string | null
  pageUrl: string | null
  wikibaseItem: string | null
}

type FetchJson =
  | { status: 'ok'; data: unknown }
  | { status: 'miss' }
  | { status: 'error' }

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const readHttps = (value: unknown, hosts: readonly string[]): string | null => {
  if (typeof value !== 'string') return null

  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || !hosts.includes(url.hostname)) return null
    url.search = ''
    return url.toString()
  } catch {
    return null
  }
}

const trimExtract = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const text = value.replace(/\s+/g, ' ').trim()
  if (!text) return null
  if (text.length <= 900) return text

  const cut = text.slice(0, 900)
  const lastSpace = cut.lastIndexOf(' ')
  const shortened = lastSpace > 600 ? cut.slice(0, lastSpace) : cut
  return `${shortened.trim()}…`
}

export const parseWikipediaSummary = (
  input: unknown
): WikipediaArticle | null => {
  if (
    !isRecord(input) ||
    typeof input.title !== 'string' ||
    !input.title.trim()
  ) {
    return null
  }

  const title = input.title.trim()
  const thumbnail = isRecord(input.thumbnail)
    ? input.thumbnail.source
    : undefined
  const original = isRecord(input.originalimage)
    ? input.originalimage.source
    : undefined
  const desktop =
    isRecord(input.content_urls) && isRecord(input.content_urls.desktop)
      ? input.content_urls.desktop.page
      : undefined
  const wikibaseItem =
    typeof input.wikibase_item === 'string' &&
    /^Q\d+$/.test(input.wikibase_item)
      ? input.wikibase_item
      : null

  return {
    title,
    type: input.type === 'disambiguation' ? 'disambiguation' : 'standard',
    description:
      typeof input.description === 'string' ? input.description : null,
    extract: trimExtract(input.extract),
    imageUrl:
      readHttps(thumbnail, IMAGE_HOSTS) ?? readHttps(original, IMAGE_HOSTS),
    pageUrl:
      readHttps(desktop, ['pt.wikipedia.org']) ??
      `https://pt.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
    wikibaseItem
  }
}

export const parseWikipediaSearch = (input: unknown): string[] | null => {
  if (
    !isRecord(input) ||
    !isRecord(input.query) ||
    !Array.isArray(input.query.search)
  ) {
    return null
  }

  return input.query.search.flatMap((item) => {
    if (
      !isRecord(item) ||
      typeof item.title !== 'string' ||
      !item.title.trim()
    ) {
      return []
    }
    return [item.title.trim()]
  })
}

const fetchJsonOnce = async (url: string): Promise<FetchJson> => {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': USER_AGENT,
        'Api-User-Agent': USER_AGENT
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    })

    if (response.status === 404) return { status: 'miss' }
    if (!response.ok) return { status: 'error' }

    return { status: 'ok', data: await response.json() }
  } catch {
    return { status: 'error' }
  }
}

const fetchJson = async (url: string, retry = true): Promise<FetchJson> => {
  const first = await fetchJsonOnce(url)
  if (!retry || first.status !== 'error') return first
  await new Promise((resolve) => setTimeout(resolve, 300))
  return fetchJsonOnce(url)
}

const fetchSummary = async (
  title: string
): Promise<{ article: WikipediaArticle | null; transient: boolean }> => {
  const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  const result = await fetchJson(url)
  if (result.status === 'miss') return { article: null, transient: false }
  if (result.status === 'error') return { article: null, transient: true }

  const article = parseWikipediaSummary(result.data)
  return article
    ? { article, transient: false }
    : { article: null, transient: true }
}

const searchTitles = async (
  query: string
): Promise<{ titles: string[]; transient: boolean }> => {
  const url =
    'https://pt.wikipedia.org/w/api.php?action=query&list=search&srlimit=3&utf8=1&format=json&srsearch=' +
    encodeURIComponent(query)
  const result = await fetchJson(url)
  if (result.status !== 'ok') return { titles: [], transient: true }

  const titles = parseWikipediaSearch(result.data)
  if (!titles || titles.length === 0) return { titles: [], transient: true }
  return { titles, transient: false }
}

const resolveArticle = async (
  lookup: SaintLookup
): Promise<{ article: WikipediaArticle | null; transient: boolean }> => {
  if (lookup.wikipediaTitle) {
    const summary = await fetchSummary(lookup.wikipediaTitle)
    if (!summary.article || summary.article.type === 'disambiguation') {
      return { article: null, transient: summary.transient }
    }
    return summary
  }

  const directName = stripRoleSuffix(lookup.nome)
  const direct = await fetchSummary(directName)
  if (direct.article && chooseWikipediaPage(lookup.nome, [direct.article])) {
    return { article: direct.article, transient: false }
  }

  const search = await searchTitles(directName)
  if (search.transient) {
    return { article: null, transient: true }
  }

  const summaries = await Promise.all(
    search.titles.slice(0, 3).map(fetchSummary)
  )
  const articles = summaries.flatMap((summary) =>
    summary.article ? [summary.article] : []
  )
  const article = chooseWikipediaPage(lookup.nome, articles)

  return {
    article,
    transient: article ? false : summaries.some((summary) => summary.transient)
  }
}

const fetchPatronLabel = async (
  ids: readonly string[]
): Promise<{ padroeiro: string | null; transient: boolean }> => {
  if (ids.length === 0) return { padroeiro: null, transient: false }

  const url =
    'https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels&languages=pt%7Cen&format=json&ids=' +
    ids.slice(0, 8).join('%7C')
  const result = await fetchJson(url, false)
  if (result.status !== 'ok') return { padroeiro: null, transient: true }

  return {
    padroeiro: formatPatrons(
      parsePortugueseLabels(result.data, ids.slice(0, 8))
    ),
    transient: false
  }
}

const fetchFacts = async (
  entityId: string
): Promise<{
  nascimento: string | null
  morte: string | null
  padroeiro: string | null
  transient: boolean
}> => {
  const empty = {
    nascimento: null,
    morte: null,
    padroeiro: null,
    transient: false
  }
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&props=claims&format=json&ids=${entityId}`
  const result = await fetchJson(url, false)
  if (result.status !== 'ok') return { ...empty, transient: true }

  const facts = parseWikidataEntity(result.data, entityId)
  if (!facts) return { ...empty, transient: true }

  const patrons = await fetchPatronLabel(facts.patronIds)
  return {
    nascimento: facts.nascimento,
    morte: facts.morte,
    padroeiro: patrons.padroeiro,
    transient: patrons.transient
  }
}

const enrichLookup = async (
  lookup: SaintLookup
): Promise<{ saint: SaintOfDay; transient: boolean }> => {
  const resolved = await resolveArticle(lookup)
  const facts = resolved.article?.wikibaseItem
    ? await fetchFacts(resolved.article.wikibaseItem)
    : { nascimento: null, morte: null, padroeiro: null, transient: false }

  return {
    transient: resolved.transient,
    saint: {
      nome: lookup.nome,
      imagem: resolved.article?.imageUrl ?? null,
      historia: resolved.article?.extract ?? null,
      reflexao: null,
      oracao: null,
      wikipediaUrl: resolved.article?.pageUrl ?? null,
      nascimento: facts.nascimento,
      morte: facts.morte,
      padroeiro: facts.padroeiro,
      grau: lookup.grau.trim() ? lookup.grau : null
    }
  }
}

export const cacheControlFor = (complete: boolean): string =>
  complete
    ? 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000'
    : 'public, max-age=300, s-maxage=300'

export const buildSaintsResponse = async (
  date: IsoDate
): Promise<{ body: SaintOfDayResponse; cacheControl: string }> => {
  const day = await saintsOn(date)
  const enriched = await Promise.all(
    day.saints.flatMap(saintQueriesFor).map(enrichLookup)
  )
  const complete = enriched.every((item) => !item.transient)

  return {
    cacheControl: cacheControlFor(complete),
    body: {
      liturgia: day.liturgia,
      completo: complete,
      results: enriched.map((item) => item.saint)
    }
  }
}
