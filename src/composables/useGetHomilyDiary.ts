import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getHomilyDiary } from '@/services/homilyService'
import { gospelMapper } from '@/utils/gospelMapper'

export const useGetHomilyDiary = () => {
  const query = useQuery({
    queryKey: ['homilyDiary'],
    queryFn: getHomilyDiary
  })

  const data = computed(() =>
    query.data.value ? gospelMapper(query.data.value) : undefined
  )

  return {
    ...query,
    data
  }
}
