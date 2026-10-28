import axios from 'axios'
import type { SaintOfDayResponse } from '@/types'

export const getSaintOfDay = async (
  date: string
): Promise<SaintOfDayResponse> => {
  const [year, month, day] = date.split('-')
  const { data } = await axios.get<SaintOfDayResponse>('/api/saints', {
    params: { dia: day, mes: month, ano: year },
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' }
  })

  return data
}
