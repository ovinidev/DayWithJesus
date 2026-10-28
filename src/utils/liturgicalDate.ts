export type IsoDate = string & { readonly __brand: 'IsoDate' }

const MIN_YEAR = 1900
const MAX_YEAR = 2199

export const isIsoDate = (value: string): value is IsoDate => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (year < MIN_YEAR || year > MAX_YEAR) return false

  const utc = new Date(Date.UTC(year, month - 1, day))
  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day
  )
}

export const isoDateFromParts = (parts: {
  dia: string | null
  mes: string | null
  ano: string | null
}): IsoDate | null => {
  const { dia, mes, ano } = parts
  if (!dia || !mes || !ano) return null
  if (
    !/^\d{1,2}$/.test(dia) ||
    !/^\d{1,2}$/.test(mes) ||
    !/^\d{4}$/.test(ano)
  ) {
    return null
  }

  const iso = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
  return isIsoDate(iso) ? iso : null
}

export const formatLocalIso = (now: Date): string => {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
