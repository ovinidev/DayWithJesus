import { api } from '@/services/api'
import type { HomilyDiary } from '@/types'

export const getHomilyDiary = async (): Promise<HomilyDiary> => {
  const { data } = await api.get<HomilyDiary>('/')

  return data
}
