export const HOMILY_TIME_ZONE = 'America/Sao_Paulo'

export const HOMILY_CHANNEL_ID = 'UCfHovshh6RJ-iQBdl0A6TzQ'

export const HOMILY_PLAYLIST_ID = 'PL6K5CF-9dJqKzOOyK5QODiI8nUtP4GmH0'

export const HOMILY_PLAYLIST_FEED_URL = `https://www.youtube.com/feeds/videos.xml?playlist_id=${HOMILY_PLAYLIST_ID}`

export const HOMILY_CHANNEL_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${HOMILY_CHANNEL_ID}`

export const HOMILY_PLAYLIST_PAGE_URL = `https://www.youtube.com/playlist?list=${HOMILY_PLAYLIST_ID}`

export type LiturgicalDate = string & { readonly __brand: 'LiturgicalDate' }

export type YoutubeVideoId = string & { readonly __brand: 'YoutubeVideoId' }

export type YoutubeThumbnailUrl = string & {
  readonly __brand: 'YoutubeThumbnailUrl'
}

export interface HomilyVideo {
  videoId: YoutubeVideoId
  title: string
  thumbnailUrl: YoutubeThumbnailUrl
}

export type HomilyLookup =
  | { kind: 'found'; video: HomilyVideo }
  | { kind: 'missing'; reason: 'not_published' | 'outside_feed' }
  | { kind: 'unavailable' }

export interface FeedEntry {
  videoId: YoutubeVideoId
  title: string
  description: string
  publishedAt: Date
  thumbnailUrl: YoutubeThumbnailUrl
}

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/
const MONTHS: Record<string, number> = {
  janeiro: 1,
  fevereiro: 2,
  marco: 3,
  abril: 4,
  maio: 5,
  junho: 6,
  julho: 7,
  agosto: 8,
  setembro: 9,
  outubro: 10,
  novembro: 11,
  dezembro: 12,
  jan: 1,
  fev: 2,
  mar: 3,
  abr: 4,
  mai: 5,
  jun: 6,
  jul: 7,
  ago: 8,
  set: 9,
  out: 10,
  nov: 11,
  dez: 12
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const isLiturgicalDate = (value: string): value is LiturgicalDate => {
  const match = DATE_PATTERN.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (year < 2005 || year > 2100) return false

  const utc = new Date(Date.UTC(year, month - 1, day))
  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day
  )
}

export const isYoutubeVideoId = (value: string): value is YoutubeVideoId =>
  VIDEO_ID_PATTERN.test(value)

export const isYoutubeThumbnailUrl = (
  value: string
): value is YoutubeThumbnailUrl => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname.endsWith('.ytimg.com')
  } catch {
    return false
  }
}

export const parseLiturgicalDateQuery = (
  value: unknown
): LiturgicalDate | null => {
  const raw = Array.isArray(value) ? value[0] : value
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim()
  return isLiturgicalDate(trimmed) ? trimmed : null
}

const thumbnailFor = (
  videoId: YoutubeVideoId,
  candidate: string | null
): YoutubeThumbnailUrl => {
  if (candidate && isYoutubeThumbnailUrl(candidate)) return candidate
  const fallback = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  if (isYoutubeThumbnailUrl(fallback)) return fallback
  throw new Error('Thumbnail fallback is not a YouTube image URL')
}

const decodeXml = (value: string): string =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => {
      const code = Number.parseInt(hex, 16)
      return Number.isInteger(code) && code >= 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : ''
    })
    .replace(/&#(\d+);/g, (_, dec: string) => {
      const code = Number.parseInt(dec, 10)
      return Number.isInteger(code) && code >= 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : ''
    })
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')

const cleanText = (value: string): string =>
  decodeXml(value)
    .replace(/[\u0000-\u001F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300)

const tagText = (block: string, name: string): string | null => {
  const pattern = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`)
  const match = block.match(pattern)
  return match ? cleanText(match[1]) : null
}

const thumbnailUrlFromEntry = (block: string): string | null => {
  const match = block.match(
    /<media:thumbnail\b[^>]*\burl=(?:"([^"]+)"|'([^']+)')/i
  )
  const url = match?.[1] ?? match?.[2]
  return url ? decodeXml(url) : null
}

const videoIdFromEntry = (block: string): YoutubeVideoId | null => {
  const tagged = tagText(block, 'yt:videoId')
  if (tagged && isYoutubeVideoId(tagged)) return tagged

  const id = tagText(block, 'id')
  const fromUrn = id?.match(/yt:video:([A-Za-z0-9_-]{11})/)
  const parsed = fromUrn?.[1]
  return parsed && isYoutubeVideoId(parsed) ? parsed : null
}

export const parseYoutubeFeed = (xml: string): FeedEntry[] | null => {
  if (!xml.includes('<feed') || xml.length > 1_000_000) return null

  const entries: FeedEntry[] = []
  for (const match of xml.matchAll(/<entry\b[\s\S]*?<\/entry>/g)) {
    const block = match[0]
    const videoId = videoIdFromEntry(block)
    const publishedRaw = tagText(block, 'published')
    const title = tagText(block, 'title')
    if (!videoId || !publishedRaw || !title) continue

    const publishedAt = new Date(publishedRaw)
    if (Number.isNaN(publishedAt.getTime())) continue

    entries.push({
      videoId,
      title,
      description: tagText(block, 'media:description') ?? '',
      publishedAt,
      thumbnailUrl: thumbnailFor(videoId, thumbnailUrlFromEntry(block))
    })
  }

  return entries
}

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const addDays = (date: LiturgicalDate, days: number): LiturgicalDate | null => {
  const [year, month, day] = date.split('-').map(Number)
  const shifted = new Date(Date.UTC(year, month - 1, day + days))
  const formatted = shifted.toISOString().slice(0, 10)
  return isLiturgicalDate(formatted) ? formatted : null
}

const daysBetween = (start: LiturgicalDate, end: LiturgicalDate): number => {
  const utc = (date: LiturgicalDate) => {
    const [year, month, day] = date.split('-').map(Number)
    return Date.UTC(year, month - 1, day)
  }
  return Math.round((utc(end) - utc(start)) / 86_400_000)
}

export const liturgicalDateFromInstant = (
  instant: Date
): LiturgicalDate | null => {
  const formatted = new Intl.DateTimeFormat('en-CA', {
    timeZone: HOMILY_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(instant)
  return isLiturgicalDate(formatted) ? formatted : null
}

const zonedWallTime = (
  date: LiturgicalDate,
  hours: number,
  minutes: number
): Date => {
  const [year, month, day] = date.split('-').map(Number)
  const guess = Date.UTC(year, month - 1, day, hours, minutes)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: HOMILY_TIME_ZONE,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).formatToParts(new Date(guess))
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value)
  const shown = Date.UTC(
    read('year'),
    read('month') - 1,
    read('day'),
    read('hour'),
    read('minute')
  )
  return new Date(guess - (shown - guess))
}

const calendarDate = (
  year: number,
  month: number,
  day: number
): LiturgicalDate | null => {
  const formatted = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return isLiturgicalDate(formatted) ? formatted : null
}

const datesInText = (text: string, publishedAt: Date): LiturgicalDate[] => {
  const dates: LiturgicalDate[] = []
  const push = (date: LiturgicalDate | null) => {
    if (date && !dates.includes(date)) dates.push(date)
  }
  const normalized = normalize(text)

  for (const match of normalized.matchAll(
    /\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})\b/g
  )) {
    push(calendarDate(Number(match[3]), Number(match[2]), Number(match[1])))
  }

  const publishedYear = liturgicalDateFromInstant(publishedAt)?.slice(0, 4)
  for (const match of normalized.matchAll(
    /\b(\d{1,2}) de ([a-z]+)\.?(?: de (\d{4}))?\b/g
  )) {
    const month = MONTHS[match[2].replace(/\./g, '')]
    if (!month) continue
    const year = match[3] ? Number(match[3]) : Number(publishedYear)
    if (!year) continue
    push(calendarDate(year, month, Number(match[1])))
  }

  return dates
}

const explicitLiturgicalDate = (entry: FeedEntry): LiturgicalDate | null => {
  const published = liturgicalDateFromInstant(entry.publishedAt)
  const dates = datesInText(
    `${entry.title}\n${entry.description}`,
    entry.publishedAt
  )
  if (!published) return dates[0] ?? null
  return (
    dates.find((date) => Math.abs(daysBetween(published, date)) <= 1) ?? null
  )
}

const resolvedDate = (entry: FeedEntry): LiturgicalDate | null =>
  explicitLiturgicalDate(entry) ?? liturgicalDateFromInstant(entry.publishedAt)

const distraction = (entry: FeedEntry): boolean =>
  /santo terco|catecismo|clipe oficial|santo rosario/.test(
    normalize(`${entry.title} ${entry.description}`)
  )

const compareInstant = (left: FeedEntry, right: FeedEntry): number =>
  left.publishedAt.getTime() - right.publishedAt.getTime()

export const lookupHomily = (input: {
  entries: readonly FeedEntry[]
  date: LiturgicalDate
  now: Date
}): Exclude<HomilyLookup, { kind: 'unavailable' }> => {
  const today = liturgicalDateFromInstant(input.now)
  const cutoff = today ? addDays(today, -45) : null
  const relevant = input.entries.filter((entry) => {
    const date = resolvedDate(entry)
    return date !== null && cutoff !== null && date >= cutoff
  })

  const dates = relevant.flatMap((entry) => {
    const date = resolvedDate(entry)
    return date ? [date] : []
  })
  const earliest = dates.reduce<LiturgicalDate | null>(
    (min, date) => (min === null || date < min ? date : min),
    null
  )

  if (!earliest || input.date < earliest)
    return { kind: 'missing', reason: 'outside_feed' }

  const watchableSkewMs = 2 * 60 * 1000
  const matches = relevant.filter((entry) => {
    const date = resolvedDate(entry)
    return (
      date === input.date &&
      entry.publishedAt.getTime() <= input.now.getTime() + watchableSkewMs
    )
  })

  if (matches.length === 0) return { kind: 'missing', reason: 'not_published' }

  const preferred = matches.some((entry) => !distraction(entry))
    ? matches.filter((entry) => !distraction(entry))
    : matches
  const video = [...preferred].sort(compareInstant).at(-1)
  if (!video) return { kind: 'missing', reason: 'not_published' }

  return {
    kind: 'found',
    video: {
      videoId: video.videoId,
      title: video.title,
      thumbnailUrl: video.thumbnailUrl
    }
  }
}

interface PlaylistItem {
  videoId: YoutubeVideoId
  title: string
  label: string
}

interface AgeWindow {
  min: number
  max: number
  estimate: number
  precise: boolean
}

const labelText = (value: string): string => normalize(value)

const ageWindow = (label: string): AgeWindow | null => {
  const match = labelText(label).match(
    /\bha (\d+) (min|mins|minuto|minutos|h|hora|horas|dia|dias)\b/
  )
  if (!match) return null

  const amount = Number(match[1])
  const unit = match[2]
  if (
    unit === 'min' ||
    unit === 'mins' ||
    unit === 'minuto' ||
    unit === 'minutos'
  ) {
    const hours = amount / 60
    return {
      min: Math.max(0, hours - 0.5),
      max: hours + 0.5,
      estimate: hours,
      precise: true
    }
  }
  if (unit === 'h' || unit === 'hora' || unit === 'horas') {
    return { min: amount - 1, max: amount + 2, estimate: amount, precise: true }
  }
  return {
    min: amount * 24,
    max: (amount + 1) * 24 + 4,
    estimate: amount * 24 + 12,
    precise: false
  }
}

const premiereInstant = (label: string): Date | null => {
  const match = labelText(label).match(
    /estreia em (\d{1,2})\/(\d{1,2})\/(\d{4}),?\s*(\d{1,2}):(\d{2})/
  )
  if (!match) return null
  const date = calendarDate(
    Number(match[3]),
    Number(match[2]),
    Number(match[1])
  )
  if (!date) return null
  const hours = Number(match[4])
  const minutes = Number(match[5])
  if (hours > 23 || minutes > 59) return null
  return zonedWallTime(date, hours, minutes)
}

const labelMatchesInstant = (
  label: string,
  instant: Date,
  now: Date
): boolean => {
  const window = ageWindow(label)
  if (!window) return false
  const ageHours = (now.getTime() - instant.getTime()) / 3_600_000
  return ageHours >= window.min && ageHours <= window.max
}

const preciseInstant = (label: string, now: Date): Date | null => {
  const window = ageWindow(label)
  if (!window?.precise) return null
  return new Date(now.getTime() - window.estimate * 3_600_000)
}

const extractYtInitialData = (html: string): unknown => {
  const markerAt = html.indexOf('ytInitialData')
  if (markerAt < 0) return null
  const start = html.indexOf('{', markerAt)
  if (start < 0) return null

  let depth = 0
  let inString = false
  let escaped = false
  for (let index = start; index < html.length; index += 1) {
    const char = html[index]
    if (inString) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === '"') inString = false
      continue
    }
    if (char === '"') inString = true
    else if (char === '{') depth += 1
    else if (char === '}') {
      depth -= 1
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(start, index + 1)) as unknown
        } catch {
          return null
        }
      }
    }
  }
  return null
}

const isLockup = (value: unknown): value is { lockupViewModel: unknown } =>
  isRecord(value) && 'lockupViewModel' in value

const longestLockupList = (value: unknown): unknown[] => {
  let best: unknown[] = []
  let bestCount = 0
  const visit = (node: unknown): void => {
    if (Array.isArray(node)) {
      const count = node.filter(isLockup).length
      if (count > bestCount) {
        best = node
        bestCount = count
      }
      node.forEach(visit)
      return
    }
    if (isRecord(node)) Object.values(node).forEach(visit)
  }
  visit(value)
  return best
}

const stringsIn = (value: unknown, found: string[]): void => {
  if (typeof value === 'string') {
    found.push(value)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item) => stringsIn(item, found))
    return
  }
  if (isRecord(value))
    Object.values(value).forEach((item) => stringsIn(item, found))
}

const toPlaylistItem = (value: unknown): PlaylistItem | null => {
  if (!isLockup(value) || !isRecord(value.lockupViewModel)) return null
  const view = value.lockupViewModel
  const contentId = view.contentId
  if (typeof contentId !== 'string' || !isYoutubeVideoId(contentId)) return null

  const metadata = isRecord(view.metadata) ? view.metadata : null
  const lockup = isRecord(metadata?.lockupMetadataViewModel)
    ? metadata.lockupMetadataViewModel
    : null
  const titleValue = isRecord(lockup?.title) ? lockup.title.content : null
  if (typeof titleValue !== 'string' || !cleanText(titleValue)) return null

  const rows = isRecord(lockup?.metadata) ? lockup.metadata : null
  const rowModel = isRecord(rows?.contentMetadataViewModel)
    ? rows.contentMetadataViewModel
    : null
  const texts: string[] = []
  stringsIn(rowModel?.metadataRows, texts)
  const label = texts.find((text) => ageWindow(text) || premiereInstant(text))
  if (!label) return null

  return { videoId: contentId, title: cleanText(titleValue), label }
}

const playlistItems = (html: string): PlaylistItem[] | null => {
  const data = extractYtInitialData(html)
  if (!data) return null

  const items: PlaylistItem[] = []
  const seen = new Set<string>()
  for (const node of longestLockupList(data)) {
    const item = toPlaylistItem(node)
    if (!item || seen.has(item.videoId)) continue
    seen.add(item.videoId)
    items.push(item)
  }
  return items
}

const entryFromItem = (item: PlaylistItem, publishedAt: Date): FeedEntry => ({
  videoId: item.videoId,
  title: item.title,
  description: '',
  publishedAt,
  thumbnailUrl: thumbnailFor(item.videoId, null)
})

export const parsePlaylistPage = (
  html: string,
  now: Date
): FeedEntry[] | null => {
  if (html.length > 4_000_000) return null
  const items = playlistItems(html)
  if (!items) return null
  if (items.length === 0) return []

  const premieres: { index: number; item: PlaylistItem; instant: Date }[] = []
  items.forEach((item, index) => {
    const instant = premiereInstant(item.label)
    if (instant) premieres.push({ index, item, instant })
  })

  let current: typeof premieres = []
  let bestRun: typeof premieres = []
  for (const premiere of premieres) {
    const previous = current.at(-1)
    current =
      !previous || premiere.index === previous.index + 1
        ? [...current, premiere]
        : [premiere]
    if (current.length > bestRun.length) bestRun = current
  }

  const entries: FeedEntry[] = []
  const run = bestRun[0]
  if (run) {
    const premiereDate = liturgicalDateFromInstant(run.instant)
    const leading: PlaylistItem[] = []
    for (let index = run.index - 1; index >= 0; index -= 1) {
      if (!ageWindow(items[index].label)) break
      leading.push(items[index])
    }
    leading.reverse()

    if (premiereDate) {
      leading.forEach((item, index) => {
        const daysBefore = leading.length - index
        const date = addDays(premiereDate, -daysBefore)
        if (!date) return
        const instant = zonedWallTime(date, 0, 0)
        if (labelMatchesInstant(item.label, instant, now)) {
          entries.push(entryFromItem(item, instant))
          return
        }
        const precise = preciseInstant(item.label, now)
        if (precise) entries.push(entryFromItem(item, precise))
      })
    }
  }

  const scheduled = run ? bestRun : []
  for (const premiere of scheduled) {
    entries.push(entryFromItem(premiere.item, premiere.instant))
  }

  if (!run) {
    for (const item of items) {
      const precise = preciseInstant(item.label, now)
      if (precise) entries.push(entryFromItem(item, precise))
    }
  }

  return entries
}

export const parseHomilyLookup = (value: unknown): HomilyLookup => {
  if (!isRecord(value)) throw new Error('Resposta inválida da homilia')

  if (value.kind === 'missing') {
    if (value.reason === 'not_published' || value.reason === 'outside_feed') {
      return { kind: 'missing', reason: value.reason }
    }
  }

  if (value.kind === 'unavailable') return { kind: 'unavailable' }

  if (value.kind === 'found' && isRecord(value.video)) {
    const { videoId, title, thumbnailUrl } = value.video
    if (
      typeof videoId === 'string' &&
      isYoutubeVideoId(videoId) &&
      typeof title === 'string' &&
      title.trim() &&
      title.trim().length <= 300 &&
      typeof thumbnailUrl === 'string' &&
      isYoutubeThumbnailUrl(thumbnailUrl)
    ) {
      return {
        kind: 'found',
        video: { videoId, title: title.trim(), thumbnailUrl }
      }
    }
  }

  throw new Error('Resposta inválida da homilia')
}
