import { describe, expect, it } from 'vitest'
import { formatLocalIso, isIsoDate, isoDateFromParts } from './liturgicalDate'

describe('liturgical dates', () => {
  it('accepts a real civil date inside the supported years', () => {
    expect(isIsoDate('2026-10-28')).toBe(true)
    expect(isIsoDate('2028-02-29')).toBe(true)
  })

  it('rejects impossible days, timestamps, and years outside the calendar', () => {
    expect(isIsoDate('2026-02-31')).toBe(false)
    expect(isIsoDate('2026-02-29')).toBe(false)
    expect(isIsoDate('2026-10-28T00:00:00Z')).toBe(false)
    expect(isIsoDate('1899-10-28')).toBe(false)
    expect(isIsoDate('2200-01-01')).toBe(false)
  })

  it('builds 28 October from day, month, and year parts', () => {
    expect(isoDateFromParts({ dia: '28', mes: '10', ano: '2026' })).toBe(
      '2026-10-28'
    )
    expect(isoDateFromParts({ dia: '8', mes: '1', ano: '2026' })).toBe(
      '2026-01-08'
    )
  })

  it('rejects a day that does not exist', () => {
    expect(isoDateFromParts({ dia: '31', mes: '2', ano: '2026' })).toBeNull()
    expect(isoDateFromParts({ dia: '28', mes: '10', ano: null })).toBeNull()
    expect(isoDateFromParts({ dia: '28', mes: '10', ano: '26' })).toBeNull()
  })

  it('formats the viewer local calendar day', () => {
    expect(formatLocalIso(new Date(2026, 9, 28, 23, 30))).toBe('2026-10-28')
  })
})
