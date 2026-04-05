import { api } from '@/services/api'
import type { LiturgyResponse } from '@/types'

export const getHomilyDiary = async (): Promise<LiturgyResponse> => {
  const { data } = await api.get<LiturgyResponse>('/')

  return data
}
