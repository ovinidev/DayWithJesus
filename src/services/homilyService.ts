import { api } from '@/services/api'
import type { LiturgyResponse } from '@/types'

export const getHomilyDiary = async (
  date?: string
): Promise<LiturgyResponse> => {
  const [year, month, day] = date?.split('-') ?? []
  const params = day && month && year ? { dia: day, mes: month, ano: year } : {}
  const { data } = await api.get<LiturgyResponse>('/', { params })

  return data
}

export const getHomilyWeek = async (): Promise<LiturgyResponse[]> => {
  const { data } = await api.get<LiturgyResponse[]>('/', {
    params: { periodo: 7 }
  })

  return data
}
