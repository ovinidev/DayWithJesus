import { useQuery } from '@tanstack/vue-query'
import { getHomilyDiary } from '@/services/homilyService'

export const useGetHomilyDiary = () => {
  return useQuery({
    queryKey: ['homilyDiary'],
    queryFn: getHomilyDiary,
  })
}
