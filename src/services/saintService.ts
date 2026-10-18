import axios from 'axios'
import type { SaintOfDayResponse } from '@/types'

export const getSaintOfDay = async (
  date: string
): Promise<SaintOfDayResponse> => {
  const [, month, day] = date.split('-')
  const { data } = await axios.get<SaintOfDayResponse>(
    import.meta.env.VITE_SAINT_API_URL,
    { params: { dia: day, mes: month } }
  )

  return data
}
