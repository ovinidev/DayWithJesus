import type { SanctoralCelebration } from './calendar.js'

export interface SaintLookup {
  nome: string
  wikipediaTitle: string | null
  grau: string
}

export interface WikiPageCandidate {
  title: string
  type: string
  description: string | null
  extract: string | null
}

interface WikipediaTarget {
  title: string
  nome?: string
}

const OVERRIDES: Record<string, readonly WikipediaTarget[]> = {
  simon_and_jude_apostles: [
    { title: 'Simão, o Zelote', nome: 'São Simão, apóstolo' },
    { title: 'Judas Tadeu', nome: 'São Judas Tadeu, apóstolo' }
  ],
  hedwig_of_silesia_religious: [{ title: 'Edviges da Silésia' }],
  our_lady_of_aparecida: [{ title: 'Nossa Senhora Aparecida' }],
  our_lady_of_guadalupe: [{ title: 'Nossa Senhora de Guadalupe (México)' }]
}

const ROLE_WORDS = new Set([
  'apostolo',
  'apostolos',
  'bispo',
  'bispos',
  'virgem',
  'virgens',
  'religiosa',
  'religioso',
  'religiosas',
  'religiosos',
  'martir',
  'martires',
  'papa',
  'papas',
  'presbitero',
  'presbiteros',
  'diacono',
  'diaconos',
  'evangelista',
  'evangelistas',
  'doutor',
  'doutora',
  'doutores',
  'doutoras',
  'igreja',
  'abade',
  'abadessa',
  'eremita',
  'eremitas',
  'rei',
  'rainha',
  'padroeiro',
  'padroeira',
  'padroeiros',
  'padroeiras',
  'companheiro',
  'companheiros',
  'companheira',
  'companheiras',
  'brasil',
  'america',
  'americas',
  'europa',
  'e',
  'da',
  'de',
  'do',
  'dos',
  'das',
  'o',
  'a',
  'os',
  'as',
  'um',
  'uma',
  'seu',
  'sua',
  'seus',
  'suas'
])

const NAME_STOP = new Set([
  'sao',
  'santa',
  'santo',
  'santos',
  'santas',
  'de',
  'da',
  'do',
  'dos',
  'das',
  'e',
  'o',
  'a',
  'os',
  'as',
  'um',
  'uma'
])

const PLACE =
  /\b(cidade|municipio|estado|capital|bairro|freguesia|distrito|favela|rodovia|aeroporto)\b/

const BUILDING =
  /\b(igreja|catedral|basilica|capela|santuario|paroquia|convento|mosteiro|universidade|clube|escola|hospital)\b/

const PERSON =
  /\b(santo|santa|apostolo|bispo|arcebispo|virgem|martir|papa|presbitero|padre|freira|monge|monja|beato|beata|arcanjo|anjo|padroeir|canoniz|evangelista|diacono|religios|mistic|cardeal|teologo|teologa|missionari|cristianism|cristao|crist[ao]s?|nossa senhora|doutor da igreja|doutora da igreja)\b/

const MONTHS = [
  '',
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro'
] as const

const MIN_SCORE = 80

export const normalizeLiturgicalText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const stripRoleSuffix = (name: string): string => {
  const comma = name.indexOf(',')
  if (comma === -1) return name.trim()

  const words = normalizeLiturgicalText(name.slice(comma + 1))
    .split(' ')
    .filter(Boolean)
  if (words.length > 0 && words.every((word) => ROLE_WORDS.has(word))) {
    return name.slice(0, comma).trim()
  }

  return name.trim()
}

const splitCombinedSaintName = (name: string): string[] | null => {
  const parts = stripRoleSuffix(name)
    .split(/\s+e\s+/i)
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length < 2) return null
  if (
    !parts.every((part) => /^(?:santos|santas|são|santa|santo)\b/i.test(part))
  ) {
    return null
  }

  return parts
}

export const saintQueriesFor = (
  celebration: SanctoralCelebration
): SaintLookup[] => {
  const override = OVERRIDES[celebration.id]
  if (override) {
    return override.map((target) => ({
      nome: target.nome ?? celebration.name,
      wikipediaTitle: target.title,
      grau: celebration.rankName
    }))
  }

  const parts = splitCombinedSaintName(celebration.name)
  if (parts) {
    return parts.map((nome) => ({
      nome,
      wikipediaTitle: null,
      grau: celebration.rankName
    }))
  }

  return [
    {
      nome: celebration.name,
      wikipediaTitle: null,
      grau: celebration.rankName
    }
  ]
}

const tokens = (value: string): string[] =>
  normalizeLiturgicalText(stripRoleSuffix(value))
    .split(' ')
    .filter((token) => token.length > 1 && !NAME_STOP.has(token))

const scorePage = (liturgicalName: string, page: WikiPageCandidate): number => {
  const query = tokens(liturgicalName)
  const title = tokens(page.title)
  if (query.length === 0 || title.length === 0) return 0

  const titleSet = new Set(title)
  const matched = query.filter((token) => titleSet.has(token)).length
  const coverage = matched / query.length
  const extra = title.filter((token) => !query.includes(token)).length
  let score = coverage * 100 - extra * 8
  if (coverage === 1 && extra === 0) score += 30

  const normalizedTitle = normalizeLiturgicalText(page.title)
  if (PLACE.test(normalizedTitle) || BUILDING.test(normalizedTitle)) score -= 50
  if (page.title.includes('(')) score -= 15

  return score
}

const isReligiousPage = (page: WikiPageCandidate): boolean => {
  if (page.type === 'disambiguation') return false

  const description = normalizeLiturgicalText(page.description ?? '')
  const extract = normalizeLiturgicalText(page.extract ?? '')
  const looksLikePlace =
    (PLACE.test(description) || BUILDING.test(description)) &&
    !PERSON.test(description)

  if (looksLikePlace) return false
  return PERSON.test(description) || PERSON.test(extract)
}

export const chooseWikipediaPage = <T extends WikiPageCandidate>(
  liturgicalName: string,
  pages: readonly T[]
): T | null => {
  const ranked = pages
    .map((page, index) => ({
      page,
      index,
      score: scorePage(liturgicalName, page)
    }))
    .filter((item) => item.score >= MIN_SCORE && isReligiousPage(item.page))
    .sort((left, right) => right.score - left.score || left.index - right.index)

  return ranked[0]?.page ?? null
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const formatWikidataTime = (value: unknown): string | null => {
  if (!isRecord(value)) return null
  if (typeof value.time !== 'string' || typeof value.precision !== 'number') {
    return null
  }
  if (value.precision < 9) return null

  const match = /^([+-])(\d+)-(\d{2})-(\d{2})/.exec(value.time)
  if (!match) return null

  const year = Number(match[2])
  const month = Number(match[3])
  const day = Number(match[4])
  if (!Number.isInteger(year) || year <= 0) return null

  const yearLabel =
    match[1] === '-'
      ? `${year} a.C.`
      : year < 1000
        ? `${year} d.C.`
        : String(year)
  const monthLabel = MONTHS[month]
  if (value.precision === 9 || !monthLabel) return yearLabel
  if (value.precision === 10 || day < 1 || day > 31) {
    return `${monthLabel} de ${yearLabel}`
  }

  return `${day} de ${monthLabel} de ${yearLabel}`
}

const claimValues = (
  claims: Record<string, unknown>,
  property: string
): unknown[] => {
  const list = claims[property]
  if (!Array.isArray(list)) return []

  return list.flatMap((item) => {
    if (!isRecord(item) || !isRecord(item.mainsnak)) return []
    const datavalue = item.mainsnak.datavalue
    if (!isRecord(datavalue)) return []
    return [datavalue.value]
  })
}

export interface WikidataFacts {
  nascimento: string | null
  morte: string | null
  patronIds: string[]
}

export const parseWikidataEntity = (
  input: unknown,
  entityId: string
): WikidataFacts | null => {
  if (!isRecord(input)) return null
  const entities = input.entities
  if (!isRecord(entities)) return null
  const entity = entities[entityId]
  if (!isRecord(entity)) return null
  const claims = entity.claims
  if (!isRecord(claims)) return null

  const birth = claimValues(claims, 'P569')[0]
  const death = claimValues(claims, 'P570')[0]
  const patronIds = claimValues(claims, 'P2925').flatMap((value) => {
    if (!isRecord(value) || typeof value.id !== 'string') return []
    return /^Q\d+$/.test(value.id) ? [value.id] : []
  })

  return {
    nascimento: formatWikidataTime(birth),
    morte: formatWikidataTime(death),
    patronIds
  }
}

const labelValue = (
  labels: Record<string, unknown>,
  language: string
): string | null => {
  const label = labels[language]
  if (!isRecord(label) || typeof label.value !== 'string') return null
  const text = label.value.trim()
  return text.length > 0 ? text : null
}

export const parsePortugueseLabels = (
  input: unknown,
  ids: readonly string[]
): string[] => {
  if (!isRecord(input)) return []
  const entities = input.entities
  if (!isRecord(entities)) return []

  return ids.flatMap((id) => {
    const entity = entities[id]
    if (!isRecord(entity) || !isRecord(entity.labels)) return []
    const label = labelValue(entity.labels, 'pt')
    return label ? [label] : []
  })
}

export const formatPatrons = (labels: readonly string[]): string | null => {
  const unique = [
    ...new Set(labels.map((label) => label.trim()).filter(Boolean))
  ]
  if (unique.length === 0) return null
  return unique.slice(0, 3).join(', ')
}
