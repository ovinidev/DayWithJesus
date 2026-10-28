import { Romcal } from 'romcal'
import { Brazil_PtBr } from '@romcal/calendar.brazil'
import type { IsoDate } from '../../utils/liturgicalDate.js'

export interface SanctoralCelebration {
  id: string
  name: string
  rankName: string
}

export interface LiturgicalDaySaints {
  liturgia: string
  saints: SanctoralCelebration[]
}

interface ReadCelebration {
  id: string
  name: string
  rankName: string
  properOfSaints: boolean
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const readText = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

const readCelebration = (value: unknown): ReadCelebration | null => {
  if (!isRecord(value)) return null
  const name = readText(value.name)
  if (!name) return null

  const cycles = isRecord(value.cycles) ? value.cycles : null
  return {
    id: readText(value.id),
    name,
    rankName: readText(value.rankName),
    properOfSaints: cycles?.properCycle === 'PROPER_OF_SAINTS'
  }
}

export const selectDay = (days: readonly unknown[]): LiturgicalDaySaints => {
  const celebrations = days.flatMap((day) => {
    const celebration = readCelebration(day)
    return celebration ? [celebration] : []
  })
  const primary = celebrations[0]

  return {
    liturgia: primary?.name ?? '',
    saints: celebrations
      .filter((celebration) => celebration.properOfSaints)
      .map((celebration) => ({
        id: celebration.id,
        name: celebration.name,
        rankName: celebration.rankName
      }))
  }
}

const calendars = new Map<number, Promise<unknown>>()

const loadCalendar = (year: number): Promise<unknown> => {
  const cached = calendars.get(year)
  if (cached) return cached

  const pending = new Romcal({ localizedCalendar: Brazil_PtBr })
    .generateCalendar(year)
    .then((value) => {
      const calendar: unknown = value
      return calendar
    })
    .catch((error: unknown) => {
      calendars.delete(year)
      throw error
    })

  calendars.set(year, pending)
  return pending
}

const readDay = (calendar: unknown, date: string): unknown[] => {
  if (!isRecord(calendar)) return []
  const days = calendar[date]
  return Array.isArray(days) ? days : []
}

export const saintsOn = async (date: IsoDate): Promise<LiturgicalDaySaints> => {
  const year = Number(date.slice(0, 4))
  const calendar = await loadCalendar(year)
  return selectDay(readDay(calendar, date))
}
